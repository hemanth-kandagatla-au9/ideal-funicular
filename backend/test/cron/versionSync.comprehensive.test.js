const { versionSync, syncVersionData } = require('../../server/cron/versionSync');
const { syncVersions } = require('../../server/services/versionManagementService');

jest.mock('../../server/services/versionManagementService');

describe('Version Sync Cron', () => {
  let consoleLogSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe('versionSync', () => {
    it('should call syncVersions and log start message', async () => {
      const mockResult = { synced: 5, failed: 0 };
      syncVersions.mockResolvedValue(mockResult);

      const result = await versionSync();

      expect(consoleLogSpy).toHaveBeenCalledWith('Cron job: Starting version synchronization...');
      expect(syncVersions).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });

    it('should propagate errors from syncVersions', async () => {
      const error = new Error('Sync failed');
      syncVersions.mockRejectedValue(error);

      await expect(versionSync()).rejects.toThrow('Sync failed');
      expect(consoleLogSpy).toHaveBeenCalledWith('Cron job: Starting version synchronization...');
    });

    it('should return sync results', async () => {
      const mockResult = { synced: 10, failed: 2, errors: [] };
      syncVersions.mockResolvedValue(mockResult);

      const result = await versionSync();

      expect(result).toEqual(mockResult);
    });
  });

  describe('syncVersionData', () => {
    it('should trigger version sync', () => {
      syncVersions.mockResolvedValue({ synced: 3 });

      syncVersionData();

      expect(consoleLogSpy).toHaveBeenCalledWith('Version sync cron job triggered');
    });

    it('should call versionSync without awaiting', () => {
      syncVersions.mockResolvedValue({ synced: 1 });

      syncVersionData();

      expect(consoleLogSpy).toHaveBeenCalled();
      // versionSync is called but not awaited in syncVersionData
    });
  });
});
