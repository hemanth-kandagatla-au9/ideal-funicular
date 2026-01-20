const {
  getMasterAgentsData,
  insertMasterAgent,
  deleteMasterAgent
} = require('../../server/controllers/agentMasterController');

const AgentMasterdataModel = require('../../server/models/agentMasterdataModel');
const { buildQuery } = require('../../server/utils/agentUtils');

// Mock dependencies
jest.mock('../../server/models/agentMasterdataModel');
jest.mock('../../server/utils/agentUtils');

const responseCodes = {
  SUCCESS: 200,
  ERROR: 400,
  SERVER_ERROR: 500,
};

function createMockReq(options = {}) {
  return {
    method: options.method || 'GET',
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

describe('Agent Master Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMasterAgentsData', () => {
    it('should return paginated master agents data', async () => {
      const req = createMockReq({
        method: 'POST',
        body: { limit: '10', pageNo: '1' }
      });
      const res = createMockRes();

      const mockQuery = { status: 'active' };
      const mockAgents = [
        { hostname: 'host1', createdAt: new Date() },
        { hostname: 'host2', createdAt: new Date() }
      ];

      buildQuery.mockReturnValue(mockQuery);
      AgentMasterdataModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockAgents)
      });
      AgentMasterdataModel.countDocuments.mockResolvedValue(25);

      await getMasterAgentsData(req, res);

      expect(buildQuery).toHaveBeenCalledWith(req.body);
      expect(AgentMasterdataModel.find).toHaveBeenCalledWith(mockQuery);
      expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(res._json.flag).toBe('success');
      expect(res._json.data.limit).toBe(10);
      expect(res._json.data.pageNo).toBe(1);
      expect(res._json.data.totalCount).toBe(25);
      expect(res._json.data.totalPage).toBe(3); // Math.ceil(25/10)
    });

    it('should use default values when parameters missing', async () => {
      const req = createMockReq({
        method: 'GET',
        query: {}
      });
      const res = createMockRes();

      buildQuery.mockReturnValue({});
      AgentMasterdataModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([])
      });
      AgentMasterdataModel.countDocuments.mockResolvedValue(0);

      await getMasterAgentsData(req, res);

      expect(res._json.data.limit).toBe(100); // default limit
      expect(res._json.data.pageNo).toBe(1); // default pageNo
    });

    it('should handle errors gracefully', async () => {
      const req = createMockReq();
      const res = createMockRes();

      buildQuery.mockImplementation(() => {
        throw new Error('Query build failed');
      });

      await getMasterAgentsData(req, res);

      expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(res._json.flag).toBe('error');
      expect(res._json.error).toBe('Query build failed');
    });
  });

  describe('insertMasterAgent', () => {
    it('should insert new unique hostnames', async () => {
      const req = createMockReq({
        body: { hostnames: 'host1,host2,host3' }
      });
      const res = createMockRes();

      AgentMasterdataModel.find.mockResolvedValue([]); // No existing records
      AgentMasterdataModel.insertMany.mockResolvedValue({ insertedCount: 3 });

      await insertMasterAgent(req, res);

      expect(AgentMasterdataModel.find).toHaveBeenCalledWith({
        hostname: { $in: ['host1', 'host2', 'host3'] }
      });
      expect(AgentMasterdataModel.insertMany).toHaveBeenCalledWith([
        { hostname: 'host1', createdAt: expect.any(Date) },
        { hostname: 'host2', createdAt: expect.any(Date) },
        { hostname: 'host3', createdAt: expect.any(Date) }
      ]);
      expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(res._json.flag).toBe('success');
      expect(res._json.data).toBe('3 records inserted successfully.');
    });

    it('should filter out existing hostnames', async () => {
      const req = createMockReq({
        body: { hostnames: 'host1,host2,host3' }
      });
      const res = createMockRes();

      AgentMasterdataModel.find.mockResolvedValue([
        { hostname: 'host1' }
      ]); // host1 already exists
      AgentMasterdataModel.insertMany.mockResolvedValue({ insertedCount: 2 });

      await insertMasterAgent(req, res);

      expect(AgentMasterdataModel.insertMany).toHaveBeenCalledWith([
        { hostname: 'host2', createdAt: expect.any(Date) },
        { hostname: 'host3', createdAt: expect.any(Date) }
      ]);
      expect(res._json.data).toBe('2 records inserted successfully.');
    });

    it('should return error when all hostnames already exist', async () => {
      const req = createMockReq({
        body: { hostnames: 'host1,host2' }
      });
      const res = createMockRes();

      AgentMasterdataModel.find.mockResolvedValue([
        { hostname: 'host1' },
        { hostname: 'host2' }
      ]);

      await insertMasterAgent(req, res);

      expect(AgentMasterdataModel.insertMany).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(res._json.flag).toBe('error');
      expect(res._json.error).toContain('already exists');
    });

    it('should handle database errors', async () => {
      const req = createMockReq({
        body: { hostnames: 'host1' }
      });
      const res = createMockRes();

      AgentMasterdataModel.find.mockRejectedValue(new Error('Database error'));

      await insertMasterAgent(req, res);

      expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(res._json.flag).toBe('error');
      expect(res._json.error).toBe('Database error');
    });
  });

  describe('deleteMasterAgent', () => {
    it('should delete master agent by hostname', async () => {
      const req = createMockReq({
        query: { hostname: 'test-host' }
      });
      const res = createMockRes();

      AgentMasterdataModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await deleteMasterAgent(req, res);

      expect(AgentMasterdataModel.deleteOne).toHaveBeenCalledWith({ hostname: 'test-host' });
      expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(res._json.flag).toBe('success');
      expect(res._json.data).toBe('1 records deleted successfully.');
    });

    it('should handle case when no records deleted', async () => {
      const req = createMockReq({
        query: { hostname: 'non-existent' }
      });
      const res = createMockRes();

      AgentMasterdataModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await deleteMasterAgent(req, res);

      expect(res._json.data).toBe('0 records deleted successfully.');
    });

    it('should handle database errors', async () => {
      const req = createMockReq({
        query: { hostname: 'test-host' }
      });
      const res = createMockRes();

      AgentMasterdataModel.deleteOne.mockRejectedValue(new Error('Delete failed'));

      await deleteMasterAgent(req, res);

      expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(res._json.flag).toBe('error');
      expect(res._json.error).toBe('Delete failed');
    });
  });
});