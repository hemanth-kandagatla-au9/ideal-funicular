/* eslint-disable @typescript-eslint/no-require-imports */
import { nodeManagementSlice } from '../nodeManagementSlice';

describe('nodeManagementSlice', () => {
  it('should have correct reducer path', () => {
    expect(nodeManagementSlice.reducerPath).toBe('nodeManagementApi');
  });

  it('should export getManagementNodes query endpoint', () => {
    expect(nodeManagementSlice.endpoints.getManagementNodes).toBeDefined();
  });

  it('should export getNodeById query endpoint', () => {
    expect(nodeManagementSlice.endpoints.getNodeById).toBeDefined();
  });

  it('should export toggleNodeActive mutation endpoint', () => {
    expect(nodeManagementSlice.endpoints.toggleNodeActive).toBeDefined();
  });

  it('should export createNode mutation endpoint', () => {
    expect(nodeManagementSlice.endpoints.createNode).toBeDefined();
  });

  it('should export updateNode mutation endpoint', () => {
    expect(nodeManagementSlice.endpoints.updateNode).toBeDefined();
  });

  it('should export deleteNode mutation endpoint', () => {
    expect(nodeManagementSlice.endpoints.deleteNode).toBeDefined();
  });

  it('should export useGetManagementNodesQuery hook', () => {
    const { useGetManagementNodesQuery } = require('../nodeManagementSlice');
    expect(useGetManagementNodesQuery).toBeDefined();
    expect(typeof useGetManagementNodesQuery).toBe('function');
  });

  it('should export useGetNodeByIdQuery hook', () => {
    const { useGetNodeByIdQuery } = require('../nodeManagementSlice');
    expect(useGetNodeByIdQuery).toBeDefined();
    expect(typeof useGetNodeByIdQuery).toBe('function');
  });

  it('should export useToggleNodeActiveMutation hook', () => {
    const { useToggleNodeActiveMutation } = require('../nodeManagementSlice');
    expect(useToggleNodeActiveMutation).toBeDefined();
    expect(typeof useToggleNodeActiveMutation).toBe('function');
  });

  it('should export useCreateNodeMutation hook', () => {
    const { useCreateNodeMutation } = require('../nodeManagementSlice');
    expect(useCreateNodeMutation).toBeDefined();
    expect(typeof useCreateNodeMutation).toBe('function');
  });

  it('should export useUpdateNodeMutation hook', () => {
    const { useUpdateNodeMutation } = require('../nodeManagementSlice');
    expect(useUpdateNodeMutation).toBeDefined();
    expect(typeof useUpdateNodeMutation).toBe('function');
  });

  it('should export useDeleteNodeMutation hook', () => {
    const { useDeleteNodeMutation } = require('../nodeManagementSlice');
    expect(useDeleteNodeMutation).toBeDefined();
    expect(typeof useDeleteNodeMutation).toBe('function');
  });

  it('should configure query endpoints correctly', () => {
    const endpoint = nodeManagementSlice.endpoints.getManagementNodes;
    expect(endpoint.matchPending).toBeDefined();
    expect(endpoint.matchFulfilled).toBeDefined();
    expect(endpoint.matchRejected).toBeDefined();
  });

  it('should configure mutation endpoints correctly', () => {
    expect(nodeManagementSlice.endpoints.createNode.matchPending).toBeDefined();
    expect(nodeManagementSlice.endpoints.updateNode.matchPending).toBeDefined();
    expect(nodeManagementSlice.endpoints.deleteNode.matchPending).toBeDefined();
  });
});
