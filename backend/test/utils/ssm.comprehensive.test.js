// Mock AWS before requiring the module
const mockGetParameter = jest.fn();
const mockSSM = {
  getParameter: mockGetParameter,
};

jest.mock('aws-sdk', () => {
  return {
    SSM: jest.fn(() => mockSSM),
    config: {
      update: jest.fn(),
    },
  };
});

const AWS = require('aws-sdk');
const { getParam } = require('../../server/utils/ssm');

describe('SSM Utils', () => {
  let consoleErrorSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetParameter.mockClear();

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  describe('getParam', () => {
    it('should fetch parameter from AWS SSM successfully', async () => {
      const mockResult = {
        Parameter: {
          Name: 'test-param',
          Type: 'SecureString',
          Value: 'test-value',
          Version: 1,
          LastModifiedDate: new Date(),
          ARN: 'arn:aws:ssm:us-east-1:123456789012:parameter/test-param',
        },
      };

      mockGetParameter.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockResult),
      });

      const result = await getParam('test-param');

      expect(result).toEqual(mockResult);
      expect(mockGetParameter).toHaveBeenCalledWith({
        Name: 'test-param',
        WithDecryption: true,
      });
    });

    it('should return local value when NODE_ENV is local', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'local';

      const result = await getParam('any-param');

      expect(result.Parameter.Value).toBe('myVal');
      expect(result.Parameter.Name).toBe('StripeSecretKey');

      process.env.NODE_ENV = originalEnv;
    });

    it('should handle AWS SSM errors and return null', async () => {
      const error = new Error('Parameter not found');
      error.code = 'ParameterNotFound';

      mockGetParameter.mockReturnValue({
        promise: jest.fn().mockRejectedValue(error),
      });

      const result = await getParam('missing-param');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching SSM param: ParameterNotFound')
      );
    });

    it('should handle ThrottlingException and warn', async () => {
      const error = new Error('Rate exceeded');
      error.code = 'ThrottlingException';

      mockGetParameter.mockReturnValue({
        promise: jest.fn().mockRejectedValue(error),
      });

      const result = await getParam('throttled-param');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Throttled by AWS SSM. Consider backing off or using a queue.'
      );
    });

    it('should handle TooManyRequestsException and warn', async () => {
      const error = new Error('Too many requests');
      error.code = 'TooManyRequestsException';

      mockGetParameter.mockReturnValue({
        promise: jest.fn().mockRejectedValue(error),
      });

      const result = await getParam('rate-limited-param');

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Throttled by AWS SSM. Consider backing off or using a queue.'
      );
    });

    it('should handle errors without error code', async () => {
      const error = new Error('Generic error');
      error.name = 'UnknownError';

      mockGetParameter.mockReturnValue({
        promise: jest.fn().mockRejectedValue(error),
      });

      const result = await getParam('error-param');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error fetching SSM param: UnknownError')
      );
    });
  });

  describe('Caching behavior', () => {
    it('should cache parameter values', async () => {
      const mockResult = {
        Parameter: {
          Name: 'cached-param',
          Type: 'SecureString',
          Value: 'cached-value',
        },
      };

      mockGetParameter.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockResult),
      });
      
      // First call should fetch from SSM
      const result1 = await getParam('cached-param');
      expect(result1.Parameter.Value).toBe('cached-value');
      
      // Second call should use cache (getParameter not called again)
      const result2 = await getParam('cached-param');
      expect(result2.Parameter.Value).toBe('cached-value');
      
      // Should only call getParameter once due to caching
      expect(mockGetParameter).toHaveBeenCalledTimes(1);
    });
  });
});
