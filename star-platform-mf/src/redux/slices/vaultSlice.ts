import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../services/baseQuery';

export const vaultSlice = createApi({
  reducerPath: 'vaultApi',
  baseQuery,
  tagTypes: ['Vault'],
  endpoints: (builder) => ({
    getAllVaults: builder.query({
      query: ({ page = 1, limit = 10 }) => `/app-workflow/vault/all?page=${page}&limit=${limit}`,
      providesTags: ['Vault'],
    }),
    getVaultConfig: builder.query({
      query: () => '/app-workflow/vault/configuration',
      providesTags: ['Vault'],
    }),
    createVault: builder.mutation({
      query: (payload) => ({
        url: '/app-workflow/vault',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Vault'],
    }),
    updateVault: builder.mutation({
      query: (payload) => ({
        url: '/app-workflow/vault',
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['Vault'],
    }),
    deleteVault: builder.mutation({
      query: (payload) => ({
        url: '/app-workflow/vault',
        method: 'DELETE',
        body: payload,
      }),
      invalidatesTags: ['Vault'],
    }),
  }),
});

export const {
  useGetVaultConfigQuery,
  useCreateVaultMutation,
  useGetAllVaultsQuery,
  useDeleteVaultMutation,
  useUpdateVaultMutation,
} = vaultSlice;
