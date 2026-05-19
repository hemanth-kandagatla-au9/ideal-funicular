import { msalConfig, loginRequest } from '../msalConfig';
import { LogLevel } from '@azure/msal-browser';

describe('msalConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use environment variables correctly', async () => {
    process.env.REACT_APP_CLIENTID = 'client-id';
    process.env.REACT_APP_AUTHORITY_URL = 'authority-url';
    process.env.REACT_APP_REDIRECTURI = 'redirect-uri';
    process.env.REACT_APP_POSTLOGOUTREDIRECTURI = 'logout-uri';

    const { msalConfig: config } = await import('../msalConfig');

    expect(config.auth.clientId).toBe('client-id');
    expect(config.auth.authority).toBe('authority-url');
    expect(config.auth.redirectUri).toBe('redirect-uri');
    expect(config.auth.postLogoutRedirectUri).toBe('logout-uri');
  });

  it('should fallback to empty strings if env variables are missing', async () => {
    delete process.env.REACT_APP_CLIENTID;
    delete process.env.REACT_APP_AUTHORITY_URL;
    delete process.env.REACT_APP_REDIRECTURI;
    delete process.env.REACT_APP_POSTLOGOUTREDIRECTURI;

    const { msalConfig: config } = await import('../msalConfig');

    expect(config.auth.clientId).toBe('');
    expect(config.auth.authority).toBe('');
    expect(config.auth.redirectUri).toBe('');
    expect(config.auth.postLogoutRedirectUri).toBe('');
  });

  describe('loggerCallback', () => {
    let errorSpy;
    let infoSpy;
    let debugSpy;
    let warnSpy;

    beforeEach(() => {
      errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      infoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
      debugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
      warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    const logger = msalConfig.system.loggerOptions.loggerCallback;

    it('should not log if containsPii is true', () => {
      logger(LogLevel.Info, 'PII message', true);

      expect(errorSpy).not.toHaveBeenCalled();
      expect(infoSpy).not.toHaveBeenCalled();
      expect(debugSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it('should log error', () => {
      logger(LogLevel.Error, 'error message', false);
      expect(errorSpy).toHaveBeenCalledWith('error message');
    });

    it('should log info', () => {
      logger(LogLevel.Info, 'info message', false);
      expect(infoSpy).toHaveBeenCalledWith('info message');
    });

    it('should log verbose as debug', () => {
      logger(LogLevel.Verbose, 'verbose message', false);
      expect(debugSpy).toHaveBeenCalledWith('verbose message');
    });

    it('should log warning', () => {
      logger(LogLevel.Warning, 'warn message', false);
      expect(warnSpy).toHaveBeenCalledWith('warn message');
    });

    it('should handle default case', () => {
      logger(999, 'unknown', false);

      expect(errorSpy).not.toHaveBeenCalled();
      expect(infoSpy).not.toHaveBeenCalled();
      expect(debugSpy).not.toHaveBeenCalled();
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});

describe('loginRequest', () => {
  it('should contain correct scopes', () => {
    expect(loginRequest.scopes).toEqual(['User.Read', 'profile', 'email']);
  });
});
