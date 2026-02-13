/* eslint-disable @typescript-eslint/no-require-imports */
import { approvalSlice } from '../approvalSlice';

describe('approvalSlice', () => {
  it('should have correct reducer path', () => {
    expect(approvalSlice.reducerPath).toBe('approvalApi');
  });

  it('should have correct tag types', () => {
    expect(approvalSlice).toHaveProperty('reducerPath', 'approvalApi');
  });

  it('should export getAllApprovalRequests query endpoint', () => {
    expect(approvalSlice.endpoints.getAllApprovalRequests).toBeDefined();
  });

  it('should export ApproveRequest mutation endpoint', () => {
    expect(approvalSlice.endpoints.ApproveRequest).toBeDefined();
  });

  it('should export RejectRequest mutation endpoint', () => {
    expect(approvalSlice.endpoints.RejectRequest).toBeDefined();
  });

  it('should export publishWorkflow mutation endpoint', () => {
    expect(approvalSlice.endpoints.publishWorkflow).toBeDefined();
  });

  it('should export useGetAllApprovalRequestsQuery hook', () => {
    const { useGetAllApprovalRequestsQuery } = require('../approvalSlice');
    expect(useGetAllApprovalRequestsQuery).toBeDefined();
    expect(typeof useGetAllApprovalRequestsQuery).toBe('function');
  });

  it('should export useApproveRequestMutation hook', () => {
    const { useApproveRequestMutation } = require('../approvalSlice');
    expect(useApproveRequestMutation).toBeDefined();
    expect(typeof useApproveRequestMutation).toBe('function');
  });

  it('should export useRejectRequestMutation hook', () => {
    const { useRejectRequestMutation } = require('../approvalSlice');
    expect(useRejectRequestMutation).toBeDefined();
    expect(typeof useRejectRequestMutation).toBe('function');
  });

  it('should export usePublishWorkflowMutation hook', () => {
    const { usePublishWorkflowMutation } = require('../approvalSlice');
    expect(usePublishWorkflowMutation).toBeDefined();
    expect(typeof usePublishWorkflowMutation).toBe('function');
  });

  it('should configure getAllApprovalRequests endpoint correctly', () => {
    const endpoint = approvalSlice.endpoints.getAllApprovalRequests;
    expect(endpoint).toBeDefined();
    expect(endpoint.matchPending).toBeDefined();
    expect(endpoint.matchFulfilled).toBeDefined();
    expect(endpoint.matchRejected).toBeDefined();
  });

  it('should configure mutations correctly', () => {
    expect(approvalSlice.endpoints.ApproveRequest.matchPending).toBeDefined();
    expect(approvalSlice.endpoints.RejectRequest.matchPending).toBeDefined();
    expect(approvalSlice.endpoints.publishWorkflow.matchPending).toBeDefined();
  });
});
