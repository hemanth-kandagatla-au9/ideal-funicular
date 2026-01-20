const { fetchApplicationPerformanceData } = require('../../server/controllers/ui-monitoring-controller/applicationController');
const { fetchInfrastructureMonitoringData } = require('../../server/controllers/ui-monitoring-controller/infrastructureController');
const { fetchLogsData } = require('../../server/controllers/ui-monitoring-controller/logsController');
const { fetchCardData } = require('../../server/controllers/ui-monitoring-controller/metricsController');
const { fetchNetworkMonitoringData } = require('../../server/controllers/ui-monitoring-controller/networkController');
const { fetchAlertsData } = require('../../server/controllers/ui-monitoring-controller/securityAlertController');

describe('UI Monitoring Controllers', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = { body: {}, params: {}, query: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('applicationController', () => {
    it('should fetch application performance data successfully', async () => {
      await fetchApplicationPerformanceData(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        statusCode: 200,
        message: 'Data fetched successfully',
        data: expect.any(Object)
      }));
    });
  });

  describe('infrastructureController', () => {
    it('should fetch infrastructure data successfully', async () => {
      await fetchInfrastructureMonitoringData(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        statusCode: 200,
        message: 'Data fetched successfully',
        data: expect.any(Object)
      }));
    });
  });

  describe('logsController', () => {
    it('should fetch logs data successfully', async () => {
      await fetchLogsData(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        statusCode: 200,
        message: 'Data fetched successfully',
        data: expect.any(Object)
      }));
    });
  });

  describe('metricsController', () => {
    it('should fetch metrics data successfully', async () => {
      await fetchCardData(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        statusCode: 200,
        message: 'Data fetched successfully',
        data: expect.any(Object)
      }));
    });
  });

  describe('networkController', () => {
    it('should fetch network data successfully', async () => {
      await fetchNetworkMonitoringData(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        statusCode: 200,
        message: 'Data fetched successfully',
        data: expect.any(Object)
      }));
    });
  });

  describe('securityAlertController', () => {
    it('should fetch security alerts data successfully', async () => {
      await fetchAlertsData(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        statusCode: 200,
        message: 'Data fetched successfully',
        data: expect.any(Object)
      }));
    });
  });
});
