import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest } from './msalConfig';

/**
 * Token bridge for localhost development.
 *
 * Registered on window BEFORE msalInstance.initialize() completes.
 * Guards against early calls by waiting for initialization internally.
 *
 * Remote's waitForBridge() finds __HOST_GET_TOKEN__ immediately since
 * initTokenBridge() is now called before any await in host index.tsx.
 * But the remote may call __HOST_GET_TOKEN__() before MSAL is initialized —
 * so we wait for the active account to be set before calling acquireTokenSilent.
 */

const INIT_POLL_INTERVAL_MS = 100;
const INIT_POLL_TIMEOUT_MS = 15000; // AAD redirect can take up to 10s

/**
 * Waits until MSAL has an active account set.
 * This confirms initialize() + handleRedirectPromise() + setActiveAccount()
 * have all completed in host's renderApp().
 */
const waitForActiveAccount = (instance: PublicClientApplication): Promise<boolean> => {
  return new Promise((resolve) => {
    // Already ready
    if (instance.getActiveAccount() || instance.getAllAccounts().length > 0) {
      resolve(true);
      return;
    }

    const start = Date.now();
    const poll = setInterval(() => {
      if (instance.getActiveAccount() || instance.getAllAccounts().length > 0) {
        clearInterval(poll);
        resolve(true);
        return;
      }
      if (Date.now() - start >= INIT_POLL_TIMEOUT_MS) {
        clearInterval(poll);
        console.error(
          `tokenBridge: no active account after ${INIT_POLL_TIMEOUT_MS / 1000}s — ` +
            `host MSAL may not have completed initialization`
        );
        resolve(false);
      }
    }, INIT_POLL_INTERVAL_MS);
  });
};

export const initTokenBridge = (instance: PublicClientApplication): void => {
  /**
   * Returns a valid access token from host's MSAL instance.
   * Waits for MSAL to be ready if called before initialize() completes.
   */
  (window as any).__HOST_GET_TOKEN__ = async (): Promise<string | null> => {
    const ready = await waitForActiveAccount(instance);
    if (!ready) return null;

    const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0];
    if (!account) {
      console.warn('__HOST_GET_TOKEN__: no active account');
      return null;
    }

    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
        forceRefresh: false,
      });
      return response.accessToken;
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        console.error('__HOST_GET_TOKEN__: session expired — redirecting to login');
        await instance.loginRedirect({ ...loginRequest, account });
      } else {
        console.error('__HOST_GET_TOKEN__ failed:', err);
      }
      return null;
    }
  };

  /**
   * Returns a valid ID token from host's MSAL instance.
   * Waits for MSAL to be ready if called before initialize() completes.
   */
  (window as any).__HOST_GET_ID_TOKEN__ = async (): Promise<string | null> => {
    const ready = await waitForActiveAccount(instance);
    if (!ready) return null;

    const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0];
    if (!account) {
      console.warn('__HOST_GET_ID_TOKEN__: no active account');
      return null;
    }

    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
        forceRefresh: false,
      });
      return response.idToken;
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        console.error('__HOST_GET_ID_TOKEN__: session expired — redirecting to login');
        await instance.loginRedirect({ ...loginRequest, account });
      } else {
        console.error('__HOST_GET_ID_TOKEN__ failed:', err);
      }
      return null;
    }
  };
};
