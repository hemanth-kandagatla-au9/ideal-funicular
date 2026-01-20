const jobController = require('../../server/controllers/jobController');
const { getJobs, putStart, putStop, putRestart, getJobDetails, postJob, deleteJob, updateJob, getJobLogs } = require('../../server/services/agentService');
const { handleApiResponse } = require('../../server/utils/agentUtils');

// Mock dependencies
jest.mock('../../server/services/agentService');
jest.mock('../../server/utils/agentUtils');

describe('Job Controller Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockReq = {
      body: { jobName: 'test-job' },
      params: { hostname: 'test-host' },
      query: { name: 'test-job' }
    };
    
    mockRes = {
      status: jest.fn(() => mockRes),
      json: jest.fn()
    };
  });

  describe('jobs', () => {
    it('should handle getting jobs successfully', () => {
      handleApiResponse.mockReturnValue();

      jobController.jobs(mockReq, mockRes);

      expect(handleApiResponse).toHaveBeenCalledWith(mockReq, mockRes, getJobs);
    });
  });

  describe('start', () => {
    it('should handle starting job successfully', () => {
      handleApiResponse.mockReturnValue();

      jobController.start(mockReq, mockRes);

      expect(handleApiResponse).toHaveBeenCalledWith(mockReq, mockRes, putStart);
    });
  });

  describe('stopjob', () => {
    it('should handle stopping job successfully', () => {
      handleApiResponse.mockReturnValue();

      jobController.stopjob(mockReq, mockRes);

      expect(handleApiResponse).toHaveBeenCalledWith(mockReq, mockRes, putStop);
    });
  });

  describe('restart', () => {
    it('should handle restarting job successfully', () => {
      handleApiResponse.mockReturnValue();

      jobController.restart(mockReq, mockRes);

      expect(handleApiResponse).toHaveBeenCalledWith(mockReq, mockRes, putRestart);
    });
  });

  describe('getJobDetails', () => {
    it('should handle getting job details successfully', () => {
      handleApiResponse.mockReturnValue();

      jobController.getJobDetails(mockReq, mockRes);

      expect(handleApiResponse).toHaveBeenCalledWith(mockReq, mockRes, getJobDetails);
    });
  });

  describe('postJob', () => {
    it('should handle posting job successfully', () => {
      handleApiResponse.mockReturnValue();

      jobController.postJob(mockReq, mockRes);

      expect(handleApiResponse).toHaveBeenCalledWith(mockReq, mockRes, postJob);
    });
  });

  describe('deleteJob', () => {
    it('should handle deleting job successfully', () => {
      handleApiResponse.mockReturnValue();

      jobController.deleteJob(mockReq, mockRes);

      expect(handleApiResponse).toHaveBeenCalledWith(mockReq, mockRes, deleteJob);
    });
  });

  describe('updateJob', () => {
    it('should handle updating job successfully', () => {
      handleApiResponse.mockReturnValue();

      jobController.updateJob(mockReq, mockRes);

      expect(handleApiResponse).toHaveBeenCalledWith(mockReq, mockRes, updateJob);
    });
  });

  describe('getJobLogs', () => {
    it('should handle getting job logs successfully', () => {
      handleApiResponse.mockReturnValue();

      jobController.getJobLogs(mockReq, mockRes);

      expect(handleApiResponse).toHaveBeenCalledWith(mockReq, mockRes, getJobLogs);
    });
  });
});