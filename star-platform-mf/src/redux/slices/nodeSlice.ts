import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../services/baseQuery';

export const nodeSlice = createApi({
  reducerPath: 'nodeApi',
  baseQuery,
  tagTypes: ['Node', 'NodeMetadata', 'GroupConfig'],
  endpoints: (builder) => ({
    getNodes: builder.query({
      query: () => '/app-workflow/node/workflow/configuration',
    }),
    getAgentNodes: builder.query({
      query: () => '/app-workflow/node/multi-agent/configuration',
    }),
    getFieldOptions: builder.mutation({
      query: ({ property, nodeId, workflowId }) => {
        if (!property?.api?.method || !property?.api?.url) {
          throw new Error('API method or URL is missing in property');
        }
        let url = property.api.url;
        if (url.includes('<NODE_ID>')) {
          url = url.replace('<NODE_ID>', nodeId);
        }
        if (url.includes('<nodeId>')) {
          url = url.replace('<nodeId>', nodeId);
        }
        if (url.includes('<workflowId>') && workflowId) {
          url = url.replace('<workflowId>', workflowId);
        }

        // Prepare the request payload based on the property's API config
        let payload: {
          nodeId?: string;
          workflowId?: string;
          baseUrl?: string;
        } = {};
        if (property.api.payload) {
          payload = { ...property.api.payload };

          // Replace payload placeholders
          if (payload.nodeId === '<nodeId>') {
            payload.nodeId = nodeId;
          }
          if (payload.workflowId === '<workflowId>') {
            payload.workflowId = workflowId;
          }
          if (payload.baseUrl === '<baseUrl>') {
            payload.baseUrl = process.env.WORKFLOW_API;
          }
        }

        const method = property.api.method.toUpperCase();
        if (method === 'GET') {
          return {
            url: url,
            method: 'GET',
          };
        }

        return {
          url: url,
          method,
          body: payload,
        };
      },
    }),
    getFieldValue: builder.mutation({
      query: ({ property, nodeID, workflowId }) => {
        if (!property?.api?.method || !property?.api?.url) {
          throw new Error('API method or URL is missing in property');
        }
        // Prepare the request payload based on the property's API config
        const payload = { nodeID: nodeID, workflowId, baseUrl: process.env.ORCHESTRATO_BASE_URL };
        const url = process.env.ORCHESTRATO_BASE_URL + property?.api?.url;
        const method = property.api.method.toUpperCase();
        return {
          url: url,
          method,
          body: payload,
        };
      },
    }),
    uploadFile: builder.mutation({
      query: ({ file, filePath, servers, overwrite }) => {
        const formData = new FormData();
        let hostnamesArray = [];
        const hostnames = [];
        if (servers) {
          hostnamesArray = servers
            .split(',')
            .map((hostname: string) => hostname.trim())
            .filter((hostname: string) => hostname.length > 0);
        }
        if (hostnamesArray.length > 0) {
          hostnames.push(
            ...hostnamesArray.map((hostname: string) => ({
              hostname: hostname,
              port: '20101',
            }))
          );
        }
        formData.append('file', file);
        formData.append('filePath', filePath ? filePath : file.name);
        formData.append('servers', JSON.stringify(hostnames));
        formData.append('overwrite', overwrite ? 'true' : 'false');
        // formData.append('nodeId', nodeId || '');
        // formData.append('workflowId', workflowId || '');

        return {
          url: '/app-workflow/Files',
          method: 'POST',
          body: formData,
        };
      },
    }),
    runNode: builder.mutation({
      query: ({ data }) => ({
        url: `/app-workflow/node/executenode`,
        method: 'POST',
        body: data,
      }),
    }),

    getNodeMetadata: builder.query<
      {
        data: {
          groupName: string;
          nodeCount: number;
        }[];
      },
      { search?: string }
    >({
      query: ({ search }) => ({
        url: '/app-workflow/node/metadata',
        method: 'GET',
        params: search ? { search } : {},
      }),
      providesTags: ['NodeMetadata'],
    }),

    getGroupConfig: builder.query<
      {
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      },
      {
        groupName: string;
        page?: number;
        limit?: number;
        search?: string;
      }
    >({
      query: ({ groupName, page = 1, limit = 10, search }) => {
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        return {
          url: `/app-workflow/node/group-config?group_name=${encodeURIComponent(groupName)}&page=${page}&limit=${limit}${searchParam}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, { groupName }) => [{ type: 'GroupConfig', id: groupName }],
    }),
  }),
});

export const {
  useGetNodesQuery,
  useGetFieldOptionsMutation,
  useGetFieldValueMutation,
  useGetAgentNodesQuery,
  useRunNodeMutation,
  useGetNodeMetadataQuery,
  useGetGroupConfigQuery,
  useUploadFileMutation,
} = nodeSlice;
