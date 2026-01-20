const { getMetricsData } = require('../../server/controllers/metricsController');
const AgentModel = require('../../server/models/agentModel');
const responseCodes = require('../../server/utils/responseCodes');

// Mock dependencies
jest.mock('../../server/models/agentModel');

describe('Metrics Controller Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {};
    
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn()
    };
  });

  describe('getMetricsData', () => {
    it('should get metrics data successfully', async () => {
      const mockAgents = [
        { status: 'Active' },
        { status: 'Active' },
        { status: 'Inactive' },
        { status: 'Failed' }
      ];
      
      AgentModel.find.mockResolvedValue(mockAgents);

      await getMetricsData(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'success',
        data: [
          { name: 'Active', count: 2 },
          { name: 'Inactive', count: 1 },
          { name: 'Failed', count: 1 }
        ]
      });
    });

    it('should handle errors when getting metrics data', async () => {
      const error = new Error('Database error');
      AgentModel.find.mockRejectedValue(error);

      await getMetricsData(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        error: 'Database error'
      });
    });

    it('should handle empty agent list', async () => {
      AgentModel.find.mockResolvedValue([]);

      await getMetricsData(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'success',
        data: [
          { name: 'Active', count: 0 },
          { name: 'Inactive', count: 0 },
          { name: 'Failed', count: 0 }
        ]
      });
    });
  });
});