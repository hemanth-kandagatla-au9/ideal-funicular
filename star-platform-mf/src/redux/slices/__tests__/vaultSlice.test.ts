/* eslint-disable @typescript-eslint/no-require-imports */
import { vaultSlice } from '../vaultSlice';

describe('vaultSlice', () => {
  it('should have correct reducer path', () => {
    expect(vaultSlice.reducerPath).toBe('vaultApi');
  });

  it('should export getAllVaults query endpoint', () => {
    expect(vaultSlice.endpoints.getAllVaults).toBeDefined();
  });

  it('should export getVaultConfig query endpoint', () => {
    expect(vaultSlice.endpoints.getVaultConfig).toBeDefined();
  });

  it('should export createVault mutation endpoint', () => {
    expect(vaultSlice.endpoints.createVault).toBeDefined();
  });

  it('should export updateVault mutation endpoint', () => {
    expect(vaultSlice.endpoints.updateVault).toBeDefined();
  });

  it('should export deleteVault mutation endpoint', () => {
    expect(vaultSlice.endpoints.deleteVault).toBeDefined();
  });

  it('should export useGetVaultConfigQuery hook', () => {
    const { useGetVaultConfigQuery } = require('../vaultSlice');
    expect(useGetVaultConfigQuery).toBeDefined();
    expect(typeof useGetVaultConfigQuery).toBe('function');
  });

  it('should export useGetAllVaultsQuery hook', () => {
    const { useGetAllVaultsQuery } = require('../vaultSlice');
    expect(useGetAllVaultsQuery).toBeDefined();
    expect(typeof useGetAllVaultsQuery).toBe('function');
  });

  it('should export useCreateVaultMutation hook', () => {
    const { useCreateVaultMutation } = require('../vaultSlice');
    expect(useCreateVaultMutation).toBeDefined();
    expect(typeof useCreateVaultMutation).toBe('function');
  });

  it('should export useUpdateVaultMutation hook', () => {
    const { useUpdateVaultMutation } = require('../vaultSlice');
    expect(useUpdateVaultMutation).toBeDefined();
    expect(typeof useUpdateVaultMutation).toBe('function');
  });

  it('should export useDeleteVaultMutation hook', () => {
    const { useDeleteVaultMutation } = require('../vaultSlice');
    expect(useDeleteVaultMutation).toBeDefined();
    expect(typeof useDeleteVaultMutation).toBe('function');
  });

  it('should configure getAllVaults endpoint correctly', () => {
    const endpoint = vaultSlice.endpoints.getAllVaults;
    expect(endpoint).toBeDefined();
    expect(endpoint.matchPending).toBeDefined();
    expect(endpoint.matchFulfilled).toBeDefined();
    expect(endpoint.matchRejected).toBeDefined();
  });

  it('should configure getVaultConfig endpoint correctly', () => {
    const endpoint = vaultSlice.endpoints.getVaultConfig;
    expect(endpoint).toBeDefined();
    expect(endpoint.matchPending).toBeDefined();
  });

  it('should configure mutations correctly', () => {
    expect(vaultSlice.endpoints.createVault.matchPending).toBeDefined();
    expect(vaultSlice.endpoints.updateVault.matchPending).toBeDefined();
    expect(vaultSlice.endpoints.deleteVault.matchPending).toBeDefined();
  });
});
