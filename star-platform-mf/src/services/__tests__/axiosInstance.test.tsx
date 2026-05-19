// src/services/__tests__/axiosInstance.test.tsx

import '@testing-library/jest-dom';

// Silence jsdom navigation warnings triggered by window.location.href in clearSession()
let consoleErrorSpy: jest.SpyInstance;
beforeAll(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterAll(() => {
  consoleErrorSpy.mockRestore();
});

// ────────────────────────────────────────────────────────────────────────────
// Mock axios BEFORE importing the module under test
// We capture the interceptor handlers directly in closures to avoid
// reliance on mock.calls indexing, which can be brittle.
// ────────────────────────────────────────────────────────────────────────────
let capturedRequestFulfilled: ((config: any) => any) | undefined;
let capturedRequestRejected: ((error: any) => any) | undefined;
let capturedResponseFulfilled: ((resp: any) => any) | undefined;
let capturedResponseRejected: ((error: any) => any) | undefined;

const mockAxiosInstance = {
  interceptors: {
    request: {
      use: jest.fn((fulfilled: any, rejected: any) => {
        capturedRequestFulfilled = fulfilled;
        capturedRequestRejected = rejected;
      }),
    },
    response: {
      use: jest.fn((fulfilled: any, rejected: any) => {
        capturedResponseFulfilled = fulfilled;
        capturedResponseRejected = rejected;
      }),
    },
  },
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
} as any;

jest.mock('axios', () => {
  // Create the patch function inside the factory to avoid hoisting issues
  const patchFn = jest.fn();

  const defaultExport: any = {
    create: jest.fn(() => mockAxiosInstance),
    patch: patchFn,
    __patchFn: patchFn, // expose for tests
  };

  return {
    __esModule: true,
    default: defaultExport,
    create: defaultExport.create,
    patch: patchFn,
  };
});

import axios from 'axios';

// Concrete reference to the actual jest.fn used by axios.patch in the module
let patchMock: jest.Mock;

// ────────────────────────────────────────────────────────────────────────────
// Mock universal-cookie so new Cookies() returns our shared mock instance
// ────────────────────────────────────────────────────────────────────────────
const cookieStore: Record<string, string> = {};
const mockCookies = {
  get: jest.fn((key: string) => cookieStore[key]),
  set: jest.fn((key: string, val: string, _opts?: any) => {
    cookieStore[key] = val;
  }),
  remove: jest.fn((key: string) => {
    delete cookieStore[key];
  }),
};

jest.mock('universal-cookie', () => {
  const MockCtor = jest.fn(() => mockCookies);
  return { __esModule: true, default: MockCtor };
});

// ────────────────────────────────────────────────────────────────────────────
// Types for convenience
// ────────────────────────────────────────────────────────────────────────────
type RequestFulfilled = (config: any) => any;
type RequestRejected = (error: any) => any;
type ResponseFulfilled = (response: any) => any;
type ResponseRejected = (error: any) => any;

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────
const FUTURE = '2999-01-01T00:00:00.000Z';
const PAST = '2000-01-01T00:00:00.000Z';

const setAccessToken = (v: string | null) =>
  v ? (cookieStore['iasphere_access_token'] = v) : delete cookieStore['iasphere_access_token'];
const setRefreshToken = (v: string | null) =>
  v ? (cookieStore['refreshToken'] = v) : delete cookieStore['refreshToken'];
const setTokenExpiry = (v: string | null) =>
  v ? (cookieStore['tokenValidity'] = v) : delete cookieStore['tokenValidity'];

// ────────────────────────────────────────────────────────────────────────────
// Capture interceptor handlers and import module under test
// ────────────────────────────────────────────────────────────────────────────
let requestFulfilled: RequestFulfilled;
let requestRejected: RequestRejected;
let responseFulfilled: ResponseFulfilled;
let responseRejected: ResponseRejected;

beforeAll(async () => {
  // Retrieve the actual patch function used by the module
  patchMock = (axios as any).__patchFn as jest.Mock;

  // Import the axiosInstance module AFTER all mocks are wired
  await import('../axiosInstance');

  // Use the handlers captured by our custom .use implementations
  if (!capturedRequestFulfilled || !capturedResponseFulfilled) {
    throw new Error('Interceptors were not registered correctly by axiosInstance module');
  }
  requestFulfilled = capturedRequestFulfilled as RequestFulfilled;
  requestRejected = (capturedRequestRejected || ((e: any) => Promise.reject(e))) as RequestRejected;
  responseFulfilled = capturedResponseFulfilled as ResponseFulfilled;
  responseRejected = capturedResponseRejected as ResponseRejected;
});

beforeEach(() => {
  // reset cookie store and session
  Object.keys(cookieStore).forEach((k) => delete cookieStore[k]);
  sessionStorage.clear();

  mockCookies.get.mockClear();
  mockCookies.set.mockClear();
  mockCookies.remove.mockClear();

  patchMock.mockReset();
});

// ────────────────────────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR — FULFILLED
// ────────────────────────────────────────────────────────────────────────────

describe('request interceptor — fulfilled', () => {
  it('does not attach Authorization when refresh returns null (no refreshToken)', async () => {
    setAccessToken(null);
    setRefreshToken(null);

    const config = { headers: {} };
    const result = await requestFulfilled(config);

    expect(result.headers.Authorization).toBeUndefined();
    expect(mockCookies.remove).not.toHaveBeenCalled();
  });

  it('does not attach Authorization when refresh returns null (no userId)', async () => {
    setAccessToken(null);
    setRefreshToken('rt');
    // userId NOT set in sessionStorage

    const config = { headers: {} };
    const result = await requestFulfilled(config);

    expect(result.headers.Authorization).toBeUndefined();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR — REJECTED
// ────────────────────────────────────────────────────────────────────────────

describe('request interceptor — rejected', () => {
  it('forwards the error as a rejected promise', async () => {
    const err = new Error('request setup failed');
    await expect(requestRejected(err)).rejects.toThrow('request setup failed');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR — FULFILLED
// ────────────────────────────────────────────────────────────────────────────

describe('response interceptor — fulfilled', () => {
  it('passes through successful responses unchanged', () => {
    const response = { status: 200, data: { ok: true } };
    expect(responseFulfilled(response)).toEqual(response);
  });
});

// ────────────────────────────────────────────────────────────────────────────
// RESPONSE INTERCEPTOR — REJECTED
// ────────────────────────────────────────────────────────────────────────────

describe('response interceptor — rejected', () => {
  it('clears session on "Session Expired" message', async () => {
    const error = {
      config: {},
      response: { status: 401, data: { message: 'Session Expired' } },
    };
    await expect(responseRejected(error)).rejects.toBeDefined();

    expect(mockCookies.remove).toHaveBeenCalledWith('token');
    expect(mockCookies.remove).toHaveBeenCalledWith('refreshToken');
    expect(mockCookies.remove).toHaveBeenCalledWith('tokenValidity');
  });

  it('does not clear session on 401 when refresh returns null (no refreshToken/userId)', async () => {
    // Missing refresh token → refreshBackendToken returns null; no clearSession in this path
    setRefreshToken(null);

    const error: any = {
      config: { headers: {} } as any,
      response: { status: 401, data: { message: 'Unauthorized' } },
    };

    await expect(responseRejected(error)).rejects.toBeDefined();
    // _retry should have been set to true on original request
    expect((error.config as any)._retry).toBe(true);
    // No session clear
    expect(mockCookies.remove).not.toHaveBeenCalled();
  });

  it('clears session immediately when _retry is already true', async () => {
    const error = {
      config: { _retry: true, headers: {} } as any,
      response: { status: 401, data: { message: 'Unauthorized' } },
    };
    await expect(responseRejected(error)).rejects.toBeDefined();
    expect(mockCookies.remove).toHaveBeenCalledWith('token');
    expect(mockCookies.remove).toHaveBeenCalledWith('refreshToken');
    expect(mockCookies.remove).toHaveBeenCalledWith('tokenValidity');
  });

  it('redirects to /not-found on 404 (no session clear)', async () => {
    const error = {
      config: { headers: {} } as any,
      response: { status: 404, data: {} },
    };
    await expect(responseRejected(error)).rejects.toBeDefined();
    expect(mockCookies.remove).not.toHaveBeenCalled();
  });

  it('rejects with no side effects for unhandled error codes (e.g. 500)', async () => {
    const error = {
      config: { headers: {} } as any,
      response: { status: 500, data: {} },
    };
    await expect(responseRejected(error)).rejects.toBeDefined();
    expect(mockCookies.remove).not.toHaveBeenCalled();
  });
});
