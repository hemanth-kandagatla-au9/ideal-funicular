const { Client } = require('ssh2');
const AgentModel = require('../../server/models/agentModel');
const responseCodes = require('../../server/utils/responseCodes');
const { LOGGER } = require('../../server/utils/opensearchLogger');
const {
  executeCommandOnAgent,
  handleApiResponse,
  buildQuery,
  getDistinctValues
} = require('../../server/utils/agentUtils');

// Mock dependencies
jest.mock('ssh2');
jest.mock('../../server/models/agentModel');
jest.mock('../../server/utils/opensearchLogger', () => ({
  LOGGER: {
    infoLog: jest.fn(),
    errorLog: jest.fn(),
    warningLog: jest.fn(),
  },
}));
jest.mock('../../server/utils/envUtils', () => ({
  getServiceAccountPassword: jest.fn().mockResolvedValue('mock-sa-password'),
}));

describe('agentUtils', () => {

  describe('executeCommandOnAgent', () => {
    let mockClient;
    let mockReq;
    let mockRes;

    beforeEach(() => {
      mockClient = {
        on: jest.fn(),
        connect: jest.fn(),
        exec: jest.fn(),
        end: jest.fn(),
      };
      Client.mockImplementation(() => mockClient);

      mockReq = { headers: {}, body: {}, user: {} };
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      process.env.RISE_SA_USERNAME = 'testuser';
      process.env.RISE_SA_PASSWORD_VALUE = 'testpassword';
      jest.clearAllMocks();
    });

    it('should successfully execute command and return success', async () => {
      const hostname = 'testhost';
      const osVersion = '7.10';

      // Mock SSH connection success
      mockClient.on.mockImplementation((event, callback) => {
        if (event === 'ready') {
          setTimeout(() => callback(), 0);
        }
        return mockClient;
      });

      mockClient.exec.mockImplementation((cmd, callback) => {
        const mockStream = {
          on: jest.fn((event, handler) => {
            if (event === 'data') {
              setTimeout(() => handler(Buffer.from('Command output')), 0);
            } else if (event === 'close') {
              setTimeout(() => handler(0), 10);
            }
            return mockStream;
          }),
          close: jest.fn(),
        };
        callback(null, mockStream);
      });

      await executeCommandOnAgent(mockReq, hostname, osVersion, mockRes);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(mockClient.connect).toHaveBeenCalledWith(expect.objectContaining({
        username: 'testuser',
        password: 'testpassword',
        host: hostname,
        port: 22,
      }));
      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        flag: 'success',
        data: expect.objectContaining({ message: 'started' }),
      }));
    });

    it('should handle SSH connection error', async () => {
      const hostname = 'testhost';
      const osVersion = '7.10';

      mockClient.on.mockImplementation((event, callback) => {
        if (event === 'error') {
          setTimeout(() => callback(new Error('Connection failed')), 0);
        }
        return mockClient;
      });

      await executeCommandOnAgent(mockReq, hostname, osVersion, mockRes);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(LOGGER.errorLog).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
    });

    it('should handle command execution error', async () => {
      const hostname = 'testhost';
      const osVersion = '7.10';

      mockClient.on.mockImplementation((event, callback) => {
        if (event === 'ready') {
          setTimeout(() => callback(), 0);
        }
        return mockClient;
      });

      mockClient.exec.mockImplementation((cmd, callback) => {
        callback(new Error('Exec failed'));
      });

      await executeCommandOnAgent(mockReq, hostname, osVersion, mockRes);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(LOGGER.errorLog).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
    });

    it('should handle non-zero exit code', async () => {
      const hostname = 'testhost';
      const osVersion = '7.10';

      mockClient.on.mockImplementation((event, callback) => {
        if (event === 'ready') {
          setTimeout(() => callback(), 0);
        }
        return mockClient;
      });

      mockClient.exec.mockImplementation((cmd, callback) => {
        const mockStream = {
          on: jest.fn((event, handler) => {
            if (event === 'close') {
              setTimeout(() => handler(1), 0); // Non-zero exit code
            }
            return mockStream;
          }),
          close: jest.fn(),
        };
        callback(null, mockStream);
      });

      await executeCommandOnAgent(mockReq, hostname, osVersion, mockRes);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(LOGGER.warningLog).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
    });

    it('should not send response when isBulk is true', async () => {
      const hostname = 'testhost';
      const osVersion = '7.10';
      const isBulk = true;

      mockClient.on.mockImplementation((event, callback) => {
        if (event === 'error') {
          setTimeout(() => callback(new Error('Connection failed')), 0);
        }
        return mockClient;
      });

      await executeCommandOnAgent(mockReq, hostname, osVersion, mockRes, isBulk);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });

  describe('handleApiResponse', () => {
    let mockReq;
    let mockRes;
    let mockApiFunction;

    beforeEach(() => {
      mockReq = {
        headers: { authorization: 'Basic dGVzdDp0ZXN0' },
        body: { hostname: 'testhost' },
        query: {},
      };
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        set: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      mockApiFunction = jest.fn();
      jest.clearAllMocks();
    });

    it('should successfully handle API response with JSON data', async () => {
      AgentModel.findOne.mockResolvedValue({
        hostname: 'testhost',
        agent_details: { server_port: 20101 },
      });
      mockApiFunction.mockResolvedValue({ result: 'success data' });

      await handleApiResponse(mockReq, mockRes, mockApiFunction);

      expect(AgentModel.findOne).toHaveBeenCalledWith({ hostname: 'testhost' });
      expect(mockApiFunction).toHaveBeenCalledWith(expect.objectContaining({
        hostname: 'testhost',
        port: 20101,
      }));
      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'success',
        data: { result: 'success data' },
      });
    });

    it('should handle host not found error', async () => {
      AgentModel.findOne.mockResolvedValue(null);

      await handleApiResponse(mockReq, mockRes, mockApiFunction);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.NOT_FOUND);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        error: 'Host not found',
        data: {},
      });
    });

    it('should handle undefined API response (connection error)', async () => {
      AgentModel.findOne.mockResolvedValue({
        hostname: 'testhost',
        agent_details: { server_port: 20101 },
      });
      mockApiFunction.mockResolvedValue(undefined);

      await handleApiResponse(mockReq, mockRes, mockApiFunction);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        error: 'Unable to connect to server testhost',
        data: {},
      });
    });

    it('should handle 404 response from API', async () => {
      AgentModel.findOne.mockResolvedValue({
        hostname: 'testhost',
        agent_details: { server_port: 20101 },
      });
      mockApiFunction.mockResolvedValue({ status: 404 });

      await handleApiResponse(mockReq, mockRes, mockApiFunction);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.NOT_FOUND);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        error: 'File Not found',
      });
    });

    it('should handle 500 response from API', async () => {
      AgentModel.findOne.mockResolvedValue({
        hostname: 'testhost',
        agent_details: { server_port: 20101 },
      });
      mockApiFunction.mockResolvedValue({ status: 500 });

      await handleApiResponse(mockReq, mockRes, mockApiFunction);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        error: 'Unable to connect to server',
      });
    });

    it('should handle buffer type response (file download)', async () => {
      AgentModel.findOne.mockResolvedValue({
        hostname: 'testhost',
        agent_details: { server_port: 20101 },
      });
      const bufferData = Buffer.from('file content');
      mockApiFunction.mockResolvedValue({
        type: 'buffer',
        contentType: 'application/octet-stream',
        data: bufferData,
      });

      await handleApiResponse(mockReq, mockRes, mockApiFunction);

      expect(mockRes.set).toHaveBeenCalledWith('Content-Type', 'application/octet-stream');
      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.send).toHaveBeenCalledWith(bufferData);
    });

    it('should handle missing or invalid authorization header when empty', async () => {
      mockReq.headers = {};
      AgentModel.findOne.mockResolvedValue({
        hostname: 'testhost',
        agent_details: { server_port: 20101 },
      });
      mockApiFunction.mockResolvedValue({ result: 'success' });

      await handleApiResponse(mockReq, mockRes, mockApiFunction);

      // Should proceed without authorization when header is missing
      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
    });

    it('should handle invalid authorization header format', async () => {
      mockReq.headers.authorization = 'Bearer token123';

      await handleApiResponse(mockReq, mockRes, mockApiFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Missing or invalid Authorization header',
      });
    });

    it('should handle exceptions', async () => {
      AgentModel.findOne.mockRejectedValue(new Error('Database error'));

      await handleApiResponse(mockReq, mockRes, mockApiFunction);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        error: 'Database error',
      });
    });

    it('should use hostname from query params if not in body', async () => {
      mockReq.body = {};
      mockReq.query = { hostname: 'queryhost' };

      AgentModel.findOne.mockResolvedValue({
        hostname: 'queryhost',
        agent_details: { server_port: 20101 },
      });
      mockApiFunction.mockResolvedValue({ result: 'success' });

      await handleApiResponse(mockReq, mockRes, mockApiFunction);

      expect(AgentModel.findOne).toHaveBeenCalledWith({ hostname: 'queryhost' });
    });
  });

  describe('buildQuery', () => {
    it('should build query with status filter', () => {
      const reqbody = { status: 'Active' };
      const query = buildQuery(reqbody);
      expect(query).toEqual({ status: 'Active' });
    });

    it('should not add status filter if status is "Recent"', () => {
      const reqbody = { status: 'Recent' };
      const query = buildQuery(reqbody);
      expect(query).toEqual({});
    });

    it('should build query with search filter', () => {
      const reqbody = { search: 'testhost' };
      const query = buildQuery(reqbody);
      expect(query).toEqual({
        hostname: { $regex: expect.any(RegExp) },
      });
      expect(query.hostname.$regex.test('testhost')).toBe(true);
      expect(query.hostname.$regex.test('TESTHOST')).toBe(true);
    });

    it('should build query with hostnameArr filter', () => {
      const reqbody = { hostnameArr: 'host1, host2, host3' };
      const query = buildQuery(reqbody);
      expect(query).toEqual({
        hostname: { $in: ['host1', 'host2', 'host3'] },
      });
    });

    it('should build query with osTypes filter', () => {
      const reqbody = { osTypes: 'Linux, Windows' };
      const query = buildQuery(reqbody);
      expect(query).toEqual({
        'cmdb.ciOsType': { $in: ['Linux', 'Windows'] },
      });
    });

    it('should build query with regions filter', () => {
      const reqbody = { regions: 'US, EU' };
      const query = buildQuery(reqbody);
      expect(query).toEqual({
        'cmdb.slRegion': { $in: ['US', 'EU'] },
      });
    });

    it('should build query with environments filter', () => {
      const reqbody = { environments: 'dev, prod' };
      const query = buildQuery(reqbody);
      expect(query).toEqual({
        'cmdb.ciSapNameEnv': { $in: ['dev', 'prod'] },
      });
    });

    it('should build query with platforms filter', () => {
      const reqbody = { platforms: 'platform1, platform2' };
      const query = buildQuery(reqbody);
      expect(query).toEqual({
        'cmdb.slPlatform': { $in: ['platform1', 'platform2'] },
      });
    });

    it('should build query with sids filter', () => {
      const reqbody = { sids: 'sid1, sid2' };
      const query = buildQuery(reqbody);
      expect(query).toEqual({
        'cmdb.ciSapNameSid': { $in: ['sid1', 'sid2'] },
      });
    });

    it('should build query with serviceNames filter', () => {
      const reqbody = { serviceNames: 'service1, service2' };
      const query = buildQuery(reqbody);
      expect(query).toEqual({
        'cmdb.slName': { $in: ['service1', 'service2'] },
      });
    });

    it('should build query with agentVersions filter', () => {
      const reqbody = { agentVersions: '1.0.0, 2.0.0' };
      const query = buildQuery(reqbody);
      expect(query).toEqual({
        'agent_details.version': { $in: ['1.0.0', '2.0.0'] },
      });
    });

    it('should build complex query with multiple filters', () => {
      const reqbody = {
        status: 'Active',
        search: 'testhost',
        osTypes: 'Linux',
        regions: 'US',
        agentVersions: '1.0.0',
      };
      const query = buildQuery(reqbody);
      expect(query).toEqual({
        status: 'Active',
        hostname: { $regex: expect.any(RegExp) },
        'cmdb.ciOsType': { $in: ['Linux'] },
        'cmdb.slRegion': { $in: ['US'] },
        'agent_details.version': { $in: ['1.0.0'] },
      });
    });

    it('should ignore empty string filters', () => {
      const reqbody = {
        search: '',
        osTypes: '  ',
        regions: '',
      };
      const query = buildQuery(reqbody);
      expect(query).toEqual({});
    });
  });

  describe('getDistinctValues', () => {
    let mockRes;

    beforeEach(() => {
      mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      jest.clearAllMocks();
    });

    it('should return distinct values successfully', async () => {
      const distinctValues = ['value1', 'value2', 'value3'];
      AgentModel.distinct.mockResolvedValue(distinctValues);

      await getDistinctValues('ciOsType', mockRes, 'osTypes', 'data');

      expect(AgentModel.distinct).toHaveBeenCalledWith('cmdb.ciOsType');
      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'success',
        data: { osTypes: distinctValues },
      });
    });

    it('should handle database error', async () => {
      AgentModel.distinct.mockRejectedValue(new Error('Database error'));

      await getDistinctValues('ciOsType', mockRes, 'osTypes', 'data');

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        message: 'Internal server error',
      });
    });

    it('should handle empty distinct values', async () => {
      AgentModel.distinct.mockResolvedValue([]);

      await getDistinctValues('slRegion', mockRes, 'regions', 'data');

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'success',
        data: { regions: [] },
      });
    });
  });
});
