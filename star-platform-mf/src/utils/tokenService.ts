import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { msalConfig, loginRequest } from './msalConfig';

let _instance: PublicClientApplication | null = null;

const ACCOUNT_POLL_INTERVAL_MS = 200;
const ACCOUNT_POLL_TIMEOUT_MS = 10000;

/**
 * Called once in host's index.tsx after msalInstance.initialize().
 * Reuses the existing MSAL instance — no duplicate initialization.
 */
export const registerMsalInstance = (instance: PublicClientApplication) => {
  _instance = instance;
};

/**
 * Waits until MSAL cache has at least one account.
 * Needed when tokenService is called before host login completes.
 */
const waitForAccount = (instance: PublicClientApplication): Promise<boolean> => {
  return new Promise((resolve) => {
    if (instance.getAllAccounts().length > 0) {
      resolve(true);
      return;
    }

    const start = Date.now();
    const poll = setInterval(() => {
      const accounts = instance.getAllAccounts();
      if (accounts.length > 0) {
        clearInterval(poll);
        instance.setActiveAccount(accounts[0]);
        resolve(true);
        return;
      }
      if (Date.now() - start >= ACCOUNT_POLL_TIMEOUT_MS) {
        clearInterval(poll);
        console.error(
          `tokenService: no account in MSAL cache after ${ACCOUNT_POLL_TIMEOUT_MS / 1000}s`
        );
        resolve(false);
      }
    }, ACCOUNT_POLL_INTERVAL_MS);
  });
};

/**
 * Returns the singleton MSAL instance.
 * Host: uses registered instance from index.tsx.
 * Remotes: creates own instance reading from shared localStorage cache.
 */
const getInstance = async (): Promise<PublicClientApplication | null> => {
  if (_instance) {
    // Ensure active account is set if it wasn't when instance was registered
    if (!_instance.getActiveAccount() && _instance.getAllAccounts().length > 0) {
      _instance.setActiveAccount(_instance.getAllAccounts()[0]);
    }
    return _instance;
  }

  // Remote path — own instance reading from shared localStorage cache
  _instance = new PublicClientApplication(msalConfig);
  await _instance.initialize();

  const accountFound = await waitForAccount(_instance);
  if (!accountFound) return null;

  return _instance;
};

/**
 * Returns a valid access token from the shared MSAL localStorage cache.
 * forceRefresh: false → cache hit, zero AAD call if token is valid.
 */
export const getAccessToken = async (): Promise<string | null> => {
  const instance = await getInstance();

  if (!instance) {
    console.error('getAccessToken: no MSAL instance available');
    return null;
  }

  const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0];

  if (!account) {
    console.warn('getAccessToken: no account found in MSAL cache');
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
      console.error('getAccessToken: session expired — redirecting to login');
      await instance.loginRedirect(loginRequest); // reuse instance, no second getInstance()
    } else {
      console.error('getAccessToken failed:', err);
    }
    return null;
  }
};

/**
 * Returns a valid ID token from the shared MSAL localStorage cache.
 * forceRefresh: false → cache hit, zero AAD call if token is valid.
 */
export const getIdToken = async (): Promise<string | null> => {
  const instance = await getInstance();

  if (!instance) {
    console.error('getIdToken: no MSAL instance available');
    return null;
  }

  const account = instance.getActiveAccount() ?? instance.getAllAccounts()[0];

  if (!account) {
    console.warn('getIdToken: no account found in MSAL cache');
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
      console.error('getIdToken: session expired — redirecting to login');
      await instance.loginRedirect(loginRequest); // reuse instance, no second getInstance()
    } else {
      console.error('getIdToken failed:', err);
    }
    return null;
  }
};
