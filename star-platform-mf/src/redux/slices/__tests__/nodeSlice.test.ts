/* eslint-disable @typescript-eslint/no-require-imports */
import { nodeSlice } from '../nodeSlice';

describe('nodeSlice', () => {
  it('should have correct reducer path', () => {
    expect(nodeSlice.reducerPath).toBe('nodeApi');
  });

  it('should export getNodes query endpoint', () => {
    expect(nodeSlice.endpoints.getNodes).toBeDefined();
  });

  it('should export getAgentNodes query endpoint', () => {
    expect(nodeSlice.endpoints.getAgentNodes).toBeDefined();
  });

  it('should export getFieldOptions mutation endpoint', () => {
    expect(nodeSlice.endpoints.getFieldOptions).toBeDefined();
  });

  it('should export getFieldValue mutation endpoint', () => {
    expect(nodeSlice.endpoints.getFieldValue).toBeDefined();
  });

  it('should export uploadFile mutation endpoint', () => {
    expect(nodeSlice.endpoints.uploadFile).toBeDefined();
  });

  it('should export runNode mutation endpoint', () => {
    expect(nodeSlice.endpoints.runNode).toBeDefined();
  });

  it('should export getNodeMetadata query endpoint', () => {
    expect(nodeSlice.endpoints.getNodeMetadata).toBeDefined();
  });

  it('should export getGroupConfig query endpoint', () => {
    expect(nodeSlice.endpoints.getGroupConfig).toBeDefined();
  });

  it('should export useGetNodesQuery hook', () => {
    const { useGetNodesQuery } = require('../nodeSlice');
    expect(useGetNodesQuery).toBeDefined();
    expect(typeof useGetNodesQuery).toBe('function');
  });

  it('should export useGetAgentNodesQuery hook', () => {
    const { useGetAgentNodesQuery } = require('../nodeSlice');
    expect(useGetAgentNodesQuery).toBeDefined();
    expect(typeof useGetAgentNodesQuery).toBe('function');
  });

  it('should export useGetFieldOptionsMutation hook', () => {
    const { useGetFieldOptionsMutation } = require('../nodeSlice');
    expect(useGetFieldOptionsMutation).toBeDefined();
    expect(typeof useGetFieldOptionsMutation).toBe('function');
  });

  it('should export useUploadFileMutation hook', () => {
    const { useUploadFileMutation } = require('../nodeSlice');
    expect(useUploadFileMutation).toBeDefined();
    expect(typeof useUploadFileMutation).toBe('function');
  });

  it('should export useRunNodeMutation hook', () => {
    const { useRunNodeMutation } = require('../nodeSlice');
    expect(useRunNodeMutation).toBeDefined();
    expect(typeof useRunNodeMutation).toBe('function');
  });

  it('should configure query endpoints correctly', () => {
    const endpoint = nodeSlice.endpoints.getNodes;
    expect(endpoint.matchPending).toBeDefined();
    expect(endpoint.matchFulfilled).toBeDefined();
    expect(endpoint.matchRejected).toBeDefined();
  });

  it('should configure mutation endpoints correctly', () => {
    expect(nodeSlice.endpoints.runNode.matchPending).toBeDefined();
    expect(nodeSlice.endpoints.uploadFile.matchPending).toBeDefined();
  });
});
