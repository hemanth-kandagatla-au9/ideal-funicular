const {
  bulkStartAgent,
  bulkStopAgent,
  bulkRestartAgent,
  bulkUpgradeAgent,
  validateAgent
} = require('../../server/controllers/bulkAgentController');

const { executeCommandOnAgent } = require('../../server/utils/agentUtils');
const { putShutDown, putRestartAgent, updateVersion } = require('../../server/services/agentService');
const responseCodes = require('../../server/utils/responseCodes');

// Mock dependencies
jest.mock('../../server/utils/agentUtils');
jest.mock('../../server/services/agentService');

describe('Bulk Agent Controller Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      body: [
        { hostname: 'host1', osVersion: '7.10' },
        { hostname: 'host2', osVersion: '6.5' }
      ],
      query: {
        agentpath: '/test/path',
        risebotAgentVersion: '1.0.0'
      }
    };
    
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn()
    };
  });

  describe('bulkStartAgent', () => {
    it('should start bulk agents successfully', async () => {
      executeCommandOnAgent.mockResolvedValue();

      await bulkStartAgent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'success',
        message: 'Bulk Agent Started'
      });
    });

    it('should handle errors in bulk start', async () => {
      mockReq.body = null; // Force error
      
      await bulkStartAgent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        error: "object null is not iterable (cannot read property Symbol(Symbol.iterator))"
      });
    });
  });

  describe('bulkStopAgent', () => {
    it('should stop bulk agents successfully', async () => {
      putShutDown.mockResolvedValue();

      await bulkStopAgent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'success',
        message: 'Bulk Agent Stopped'
      });
    });
  });

  describe('bulkRestartAgent', () => {
    it('should restart bulk agents successfully', async () => {
      putRestartAgent.mockResolvedValue();

      await bulkRestartAgent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'success',
        message: 'Bulk Agent ReStarted'
      });
    });
  });

  describe('bulkUpgradeAgent', () => {
    it('should upgrade bulk agents successfully', async () => {
      updateVersion.mockResolvedValue();

      await bulkUpgradeAgent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'success',
        message: 'Bulk Agent Upgraded'
      });
    });
  });

  describe('validateAgent', () => {
    it('should validate agent successfully', async () => {
      await validateAgent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        isCompatible: true
      });
    });
  });
});