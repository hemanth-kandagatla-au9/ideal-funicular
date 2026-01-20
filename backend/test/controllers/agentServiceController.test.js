const {
  startAgentService,
  getAgentInfo,
  getAgentsData,
  getRegions,
  getPlatforms,
  getEnvironments,
  getSids,
  getOStypes,
  getServiceNames,
  pid,
  config,
  updateLocalConfiguration,
  getApplicationLogs,
  restartAgent,
  shutdown,
  health,
  download
} = require('../../server/controllers/agentServiceController');

const AgentModel = require('../../server/models/agentModel');
const { handleApiResponse, getDistinctValues, buildQuery, executeCommandOnAgent } = require('../../server/utils/agentUtils');
const { getPid, getConfig, updateLocalConfiguration: updateLocalConfigurationService, getApplicationLogs: getApplicationLogsService, putRestartAgent, putShutDown, getHealth, downloadFile } = require('../../server/services/agentService');

// Mock dependencies
jest.mock('../../server/models/agentModel');
jest.mock('../../server/utils/agentUtils');
jest.mock('../../server/services/agentService');

const responseCodes = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  ERROR: 400
};

function createMockReq(options = {}) {
  return {
    method: options.method || 'POST',
    body: options.body || {},
    query: options.query || {},
    params: options.params || {},
  };
}

function createMockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res._json = {};
  res.json.mockImplementation((data) => {
    res._json = data;
    return res;
  });
  return res;
}

describe('Agent Service Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('startAgentService', () => {
    it('should call executeCommandOnAgent with correct parameters', async () => {
      const req = createMockReq({
        body: { hostname: 'test-host', osVersion: 'linux' }
      });
      const res = createMockRes();

      executeCommandOnAgent.mockResolvedValue();

      await startAgentService(req, res);

      expect(executeCommandOnAgent).toHaveBeenCalledWith(req, 'test-host', 'linux', res);
    });
  });

  describe('getAgentInfo', () => {
    it('should return agent info when host exists', async () => {
      const req = createMockReq({
        body: { hostname: 'test-host' }
      });
      const res = createMockRes();

      const mockAgent = {
        hostname: 'test-host',
        agent_details: {
          cpu_usage: 45.123,
          memory: 1073741824, // 1GB in bytes
          disk_usage: 2147483648 // 2GB in bytes
        }
      };

      AgentModel.findOne.mockResolvedValue(mockAgent);

      await getAgentInfo(req, res);

      expect(AgentModel.findOne).toHaveBeenCalledWith({ hostname: 'test-host' });
      expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(res._json.flag).toBe('success');
      expect(res._json.data.agent_details.cpu_usage).toBe('45.123%');
      expect(res._json.data.agent_details.memory).toBe('1024.00 MB');
      expect(res._json.data.agent_details.disk_usage).toBe('2048.00 MB');
    });

    it('should return error when host not found', async () => {
      const req = createMockReq({
        body: { hostname: 'non-existent-host' }
      });
      const res = createMockRes();

      AgentModel.findOne.mockResolvedValue(null);

      await getAgentInfo(req, res);

      expect(res.status).toHaveBeenCalledWith(responseCodes.NOT_FOUND);
      expect(res._json.flag).toBe('error');
      expect(res._json.message).toBe('Host Not found');
    });

    it('should handle string values for agent details', async () => {
      const req = createMockReq({
        body: { hostname: 'test-host' }
      });
      const res = createMockRes();

      const mockAgent = {
        hostname: 'test-host',
        agent_details: {
          cpu_usage: '45.123%',
          memory: '1024.00 MB',
          disk_usage: '2048.00 MB'
        }
      };

      AgentModel.findOne.mockResolvedValue(mockAgent);

      await getAgentInfo(req, res);

      expect(res._json.data.agent_details.cpu_usage).toBe('45.123%');
      expect(res._json.data.agent_details.memory).toBe('1024.00 MB');
      expect(res._json.data.agent_details.disk_usage).toBe('2048.00 MB');
    });
  });

  describe('getAgentsData', () => {
    it('should return paginated agents data with counts', async () => {
      const req = createMockReq({
        method: 'POST',
        body: { pageSize: '10', pageNo: '0' }
      });
      const res = createMockRes();

      const mockQuery = { status: 'Active' };
      const mockAgents = [
        { hostname: 'host1', status: 'Active' },
        { hostname: 'host2', status: 'Active' }
      ];

      buildQuery.mockReturnValue(mockQuery);
      AgentModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockAgents)
      });
      AgentModel.countDocuments.mockResolvedValueOnce(25)
        .mockResolvedValueOnce(20) // activeCount
        .mockResolvedValueOnce(3)  // inactiveCount
        .mockResolvedValueOnce(2); // failedCount

      await getAgentsData(req, res);

      expect(buildQuery).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(res._json.flag).toBe('success');
      expect(res._json.data.pagination.limit).toBe(10);
      expect(res._json.data.pagination.totalPage).toBe(25);
      expect(res._json.data.pagination.activeCount).toBe(20);
      expect(res._json.data.pagination.inactiveCount).toBe(3);
      expect(res._json.data.pagination.failedCount).toBe(2);
    });

    it('should use default pagination values', async () => {
      const req = createMockReq({
        method: 'GET',
        query: {}
      });
      const res = createMockRes();

      buildQuery.mockReturnValue({});
      AgentModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([])
      });
      AgentModel.countDocuments.mockResolvedValue(0);

      await getAgentsData(req, res);

      expect(AgentModel.find().skip).toHaveBeenCalledWith(0); // pageNo 0 * limit 100
      expect(AgentModel.find().limit).toHaveBeenCalledWith(100); // default limit
    });

    it('should handle errors gracefully', async () => {
      const req = createMockReq({
        body: { pageSize: '10', pageNo: '0' }
      });
      const res = createMockRes();

      buildQuery.mockImplementation(() => {
        throw new Error('Query build failed');
      });

      await getAgentsData(req, res);

      expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(res._json.flag).toBe('error');
      expect(res._json.error).toBe('Query build failed');
    });
  });

  describe('getRegions', () => {
    it('should call getDistinctValues with correct parameters', async () => {
      const req = createMockReq();
      const res = createMockRes();

      await getRegions(req, res);

      expect(getDistinctValues).toHaveBeenCalledWith("slRegion", res, "regions", "agentRegions");
    });
  });

  describe('getPlatforms', () => {
    it('should call getDistinctValues with correct parameters', async () => {
      const req = createMockReq();
      const res = createMockRes();

      await getPlatforms(req, res);

      expect(getDistinctValues).toHaveBeenCalledWith("slPlatform", res, "platforms", "agentPlatforms");
    });
  });

  describe('getEnvironments', () => {
    it('should call getDistinctValues with correct parameters', async () => {
      const req = createMockReq();
      const res = createMockRes();

      await getEnvironments(req, res);

      expect(getDistinctValues).toHaveBeenCalledWith("ciSapNameEnv", res, "environments", "agentEnvironments");
    });
  });

  describe('getSids', () => {
    it('should call getDistinctValues with correct parameters', async () => {
      const req = createMockReq();
      const res = createMockRes();

      await getSids(req, res);

      expect(getDistinctValues).toHaveBeenCalledWith("ciSapNameSid", res, "sids", "agentSids");
    });
  });

  describe('getOStypes', () => {
    it('should call getDistinctValues with correct parameters', async () => {
      const req = createMockReq();
      const res = createMockRes();

      await getOStypes(req, res);

      expect(getDistinctValues).toHaveBeenCalledWith("ciOsType", res, "os", "agentOsTypes");
    });
  });

  describe('getServiceNames', () => {
    it('should call getDistinctValues with correct parameters', async () => {
      const req = createMockReq();
      const res = createMockRes();

      await getServiceNames(req, res);

      expect(getDistinctValues).toHaveBeenCalledWith("slName", res, "serviceNames", "agentServiceNames");
    });
  });

  describe('API wrapper functions', () => {
    it('pid should call handleApiResponse with getPid', () => {
      const req = createMockReq();
      const res = createMockRes();

      pid(req, res);

      expect(handleApiResponse).toHaveBeenCalledWith(req, res, getPid);
    });

    it('config should call handleApiResponse with getConfig', () => {
      const req = createMockReq();
      const res = createMockRes();

      config(req, res);

      expect(handleApiResponse).toHaveBeenCalledWith(req, res, getConfig);
    });

    it('updateLocalConfiguration should call handleApiResponse with updateLocalConfiguration service', () => {
      const req = createMockReq();
      const res = createMockRes();

      updateLocalConfiguration(req, res);

      expect(handleApiResponse).toHaveBeenCalledWith(req, res, updateLocalConfigurationService);
    });

    it('getApplicationLogs should call handleApiResponse with getApplicationLogs service', () => {
      const req = createMockReq();
      const res = createMockRes();

      getApplicationLogs(req, res);

      expect(handleApiResponse).toHaveBeenCalledWith(req, res, getApplicationLogsService);
    });

    it('restartAgent should call handleApiResponse with putRestartAgent', () => {
      const req = createMockReq();
      const res = createMockRes();

      restartAgent(req, res);

      expect(handleApiResponse).toHaveBeenCalledWith(req, res, putRestartAgent);
    });

    it('shutdown should call handleApiResponse with putShutDown', () => {
      const req = createMockReq();
      const res = createMockRes();

      shutdown(req, res);

      expect(handleApiResponse).toHaveBeenCalledWith(req, res, putShutDown);
    });

    it('health should call handleApiResponse with getHealth', () => {
      const req = createMockReq();
      const res = createMockRes();

      health(req, res);

      expect(handleApiResponse).toHaveBeenCalledWith(req, res, getHealth);
    });

    it('download should call handleApiResponse with downloadFile', () => {
      const req = createMockReq();
      const res = createMockRes();

      download(req, res);

      expect(handleApiResponse).toHaveBeenCalledWith(req, res, downloadFile);
    });
  });
});
describe('checkBasicAuth', () => {
  const checkBasicAuth = require('../../server/controllers/agentServiceController').checkBasicAuth;

  it('should return auth info when agent found', async () => {
    const mockAgent = {
      hostname: 'test-host',
      agent_details: { version: '2.5' },
    };
    AgentModel.findOne.mockResolvedValue(mockAgent);

    const req = createMockReq({ query: { hostname: 'test-host' } });
    const res = createMockRes();

    await checkBasicAuth(req, res);

    expect(AgentModel.findOne).toHaveBeenCalledWith({ hostname: 'test-host' });
    expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
    expect(res.json).toHaveBeenCalledWith({
      flag: 'success',
      data: {
        hostName: 'test-host',
        version: '2.5',
        isBasicAuth: true,
      },
    });
  });

  it('should identify version >= 3.0 as not basic auth', async () => {
    const mockAgent = {
      hostname: 'new-host',
      agent_details: { version: '3.1' },
    };
    AgentModel.findOne.mockResolvedValue(mockAgent);

    const req = createMockReq({ query: { hostname: 'new-host' } });
    const res = createMockRes();

    await checkBasicAuth(req, res);

    expect(res.json).toHaveBeenCalledWith({
      flag: 'success',
      data: {
        hostName: 'new-host',
        version: '3.1',
        isBasicAuth: false,
      },
    });
  });

  it('should return 404 when agent not found', async () => {
    AgentModel.findOne.mockResolvedValue(null);

    const req = createMockReq({ query: { hostname: 'missing-host' } });
    const res = createMockRes();

    await checkBasicAuth(req, res);

    expect(res.status).toHaveBeenCalledWith(responseCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      flag: 'error',
      message: 'Host Not found',
      data: {},
    });
  });

  it('should handle database errors', async () => {
    const error = new Error('Database error');
    AgentModel.findOne.mockRejectedValue(error);

    const req = createMockReq({ query: { hostname: 'test-host' } });
    const res = createMockRes();

    await checkBasicAuth(req, res);

    expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      flag: 'error',
      error: 'Database error',
    });
  });
});
