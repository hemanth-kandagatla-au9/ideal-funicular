import '@testing-library/jest-dom';

// Mock window globals used by Module Federation
(global as any).__webpack_init_sharing__ = jest.fn(() => Promise.resolve());
(global as any).__webpack_share_scopes__ = { default: {} };

// Mock MSAL globals
(global as any).__POWERED_BY_IASPHERE__ = true;
(global as any).__HOST_APP__ = true;
(global as any).__HOST_GET_TOKEN__ = jest.fn(() => Promise.resolve('mock-token'));
(global as any).__WF_NAVIGATE__ = jest.fn();
(global as any).__REDUX_STORE__ = {};

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock environment variables
process.env.REACT_APP_CLIENTID = 'test-client-id';
process.env.REACT_APP_AUTHORITY_URL = 'https://login.microsoftonline.com/test';
process.env.REACT_APP_REDIRECTURI = 'http://localhost:3006';
process.env.REACT_APP_POSTLOGOUTREDIRECTURI = 'http://localhost:3006';
process.env.STAR_API_URL = 'http://localhost:3001/api';
process.env.REACT_APP_BACKEND_URL = 'http://localhost:3001';
process.env.REACT_APP_WORKFLOW_API = 'http://localhost:3001/api/app-workflow';

// Suppress console errors in tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
