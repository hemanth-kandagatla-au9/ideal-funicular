import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { SideBarConfigNodeType } from "../../types";
import { baseQuery } from '../../services/baseQuery';

export const nodeManagementSlice = createApi({
  reducerPath: 'nodeManagementApi',
  baseQuery,
  tagTypes: ['ManagementNodes'],
  endpoints: (builder) => ({
    // getManagementNodes: builder.query<SideBarConfigNodeType, { page: number; limit: number;search:string }>({
    //   query: ({ page, limit,search}) => ({
    //     url: "/app-workflow/manage-nodes/configuration/",
    //     params: {
    //       page,
    //       limit,
    //       ...(search ? { search } : {}),
    //     },
    //   }),
    //   providesTags: ["ManagementNodes"],
    // }),
    getManagementNodes: builder.query<
      '',
      {
        page: number;
        limit: number;
        search?: string;
        group?: string;
        isNodeActive?: boolean;
        isNodeInUse?: boolean;
      }
    >({
      query: ({ page, limit, search, group, isNodeActive, isNodeInUse }) => ({
        url: '/app-workflow/manage-nodes/configuration/',
        params: {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(group ? { group } : {}),
          ...(isNodeActive !== undefined ? { isNodeActive } : {}),
          ...(isNodeInUse !== undefined ? { isNodeInUse } : {}),
        },
      }),
      providesTags: ['ManagementNodes'],
    }),

    getNodeById: builder.query({
      query: (nodeId) => ({
        url: `/app-workflow/manage-nodes/configuration`,
        method: 'GET',
        params: {
          node_id: nodeId,
        },
      }),
    }),

    toggleNodeActive: builder.mutation({
      query: ({ nodeId, action }) => ({
        url: `/app-workflow/manage-nodes/configuration/${action}`,
        method: 'PATCH',
        params: {
          node_id: nodeId,
        },
      }),
      invalidatesTags: ['ManagementNodes'],
    }),
    createNode: builder.mutation({
      query: (payload) => ({
        url: '/app-workflow/manage-nodes/configuration',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['ManagementNodes'],
    }),

    updateNode: builder.mutation({
      query: ({ nodeId, payload }) => ({
        url: `/app-workflow/manage-nodes/configuration`,
        method: 'PUT',
        body: payload,
        params: {
          node_id: nodeId,
        },
      }),
      invalidatesTags: ['ManagementNodes'],
    }),

    deleteNode: builder.mutation({
      query: (nodeId) => ({
        url: `/app-workflow/manage-nodes/configuration`,
        method: 'DELETE',
        params: {
          node_id: nodeId,
        },
      }),
      invalidatesTags: ['ManagementNodes'],
    }),
  }),
});

export const {
  useGetManagementNodesQuery,
  useDeleteNodeMutation,
  useGetNodeByIdQuery,
  useToggleNodeActiveMutation,
  useCreateNodeMutation,
  useUpdateNodeMutation,
} = nodeManagementSlice;
