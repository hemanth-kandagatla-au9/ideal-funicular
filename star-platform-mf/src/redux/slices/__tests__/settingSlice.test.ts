/* eslint-disable @typescript-eslint/no-require-imports */
import { settingSlice } from '../settingSlice';

describe('settingSlice', () => {
  it('should have correct reducer path', () => {
    expect(settingSlice.reducerPath).toBe('settingApi');
  });

  it('should export getAllServerDetails query endpoint', () => {
    expect(settingSlice.endpoints.getAllServerDetails).toBeDefined();
  });

  it('should export getServerMetadata query endpoint', () => {
    expect(settingSlice.endpoints.getServerMetadata).toBeDefined();
  });

  it('should export createServer mutation endpoint', () => {
    expect(settingSlice.endpoints.createServer).toBeDefined();
  });

  it('should export updateServer mutation endpoint', () => {
    expect(settingSlice.endpoints.updateServer).toBeDefined();
  });

  it('should export deleteServer mutation endpoint', () => {
    expect(settingSlice.endpoints.deleteServer).toBeDefined();
  });

  it('should export getAllWorkflowCategoryDetails query endpoint', () => {
    expect(settingSlice.endpoints.getAllWorkflowCategoryDetails).toBeDefined();
  });

  it('should export createWorkflowCategory mutation endpoint', () => {
    expect(settingSlice.endpoints.createWorkflowCategory).toBeDefined();
  });

  it('should export updateWorkflowCategory mutation endpoint', () => {
    expect(settingSlice.endpoints.updateWorkflowCategory).toBeDefined();
  });

  it('should export deleteWorkflowCategory mutation endpoint', () => {
    expect(settingSlice.endpoints.deleteWorkflowCategory).toBeDefined();
  });

  it('should export getApprovalSettings query endpoint', () => {
    expect(settingSlice.endpoints.getApprovalSettings).toBeDefined();
  });

  it('should export getApprovalSettingsByID query endpoint', () => {
    expect(settingSlice.endpoints.getApprovalSettingsByID).toBeDefined();
  });

  it('should export createApprovalSetting mutation endpoint', () => {
    expect(settingSlice.endpoints.createApprovalSetting).toBeDefined();
  });

  it('should export updateApprovalSetting mutation endpoint', () => {
    expect(settingSlice.endpoints.updateApprovalSetting).toBeDefined();
  });

  it('should export deleteApprovalSetting mutation endpoint', () => {
    expect(settingSlice.endpoints.deleteApprovalSetting).toBeDefined();
  });

  it('should export metadataApprovalSetting query endpoint', () => {
    expect(settingSlice.endpoints.metadataApprovalSetting).toBeDefined();
  });

  it('should export useGetAllServerDetailsQuery hook', () => {
    const { useGetAllServerDetailsQuery } = require('../settingSlice');
    expect(useGetAllServerDetailsQuery).toBeDefined();
    expect(typeof useGetAllServerDetailsQuery).toBe('function');
  });

  it('should export useCreateServerMutation hook', () => {
    const { useCreateServerMutation } = require('../settingSlice');
    expect(useCreateServerMutation).toBeDefined();
    expect(typeof useCreateServerMutation).toBe('function');
  });

  it('should configure query endpoints correctly', () => {
    const endpoint = settingSlice.endpoints.getAllServerDetails;
    expect(endpoint.matchPending).toBeDefined();
    expect(endpoint.matchFulfilled).toBeDefined();
    expect(endpoint.matchRejected).toBeDefined();
  });

  it('should configure mutation endpoints correctly', () => {
    expect(settingSlice.endpoints.createServer.matchPending).toBeDefined();
    expect(settingSlice.endpoints.updateServer.matchPending).toBeDefined();
    expect(settingSlice.endpoints.deleteServer.matchPending).toBeDefined();
  });
});
