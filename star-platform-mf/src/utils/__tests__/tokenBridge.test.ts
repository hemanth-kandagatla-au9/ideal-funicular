// src/utils/__tests__/tokenBridge.test.ts

/**
 * 100% coverage for src/utils/tokenBridge.ts
 * Ensures instanceof checks pass by constructing the error with the exact prototype
 * that tokenBridge imported (via Object.create on InteractionRequiredAuthError.prototype).
 */

describe('initTokenBridge', () => {
  let initTokenBridge: (instance: any) => void;
  let loginRequest: any;
  let InteractionRequiredAuthErrorClass: new (...args: any[]) => Error;

  let mockInstance: {
    getActiveAccount: jest.Mock;
    getAllAccounts: jest.Mock;
    acquireTokenSilent: jest.Mock;
    loginRedirect: jest.Mock;
  };

  // Mock must be defined before loading the module under test
  jest.mock('@azure/msal-browser', () => {
    class InteractionRequiredAuthError extends Error {
      code: string;
      constructor(code = 'interaction_required', message?: string) {
        super(message ?? code);
        this.name = 'InteractionRequiredAuthError';
        this.code = code;
      }
    }
    return {
      __esModule: true,
      InteractionRequiredAuthError,
    };
  });

  const loadModule = () => {
    jest.isolateModules(() => {
      ({ initTokenBridge } = require('../tokenBridge'));
      ({ loginRequest } = require('../msalConfig'));
      ({
        InteractionRequiredAuthError: InteractionRequiredAuthErrorClass,
      } = require('@azure/msal-browser'));
    });
  };

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    mockInstance = {
      getActiveAccount: jest.fn(),
      getAllAccounts: jest.fn(),
      acquireTokenSilent: jest.fn(),
      loginRedirect: jest.fn(),
    };

    loadModule();
    initTokenBridge(mockInstance as any);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ─── Success paths ───────────────────────────────────────────────────────

  test('returns access and id tokens when active account exists', async () => {
    mockInstance.getActiveAccount.mockReturnValue({ username: 'active' });
    mockInstance.acquireTokenSilent.mockResolvedValue({
      accessToken: 'access-token',
      idToken: 'id-token',
    });

    const token = await (window as any).__HOST_GET_TOKEN__();
    const idToken = await (window as any).__HOST_GET_ID_TOKEN__();

    expect(token).toBe('access-token');
    expect(idToken).toBe('id-token');
    expect(mockInstance.acquireTokenSilent).toHaveBeenCalledTimes(2);
  });

  test('falls back to getAllAccounts when no active account (access token)', async () => {
    mockInstance.getActiveAccount.mockReturnValue(null);
    mockInstance.getAllAccounts.mockReturnValue([{ username: 'fallback' }]);
    mockInstance.acquireTokenSilent.mockResolvedValue({ accessToken: 'fallback-token' });

    const token = await (window as any).__HOST_GET_TOKEN__();
    expect(token).toBe('fallback-token');
  });

  test('falls back to getAllAccounts when no active account (id token)', async () => {
    mockInstance.getActiveAccount.mockReturnValue(null);
    mockInstance.getAllAccounts.mockReturnValue([{ username: 'fallback' }]);
    mockInstance.acquireTokenSilent.mockResolvedValue({ idToken: 'fallback-id' });

    const idToken = await (window as any).__HOST_GET_ID_TOKEN__();
    expect(idToken).toBe('fallback-id');
  });

  // ─── Warning when bridge is ready but no account at call time ────────────

  test('warns and returns null when ready but no account at call time (access token)', async () => {
    jest.useFakeTimers();

    mockInstance.getActiveAccount.mockReturnValue(null);
    mockInstance.getAllAccounts
      .mockReturnValueOnce([]) // initial
      .mockReturnValueOnce([{ username: 'ephemeral' }]) // becomes ready
      .mockReturnValueOnce([]); // call-time none

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const p = (window as any).__HOST_GET_TOKEN__();

    jest.advanceTimersByTime(150);

    const token = await p;
    expect(token).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('__HOST_GET_TOKEN__: no active account');
    warnSpy.mockRestore();
  });

  test('warns and returns null when ready but no account at call time (id token)', async () => {
    jest.useFakeTimers();

    mockInstance.getActiveAccount.mockReturnValue(null);
    mockInstance.getAllAccounts
      .mockReturnValueOnce([]) // initial
      .mockReturnValueOnce([{ username: 'ephemeral' }]) // ready
      .mockReturnValueOnce([]); // call-time none

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const p = (window as any).__HOST_GET_ID_TOKEN__();

    jest.advanceTimersByTime(150);

    const idToken = await p;
    expect(idToken).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('__HOST_GET_ID_TOKEN__: no active account');
    warnSpy.mockRestore();
  });

  // ─── InteractionRequiredAuthError handling ───────────────────────────────
  // Use the exact prototype the module imported so "instanceof" passes

  test('InteractionRequiredAuthError triggers loginRedirect and logs (access token)', async () => {
    const account = { username: 'user' };
    mockInstance.getActiveAccount.mockReturnValue(account);

    // Build an error whose prototype chain matches the imported class
    const err = Object.create(InteractionRequiredAuthErrorClass.prototype);
    err.message = 'expired';
    mockInstance.acquireTokenSilent.mockRejectedValue(err);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const token = await (window as any).__HOST_GET_TOKEN__();

    expect(token).toBeNull();
    expect(mockInstance.loginRedirect).toHaveBeenCalledWith({ ...loginRequest, account });
    expect(errorSpy).toHaveBeenCalledWith(
      '__HOST_GET_TOKEN__: session expired — redirecting to login'
    );
    errorSpy.mockRestore();
  });

  test('InteractionRequiredAuthError triggers loginRedirect and logs (id token)', async () => {
    const account = { username: 'user' };
    mockInstance.getActiveAccount.mockReturnValue(account);

    const err = Object.create(InteractionRequiredAuthErrorClass.prototype);
    err.message = 'expired';
    mockInstance.acquireTokenSilent.mockRejectedValue(err);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const idToken = await (window as any).__HOST_GET_ID_TOKEN__();

    expect(idToken).toBeNull();
    expect(mockInstance.loginRedirect).toHaveBeenCalledWith({ ...loginRequest, account });
    expect(errorSpy).toHaveBeenCalledWith(
      '__HOST_GET_ID_TOKEN__: session expired — redirecting to login'
    );
    errorSpy.mockRestore();
  });

  // ─── Generic error handling ──────────────────────────────────────────────

  test('generic error logs and returns null (access token)', async () => {
    mockInstance.getActiveAccount.mockReturnValue({ username: 'user' });
    mockInstance.acquireTokenSilent.mockRejectedValue(new Error('random error'));

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const token = await (window as any).__HOST_GET_TOKEN__();

    expect(token).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith('__HOST_GET_TOKEN__ failed:', expect.any(Error));
    errorSpy.mockRestore();
  });

  test('generic error logs and returns null (id token)', async () => {
    mockInstance.getActiveAccount.mockReturnValue({ username: 'user' });
    mockInstance.acquireTokenSilent.mockRejectedValue(new Error('random error'));

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const idToken = await (window as any).__HOST_GET_ID_TOKEN__();

    expect(idToken).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith('__HOST_GET_ID_TOKEN__ failed:', expect.any(Error));
    errorSpy.mockRestore();
  });

  // ─── Timeout handling ────────────────────────────────────────────────────

  test('waitForActiveAccount times out and returns null (access token) with timeout log', async () => {
    jest.useFakeTimers();

    mockInstance.getActiveAccount.mockReturnValue(null);
    mockInstance.getAllAccounts.mockReturnValue([]);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const p = (window as any).__HOST_GET_TOKEN__();

    jest.advanceTimersByTime(15100);

    const token = await p;
    expect(token).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(
      'tokenBridge: no active account after 15s — host MSAL may not have completed initialization'
    );
    errorSpy.mockRestore();
  });

  test('waitForActiveAccount times out and returns null (id token) with timeout log', async () => {
    jest.useFakeTimers();

    mockInstance.getActiveAccount.mockReturnValue(null);
    mockInstance.getAllAccounts.mockReturnValue([]);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const p = (window as any).__HOST_GET_ID_TOKEN__();

    jest.advanceTimersByTime(15100);

    const idToken = await p;
    expect(idToken).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(
      'tokenBridge: no active account after 15s — host MSAL may not have completed initialization'
    );
    errorSpy.mockRestore();
  });
});
