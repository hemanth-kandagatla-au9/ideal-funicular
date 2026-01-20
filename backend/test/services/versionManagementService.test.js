const mongoose = require("mongoose");
const {
  saveVersion,
  getVersions,
  softDeleteVersion,
  updateVersionService
} = require('../../server/services/versionManagementService');

const responseCodes = require('../../server/utils/responseCodes');

// Mock dependencies
jest.mock('../../server/models/agentVersionModel', () => ({
  aggregate: jest.fn(),
  find: jest.fn(),
  findOneAndUpdate: jest.fn()
}));

jest.mock('mongoose', () => ({
  Schema: jest.fn().mockImplementation(() => ({})),
  model: jest.fn(),
  Types: {
    ObjectId: {
      isValid: jest.fn()
    }
  }
}));

const AgentVersionModel = require('../../server/models/agentVersionModel');

describe('Version Management Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getVersions', () => {
    it('should return versions with pagination', async () => {
      const query = {
        page: 1,
        limit: 10,
        isDeleted: false
      };

      const mockVersions = [
        { _id: '1', agentVersion: '1.0.0', versionStatus: 'stable' },
        { _id: '2', agentVersion: '1.0.1', versionStatus: 'beta' }
      ];

      const mockCountResult = [{ total: 25 }];
      const mockFilterOptions = {
        operatingSystem: ['linux', 'windows'],
        versionStatus: ['stable', 'beta'],
        upgradeType: ['major', 'minor']
      };

      AgentVersionModel.aggregate
        .mockResolvedValueOnce(mockCountResult)
        .mockResolvedValueOnce(mockVersions)
        .mockResolvedValueOnce([mockFilterOptions]);

      const result = await getVersions(query);

      expect(result.versionData).toEqual(mockVersions);
      expect(result.pagination.total).toBe(25);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.totalPages).toBe(3);
      expect(result.filterData).toEqual(mockFilterOptions);
    });

    it('should filter by operating system', async () => {
      const query = {
        operatingSystem: 'linux,windows',
        page: 1,
        limit: 10,
        isDeleted: false
      };

      AgentVersionModel.aggregate
        .mockResolvedValueOnce([{ total: 5 }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{}]);

      await getVersions(query);

      expect(AgentVersionModel.aggregate).toHaveBeenCalledWith([
        { $match: { isDeleted: false, "compatibleOS.agentType": { $in: ['linux', 'windows'] } } },
        { $count: "total" }
      ]);
    });

    it('should filter by version status', async () => {
      const query = {
        versionStatus: 'stable,beta',
        page: 1,
        limit: 10,
        isDeleted: false
      };

      AgentVersionModel.aggregate
        .mockResolvedValueOnce([{ total: 3 }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{}]);

      await getVersions(query);

      expect(AgentVersionModel.aggregate).toHaveBeenCalledWith([
        { $match: { isDeleted: false, versionStatus: { $in: ['stable', 'beta'] } } },
        { $count: "total" }
      ]);
    });

    it('should filter by upgrade type', async () => {
      const query = {
        upgradeType: 'major,minor',
        page: 1,
        limit: 10,
        isDeleted: false
      };

      AgentVersionModel.aggregate
        .mockResolvedValueOnce([{ total: 2 }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{}]);

      await getVersions(query);

      expect(AgentVersionModel.aggregate).toHaveBeenCalledWith([
        { $match: { isDeleted: false, upgradeType: { $in: ['major', 'minor'] } } },
        { $count: "total" }
      ]);
    });

    it('should filter by date range', async () => {
      const query = {
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        page: 1,
        limit: 10,
        isDeleted: false
      };

      AgentVersionModel.aggregate
        .mockResolvedValueOnce([{ total: 10 }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{}]);

      await getVersions(query);

      expect(AgentVersionModel.aggregate).toHaveBeenCalledWith([
        { 
          $match: { 
            isDeleted: false, 
            releaseDate: { 
              $gte: new Date('2024-01-01'), 
              $lte: new Date('2024-12-31') 
            } 
          } 
        },
        { $count: "total" }
      ]);
    });

    it('should handle start date only', async () => {
      const query = {
        startDate: '2024-01-01',
        page: 1,
        limit: 10,
        isDeleted: false
      };

      AgentVersionModel.aggregate
        .mockResolvedValueOnce([{ total: 5 }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{}]);

      await getVersions(query);

      expect(AgentVersionModel.aggregate).toHaveBeenCalledWith([
        { 
          $match: { 
            isDeleted: false, 
            releaseDate: { 
              $gte: new Date('2024-01-01')
            } 
          } 
        },
        { $count: "total" }
      ]);
    });

    it('should handle empty count result', async () => {
      const query = {
        page: 1,
        limit: 10,
        isDeleted: false
      };

      AgentVersionModel.aggregate
        .mockResolvedValueOnce([]) // Empty count result
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{}]);

      const result = await getVersions(query);

      expect(result.pagination.total).toBe(0);
      expect(result.pagination.totalPages).toBe(0);
    });

    it('should use default pagination values', async () => {
      const query = {
        isDeleted: false
      };

      AgentVersionModel.aggregate
        .mockResolvedValueOnce([{ total: 15 }])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{}]);

      const result = await getVersions(query);

      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
    });

    it('should handle database errors', async () => {
      const query = {
        page: 1,
        limit: 10,
        isDeleted: false
      };

      const mockError = new Error('Database connection failed');
      AgentVersionModel.aggregate.mockRejectedValue(mockError);

      const result = await getVersions(query);

      expect(result).toBe(mockError);
    });
  });

  describe('saveVersion', () => {
    it('should return EXISTS code when version already exists', async () => {
      const versionData = {
        agentVersion: '1.0.0',
        versionStatus: 'stable'
      };

      AgentVersionModel.find.mockResolvedValue([{ agentVersion: '1.0.0' }]);

      const result = await saveVersion(versionData);

      expect(result).toBe(responseCodes.EXISTS);
    });

    it('should handle database find errors', async () => {
      const versionData = {
        agentVersion: '2.0.0',
        versionStatus: 'stable'
      };

      const mockError = new Error('Find failed');
      AgentVersionModel.find.mockRejectedValue(mockError);

      const result = await saveVersion(versionData);

      expect(result).toBe(mockError);
    });
  });

  describe('softDeleteVersion', () => {
    it('should soft delete version successfully', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const mockResult = {
        _id: validId,
        agentVersion: '1.0.0',
        isDeleted: true
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      AgentVersionModel.findOneAndUpdate.mockResolvedValue(mockResult);

      const result = await softDeleteVersion(validId);

      expect(AgentVersionModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: validId, isDeleted: false },
        { isDeleted: true },
        { new: true }
      );
      expect(result.message).toBe('Version soft-deleted successfully');
      expect(result.data).toEqual(mockResult);
    });

    it('should return error for invalid ObjectId', async () => {
      const invalidId = 'invalid_id';

      mongoose.Types.ObjectId.isValid.mockReturnValue(false);

      const result = await softDeleteVersion(invalidId);

      expect(result).toBe('Invalid ObjectId');
      expect(AgentVersionModel.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it('should return not found when version does not exist', async () => {
      const validId = '507f1f77bcf86cd799439011';

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      AgentVersionModel.findOneAndUpdate.mockResolvedValue(null);

      const result = await softDeleteVersion(validId);

      expect(result).toBe('Version not found');
    });

    it('should handle database errors', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const mockError = new Error('Database error');

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      AgentVersionModel.findOneAndUpdate.mockRejectedValue(mockError);

      const result = await softDeleteVersion(validId);

      expect(result).toBe(mockError);
    });
  });

  describe('updateVersionService', () => {
    it('should update version successfully', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const updateData = {
        versionStatus: 'deprecated',
        upgradeType: 'patch'
      };
      const mockResult = {
        _id: validId,
        agentVersion: '1.0.0',
        ...updateData
      };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      AgentVersionModel.findOneAndUpdate.mockResolvedValue(mockResult);

      const result = await updateVersionService(validId, updateData);

      expect(AgentVersionModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: validId, isDeleted: false },
        { $set: updateData },
        { new: true }
      );
      expect(result.message).toBe('Version data updated successfully');
      expect(result.data).toEqual(mockResult);
    });

    it('should return error for invalid ObjectId', async () => {
      const invalidId = 'invalid_id';
      const updateData = { versionStatus: 'stable' };

      mongoose.Types.ObjectId.isValid.mockReturnValue(false);

      const result = await updateVersionService(invalidId, updateData);

      expect(result).toBe('Invalid ObjectId');
      expect(AgentVersionModel.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it('should return not found when version does not exist', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const updateData = { versionStatus: 'stable' };

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      AgentVersionModel.findOneAndUpdate.mockResolvedValue(null);

      const result = await updateVersionService(validId, updateData);

      expect(result).toBe('Version not found');
    });

    it('should handle database errors', async () => {
      const validId = '507f1f77bcf86cd799439011';
      const updateData = { versionStatus: 'stable' };
      const mockError = new Error('Update failed');

      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      AgentVersionModel.findOneAndUpdate.mockRejectedValue(mockError);

      const result = await updateVersionService(validId, updateData);

      expect(result).toBe(mockError);
    });
  });
});