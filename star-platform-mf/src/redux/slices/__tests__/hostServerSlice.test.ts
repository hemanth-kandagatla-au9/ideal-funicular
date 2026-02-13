/* eslint-disable @typescript-eslint/no-require-imports */
import { hostServerSlice } from '../hostServerSlice';

describe('hostServerSlice', () => {
  it('should have correct reducer path', () => {
    expect(hostServerSlice.reducerPath).toBe('hostServerAPI');
  });

  it('should export getAllHostServers query endpoint', () => {
    expect(hostServerSlice.endpoints.getAllHostServers).toBeDefined();
  });

  it('should export getAllFilters query endpoint', () => {
    expect(hostServerSlice.endpoints.getAllFilters).toBeDefined();
  });

  it('should export useGetAllHostServersQuery hook', () => {
    const { useGetAllHostServersQuery } = require('../hostServerSlice');
    expect(useGetAllHostServersQuery).toBeDefined();
    expect(typeof useGetAllHostServersQuery).toBe('function');
  });

  it('should export useGetAllFiltersQuery hook', () => {
    const { useGetAllFiltersQuery } = require('../hostServerSlice');
    expect(useGetAllFiltersQuery).toBeDefined();
    expect(typeof useGetAllFiltersQuery).toBe('function');
  });

  it('should configure getAllHostServers endpoint correctly', () => {
    const endpoint = hostServerSlice.endpoints.getAllHostServers;
    expect(endpoint).toBeDefined();
    expect(endpoint.matchPending).toBeDefined();
    expect(endpoint.matchFulfilled).toBeDefined();
    expect(endpoint.matchRejected).toBeDefined();
  });

  it('should configure getAllFilters endpoint correctly', () => {
    const endpoint = hostServerSlice.endpoints.getAllFilters;
    expect(endpoint).toBeDefined();
    expect(endpoint.matchPending).toBeDefined();
    expect(endpoint.matchFulfilled).toBeDefined();
    expect(endpoint.matchRejected).toBeDefined();
  });

  it('should have correct tag types', () => {
    expect(hostServerSlice).toHaveProperty('reducerPath', 'hostServerAPI');
  });
});
