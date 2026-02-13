/* eslint-disable @typescript-eslint/no-require-imports */
import { workFlowSlice } from '../workflowSlice';

describe('workflowSlice', () => {
  it('should have correct reducer path', () => {
    expect(workFlowSlice.reducerPath).toBe('workflowApi');
  });

  it('should export getAllWorkflows query endpoint', () => {
    expect(workFlowSlice.endpoints.getAllWorkflows).toBeDefined();
  });

  it('should export getWorkflowById query endpoint', () => {
    expect(workFlowSlice.endpoints.getWorkflowById).toBeDefined();
  });

  it('should export getRetryExecutions mutation endpoint', () => {
    expect(workFlowSlice.endpoints.getRetryExecutions).toBeDefined();
  });

  it('should export getPdfClickAnalytics query endpoint', () => {
    expect(workFlowSlice.endpoints.getPdfClickAnalytics).toBeDefined();
  });

  it('should export getScheduleTriggerData query endpoint', () => {
    expect(workFlowSlice.endpoints.getScheduleTriggerData).toBeDefined();
  });

  it('should export createWorkflow mutation endpoint', () => {
    expect(workFlowSlice.endpoints.createWorkflow).toBeDefined();
  });

  it('should export workflowBookmark mutation endpoint', () => {
    expect(workFlowSlice.endpoints.workflowBookmark).toBeDefined();
  });

  it('should export validateWorkflow mutation endpoint', () => {
    expect(workFlowSlice.endpoints.validateWorkflow).toBeDefined();
  });

  it('should export updateWorkflow mutation endpoint', () => {
    expect(workFlowSlice.endpoints.updateWorkflow).toBeDefined();
  });

  it('should export deleteWorkflow mutation endpoint', () => {
    expect(workFlowSlice.endpoints.deleteWorkflow).toBeDefined();
  });

  it('should export manualTriggerWorkflow mutation endpoint', () => {
    expect(workFlowSlice.endpoints.manualTriggerWorkflow).toBeDefined();
  });

  it('should export updateWorkflowIsActive mutation endpoint', () => {
    expect(workFlowSlice.endpoints.updateWorkflowIsActive).toBeDefined();
  });

  it('should export getAllExecutions query endpoint', () => {
    expect(workFlowSlice.endpoints.getAllExecutions).toBeDefined();
  });

  it('should export getAllExecutionsByWfId query endpoint', () => {
    expect(workFlowSlice.endpoints.getAllExecutionsByWfId).toBeDefined();
  });

  it('should export getExecutionById query endpoint', () => {
    expect(workFlowSlice.endpoints.getExecutionById).toBeDefined();
  });

  it('should export getAllNodes query endpoint', () => {
    expect(workFlowSlice.endpoints.getAllNodes).toBeDefined();
  });

  it('should export getNodeLogs query endpoint', () => {
    expect(workFlowSlice.endpoints.getNodeLogs).toBeDefined();
  });

  it('should export getWorkflowVersionById query endpoint', () => {
    expect(workFlowSlice.endpoints.getWorkflowVersionById).toBeDefined();
  });

  it('should export getVersionById query endpoint', () => {
    expect(workFlowSlice.endpoints.getVersionById).toBeDefined();
  });

  it('should export executionFlowAction mutation endpoint', () => {
    expect(workFlowSlice.endpoints.executionFlowAction).toBeDefined();
  });

  it('should export executionFlowActionByGroup mutation endpoint', () => {
    expect(workFlowSlice.endpoints.executionFlowActionByGroup).toBeDefined();
  });

  it('should export getUsersMetadata query endpoint', () => {
    expect(workFlowSlice.endpoints.getUsersMetadata).toBeDefined();
  });

  it('should export getFileDownloadResponse mutation endpoint', () => {
    expect(workFlowSlice.endpoints.getFileDownloadResponse).toBeDefined();
  });

  it('should export getWorkflowSettings query endpoint', () => {
    expect(workFlowSlice.endpoints.getWorkflowSettings).toBeDefined();
  });

  it('should export updateWorkflowSettings mutation endpoint', () => {
    expect(workFlowSlice.endpoints.updateWorkflowSettings).toBeDefined();
  });

  it('should export useGetAllWorkflowsQuery hook', () => {
    const { useGetAllWorkflowsQuery } = require('../workflowSlice');
    expect(useGetAllWorkflowsQuery).toBeDefined();
    expect(typeof useGetAllWorkflowsQuery).toBe('function');
  });

  it('should configure query endpoints correctly', () => {
    const endpoint = workFlowSlice.endpoints.getAllWorkflows;
    expect(endpoint.matchPending).toBeDefined();
    expect(endpoint.matchFulfilled).toBeDefined();
    expect(endpoint.matchRejected).toBeDefined();
  });

  it('should configure mutation endpoints correctly', () => {
    expect(workFlowSlice.endpoints.createWorkflow.matchPending).toBeDefined();
    expect(workFlowSlice.endpoints.updateWorkflow.matchPending).toBeDefined();
    expect(workFlowSlice.endpoints.deleteWorkflow.matchPending).toBeDefined();
  });
});
