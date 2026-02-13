import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

// Standalone-compatible header logic
const prepareStandaloneHeaders = (headers: Headers, args: FetchArgs) => {
  const idToken = sessionStorage.getItem('msal_id_token');
  const accessToken = sessionStorage.getItem('msal_access_token');

  // Standalone workflow uses ID_TOKEN as Bearer
  if (idToken) {
    headers.set('Authorization', `Bearer ${idToken}`);
    headers.set('accessToken', `${accessToken || ''}`);
  }

  // REMOVE Content-Type for GET requests to avoid preflight
  if (!args?.method || args.method.toUpperCase() === 'GET') {
    headers.delete('Content-Type');
  }

  return headers;
};

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const raw = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_WORKFLOW_API,
    // "https://workflow-sbx.ai.apps.jnj.com/api/app-workflow",
    prepareHeaders: (headers) => prepareStandaloneHeaders(headers, args as FetchArgs),
    credentials: 'omit', // EXACTLY like standalone
  });

  return raw(args, api, extraOptions);
};
