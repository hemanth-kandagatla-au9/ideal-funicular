/* eslint-disable @typescript-eslint/no-var-requires */
import Config from "../../../config/config";
import AxiosInstanceClass from "../../../services/axiosInstance";
import { getLocalAccessToken, getUserInfo } from "../../../utils/TokenUtils";
jest.mock("../../../config/config");
jest.mock("../../../services/axiosInstance");
jest.mock("../../../utils/TokenUtils");

describe('UtilizationService', () => {
  let UtilizationService;
  let mockAxiosInstance;
  let mockAxiosInstanceClass;

  beforeAll(() => {
    mockAxiosInstance = {
      post: jest.fn(),
      get: jest.fn()
    };
    
    mockAxiosInstanceClass = {
      init: jest.fn(() => mockAxiosInstance)
    };
    AxiosInstanceClass.mockImplementation(() => mockAxiosInstanceClass);
    getLocalAccessToken.mockReturnValue('mock-token');
    getUserInfo.mockReturnValue({ email: 'test@example.com' });
    
    Config.apiEndpoints = {
      utilities: {
        baseUrl: 'http://test-api.com',
        get: {
          getMetricsData: '/metrics-data',
          getDownloadMetricsData: '/download-metrics'
        }
      }
    };
    UtilizationService = require("../../../services/auth/UtilizationService").default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('utilizationMetrics', () => {
    it('should post utilization metrics with correct parameters', async () => {
      const type = 'TEST_ACTIVITY';
      const payload = { key: 'value' };
      const today = new Date();
      const expectedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
      
      mockAxiosInstance.post.mockResolvedValue({ data: 'metric added' });

      const result = await UtilizationService.utilizationMetrics(type, payload);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        'http://test-api.com/v1/utilities/activity-log/',
        {
          activityType: type,
          meta: { ...payload, userID: 'test' },
          createDate: expectedDate
        }
      );
      expect(result).toBe('metric added');
    });

    it('should use provided userID when available', async () => {
      const payload = { userID: 'custom@example.com' };
      mockAxiosInstance.post.mockResolvedValue({ data: 'metric added' });

      await UtilizationService.utilizationMetrics('TEST', payload);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          meta: expect.objectContaining({
            userID: 'custom'
          })
        })
      );
    });

    it('should handle errors gracefully', async () => {
      const errorResponse = { response: { data: 'error' } };
      mockAxiosInstance.post.mockRejectedValue(errorResponse);

      const result = await UtilizationService.utilizationMetrics('TEST', {});

      expect(result).toEqual(errorResponse.response);
    });
  });

  describe('getUtilizationMetrics', () => {
    it('should fetch utilization metrics', async () => {
      const mockResponse = { data: 'metrics' };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await UtilizationService.getUtilizationMetrics();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        'http://test-api.com/v1/utilities/activity-log/metrices'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const errorResponse = { response: { data: 'error' } };
      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      const result = await UtilizationService.getUtilizationMetrics();

      expect(result).toEqual(errorResponse.response);
    });
  });

  describe('getUtilizationMetricDetail', () => {
    it('should fetch metric details for specific activity', async () => {
      const activity = 'LOGIN';
      const mockResponse = { data: 'details' };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await UtilizationService.getUtilizationMetricDetail(activity);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        'http://test-api.com/v1/utilities/activity-log/metricedata?activity=LOGIN'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const errorResponse = { response: { data: 'error' } };
      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      const result = await UtilizationService.getUtilizationMetricDetail('LOGIN');

      expect(result).toEqual(errorResponse.response);
    });
  });

  describe('getUtilizationMetricData', () => {
    it('should fetch metric data with all parameters', async () => {
      const payload = {
        limit: 10,
        search: 'SEARCH',
        createData: '2023-01-01',
        action: 'ACTION',
        users: 'USER',
        sids: 'SID',
        regions: 'REGION',
        platforms: 'PLATFORM',
        sectors: 'SECTOR',
        pageNo: 1,
        exportData: false
      };
      const mockResponse = { data: 'metric-data' };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await UtilizationService.getUtilizationMetricData(payload);

      const expectedUrl = 'http://test-api.com/v1/utilities/activity-log?limit=10&activityType=SEARCH&createDate=2023-01-01&action=ACTION&userID=USER&sid=SID&region=REGION&platform=PLATFORM&sector=SECTOR&pageNo=1';
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(expectedUrl);
      expect(result).toEqual(mockResponse);
    });

    it('should handle exportData=true case', async () => {
      const payload = { exportData: true };
      const mockResponse = { data: 'export-data' };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await UtilizationService.getUtilizationMetricData(payload);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        'http://test-api.com/v1/utilities/activity-log?exportData=true'
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      const errorResponse = { response: { data: 'error' } };
      mockAxiosInstance.get.mockRejectedValue(errorResponse);

      const result = await UtilizationService.getUtilizationMetricData({});

      expect(result).toEqual(errorResponse.response);
    });
  });

  describe('getMetricsData', () => {
    it('should fetch metrics data', async () => {
      const mockResponse = { data: 'metrics-data' };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await UtilizationService.getMetricsData();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        'http://test-api.com/metrics-data'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getDownloadMetricsData', () => {
    it('should fetch download metrics data', async () => {
      const mockResponse = { data: 'download-metrics' };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await UtilizationService.getDownloadMetricsData();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        'http://test-api.com/download-metrics'
      );
      expect(result).toEqual(mockResponse);
    });
  });
 
});


