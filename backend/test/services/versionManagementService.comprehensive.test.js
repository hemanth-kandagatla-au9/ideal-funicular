const mongoose = require('mongoose');
const AgentVersionModel = require('../../server/models/agentVersionModel');
const VersionsModel = require('../../server/models/versionsModel');
const responseCodes = require('../../server/utils/responseCodes');

jest.mock('../../server/models/agentVersionModel');
jest.mock('../../server/models/versionsModel');

const {
  getVersions,
  saveVersion,
  updateVersionService,
  softDeleteVersion,
  syncVersions
} = require('../../server/services/versionManagementService');

describe('versionManagementService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getVersions', () => {
    it('should fetch versions with filters and pagination', async () => {
      const mockAggregateResult = [
        { agentVersion: '1.0.0', versionStatus: 'stable', upgradeType: 'minor' }
      ];
      const mockCountResult = [{ total: 1 }];
      const mockFilterResult = {
        operatingSystem: ['linux', 'windows'],
        versionStatus: ['stable'],
        upgradeType: ['minor']
      };

      AgentVersionModel.aggregate = jest.fn()
        .mockResolvedValueOnce(mockCountResult) // First call for count
        .mockResolvedValueOnce(mockAggregateResult) // Second call for data
        .mockResolvedValueOnce([mockFilterResult]); // Third call for filters

      const query = {
        operatingSystem: 'linux',
        versionStatus: 'stable',
        upgradeType: 'minor',
        page: 1,
        limit: 10,
        isDeleted: false
      };

      const result = await getVersions(query);

      expect(result.versionData).toEqual(mockAggregateResult);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(AgentVersionModel.aggregate).toHaveBeenCalledTimes(3);
    });

    it('should handle date range filters', async () => {
      AgentVersionModel.aggregate = jest.fn()
        .mockResolvedValueOnce([{ total: 0 }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{
          operatingSystem: [],
          versionStatus: [],
          upgradeType: []
        }]);

      const query = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        isDeleted: false
      };

      const result = await getVersions(query);

      expect(result.pagination.total).toBe(0);
      expect(AgentVersionModel.aggregate).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('Database error');
      AgentVersionModel.aggregate = jest.fn().mockRejectedValue(error);

      const query = { isDeleted: false };
      const result = await getVersions(query);

      expect(result).toBe(error);
    });

    it('should handle agentVersion filter', async () => {
      AgentVersionModel.aggregate = jest.fn()
        .mockResolvedValueOnce([{ total: 1 }])
        .mockResolvedValueOnce([{ agentVersion: '2.0.0' }])
        .mockResolvedValueOnce([{ operatingSystem: [], versionStatus: [], upgradeType: [] }]);

      const query = {
        agentVersion: '2.0.0',
        isDeleted: false
      };

      const result = await getVersions(query);

      expect(result.versionData).toHaveLength(1);
      expect(AgentVersionModel.aggregate).toHaveBeenCalled();
    });
  });

  describe('saveVersion', () => {
    it('should return EXISTS code when version already exists', async () => {
      AgentVersionModel.find = jest.fn().mockResolvedValue([
        { agentVersion: '1.0.0', isDeleted: false }
      ]);

      const versionData = { agentVersion: '1.0.0' };
      const result = await saveVersion(versionData);

      expect(result).toBe(responseCodes.EXISTS);
      expect(AgentVersionModel.find).toHaveBeenCalledWith({
        agentVersion: '1.0.0',
        isDeleted: false
      });
    });

    it('should save new version successfully', async () => {
      const mockSavedVersion = {
        agentVersion: '2.0.0',
        versionStatus: 'beta',
        _id: 'mock-id'
      };

      AgentVersionModel.find = jest.fn().mockResolvedValue([]);
      
      const mockSave = jest.fn().mockResolvedValue(mockSavedVersion);
      AgentVersionModel.mockImplementation(() => ({
        save: mockSave
      }));

      const versionData = { agentVersion: '2.0.0', versionStatus: 'beta' };
      const result = await saveVersion(versionData);

      expect(result).toEqual(mockSavedVersion);
      expect(mockSave).toHaveBeenCalled();
    });

    it('should handle save errors', async () => {
      const error = new Error('Save failed');
      AgentVersionModel.find = jest.fn().mockResolvedValue([]);
      
      AgentVersionModel.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(error)
      }));

      const versionData = { agentVersion: '3.0.0' };
      const result = await saveVersion(versionData);

      expect(result).toBe(error);
    });
  });

  describe('updateVersionService', () => {
    it('should update version successfully', async () => {
      const mockId = '507f1f77bcf86cd799439011';
      const mockUpdatedDoc = {
        _id: mockId,
        agentVersion: '1.0.1',
        versionStatus: 'stable'
      };

      AgentVersionModel.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedDoc);

      const updateData = { versionStatus: 'stable' };
      const result = await updateVersionService(mockId, updateData);

      expect(result.message).toBe('Version data updated successfully');
      expect(result.data).toEqual(mockUpdatedDoc);
      expect(AgentVersionModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockId, isDeleted: false },
        { $set: updateData },
        { new: true }
      );
    });

    it('should handle invalid ObjectId', async () => {
      const result = await updateVersionService('invalid-id', { versionStatus: 'stable' });
      expect(result).toBe('Invalid ObjectId');
    });

    it('should handle version not found', async () => {
      const mockId = '507f1f77bcf86cd799439011';
      AgentVersionModel.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      const result = await updateVersionService(mockId, { versionStatus: 'deprecated' });
      expect(result).toBe('Version not found');
    });

    it('should handle update errors', async () => {
      const mockId = '507f1f77bcf86cd799439011';
      const error = new Error('Update failed');
      AgentVersionModel.findOneAndUpdate = jest.fn().mockRejectedValue(error);

      const result = await updateVersionService(mockId, { versionStatus: 'deprecated' });
      expect(result).toBe(error);
    });
  });

  describe('softDeleteVersion', () => {
    it('should soft delete version successfully', async () => {
      const mockId = '507f1f77bcf86cd799439011';
      const mockDeletedDoc = {
        _id: mockId,
        agentVersion: '1.0.0',
        isDeleted: true
      };

      AgentVersionModel.findOneAndUpdate = jest.fn().mockResolvedValue(mockDeletedDoc);

      const result = await softDeleteVersion(mockId);

      expect(result.message).toBe('Version soft-deleted successfully');
      expect(result.data).toEqual(mockDeletedDoc);
      expect(AgentVersionModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockId, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );
    });

    it('should handle version not found', async () => {
      const mockId = '507f1f77bcf86cd799439011';
      AgentVersionModel.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      const result = await softDeleteVersion(mockId);
      expect(result).toBe('Version not found');
    });

    it('should handle delete errors', async () => {
      const mockId = '507f1f77bcf86cd799439011';
      const error = new Error('Delete failed');
      AgentVersionModel.findOneAndUpdate = jest.fn().mockRejectedValue(error);

      const result = await softDeleteVersion(mockId);
      expect(result).toBe(error);
    });
  });

  describe('syncVersions', () => {
    it('should sync versions from VersionsModel successfully', async () => {
      const mockVersions = [
        { version: '3.0.0', buildDate: '2024-01-01', isActive: true }
      ];

      VersionsModel.find = jest.fn().mockResolvedValue(mockVersions);
      AgentVersionModel.findOne = jest.fn().mockResolvedValue(null);
      
      const mockSave = jest.fn().mockResolvedValue({ _id: 'new-id' });
      AgentVersionModel.mockImplementation(() => ({
        save: mockSave
      }));

      const result = await syncVersions();

      expect(result.success).toBe(true);
      expect(result.syncedCount).toBeGreaterThanOrEqual(0);
      expect(VersionsModel.find).toHaveBeenCalled();
    });

    it('should handle sync errors', async () => {
      const error = new Error('Sync failed');
      VersionsModel.find = jest.fn().mockRejectedValue(error);

      const result = await syncVersions();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Sync failed');
    });
  });

  describe('extractFilterOptions', () => {
    it('should extract unique filter options from versions', async () => {
      const mockFilterResult = {
        operatingSystem: ['linux', 'windows'],
        versionStatus: ['stable', 'beta'],
        upgradeType: ['major', 'minor']
      };

      AgentVersionModel.aggregate = jest.fn().mockResolvedValue([mockFilterResult]);

      const query = { isDeleted: false };
      const result = await getVersions(query);

      // extractFilterOptions is called internally by getVersions
      expect(result.filterData).toBeDefined();
    });
  });

  describe('syncVersions - Error Handling', () => {
    it('should skip version with missing version field', async () => {
      const mockVersions = [
        { buildDate: '2024-01-01' }, // Missing version field
        { version: '1.0.0', buildDate: '2024-01-01' }
      ];

      VersionsModel.find.mockResolvedValue(mockVersions);
      AgentVersionModel.findOne.mockResolvedValue(null);
      AgentVersionModel.create.mockResolvedValue({});

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const result = await syncVersions();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Skipping version with missing version field:',
        mockVersions[0]
      );
      expect(result.syncedCount).toBe(1);
      consoleSpy.mockRestore();
    });

    it('should handle error during version sync', async () => {
      const mockVersions = [
        { version: '1.0.0', buildDate: '2024-01-01' }
      ];

      VersionsModel.find.mockResolvedValue(mockVersions);
      AgentVersionModel.findOne.mockRejectedValue(new Error('Database error'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await syncVersions();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error syncing version 1.0.0:',
        'Database error'
      );
      expect(result.errorCount).toBe(1);
      consoleSpy.mockRestore();
    });

    it('should update buildDate for existing version', async () => {
      const mockVersions = [
        { version: '1.0.0', buildDate: '2024-02-01' }
      ];

      const existingVersion = {
        _id: 'version123',
        agentVersion: '1.0.0',
        buildDate: new Date('2024-01-01')
      };

      VersionsModel.find.mockResolvedValue(mockVersions);
      AgentVersionModel.findOne.mockResolvedValue(existingVersion);
      AgentVersionModel.findByIdAndUpdate.mockResolvedValue({});

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await syncVersions();

      expect(AgentVersionModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'version123',
        expect.objectContaining({
          buildDate: expect.any(Date)
        })
      );
      expect(result.updatedCount).toBe(1);
      consoleSpy.mockRestore();
    });

    it('should log when buildDate is unchanged', async () => {
      const buildDate = new Date('2024-01-01');
      const mockVersions = [
        { version: '1.0.0', buildDate: buildDate.toISOString() }
      ];

      const existingVersion = {
        _id: 'version123',
        agentVersion: '1.0.0',
        buildDate: buildDate
      };

      VersionsModel.find.mockResolvedValue(mockVersions);
      AgentVersionModel.findOne.mockResolvedValue(existingVersion);

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await syncVersions();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Version 1.0.0 buildDate unchanged')
      );
      consoleSpy.mockRestore();
    });
  });
});
