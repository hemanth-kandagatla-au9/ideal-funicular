const {
  manageVersions,
  deleteVersion,
  getVersionsList,
  getAgentVersions,
  version
} = require('../../server/controllers/agentVersionController');

const AgentModel = require('../../server/models/agentModel');
const AgentVersionModel = require('../../server/models/agentVersionModel');
const { updateVersion } = require('../../server/services/agentService');
const { handleApiResponse } = require('../../server/utils/agentUtils');

// Mock dependencies
jest.mock('../../server/models/agentModel');
jest.mock('../../server/models/agentVersionModel');
jest.mock('../../server/services/agentService');
jest.mock('../../server/utils/agentUtils');

const responseCodes = {
  SUCCESS: 200,
  ERROR: 400,
  SERVER_ERROR: 500
};

function createMockReq(options = {}) {
  return {
    method: options.method || 'POST',
    body: options.body || [],
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

describe('Agent Version Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('manageVersions', () => {
    describe('POST method - Insert versions', () => {
      it('should insert new versions successfully', async () => {
        const req = createMockReq({
          method: 'POST',
          body: [
            { agentVersion: '1.0.0', buildDate: '2024-01-01' },
            { agentVersion: '1.0.1', buildDate: '2024-01-02' }
          ]
        });
        const res = createMockRes();

        AgentVersionModel.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
        AgentVersionModel.insertOne.mockResolvedValue({});

        await manageVersions(req, res);

        expect(AgentVersionModel.findOne).toHaveBeenCalledTimes(2);
        expect(AgentVersionModel.insertOne).toHaveBeenCalledTimes(2);
        expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
        expect(res._json.flag).toBe('success');
        expect(res._json.data).toBe('2 records inserted successfully, 0 records failed.');
      });

      it('should handle partial success when some versions already exist', async () => {
        const req = createMockReq({
          method: 'POST',
          body: [
            { agentVersion: '1.0.0', buildDate: '2024-01-01' },
            { agentVersion: '1.0.1', buildDate: '2024-01-02' }
          ]
        });
        const res = createMockRes();

        AgentVersionModel.findOne.mockResolvedValueOnce({ agentVersion: '1.0.0' }).mockResolvedValueOnce(null);
        AgentVersionModel.insertOne.mockResolvedValue({});

        await manageVersions(req, res);

        expect(AgentVersionModel.insertOne).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
        expect(res._json.flag).toBe('partial_success');
        expect(res._json.data).toBe('1 records inserted successfully, 1 records failed.');
      });

      it('should handle all versions already existing', async () => {
        const req = createMockReq({
          method: 'POST',
          body: [
            { agentVersion: '1.0.0', buildDate: '2024-01-01' },
            { agentVersion: '1.0.1', buildDate: '2024-01-02' }
          ]
        });
        const res = createMockRes();

        AgentVersionModel.findOne.mockResolvedValue({ agentVersion: '1.0.0' });

        await manageVersions(req, res);

        expect(AgentVersionModel.insertOne).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
        expect(res._json.flag).toBe('partial_success');
        expect(res._json.data).toBe('0 records inserted successfully, 2 records failed.');
      });
    });

    describe('PUT method - Update versions', () => {
      it('should update versions successfully', async () => {
        const req = createMockReq({
          method: 'PUT',
          body: [
            { agentVersion: '1.0.0', buildDate: '2024-01-01' },
            { agentVersion: '1.0.1', buildDate: '2024-01-02' }
          ]
        });
        const res = createMockRes();

        AgentVersionModel.updateOne.mockResolvedValue({ modifiedCount: 1, upsertedCount: 0 });

        await manageVersions(req, res);

        expect(AgentVersionModel.updateOne).toHaveBeenCalledTimes(2);
        expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
        expect(res._json.flag).toBe('success');
        expect(res._json.data).toBe('2 records updated successfully, 0 records failed.');
      });

      it('should handle upserted records', async () => {
        const req = createMockReq({
          method: 'PUT',
          body: [
            { agentVersion: '1.0.0', buildDate: '2024-01-01' }
          ]
        });
        const res = createMockRes();

        AgentVersionModel.updateOne.mockResolvedValue({ modifiedCount: 0, upsertedCount: 1 });

        await manageVersions(req, res);

        expect(res._json.flag).toBe('success');
        expect(res._json.data).toBe('1 records updated successfully, 0 records failed.');
      });

      it('should handle partial success on updates', async () => {
        const req = createMockReq({
          method: 'PUT',
          body: [
            { agentVersion: '1.0.0', buildDate: '2024-01-01' },
            { agentVersion: '1.0.1', buildDate: '2024-01-02' }
          ]
        });
        const res = createMockRes();

        AgentVersionModel.updateOne
          .mockResolvedValueOnce({ modifiedCount: 1, upsertedCount: 0 })
          .mockResolvedValueOnce({ modifiedCount: 0, upsertedCount: 0 });

        await manageVersions(req, res);

        expect(res._json.flag).toBe('partial_success');
        expect(res._json.data).toBe('1 records updated successfully, 1 records failed.');
      });
    });

    it('should return error for invalid HTTP method', async () => {
      const req = createMockReq({
        method: 'DELETE',
        body: [{ agentVersion: '1.0.0' }]
      });
      const res = createMockRes();

      await manageVersions(req, res);

      expect(res.status).toHaveBeenCalledWith(responseCodes.ERROR);
      expect(res._json.flag).toBe('error');
      expect(res._json.message).toBe('Invalid HTTP method.');
    });

    it('should return error for invalid input format', async () => {
      const req = createMockReq({
        method: 'POST',
        body: { agentVersion: '1.0.0' } // Not an array
      });
      const res = createMockRes();

      await manageVersions(req, res);

      expect(res.status).toHaveBeenCalledWith(responseCodes.ERROR);
      expect(res._json.flag).toBe('error');
      expect(res._json.message).toBe('Invalid input format. Expected an array of version documents.');
    });

    it('should handle database errors gracefully', async () => {
      const req = createMockReq({
        method: 'POST',
        body: [{ agentVersion: '1.0.0' }]
      });
      const res = createMockRes();

      AgentVersionModel.findOne.mockRejectedValue(new Error('Database error'));

      await manageVersions(req, res);

      expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(res._json.flag).toBe('error');
      expect(res._json.message).toBe('Error occurred ');
    });
  });

  describe('deleteVersion', () => {
    it('should delete version successfully', async () => {
      const req = createMockReq({
        query: { agentVersion: '1.0.0' }
      });
      const res = createMockRes();

      AgentVersionModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await deleteVersion(req, res);

      expect(AgentVersionModel.deleteOne).toHaveBeenCalledWith({ agentVersion: '1.0.0' });
      expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(res._json.flag).toBe('success');
      expect(res._json.data).toBe('1 record deleted.');
    });

    it('should handle case when no records are deleted', async () => {
      const req = createMockReq({
        query: { agentVersion: 'non-existent' }
      });
      const res = createMockRes();

      AgentVersionModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await deleteVersion(req, res);

      expect(res._json.data).toBe('0 record deleted.');
    });

    it('should return error when agentVersion is missing', async () => {
      const req = createMockReq({
        query: {}
      });
      const res = createMockRes();

      await deleteVersion(req, res);

      expect(res.status).toHaveBeenCalledWith(responseCodes.ERROR);
      expect(res._json.flag).toBe('error');
      expect(res._json.message).toBe('agentVersion required.');
    });

    it('should handle database errors gracefully', async () => {
      const req = createMockReq({
        query: { agentVersion: '1.0.0' }
      });
      const res = createMockRes();

      AgentVersionModel.deleteOne.mockRejectedValue(new Error('Database error'));

      await deleteVersion(req, res);

      expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(res._json.flag).toBe('error');
      expect(res._json.message).toBe('Deletion error.');
    });
  });

  describe('getVersionsList', () => {
    it('should return static versions list', async () => {
      const req = createMockReq();
      const res = createMockRes();

      const mockVersions = [
        { _id: '1', agentVersion: '1.2.3', buildDate: new Date(), compatibleOS: ['linux'], upgradeType: 'full' },
        { _id: '2', agentVersion: '1.2.2', buildDate: new Date(), compatibleOS: ['windows'], upgradeType: 'full' },
        { _id: '3', agentVersion: '1.2.1', buildDate: new Date(), compatibleOS: ['linux'], upgradeType: 'full' }
      ];

      AgentVersionModel.find = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockVersions)
      });

      await getVersionsList(req, res);

      expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(res._json.flag).toBe('success');
      expect(res._json.data.risebotVersions).toHaveLength(3);
      expect(res._json.data.risebotVersions[0].version).toBe('1.2.3');
      expect(res._json.data.risebotVersions[1].version).toBe('1.2.2');
      expect(res._json.data.risebotVersions[2].version).toBe('1.2.1');
    });

    it('should handle errors when fetching versions list', async () => {
      const req = createMockReq();
      const res = createMockRes();

      const error = new Error('Database connection failed');
      AgentVersionModel.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            lean: jest.fn().mockRejectedValue(error)
          })
        })
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      await getVersionsList(req, res);

      expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(res._json.flag).toBe('error');
      expect(res._json.message).toBe('Failed to fetch versions');
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching versions list:', error);

      consoleSpy.mockRestore();
    });
  });

  describe('getAgentVersions', () => {
    it('should return distinct agent versions', async () => {
      const req = createMockReq();
      const res = createMockRes();

      const mockVersions = ['1.0.0', '1.0.1', '1.0.2'];
      AgentModel.distinct.mockResolvedValue(mockVersions);

      await getAgentVersions(req, res);

      expect(AgentModel.distinct).toHaveBeenCalledWith('agent_details.version');
      expect(res.status).toHaveBeenCalledWith(responseCodes.SUCCESS);
      expect(res._json.flag).toBe('success');
      expect(res._json.agentVersions.versions).toEqual(mockVersions);
    });

    it('should handle database errors gracefully', async () => {
      const req = createMockReq();
      const res = createMockRes();

      AgentModel.distinct.mockRejectedValue(new Error('Database error'));

      await getAgentVersions(req, res);

      expect(res.status).toHaveBeenCalledWith(responseCodes.SERVER_ERROR);
      expect(res._json.flag).toBe('error');
      expect(res._json.message).toBe('Internal server error');
      expect(res._json.error).toBeInstanceOf(Error);
    });
  });

  describe('version wrapper function', () => {
    it('should call handleApiResponse with updateVersion service', () => {
      const req = createMockReq();
      const res = createMockRes();

      version(req, res);

      expect(handleApiResponse).toHaveBeenCalledWith(req, res, updateVersion);
    });
  });
});