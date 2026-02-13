/* eslint-disable @typescript-eslint/no-require-imports */
import { scriptsSlice } from '../scriptSclice';

describe('scriptsSlice', () => {
  it('should have correct reducer path', () => {
    expect(scriptsSlice.reducerPath).toBe('ScriptsApi');
  });

  it('should export getAllScripts query endpoint', () => {
    expect(scriptsSlice.endpoints.getAllScripts).toBeDefined();
  });

  it('should export getScriptById query endpoint', () => {
    expect(scriptsSlice.endpoints.getScriptById).toBeDefined();
  });

  it('should export getScriptVersion query endpoint', () => {
    expect(scriptsSlice.endpoints.getScriptVersion).toBeDefined();
  });

  it('should export createScript mutation endpoint', () => {
    expect(scriptsSlice.endpoints.createScript).toBeDefined();
  });

  it('should export addScriptVersion mutation endpoint', () => {
    expect(scriptsSlice.endpoints.addScriptVersion).toBeDefined();
  });

  it('should export deleteScript mutation endpoint', () => {
    expect(scriptsSlice.endpoints.deleteScript).toBeDefined();
  });

  it('should export setActiveScriptVersion mutation endpoint', () => {
    expect(scriptsSlice.endpoints.setActiveScriptVersion).toBeDefined();
  });

  it('should export getAllCapabilities query endpoint', () => {
    expect(scriptsSlice.endpoints.getAllCapabilities).toBeDefined();
  });

  it('should export createCapability mutation endpoint', () => {
    expect(scriptsSlice.endpoints.createCapability).toBeDefined();
  });

  it('should export updateCapability mutation endpoint', () => {
    expect(scriptsSlice.endpoints.updateCapability).toBeDefined();
  });

  it('should export deleteCapability mutation endpoint', () => {
    expect(scriptsSlice.endpoints.deleteCapability).toBeDefined();
  });

  it('should export getAllProperties query endpoint', () => {
    expect(scriptsSlice.endpoints.getAllProperties).toBeDefined();
  });

  it('should export getCapabilitiesById query endpoint', () => {
    expect(scriptsSlice.endpoints.getCapabilitiesById).toBeDefined();
  });

  it('should export getCapabilitiesVersionsById query endpoint', () => {
    expect(scriptsSlice.endpoints.getCapabilitiesVersionsById).toBeDefined();
  });

  it('should export useGetAllScriptsQuery hook', () => {
    const { useGetAllScriptsQuery } = require('../scriptSclice');
    expect(useGetAllScriptsQuery).toBeDefined();
    expect(typeof useGetAllScriptsQuery).toBe('function');
  });

  it('should configure query endpoints correctly', () => {
    const endpoint = scriptsSlice.endpoints.getAllScripts;
    expect(endpoint.matchPending).toBeDefined();
    expect(endpoint.matchFulfilled).toBeDefined();
    expect(endpoint.matchRejected).toBeDefined();
  });

  it('should configure mutation endpoints correctly', () => {
    expect(scriptsSlice.endpoints.createScript.matchPending).toBeDefined();
    expect(scriptsSlice.endpoints.deleteScript.matchPending).toBeDefined();
  });
});
