import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../services/baseQuery';

// const baseQuery = fetchBaseQuery({
//   baseUrl: process.env.WORKFLOW_API,
// });

// const orchestratoBaseQuery = fetchBaseQuery({
//   baseUrl: process.env.ORCHESTRATO_BASE_URL,
// });

// const rustApiBaseQuery = fetchBaseQuery({
//   baseUrl: process.env.REACT_APP_RUST_API,
// });

export const settingSlice = createApi({
  reducerPath: 'settingApi',
  baseQuery,
  tagTypes: ['ServerSetting', 'CategorySetting', 'ServerMetadata', 'ApprovalSetting'],
  endpoints: (builder) => ({
    getAllServerDetails: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        search?: string;
        region?: string;
        environment?: string;
      }
    >({
      query: ({ page = 1, limit = 10, search, region, environment } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (search) params.append('search', search);
        if (region) params.append('region', region);
        if (environment) params.append('environment', environment);
        return `/app-workflow/host/all?${params.toString()}`;
      },
      providesTags: ['ServerSetting'],
    }),
    getServerMetadata: builder.query<any, void>({
      query: () => ({
        url: '/app-workflow/host/metadata',
        method: 'GET',
      }),
      providesTags: ['ServerMetadata'],
    }),
    createServer: builder.mutation({
      query: (payload) => ({
        url: '/app-workflow/host',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['ServerSetting'],
    }),
    updateServer: builder.mutation({
      query: (payload) => ({
        url: `/app-workflow/host/${payload.id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['ServerSetting'],
    }),
    deleteServer: builder.mutation({
      query: (id) => ({
        url: `/app-workflow/host/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ServerSetting'],
    }),
    getAllWorkflowCategoryDetails: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        search?: string;
        sort_by?: string;
      }
    >({
      query: ({ page = 1, limit = 10, search, sort_by } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          sort_by: String(sort_by),
        });
        if (search) params.append('search', search);
        if (sort_by) params.append('region', sort_by);
        return `/app-workflow/category/all?${params.toString()}`;
      },
      providesTags: ['CategorySetting'],
    }),
    createWorkflowCategory: builder.mutation({
      query: (payload) => ({
        url: '/app-workflow/category',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['CategorySetting'],
    }),
    updateWorkflowCategory: builder.mutation({
      query: (payload) => ({
        url: `/app-workflow/category`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['CategorySetting'],
    }),
    deleteWorkflowCategory: builder.mutation({
      query: (id) => ({
        url: `/app-workflow/category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CategorySetting'],
    }),

    getApprovalSettings: builder.query<any, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          search: search || '',
        });
        return {
          url: `/app-workflow/approval-settings/all?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['ApprovalSetting'],
    }),

    getApprovalSettingsByID: builder.query<any, string>({
      query: (id) => ({
        url: `/app-workflow/approval-settings/${id}`,
        method: 'GET',
      }),
      providesTags: ['ApprovalSetting'],
    }),

    createApprovalSetting: builder.mutation({
      query: (payload) => ({
        url: '/app-workflow/approval-settings',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['ApprovalSetting'],
    }),

    updateApprovalSetting: builder.mutation({
      query: (payload) => ({
        url: `/app-workflow/approval-settings/${payload.id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['ApprovalSetting'],
    }),
    deleteApprovalSetting: builder.mutation({
      query: (id) => ({
        url: `/app-workflow/approval-settings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ApprovalSetting'],
    }),

    metadataApprovalSetting: builder.query<any, any>({
      query: () => ({
        url: '/app-workflow/approval-settings/metadata',
        method: 'GET',
      }),
      providesTags: ['ApprovalSetting'],
    }),
  }),
});

export const {
  useGetAllServerDetailsQuery,
  useGetServerMetadataQuery,
  useCreateServerMutation,
  useUpdateServerMutation,
  useDeleteServerMutation,
  useGetAllWorkflowCategoryDetailsQuery,
  useCreateWorkflowCategoryMutation,
  useUpdateWorkflowCategoryMutation,
  useDeleteWorkflowCategoryMutation,
  useGetApprovalSettingsQuery,
  useGetApprovalSettingsByIDQuery,
  useCreateApprovalSettingMutation,
  useUpdateApprovalSettingMutation,
  useDeleteApprovalSettingMutation,
  useMetadataApprovalSettingQuery,
} = settingSlice;
