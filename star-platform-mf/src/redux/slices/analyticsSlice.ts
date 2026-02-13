import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../services/baseQuery';

export const analyticsApi = createApi({
  reducerPath: 'analyticsApi',
  baseQuery,
  endpoints: (builder) => ({
    getAllDashboardData: builder.query<any, void>({
      query: () => 'app-workflow/analytics/dashboard',
    }),
  }),
});

export const { useGetAllDashboardDataQuery } = analyticsApi;
