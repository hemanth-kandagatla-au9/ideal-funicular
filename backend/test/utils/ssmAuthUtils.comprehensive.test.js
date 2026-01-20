const {
  getPrivateKeyFromSSM,
  getCertificateFromSSM,
  getServiceCredentials,
  getCachedPrivateKey,
  getCachedCertificate
} = require('../../server/utils/ssmAuthUtils');
const { getParam } = require('../../server/utils/ssm');

// Mock dependencies
jest.mock('../../server/utils/ssm', () => ({
  getParam: jest.fn(),
}));

describe('ssmAuthUtils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    process.env = {
      ...originalEnv,
      PREDEV_JWT_TOKEN_PRIVATE_KEY: '/jwt/private-key',
      PREDEV_JWT_TOKEN_PUBLIC_KEY: '/jwt/public-cert',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.useRealTimers();
  });

  describe('getPrivateKeyFromSSM', () => {
    it('should retrieve private key from SSM successfully', async () => {
      const mockPrivateKey = '-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----';
      getParam.mockResolvedValue({
        Parameter: { Value: mockPrivateKey }
      });

      const result = await getPrivateKeyFromSSM();

      expect(getParam).toHaveBeenCalledWith('/jwt/private-key');
      expect(result).toBe(mockPrivateKey);
    });

    it('should throw error when SSM retrieval fails', async () => {
      getParam.mockRejectedValue(new Error('SSM Error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(getPrivateKeyFromSSM()).rejects.toThrow('Failed to retrieve private key from SSM');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error retrieving private key from SSM:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should use environment variable for parameter name', async () => {
      process.env.PREDEV_JWT_TOKEN_PRIVATE_KEY = '/custom/private-key';
      getParam.mockResolvedValue({
        Parameter: { Value: 'mock-key' }
      });

      await getPrivateKeyFromSSM();

      expect(getParam).toHaveBeenCalledWith('/custom/private-key');
    });
  });

  describe('getCertificateFromSSM', () => {
    it('should retrieve public certificate from SSM successfully', async () => {
      const mockCertificate = '-----BEGIN CERTIFICATE-----\nMOCK_CERT\n-----END CERTIFICATE-----';
      getParam.mockResolvedValue({
        Parameter: { Value: mockCertificate }
      });
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = await getCertificateFromSSM();

      expect(getParam).toHaveBeenCalledWith('/jwt/public-cert');
      expect(result).toBe(mockCertificate);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Retrieved certificate'));

      consoleLogSpy.mockRestore();
    });

    it('should throw error when SSM retrieval fails', async () => {
      getParam.mockRejectedValue(new Error('SSM Error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(getCertificateFromSSM()).rejects.toThrow('Failed to retrieve certificate from SSM');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error retrieving certificate from SSM:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should use environment variable for certificate parameter', async () => {
      process.env.PREDEV_JWT_TOKEN_PUBLIC_KEY = '/custom/public-cert';
      getParam.mockResolvedValue({
        Parameter: { Value: 'mock-cert' }
      });
      jest.spyOn(console, 'log').mockImplementation();

      await getCertificateFromSSM();

      expect(getParam).toHaveBeenCalledWith('/custom/public-cert');
    });
  });

  describe('getServiceCredentials', () => {
    it('should retrieve and parse service credentials successfully', async () => {
      const mockCredentials = { username: 'testuser', password: 'testpass' };
      getParam.mockResolvedValue({
        Parameter: { Value: JSON.stringify(mockCredentials) }
      });

      const result = await getServiceCredentials('test-service');

      expect(getParam).toHaveBeenCalledWith('/agent/services/test-service/credentials');
      expect(result).toEqual(mockCredentials);
    });

    it('should throw error when SSM retrieval fails', async () => {
      getParam.mockRejectedValue(new Error('SSM Error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(getServiceCredentials('test-service')).rejects.toThrow(
        'Failed to retrieve credentials for service test-service'
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error retrieving credentials for service test-service:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle different service IDs', async () => {
      getParam.mockResolvedValue({
        Parameter: { Value: '{"key":"value"}' }
      });

      await getServiceCredentials('database-service');
      expect(getParam).toHaveBeenCalledWith('/agent/services/database-service/credentials');

      await getServiceCredentials('api-service');
      expect(getParam).toHaveBeenCalledWith('/agent/services/api-service/credentials');
    });

    it('should parse complex credential objects', async () => {
      const complexCreds = {
        username: 'admin',
        password: 'complex_pass',
        host: 'db.example.com',
        port: 5432,
        database: 'production'
      };
      getParam.mockResolvedValue({
        Parameter: { Value: JSON.stringify(complexCreds) }
      });

      const result = await getServiceCredentials('database');

      expect(result).toEqual(complexCreds);
    });
  });

  describe('getCachedPrivateKey', () => {
    it('should fetch and return private key successfully', async () => {
      const mockPrivateKey = '-----BEGIN PRIVATE KEY-----\nKEY\n-----END PRIVATE KEY-----';
      getParam.mockResolvedValue({
        Parameter: { Value: mockPrivateKey }
      });

      const result = await getCachedPrivateKey();

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });

  describe('getCachedCertificate', () => {
    it('should fetch and return certificate successfully', async () => {
      const mockCert = '-----BEGIN CERTIFICATE-----\nCERT\n-----END CERTIFICATE-----';
      getParam.mockResolvedValue({
        Parameter: { Value: mockCert }
      });
      jest.spyOn(console, 'log').mockImplementation();

      const result = await getCachedCertificate();

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });
});
