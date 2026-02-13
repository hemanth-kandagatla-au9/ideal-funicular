/* eslint-disable @typescript-eslint/no-require-imports */
import { analyticsApi } from '../analyticsSlice';

describe('analyticsSlice', () => {
  it('should have correct reducer path', () => {
    expect(analyticsApi.reducerPath).toBe('analyticsApi');
  });

  it('should export getAllDashboardData query endpoint', () => {
    expect(analyticsApi.endpoints.getAllDashboardData).toBeDefined();
  });

  it('should configure getAllDashboardData query correctly', () => {
    const endpoint = analyticsApi.endpoints.getAllDashboardData;
    expect(endpoint).toBeDefined();
    expect(endpoint.matchPending).toBeDefined();
    expect(endpoint.matchFulfilled).toBeDefined();
    expect(endpoint.matchRejected).toBeDefined();
  });

  it('should export useGetAllDashboardDataQuery hook', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useGetAllDashboardDataQuery } = require('../analyticsSlice');
    expect(useGetAllDashboardDataQuery).toBeDefined();
    expect(typeof useGetAllDashboardDataQuery).toBe('function');
  });
});
