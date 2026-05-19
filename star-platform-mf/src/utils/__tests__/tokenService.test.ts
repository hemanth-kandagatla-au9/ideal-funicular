// src/utils/__tests__/tokenService.test.ts

/**
 * Pass all tests and drive 100% coverage for src/utils/tokenService.ts
 * - Covers: registered instance, remote instance (immediate/polling/timeout),
 *   no-account warnings, InteractionRequiredAuthError, and generic errors
 */

import type { Mock } from 'jest-mock';

// Mock @azure/msal-browser with a real class for instanceof checks
jest.mock('@azure/msal-browser', () => {
  class InteractionRequiredAuthError extends Error {
    code: string;
    constructor(code = 'interaction_required', message?: string) {
      super(message || code);
      this.name = 'InteractionRequiredAuthError';
      this.code = code;
    }
  }
  const PublicClientApplication = jest.fn();
  return {
    __esModule: true,
    PublicClientApplication,
    InteractionRequiredAuthError,
  };
});

type MsalMock = {
  initialize: jest.Mock;
  getAllAccounts: jest.Mock;
  getActiveAccount: jest.Mock;
  setActiveAccount: jest.Mock;
  acquireTokenSilent: jest.Mock;
  loginRedirect: jest.Mock;
};

const makeMsalInstance = (): MsalMock => ({
  initialize: jest.fn(),
  getAllAccounts: jest.fn(),
  getActiveAccount: jest.fn(),
  setActiveAccount: jest.fn(),
  acquireTokenSilent: jest.fn(),
  loginRedirect: jest.fn(),
});

const path = require('path');
const tokenServicePath = path.join(__dirname, '..', 'tokenService');
const msalConfigPath = path.join(__dirname, '..', 'msalConfig');

// Helpers to drive fake timers deterministically across Jest versions
const advanceTimers = async (ms: number) => {
  if (typeof (jest as any).advanceTimersByTimeAsync === 'function') {
    await (jest as any).advanceTimersByTimeAsync(ms);
  } else {
    jest.advanceTimersByTime(ms);
    // Flush microtasks
    await Promise.resolve();
  }
};

const runPendingTimers = async () => {
  if (typeof (jest as any).runOnlyPendingTimersAsync === 'function') {
    await (jest as any).runOnlyPendingTimersAsync();
  } else {
    jest.runOnlyPendingTimers();
    await Promise.resolve();
  }
};

describe('tokenService', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  // Load a fresh copy of tokenService wired to the provided MSAL instance.
  // Also return the InteractionRequiredAuthError class from the same isolate to keep instanceof identity.
  function loadTokenService(instance: MsalMock): {
    svc: typeof import('../tokenService');
    InteractionRequiredAuthError: new (...args: any[]) => Error;
  } {
    let tokenServiceModule!: typeof import('../tokenService');
    let InteractionRequiredAuthError!: new (...args: any[]) => Error;

    jest.isolateModules(() => {
      // Deterministic msalConfig
      jest.doMock(msalConfigPath, () => ({
        __esModule: true,
        msalConfig: { auth: { clientId: 'test-client' } },
        loginRequest: { scopes: ['user.read'] },
      }));

      const msal = require('@azure/msal-browser');
      (msal.PublicClientApplication as Mock).mockImplementation(() => instance);
      InteractionRequiredAuthError = msal.InteractionRequiredAuthError;

      tokenServiceModule = require(tokenServicePath);
    });

    return { svc: tokenServiceModule, InteractionRequiredAuthError };
  }

  // ────────────────────────────────────────────────────────────────────────
  // Registered instance path
  // ────────────────────────────────────────────────────────────────────────

  it('uses registered instance and returns access token', async () => {
    const instance = makeMsalInstance();
    const { svc } = loadTokenService(instance);

    instance.getAllAccounts.mockReturnValue([{ id: '1' }]);
    instance.getActiveAccount.mockReturnValue({ id: '1' });
    instance.acquireTokenSilent.mockResolvedValue({ accessToken: 'access-token' });

    svc.registerMsalInstance(instance as any);

    const token = await svc.getAccessToken();
    expect(token).toBe('access-token');
  });

  it('registered instance: sets active account if missing', async () => {
    const instance = makeMsalInstance();
    const { svc } = loadTokenService(instance);

    const account = { id: '1' };
    instance.getAllAccounts.mockReturnValue([account]);
    instance.getActiveAccount.mockReturnValue(null);
    instance.acquireTokenSilent.mockResolvedValue({ accessToken: 'tok' });

    svc.registerMsalInstance(instance as any);

    const token = await svc.getAccessToken();
    expect(token).toBe('tok');
    expect(instance.setActiveAccount).toHaveBeenCalledWith(account);
  });

  // ────────────────────────────────────────────────────────────────────────
  // Remote instance paths (no registered instance)
  // ────────────────────────────────────────────────────────────────────────

  it('creates instance and resolves immediately when account exists', async () => {
    const instance = makeMsalInstance();
    const { svc } = loadTokenService(instance);

    instance.initialize.mockResolvedValue(undefined);
    instance.getAllAccounts.mockReturnValue([{ id: '1' }]);
    instance.getActiveAccount.mockReturnValue(null);
    instance.acquireTokenSilent.mockResolvedValue({ accessToken: 'remote-token' });

    const token = await svc.getAccessToken();
    expect(token).toBe('remote-token');
    // Immediate path does not call setActiveAccount in waitForAccount
    expect(instance.setActiveAccount).not.toHaveBeenCalled();
  });

  it('detects account during polling and sets active account before proceeding', async () => {
    jest.useFakeTimers();
    const instance = makeMsalInstance();
    const { svc } = loadTokenService(instance);

    instance.initialize.mockResolvedValue(undefined);

    const account = { id: 'A' };
    let calls = 0;
    instance.getAllAccounts.mockImplementation(() => {
      calls += 1;
      return calls < 2 ? [] : [account];
    });
    instance.acquireTokenSilent.mockResolvedValue({ accessToken: 'polled-token' });

    const tokenPromise = svc.getAccessToken();

    // First poll interval is 200ms; advance past it and flush
    await advanceTimers(250);
    await runPendingTimers();

    const token = await tokenPromise;
    expect(token).toBe('polled-token');
    expect(instance.setActiveAccount).toHaveBeenCalledWith(account);

    jest.useRealTimers();
  }, 15000);

  it('returns null when waitForAccount times out (access token) and logs errors', async () => {
    jest.useFakeTimers();
    const instance = makeMsalInstance();
    const { svc } = loadTokenService(instance);

    instance.initialize.mockResolvedValue(undefined);
    instance.getAllAccounts.mockReturnValue([]);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const tokenPromise = svc.getAccessToken();

    // Timeout is 10s; advance slightly beyond and flush
    await advanceTimers(10050);
    await runPendingTimers();

    const token = await tokenPromise;
    expect(token).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith('tokenService: no account in MSAL cache after 10s');
    expect(errorSpy).toHaveBeenCalledWith('getAccessToken: no MSAL instance available');

    errorSpy.mockRestore();
    jest.useRealTimers();
  }, 15000);

  // ────────────────────────────────────────────────────────────────────────
  // No account warnings
  // ────────────────────────────────────────────────────────────────────────

  it('logs warning and returns null when no account in cache (access token)', async () => {
    const instance = makeMsalInstance();
    const { svc } = loadTokenService(instance);

    svc.registerMsalInstance(instance as any);

    instance.getAllAccounts.mockReturnValue([]);
    instance.getActiveAccount.mockReturnValue(null);

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const token = await svc.getAccessToken();

    expect(token).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('getAccessToken: no account found in MSAL cache');
    warnSpy.mockRestore();
  });

  it('logs warning and returns null when no account in cache (ID token)', async () => {
    const instance = makeMsalInstance();
    const { svc } = loadTokenService(instance);

    svc.registerMsalInstance(instance as any);

    instance.getAllAccounts.mockReturnValue([]);
    instance.getActiveAccount.mockReturnValue(null);

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const token = await svc.getIdToken();

    expect(token).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('getIdToken: no account found in MSAL cache');
    warnSpy.mockRestore();
  });

  // ────────────────────────────────────────────────────────────────────────
  // InteractionRequiredAuthError and generic errors
  // ────────────────────────────────────────────────────────────────────────

  it('triggers loginRedirect on InteractionRequiredAuthError (access token)', async () => {
    const instance = makeMsalInstance();
    const { svc, InteractionRequiredAuthError } = loadTokenService(instance);

    svc.registerMsalInstance(instance as any);

    instance.getAllAccounts.mockReturnValue([{ id: '1' }]);
    instance.getActiveAccount.mockReturnValue({ id: '1' });

    // Ensure instanceof matches the class identity used inside tokenService
    const err = new Error('error');
    Object.setPrototypeOf(err, InteractionRequiredAuthError.prototype);
    instance.acquireTokenSilent.mockRejectedValue(err);

    const token = await svc.getAccessToken();
    expect(token).toBeNull();
    expect(instance.loginRedirect).toHaveBeenCalled();
  });

  it('logs generic error and returns null (access token)', async () => {
    const instance = makeMsalInstance();
    const { svc } = loadTokenService(instance);

    svc.registerMsalInstance(instance as any);

    instance.getAllAccounts.mockReturnValue([{ id: '1' }]);
    instance.getActiveAccount.mockReturnValue({ id: '1' });
    instance.acquireTokenSilent.mockRejectedValue(new Error('Some error'));

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const token = await svc.getAccessToken();

    expect(token).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith('getAccessToken failed:', expect.any(Error));
    errorSpy.mockRestore();
  });

  it('returns ID token on success', async () => {
    const instance = makeMsalInstance();
    const { svc } = loadTokenService(instance);

    svc.registerMsalInstance(instance as any);

    instance.getAllAccounts.mockReturnValue([{ id: '1' }]);
    instance.getActiveAccount.mockReturnValue({ id: '1' });
    instance.acquireTokenSilent.mockResolvedValue({ idToken: 'id-token' });

    const token = await svc.getIdToken();
    expect(token).toBe('id-token');
  });

  it('triggers loginRedirect on InteractionRequiredAuthError (ID token)', async () => {
    const instance = makeMsalInstance();
    const { svc, InteractionRequiredAuthError } = loadTokenService(instance);

    svc.registerMsalInstance(instance as any);

    instance.getAllAccounts.mockReturnValue([{ id: '1' }]);
    instance.getActiveAccount.mockReturnValue({ id: '1' });

    // Ensure instanceof matches by setting the prototype
    const err = new Error('error');
    Object.setPrototypeOf(err, InteractionRequiredAuthError.prototype);
    instance.acquireTokenSilent.mockRejectedValue(err);

    const token = await svc.getIdToken();
    expect(token).toBeNull();
    expect(instance.loginRedirect).toHaveBeenCalled();
  });

  it('returns null when waitForAccount times out (ID token) and logs errors', async () => {
    jest.useFakeTimers();
    const instance = makeMsalInstance();
    const { svc } = loadTokenService(instance);

    instance.initialize.mockResolvedValue(undefined);
    instance.getAllAccounts.mockReturnValue([]);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const tokenPromise = svc.getIdToken();

    await advanceTimers(10050);
    await runPendingTimers();

    const token = await tokenPromise;
    expect(token).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith('tokenService: no account in MSAL cache after 10s');
    expect(errorSpy).toHaveBeenCalledWith('getIdToken: no MSAL instance available');

    errorSpy.mockRestore();
    jest.useRealTimers();
  }, 15000);
});
