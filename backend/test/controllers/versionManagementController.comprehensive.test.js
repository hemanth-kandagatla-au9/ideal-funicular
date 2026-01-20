const {
  createVersion,
  fetchVersions,
  deleteVersion,
  updateVersion
} = require('../../server/controllers/version-management-controller/versionManagement.controller');
const responseHandler = require('../../server/utils/responseHandler');
const responseCodes = require('../../server/utils/responseCodes');
const messages = require('../../server/utils/messages');
const {
  saveVersion,
  getVersions,
  softDeleteVersion,
  updateVersionService
} = require('../../server/services/versionManagementService');

// Mock dependencies
jest.mock('../../server/utils/responseHandler');
jest.mock('../../server/services/versionManagementService');

describe('versionManagement.controller', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
    responseHandler.mockImplementation((res, error, message, data, code) => {
      return res.status(code).json({ error, message, data });
    });
  });

  describe('createVersion', () => {
    it('should create version successfully', async () => {
      mockReq.body = { agentVersion: '1.0.0', description: 'Initial release' };
      saveVersion.mockResolvedValue({ _id: '123', agentVersion: '1.0.0' });

      await createVersion(mockReq, mockRes);

      expect(saveVersion).toHaveBeenCalledWith(mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        null,
        messages.SUCCESS,
        'Version created successfully',
        responseCodes.SUCCESS
      );
    });

    it('should handle error when version already exists', async () => {
      mockReq.body = { agentVersion: '1.0.0' };
      saveVersion.mockResolvedValue(responseCodes.EXISTS);

      await createVersion(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        true,
        messages.EXISTS,
        'Version 1.0.0 already exists',
        responseCodes.EXISTS
      );
    });

    it('should handle service error during creation', async () => {
      mockReq.body = { agentVersion: '1.0.0' };
      const mockError = new Error('Database error');
      saveVersion.mockRejectedValue(mockError);

      await createVersion(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        mockError.stack,
        messages.SERVER_ERROR,
        [],
        responseCodes.SERVER_ERROR
      );
    });

    it('should handle exceptions in catch block', async () => {
      mockReq.body = { agentVersion: '1.0.0' };
      const mockError = new Error('Unexpected error');
      mockError.stack = 'error stack';
      saveVersion.mockImplementation(() => {
        throw mockError;
      });

      await createVersion(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        'error stack',
        messages.SERVER_ERROR,
        [],
        responseCodes.SERVER_ERROR
      );
    });
  });

  describe('fetchVersions', () => {
    it('should fetch versions successfully', async () => {
      const mockVersions = [
        { _id: '1', agentVersion: '1.0.0' },
        { _id: '2', agentVersion: '2.0.0' },
      ];
      getVersions.mockResolvedValue(mockVersions);

      await fetchVersions(mockReq, mockRes);

      expect(mockReq.query.isDeleted).toBe(false);
      expect(getVersions).toHaveBeenCalledWith(mockReq.query);
      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        null,
        messages.SUCCESS,
        mockVersions,
        responseCodes.SUCCESS
      );
    });

    it('should handle service error during fetch', async () => {
      const mockError = new Error('Database error');
      getVersions.mockRejectedValue(mockError);

      await fetchVersions(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        mockError.stack,
        messages.SERVER_ERROR,
        [],
        responseCodes.SERVER_ERROR
      );
    });

    it('should handle exceptions in catch block', async () => {
      const mockError = new Error('Unexpected error');
      mockError.stack = 'error stack';
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      getVersions.mockImplementation(() => {
        throw mockError;
      });

      await fetchVersions(mockReq, mockRes);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('error fetching versions'));
      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        'error stack',
        messages.SERVER_ERROR,
        [],
        responseCodes.SERVER_ERROR
      );

      consoleLogSpy.mockRestore();
    });

    it('should fetch with query filters', async () => {
      mockReq.query = { agentVersion: '1.0.0' };
      getVersions.mockResolvedValue([{ _id: '1', agentVersion: '1.0.0' }]);

      await fetchVersions(mockReq, mockRes);

      expect(mockReq.query.isDeleted).toBe(false);
      expect(getVersions).toHaveBeenCalledWith(
        expect.objectContaining({ agentVersion: '1.0.0', isDeleted: false })
      );
    });
  });

  describe('deleteVersion', () => {
    it('should delete version successfully', async () => {
      mockReq.params = { id: '123' };
      const mockDeletedVersion = { _id: '123', isDeleted: true };
      softDeleteVersion.mockResolvedValue(mockDeletedVersion);

      await deleteVersion(mockReq, mockRes);

      expect(softDeleteVersion).toHaveBeenCalledWith('123');
      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        null,
        messages.SUCCESS,
        mockDeletedVersion,
        responseCodes.SUCCESS
      );
    });

    it('should handle invalid ObjectId', async () => {
      mockReq.params = { id: 'invalid-id' };
      softDeleteVersion.mockResolvedValue('Invalid ObjectId');

      await deleteVersion(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        true,
        'Invalid ObjectId',
        [],
        responseCodes.ERROR
      );
    });

    it('should handle version not found', async () => {
      mockReq.params = { id: '123' };
      softDeleteVersion.mockResolvedValue('Version not found');

      await deleteVersion(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        true,
        'Version not found',
        [],
        responseCodes.NOT_FOUND
      );
    });

    it('should handle service error during deletion', async () => {
      mockReq.params = { id: '123' };
      const mockError = new Error('Database error');
      softDeleteVersion.mockRejectedValue(mockError);

      await deleteVersion(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        mockError.stack,
        messages.SERVER_ERROR,
        [],
        responseCodes.SERVER_ERROR
      );
    });

    it('should handle exceptions in catch block', async () => {
      mockReq.params = { id: '123' };
      const mockError = new Error('Unexpected error');
      mockError.stack = 'error stack';
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      softDeleteVersion.mockImplementation(() => {
        throw mockError;
      });

      await deleteVersion(mockReq, mockRes);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('error deleting versions'));
      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        'error stack',
        messages.SERVER_ERROR,
        [],
        responseCodes.SERVER_ERROR
      );

      consoleLogSpy.mockRestore();
    });
  });

  describe('updateVersion', () => {
    it('should update version successfully', async () => {
      mockReq.params = { id: '123' };
      mockReq.body = { agentVersion: '1.0.1', description: 'Updated' };
      const mockUpdatedVersion = { _id: '123', agentVersion: '1.0.1' };
      updateVersionService.mockResolvedValue(mockUpdatedVersion);

      await updateVersion(mockReq, mockRes);

      expect(updateVersionService).toHaveBeenCalledWith('123', mockReq.body);
      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        null,
        messages.SUCCESS,
        mockUpdatedVersion,
        responseCodes.SUCCESS
      );
    });

    it('should handle invalid ObjectId', async () => {
      mockReq.params = { id: 'invalid-id' };
      mockReq.body = { agentVersion: '1.0.1' };
      updateVersionService.mockResolvedValue('Invalid ObjectId');

      await updateVersion(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        true,
        'Invalid ObjectId',
        [],
        responseCodes.ERROR
      );
    });

    it('should handle version not found', async () => {
      mockReq.params = { id: '123' };
      mockReq.body = { agentVersion: '1.0.1' };
      updateVersionService.mockResolvedValue('Version not found');

      await updateVersion(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        true,
        'Version not found',
        [],
        responseCodes.NOT_FOUND
      );
    });

    it('should handle service error during update', async () => {
      mockReq.params = { id: '123' };
      mockReq.body = { agentVersion: '1.0.1' };
      const mockError = new Error('Database error');
      updateVersionService.mockRejectedValue(mockError);

      await updateVersion(mockReq, mockRes);

      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        mockError.stack,
        messages.SERVER_ERROR,
        [],
        responseCodes.SERVER_ERROR
      );
    });

    it('should handle exceptions in catch block', async () => {
      mockReq.params = { id: '123' };
      mockReq.body = { agentVersion: '1.0.1' };
      const mockError = new Error('Unexpected error');
      mockError.stack = 'error stack';
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      updateVersionService.mockImplementation(() => {
        throw mockError;
      });

      await updateVersion(mockReq, mockRes);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('error deleting versions'));
      expect(responseHandler).toHaveBeenCalledWith(
        mockRes,
        'error stack',
        messages.SERVER_ERROR,
        [],
        responseCodes.SERVER_ERROR
      );

      consoleLogSpy.mockRestore();
    });
  });
});
