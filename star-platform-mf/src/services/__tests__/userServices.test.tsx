// src/services/__tests__/userServices.test.tsx

// NOTE: Keep this file as TypeScript-friendly without using problematic generic types from jest-mock.
// We avoid importing Mock types and instead use plain function types for maximum compatibility.

//
// We will dynamically mock modules BEFORE requiring userServices so that
// the module captures the correct mocked implementations at import time.
//

type PostImpl = ((...args: any[]) => any) | undefined;
type GetImpl = ((...args: any[]) => any) | undefined;

const loadModule = (opts: {
  env?: Partial<NodeJS.ProcessEnv>;
  tokenValue?: string | null | Promise<string | null>;
  axiosPostImpl?: PostImpl;
  axiosGetImpl?: GetImpl;
}) => {
  const originalEnv = process.env;
  jest.resetModules();

  // Apply env overrides for this isolated load
  process.env = { ...originalEnv, ...(opts.env || {}) };

  // Mock tokenService.getIdToken BEFORE requiring userServices
  jest.doMock('../../utils/tokenService', () => ({
    getIdToken:
      typeof opts.tokenValue === 'undefined'
        ? jest.fn().mockResolvedValue('token-default')
        : typeof (opts.tokenValue as any)?.then === 'function'
          ? jest.fn().mockReturnValue(opts.tokenValue)
          : jest.fn().mockResolvedValue(opts.tokenValue),
  }));

  // Mock axios BEFORE requiring userServices
  const postMock = opts.axiosPostImpl
    ? jest.fn(opts.axiosPostImpl)
    : jest.fn().mockResolvedValue({ status: 200 });
  const getMock = opts.axiosGetImpl
    ? jest.fn(opts.axiosGetImpl)
    : jest.fn().mockResolvedValue({ data: {} });

  jest.doMock('axios', () => ({
    __esModule: true,
    default: { post: postMock, get: getMock },
    post: postMock,
    get: getMock,
  }));

  // Require userServices (will capture the above mocks)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('../userServices');
  // Return the mocked axios module to assert calls
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const axiosMod = require('axios');

  // Restore environment for subsequent calls
  process.env = originalEnv;

  return { mod, axiosMod, postMock, getMock };
};

describe('userServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginInsights', () => {
    it('returns false and does not call axios when token not ready', async () => {
      const { mod, axiosMod } = loadModule({
        env: { REACT_APP_BACKEND_URL: 'https://api/' },
        tokenValue: null,
      });

      const res = await mod.loginInsights({ action: 'login' });

      expect(res).toBe(false);
      expect(axiosMod.post).not.toHaveBeenCalled();
    });

    it('returns true on successful post and sends correct headers', async () => {
      const { mod, axiosMod } = loadModule({
        env: { REACT_APP_BACKEND_URL: 'https://api/' },
        tokenValue: 'token-1',
        axiosPostImpl: jest.fn().mockResolvedValue({ status: 200 }),
      });

      const res = await mod.loginInsights({ action: 'login' });

      expect(res).toBe(true);
      expect(axiosMod.post).toHaveBeenCalledWith(
        'https://api/auth/loginInsights',
        { action: 'login' },
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer token-1',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
        })
      );
    });

    it('returns false on non-session error', async () => {
      const { mod } = loadModule({
        env: { REACT_APP_BACKEND_URL: 'https://api/' },
        tokenValue: 'token-2',
        axiosPostImpl: jest.fn().mockRejectedValue(new Error('Network failure')),
      });

      const res = await mod.loginInsights({ action: 'login' });

      expect(res).toBe(false);
      // We do not assert on navigation due to jsdom limitations.
    });

    it('returns false and executes redirect branch on session-expired error', async () => {
      const { mod } = loadModule({
        env: { REACT_APP_BACKEND_URL: 'https://api/' },
        tokenValue: 'token-3',
        axiosPostImpl: jest
          .fn()
          .mockRejectedValue({ response: { data: { message: 'Session expired' } } }),
      });

      const res = await mod.loginInsights({ action: 'login' });

      expect(res).toBe(false);
    });
  });

  describe('getUserPermissions', () => {
    it('returns null and logs when AUTH_API_URL is undefined', async () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const { mod } = loadModule({
        env: { AUTH_API_URL: undefined },
        tokenValue: 'token-x',
      });

      const res = await mod.getUserPermissions();
      expect(res).toBeNull();
      expect(errorSpy).toHaveBeenCalledWith('AUTH_API_URL is not defined');
      errorSpy.mockRestore();
    });

    it('returns null and warns when token is not available', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const { mod } = loadModule({
        env: { AUTH_API_URL: 'https://auth.api' },
        tokenValue: null,
      });

      const res = await mod.getUserPermissions();
      expect(res).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith('getUserPermissions: no token available');
      warnSpy.mockRestore();
    });

    it('returns response.data on success and sends correct headers', async () => {
      const { mod, axiosMod } = loadModule({
        env: { AUTH_API_URL: 'https://auth.api' },
        tokenValue: 'token-4',
        axiosGetImpl: jest.fn().mockResolvedValue({ data: { roles: ['r1'] } }),
      });

      const res = await mod.getUserPermissions();

      expect(res).toEqual({ roles: ['r1'] });
      expect(axiosMod.get).toHaveBeenCalledWith(
        'https://auth.api/auth/getUserPermission',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer token-4',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
        })
      );
    });

    it('returns null when response indicates suicidal session expired', async () => {
      const { mod } = loadModule({
        env: { AUTH_API_URL: 'https://auth.api' },
        tokenValue: 'token-5',
        axiosGetImpl: jest.fn().mockResolvedValue({
          data: { errorCode: 'SESSION_EXPIRED' },
        }),
      });

      const res = await mod.getUserPermissions();
      expect(res).toBeNull();
    });

    it('returns null when error indicates session expired', async () => {
      const { mod } = loadModule({
        env: { AUTH_API_URL: 'https://auth.api' },
        tokenValue: 'token-6',
        axiosGetImpl: jest
          .fn()
          .mockRejectedValue({ response: { data: { message: 'session-expired' } } }),
      });

      const res = await mod.getUserPermissions();
      expect(res).toBeNull();
    });

    it('returns error.response when error is not session expired', async () => {
      const errorResponse = { status: 500, data: { msg: 'server error' } };
      const { mod } = loadModule({
        env: { AUTH_API_URL: 'https://auth.api' },
        tokenValue: 'token-7',
        axiosGetImpl: jest.fn().mockRejectedValue({ response: errorResponse }),
      });

      const res = await mod.getUserPermissions();
      expect(res).toEqual(errorResponse);
    });
  });
});
