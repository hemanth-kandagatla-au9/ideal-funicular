import { baseQuery } from '../baseQuery';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Mock fetchBaseQuery
jest.mock('@reduxjs/toolkit/query/react', () => ({
  fetchBaseQuery: jest.fn(),
}));

const mockFetchBaseQuery = fetchBaseQuery as jest.MockedFunction<typeof fetchBaseQuery>;

describe('baseQuery', () => {
  let mockRawQuery: jest.Mock;
  let mockSessionStorage: Record<string, string>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock sessionStorage
    mockSessionStorage = {};
    Storage.prototype.getItem = jest.fn((key: string) => mockSessionStorage[key] || null);
    Storage.prototype.setItem = jest.fn((key: string, value: string) => {
      mockSessionStorage[key] = value;
    });
    Storage.prototype.removeItem = jest.fn((key: string) => {
      delete mockSessionStorage[key];
    });

    // Mock fetchBaseQuery to return a mock raw query function
    mockRawQuery = jest.fn().mockResolvedValue({ data: 'test-data' });
    mockFetchBaseQuery.mockReturnValue(mockRawQuery);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Configuration', () => {
    it('should configure fetchBaseQuery with correct baseUrl', async () => {
      await baseQuery('/test-endpoint', {} as any, {});

      expect(mockFetchBaseQuery).toHaveBeenCalled();
      const config = mockFetchBaseQuery.mock.calls[0][0];

      expect(config.baseUrl).toBe(process.env.REACT_APP_WORKFLOW_API);
    });

    it('should set credentials to omit', async () => {
      await baseQuery('/test-endpoint', {} as any, {});

      const config = mockFetchBaseQuery.mock.calls[0][0];
      expect(config.credentials).toBe('omit');
    });

    it('should have prepareHeaders function', async () => {
      await baseQuery('/test-endpoint', {} as any, {});

      const config = mockFetchBaseQuery.mock.calls[0][0];
      expect(typeof config.prepareHeaders).toBe('function');
    });

    it('should call prepareHeaders with headers object', async () => {
      await baseQuery('/test-endpoint', {} as any, {});

      const config = mockFetchBaseQuery.mock.calls[0][0];
      const mockHeaders = new Headers();

      const result = config.prepareHeaders(mockHeaders, { url: '/test', method: 'GET' } as any);
      expect(result).toBeInstanceOf(Headers);
    });
  });

  describe('Header Preparation', () => {
    it('should modify headers through prepareHeaders', async () => {
      await baseQuery('/test-endpoint', {} as any, {});

      const config = mockFetchBaseQuery.mock.calls[0][0];
      const mockHeaders = new Headers();
      mockHeaders.set('Content-Type', 'application/json');

      // Call prepareHeaders and verify it returns headers
      const result = config.prepareHeaders(mockHeaders, { url: '/test', method: 'GET' } as any);

      expect(result).toBeInstanceOf(Headers);
    });

    it('should handle different HTTP methods', async () => {
      await baseQuery('/test-endpoint', {} as any, {});

      const config = mockFetchBaseQuery.mock.calls[0][0];

      ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].forEach((method) => {
        const mockHeaders = new Headers();
        const result = config.prepareHeaders(mockHeaders, { url: '/test', method } as any);
        expect(result).toBeInstanceOf(Headers);
      });
    });

    it('should handle undefined method', async () => {
      await baseQuery('/test-endpoint', {} as any, {});

      const config = mockFetchBaseQuery.mock.calls[0][0];
      const mockHeaders = new Headers();

      const result = config.prepareHeaders(mockHeaders, { url: '/test' } as any);
      expect(result).toBeInstanceOf(Headers);
    });
  });

  describe('Query Execution', () => {
    it('should call raw query with correct args', async () => {
      const args = '/test-endpoint';
      const api = { signal: new AbortController().signal } as any;
      const extraOptions = { custom: 'option' };

      await baseQuery(args, api, extraOptions);

      expect(mockRawQuery).toHaveBeenCalledWith(args, api, extraOptions);
    });

    it('should return raw query result', async () => {
      mockRawQuery.mockResolvedValue({ data: 'test-response' });

      const result = await baseQuery('/test', {} as any, {});

      expect(result).toEqual({ data: 'test-response' });
    });

    it('should handle FetchArgs object', async () => {
      const fetchArgs = { url: '/test', method: 'POST', body: { key: 'value' } };

      await baseQuery(fetchArgs, {} as any, {});

      expect(mockRawQuery).toHaveBeenCalledWith(fetchArgs, expect.any(Object), {});
    });

    it('should handle query errors', async () => {
      const error = { error: { status: 404, data: 'Not found' } };
      mockRawQuery.mockResolvedValue(error);

      const result = await baseQuery('/test', {} as any, {});

      expect(result).toEqual(error);
    });
  });

  describe('Environment Configuration', () => {
    it('should use REACT_APP_WORKFLOW_API from environment', async () => {
      const originalEnv = process.env.REACT_APP_WORKFLOW_API;
      process.env.REACT_APP_WORKFLOW_API = 'https://test-api.example.com';

      await baseQuery('/test', {} as any, {});

      const config = mockFetchBaseQuery.mock.calls[0][0];
      expect(config.baseUrl).toBe('https://test-api.example.com');

      process.env.REACT_APP_WORKFLOW_API = originalEnv;
    });
  });
});
