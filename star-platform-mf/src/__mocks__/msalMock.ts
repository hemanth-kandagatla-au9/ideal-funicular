import { PublicClientApplication } from '@azure/msal-browser';

// Mock MSAL PublicClientApplication
export const mockMsalInstance = {
  initialize: jest.fn(() => Promise.resolve()),
  handleRedirectPromise: jest.fn(() => Promise.resolve(null)),
  getAllAccounts: jest.fn(() => [
    {
      homeAccountId: 'test-home-id',
      environment: 'login.windows.net',
      tenantId: 'test-tenant-id',
      username: 'test@example.com',
      localAccountId: 'test-local-id',
      name: 'Test User',
      idTokenClaims: {},
    },
  ]),
  getActiveAccount: jest.fn(() => ({
    homeAccountId: 'test-home-id',
    environment: 'login.windows.net',
    tenantId: 'test-tenant-id',
    username: 'test@example.com',
    localAccountId: 'test-local-id',
    name: 'Test User',
    idTokenClaims: {},
  })),
  setActiveAccount: jest.fn(),
  addEventCallback: jest.fn(),
  loginRedirect: jest.fn(() => Promise.resolve()),
  acquireTokenSilent: jest.fn(() =>
    Promise.resolve({
      accessToken: 'mock-access-token',
      idToken: 'mock-id-token',
      expiresOn: new Date(Date.now() + 3600000),
      account: {
        homeAccountId: 'test-home-id',
        environment: 'login.windows.net',
        tenantId: 'test-tenant-id',
        username: 'test@example.com',
        localAccountId: 'test-local-id',
        name: 'Test User',
        idTokenClaims: {},
      },
    })
  ),
  acquireTokenPopup: jest.fn(() =>
    Promise.resolve({
      accessToken: 'mock-access-token',
      idToken: 'mock-id-token',
      expiresOn: new Date(Date.now() + 3600000),
    })
  ),
};

jest.mock('@azure/msal-browser', () => ({
  PublicClientApplication: jest.fn(() => mockMsalInstance),
  EventType: {
    LOGIN_SUCCESS: 'msal:loginSuccess',
    LOGIN_FAILURE: 'msal:loginFailure',
    LOGOUT_SUCCESS: 'msal:logoutSuccess',
  },
  InteractionRequiredAuthError: class InteractionRequiredAuthError extends Error {
    errorCode = 'interaction_required';
  },
  LogLevel: {
    Error: 0,
    Warning: 1,
    Info: 2,
    Verbose: 3,
  },
}));

jest.mock('@azure/msal-react', () => ({
  MsalProvider: ({ children }: any) => children,
  useIsAuthenticated: jest.fn(() => true),
  useMsal: jest.fn(() => ({
    instance: mockMsalInstance,
    accounts: mockMsalInstance.getAllAccounts(),
    inProgress: 'none',
  })),
}));

export default mockMsalInstance;
