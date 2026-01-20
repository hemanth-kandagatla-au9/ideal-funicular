const {
  getJWTConfig,
  getSSMPaths,
  getTokenPayloadTemplate
} = require('../../../server/auth/utils/authConfig');

describe('authConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getJWTConfig', () => {
    it('should return default JWT configuration', () => {
      const config = getJWTConfig();

      expect(config).toHaveProperty('issuer');
      expect(config).toHaveProperty('audience');
      expect(config).toHaveProperty('algorithm', 'RS256');
      expect(config).toHaveProperty('expiresIn');
    });

    it('should use environment variables when provided', () => {
      process.env.JWT_ISSUER = 'custom-issuer';
      process.env.JWT_AUDIENCE = 'custom-audience';
      process.env.JWT_EXPIRATION = '7200';

      // Need to reload module to pick up new env vars
      jest.resetModules();
      const { getJWTConfig: getConfig } = require('../../../server/auth/utils/authConfig');
      
      const config = getConfig();

      expect(config.issuer).toBe('custom-issuer');
      expect(config.audience).toBe('custom-audience');
      expect(config.expiresIn).toBe('7200');
    });
  });

  describe('getSSMPaths', () => {
    it('should return default SSM paths', () => {
      const paths = getSSMPaths();

      expect(paths).toHaveProperty('privateKey');
      expect(paths).toHaveProperty('publicKey');
      expect(paths.privateKey).toContain('/risebot/auth/rsa-private-key');
      expect(paths.publicKey).toContain('/risebot/auth/rsa-public-key');
    });

    it('should use custom SSM paths from environment', () => {
      process.env.SSM_RSA_PRIVATE_KEY_PARAM = '/custom/private-key';
      process.env.SSM_RSA_PUBLIC_KEY_PARAM = '/custom/public-key';

      jest.resetModules();
      const { getSSMPaths: getPaths } = require('../../../server/auth/utils/authConfig');
      
      const paths = getPaths();

      expect(paths.privateKey).toBe('/custom/private-key');
      expect(paths.publicKey).toBe('/custom/public-key');
    });
  });

  describe('getTokenPayloadTemplate', () => {
    it('should return token payload with sub and roles', () => {
      const sub = 'user123';
      const roles = ['admin', 'user'];

      const payload = getTokenPayloadTemplate(sub, roles);

      expect(payload).toHaveProperty('sub', sub);
      expect(payload).toHaveProperty('roles', roles);
    });

    it('should handle different role arrays', () => {
      const sub = 'testuser';
      const roles = ['viewer'];

      const payload = getTokenPayloadTemplate(sub, roles);

      expect(payload.sub).toBe('testuser');
      expect(payload.roles).toEqual(['viewer']);
    });
  });
});
