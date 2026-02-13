// services/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../services/baseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<any, void>({
      query: () => ({
        url: '/app-workflow/login',
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
