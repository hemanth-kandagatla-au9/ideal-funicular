/* eslint-disable @typescript-eslint/no-require-imports */
import { authApi } from '../authSlice';

describe('authSlice', () => {
  it('should have correct reducer path', () => {
    expect(authApi.reducerPath).toBe('authApi');
  });

  it('should export login mutation endpoint', () => {
    expect(authApi.endpoints.login).toBeDefined();
  });

  it('should configure login mutation correctly', () => {
    const endpoint = authApi.endpoints.login;
    expect(endpoint).toBeDefined();
    expect(endpoint.matchPending).toBeDefined();
    expect(endpoint.matchFulfilled).toBeDefined();
    expect(endpoint.matchRejected).toBeDefined();
  });

  it('should export useLoginMutation hook', () => {
    const { useLoginMutation } = require('../authSlice');
    expect(useLoginMutation).toBeDefined();
    expect(typeof useLoginMutation).toBe('function');
  });
});
