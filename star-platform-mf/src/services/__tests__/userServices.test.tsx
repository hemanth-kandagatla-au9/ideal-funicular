import { authAction, getUserPermissions } from '../userServices';
import axiosInstance from '../axiosInstance';

// Mock axiosInstance
jest.mock('../axiosInstance');

const mockAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

describe('userServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authAction', () => {
    it('should post authAction data and return response data', async () => {
      const mockData = { username: 'testuser', action: 'login' };
      const mockResponse = { data: { success: true, token: 'abc123' } };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authAction(mockData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/authAction', mockData);
      expect(result).toEqual({ success: true, token: 'abc123' });
    });

    it('should return error response on failure', async () => {
      const mockData = { username: 'testuser', action: 'login' };
      const mockError = {
        response: { status: 401, data: { message: 'Unauthorized' } },
      };

      mockAxiosInstance.post.mockRejectedValue(mockError);

      const result = await authAction(mockData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/authAction', mockData);
      expect(result).toEqual({ status: 401, data: { message: 'Unauthorized' } });
    });

    it('should handle network errors', async () => {
      const mockData = { username: 'testuser', action: 'login' };
      const mockError = {
        response: undefined,
        message: 'Network Error',
      };

      mockAxiosInstance.post.mockRejectedValue(mockError);

      const result = await authAction(mockData);

      expect(result).toBeUndefined();
    });

    it('should handle empty data', async () => {
      const mockResponse = { data: { success: false } };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authAction({});

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/authAction', {});
      expect(result).toEqual({ success: false });
    });
  });

  describe('getUserPermissions', () => {
    it('should get user permissions with pageNo and pageSize', async () => {
      const mockResponse = {
        data: {
          permissions: ['read', 'write', 'delete'],
          total: 3,
          pageNo: 1,
          pageSize: 10,
        },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getUserPermissions({ pageNo: 1, pageSize: 10 });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/auth/getUserPermission?pageNo=1&pageSize=10'
      );
      expect(result).toEqual({
        permissions: ['read', 'write', 'delete'],
        total: 3,
        pageNo: 1,
        pageSize: 10,
      });
    });

    it('should return error response on failure', async () => {
      const mockError = {
        response: { status: 403, data: { message: 'Forbidden' } },
      };

      mockAxiosInstance.get.mockRejectedValue(mockError);

      const result = await getUserPermissions({ pageNo: 1, pageSize: 10 });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/auth/getUserPermission?pageNo=1&pageSize=10'
      );
      expect(result).toEqual({ status: 403, data: { message: 'Forbidden' } });
    });

    it('should handle different page numbers', async () => {
      const mockResponse = {
        data: { permissions: ['execute'], pageNo: 5, pageSize: 20 },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getUserPermissions({ pageNo: 5, pageSize: 20 });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/auth/getUserPermission?pageNo=5&pageSize=20'
      );
      expect(result).toEqual({ permissions: ['execute'], pageNo: 5, pageSize: 20 });
    });

    it('should handle zero page size', async () => {
      const mockResponse = {
        data: { permissions: [], pageNo: 0, pageSize: 0 },
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await getUserPermissions({ pageNo: 0, pageSize: 0 });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/auth/getUserPermission?pageNo=0&pageSize=0'
      );
      expect(result).toEqual({ permissions: [], pageNo: 0, pageSize: 0 });
    });

    it('should handle network errors', async () => {
      const mockError = {
        response: undefined,
        message: 'Network Error',
      };

      mockAxiosInstance.get.mockRejectedValue(mockError);

      const result = await getUserPermissions({ pageNo: 1, pageSize: 10 });

      expect(result).toBeUndefined();
    });

    it('should handle server timeout', async () => {
      const mockError = {
        response: { status: 504, data: { message: 'Gateway Timeout' } },
      };

      mockAxiosInstance.get.mockRejectedValue(mockError);

      const result = await getUserPermissions({ pageNo: 1, pageSize: 10 });

      expect(result).toEqual({ status: 504, data: { message: 'Gateway Timeout' } });
    });

    it('should construct query string correctly with large page size', async () => {
      const mockResponse = { data: { permissions: [] } };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      await getUserPermissions({ pageNo: 100, pageSize: 1000 });

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/auth/getUserPermission?pageNo=100&pageSize=1000'
      );
    });
  });
});
