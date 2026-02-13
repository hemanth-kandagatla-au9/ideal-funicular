import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../services/baseQuery';

export const scriptsSlice = createApi({
  reducerPath: 'ScriptsApi',
  baseQuery,
  tagTypes: ['Scripts', 'Capabilities'],
  endpoints: (builder) => ({
    getAllScripts: builder.query({
      // Supports search, filter, sort via params
      query: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return `/app-workflow/scripts/all${query ? `?${query}` : ''}`;
      },
      providesTags: ['Scripts'],
    }),
    getScriptById: builder.query({
      query: (script_id) => `/app-workflow/scripts/get/${script_id}`,
      providesTags: ['Scripts'],
    }),
    getScriptVersion: builder.query({
      query: ({ script_id, version }) =>
        `/app-workflow/scripts/get-version/${script_id}/${version}`,
      providesTags: ['Scripts'],
    }),
    createScript: builder.mutation({
      query: (payload) => ({
        url: '/app-workflow/scripts/create',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Scripts'],
    }),
    addScriptVersion: builder.mutation({
      query: ({ script_id, ...payload }) => ({
        url: `/app-workflow/scripts/add-version/${script_id}`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Scripts'],
    }),
    deleteScript: builder.mutation({
      query: (script_id) => ({
        url: `/app-workflow/scripts/delete/${script_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Scripts'],
    }),
    setActiveScriptVersion: builder.mutation({
      query: ({ script_id, version }) => ({
        url: `/app-workflow/scripts/set-active-version/${script_id}/${version}`,
        method: 'POST',
      }),
      invalidatesTags: ['Scripts'],
    }),
    getAllCapabilities: builder.query({
      query: (params: {
        page: number;
        limit: number;
        search?: string;
        capabilityType?: string;
        group?: string;
        isCapabilityActive?: boolean;
        isCapabilityInUse?: boolean;
        sort_by?: string;
      }) => {
        const {
          page,
          limit,
          search,
          capabilityType,
          group,
          isCapabilityActive,
          isCapabilityInUse,
          sort_by,
        } = params || ({} as any);

        const usp = new URLSearchParams();
        usp.set('page', String(page));
        usp.set('limit', String(limit));
        if (search) usp.set('search', search);
        if (capabilityType) usp.set('capabilityType', capabilityType);
        if (group) usp.set('group', group);
        if (typeof isCapabilityActive === 'boolean')
          usp.set('isCapabilityActive', String(isCapabilityActive));
        if (typeof isCapabilityInUse === 'boolean')
          usp.set('isCapabilityInUse', String(isCapabilityInUse));
        if (sort_by) usp.set('sort_by', sort_by);

        const q = usp.toString();
        return `/app-workflow/capabilities/all${q ? `?${q}` : ''}`;
      },
      providesTags: ['Capabilities'],
    }),
    createCapability: builder.mutation({
      query: ({ payload, email }) => ({
        url: `/app-workflow/capabilities/create${email ? `?email=${encodeURIComponent(email)}` : ''}`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Capabilities'],
    }),
    updateCapability: builder.mutation({
      query: ({ payload, email }) => {
        const { id, versions_type, defaultversion, ...body } = payload;
        let url = `/app-workflow/capabilities/update_by_id?capability_id=${id}`;

        if (versions_type) {
          url += `&versions_type=${versions_type}`;
        }
        if (defaultversion) {
          url += `&defaultversion=${defaultversion}`;
        }
        if (email) {
          url += `&email=${encodeURIComponent(email)}`;
        }

        return {
          url,
          method: 'PUT',
          body,
        };
      },
    }),
    deleteCapability: builder.mutation({
      query: (capability_id) => ({
        url: `/app-workflow/capabilities/delete?capability_id=${capability_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Capabilities'],
    }),
    getAllProperties: builder.query({
      query: () => {
        return `/app-workflow/capabilities/properties/all`;
      },
    }),
    getCapabilitiesById: builder.query({
      query: (capability_id) => {
        return `/app-workflow/capabilities/get_by_id?capability_id=${capability_id}`;
      },
    }),
    getCapabilitiesVersionsById: builder.query({
      query: ({ capability_id, versionNumber }) => {
        let url = `/app-workflow/capabilities/versions/get_by_id?capability_id=${capability_id}`;
        if (versionNumber !== undefined && versionNumber !== null && versionNumber !== '') {
          url += `&versionNumber=${versionNumber}`;
        }
        return url;
      },
      providesTags: ['Capabilities'],
    }),
  }),
});

export const {
  useGetAllScriptsQuery,
  useGetScriptByIdQuery,
  useGetScriptVersionQuery,
  useCreateScriptMutation,
  useAddScriptVersionMutation,
  useDeleteScriptMutation,
  useSetActiveScriptVersionMutation,
  useGetAllCapabilitiesQuery,
  useCreateCapabilityMutation,
  useUpdateCapabilityMutation,
  useDeleteCapabilityMutation,
  useGetAllPropertiesQuery,
  useGetCapabilitiesByIdQuery,
  useGetCapabilitiesVersionsByIdQuery,
} = scriptsSlice;
