import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../services/baseQuery';
import { rejects } from 'assert';
import { isRejectedWithValue } from '@reduxjs/toolkit';

export const approvalSlice = createApi({
  reducerPath: 'approvalApi',
  baseQuery,
  tagTypes: ['approvalRequests', 'approvalStatus'],
  endpoints: (builder) => ({
    getAllApprovalRequests: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
      }
    >({
      query: ({ page = 1, limit = 10, search, status } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        return `/app-workflow/request-approval/requests/all?${params.toString()}`;
      },
      providesTags: ['approvalRequests'],
    }),
    ApproveRequest: builder.mutation({
      query: (payload) => ({
        url: `/app-workflow/request-approval/${payload.id}/approve/${payload.version}?level=${payload.level}`,
        method: 'POST',
      }),
      invalidatesTags: ['approvalRequests', 'approvalStatus'],
    }),

    RejectRequest: builder.mutation({
      query: (payload) => ({
        url: `/app-workflow/request-approval/${payload.id}/reject/${payload.version}?level=${payload.level}`,
        method: 'POST',
      }),
      invalidatesTags: ['approvalRequests', 'approvalStatus'],
    }),

    publishWorkflow: builder.mutation({
      query: (payload) => ({
        url: `/app-workflow/request-approval/${payload.id}/publish/${payload.version}`,
        method: 'POST',
      }),
      invalidatesTags: ['approvalRequests', 'approvalStatus'],
    }),
  }),
});

export const {
  useGetAllApprovalRequestsQuery,
  useApproveRequestMutation,
  useRejectRequestMutation,
  usePublishWorkflowMutation,
} = approvalSlice;
