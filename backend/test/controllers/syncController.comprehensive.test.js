const {
  syncAgentStatus,
  syncCMDBData,
  manualVersionSync,
} = require('../../server/controllers/syncController');
const cronJobController = require('../../server/cron/agentInfo');
const { versionSync } = require('../../server/cron/versionSync');
const responseHandler = require('../../server/utils/responseHandler');
const responseCodes = require('../../server/utils/responseCodes');
const messages = require('../../server/utils/messages');

jest.mock('../../server/cron/agentInfo');
jest.mock('../../server/cron/versionSync');
jest.mock('../../server/utils/responseHandler');

describe('Sync Controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    responseHandler.mockImplementation((res, err, msg, data, code) => res);
  });

  describe('syncAgentStatus', () => {
    it('should sync agent status and discovery data successfully', async () => {
      cronJobController.syncAgentStatus = jest.fn();
      cronJobController.syncDiscoveryData = jest.fn();

      await syncAgentStatus(mockReq, mockRes);

      expect(cronJobController.syncAgentStatus).toHaveBeenCalled();
      expect(cronJobController.syncDiscoveryData).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'success',
        message: 'Agent Status Synced',
      });
    });

    it('should handle errors during agent status sync', async () => {
      const error = new Error('Sync failed');
      cronJobController.syncAgentStatus = jest.fn().mockImplementation(() => {
        throw error;
      });

      await syncAgentStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        error: 'Sync failed',
      });
    });

    it('should handle errors during discovery data sync', async () => {
      const error = new Error('Discovery sync failed');
      cronJobController.syncAgentStatus = jest.fn();
      cronJobController.syncDiscoveryData = jest.fn().mockImplementation(() => {
        throw error;
      });

      await syncAgentStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        error: 'Discovery sync failed',
      });
    });
  });

  describe('syncCMDBData', () => {
    it('should sync CMDB data successfully', async () => {
      cronJobController.syncDiscoveryData = jest.fn();

      await syncCMDBData(mockReq, mockRes);

      expect(cronJobController.syncDiscoveryData).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'success',
        message: 'Agent CMDB Synced',
      });
    });

    it('should handle errors during CMDB sync', async () => {
      const error = new Error('CMDB sync failed');
      cronJobController.syncDiscoveryData = jest.fn().mockImplementation(() => {
        throw error;
      });

      await syncCMDBData(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        flag: 'error',
        error: 'CMDB sync failed',
      });
    });
  });

  describe('manualVersionSync', () => {
    it('should manually sync versions successfully', async () => {
      const result = { synced: 10, failed: 0 };
      versionSync.mockResolvedValue(result);

      await manualVersionSync(mockReq, mockRes);

      expect(versionSync).toHaveBeenCalled();
      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        null,
        messages.SUCCESS,
        result,
        responseCodes.OK
      );
    });

    it('should handle errors during manual version sync', async () => {
      const error = new Error('Version sync failed');
      error.stack = 'Error: Version sync failed\n  at ...';
      versionSync.mockRejectedValue(error);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await manualVersionSync(mockReq, mockRes);

      expect(versionSync).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Manual version sync error:', error);
      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        error.stack,
        messages.SERVER_ERROR,
        [],
        responseCodes.SERVER_ERROR
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle timeout errors during version sync', async () => {
      const error = new Error('Timeout');
      error.stack = 'Error: Timeout\n  at ...';
      versionSync.mockRejectedValue(error);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await manualVersionSync(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        error.stack,
        messages.SERVER_ERROR,
        [],
        responseCodes.SERVER_ERROR
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
