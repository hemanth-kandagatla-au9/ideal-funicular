import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../services/baseQuery';

interface CMDBInfo {
  osType: string;
  platform: string;
  region: string;
  serviceName: string;
  environment: string;
  sid: string;
}

interface HostServer {
  id: string;
  hostname: string;
  port: number;
  cmdb: CMDBInfo;
  isDeleted: boolean;
  updatedAt: string;
}

interface HostServerResponse {
  status: boolean;
  message: string;
  data: HostServer[];
  reason: string;
  page: number;
  limit: number;
  total: number;
  status_counts: any;
}

// const baseQuery = fetchBaseQuery({
//   baseUrl: process.env.WORKFLOW_API,
// });

export const hostServerSlice = createApi({
  reducerPath: 'hostServerAPI',
  baseQuery,
  tagTypes: ['host', 'filters'],
  endpoints: (builder) => ({
    getAllHostServers: builder.query<
      HostServerResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        platform?: string;
        environment?: string;
        serverType?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        search = '',
        platform = '',
        environment = '',
        serverType = '',
      } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          search,
          platform,
          environment,
          serverType,
        });
        return `/app-workflow/host/all?${params.toString()}`;
      },
      providesTags: ['host'],
    }),
    getAllFilters: builder.query<any, void>({
      query: () => `app-workflow/host/config`,
      providesTags: ['filters'],
    }),
  }),
});

export const { useGetAllHostServersQuery, useGetAllFiltersQuery } = hostServerSlice;
