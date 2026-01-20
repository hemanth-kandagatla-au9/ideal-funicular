const { loadConfig } = require('../../server/utils/mslConfig');
const { getMSALClientID, getMSALTenantID } = require('../../server/utils/envUtils');

jest.mock('../../server/utils/envUtils');

describe('MSL Config', () => {
  let consoleLogSpy;
  let originalEnv;

  beforeEach(() => {
    jest.clearAllMocks();
    originalEnv = { ...process.env };
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    process.env = originalEnv;
    consoleLogSpy.mockRestore();
  });

  describe('loadConfig', () => {
    it('should load config from environment variables', async () => {
      process.env.CLIENT_ID = 'test-client-id';
      process.env.TENANT_ID = 'test-tenant-id';

      const config = await loadConfig();

      expect(config.msalConfig.auth.clientId).toBe('test-client-id');
      expect(config.msalConfig.auth.authority).toBe('https://login.microsoftonline.com/test-tenant-id');
      expect(config.tokenValidationConfig.issuer).toBe('https://login.microsoftonline.com/test-tenant-id/v2.0');
      expect(config.tokenValidationConfig.audience).toBe('test-client-id');
    });

    it('should load config from SSM when env variables not set', async () => {
      delete process.env.CLIENT_ID;
      delete process.env.TENANT_ID;

      getMSALClientID.mockResolvedValue('ssm-client-id');
      getMSALTenantID.mockResolvedValue('ssm-tenant-id');

      const config = await loadConfig();

      expect(getMSALClientID).toHaveBeenCalled();
      expect(getMSALTenantID).toHaveBeenCalled();
      expect(config.msalConfig.auth.clientId).toBe('ssm-client-id');
      expect(config.msalConfig.auth.authority).toBe('https://login.microsoftonline.com/ssm-tenant-id');
    });

    it('should include system logger configuration', async () => {
      process.env.CLIENT_ID = 'test-client-id';
      process.env.TENANT_ID = 'test-tenant-id';

      const config = await loadConfig();

      expect(config.msalConfig.system.loggerOptions).toBeDefined();
      expect(config.msalConfig.system.loggerOptions.piiLoggingEnabled).toBe(false);
      expect(config.msalConfig.system.loggerOptions.logLevel).toBe('Verbose');
    });

    it('should log messages through logger callback', async () => {
      process.env.CLIENT_ID = 'test-client-id';
      process.env.TENANT_ID = 'test-tenant-id';

      const config = await loadConfig();
      const loggerCallback = config.msalConfig.system.loggerOptions.loggerCallback;

      loggerCallback('Test error message');

      expect(consoleLogSpy).toHaveBeenCalledWith('msl error::::', 'Test error message');
    });

    it('should configure token validation with correct issuer', async () => {
      process.env.CLIENT_ID = 'client-123';
      process.env.TENANT_ID = 'tenant-456';

      const config = await loadConfig();

      expect(config.tokenValidationConfig.issuer).toBe('https://login.microsoftonline.com/tenant-456/v2.0');
    });

    it('should configure token validation with correct audience', async () => {
      process.env.CLIENT_ID = 'client-789';
      process.env.TENANT_ID = 'tenant-abc';

      const config = await loadConfig();

      expect(config.tokenValidationConfig.audience).toBe('client-789');
    });

    it('should prefer environment variables over SSM', async () => {
      process.env.CLIENT_ID = 'env-client-id';
      process.env.TENANT_ID = 'env-tenant-id';

      getMSALClientID.mockResolvedValue('ssm-client-id');
      getMSALTenantID.mockResolvedValue('ssm-tenant-id');

      const config = await loadConfig();

      expect(getMSALClientID).not.toHaveBeenCalled();
      expect(getMSALTenantID).not.toHaveBeenCalled();
      expect(config.msalConfig.auth.clientId).toBe('env-client-id');
    });

    it('should return both msalConfig and tokenValidationConfig', async () => {
      process.env.CLIENT_ID = 'test-id';
      process.env.TENANT_ID = 'test-tenant';

      const config = await loadConfig();

      expect(config).toHaveProperty('msalConfig');
      expect(config).toHaveProperty('tokenValidationConfig');
    });
  });
});
