type PdfClickAnalyticsParams = {
  workflowId: string;
  executionId: string;
};

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

export const workFlowSlice = createApi({
  reducerPath: 'workflowApi',
  baseQuery,
  tagTypes: ['Workflow', 'Execution'],
  endpoints: (builder) => ({
    getAllWorkflows: builder.query<
      any,
      {
        page?: number;
        limit?: number;
        isActive?: boolean;
        status?: string;
        search?: string;
        department?: string;
        startDate?: string;
        endDate?: string;
        workflowId?: string;
        is_executed?: boolean;
        category?: string;
        triggerType?: string;
        sort_by?: string;
        isFavorite?: boolean;
        username?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        isActive,
        status,
        search,
        department,
        startDate,
        endDate,
        workflowId,
        is_executed,
        category,
        triggerType,
        sort_by,
        isFavorite,
        username,
      } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (is_executed) params.append('is_executed', String(is_executed));
        if (status && status.toLowerCase() !== 'all') params.append('status_info', status);
        if (typeof isActive !== 'undefined') params.append('isActive', String(isActive));
        if (search) params.append('search', search);
        if (department) params.append('department', department);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (workflowId) params.append('workflow_id', workflowId);
        if (category) params.append('category', category);
        if (triggerType) params.append('triggerType', triggerType);
        if (sort_by) params.append('sort_by', sort_by);
        if (typeof isFavorite !== 'undefined') params.append('isFavorite', String(isFavorite));
        if (username) params.append('username', username);

        return `/app-workflow/workflow/all?${params.toString()}`;
      },
      providesTags: ['Workflow'],
    }),

    getWorkflowById: builder.query({
      query: (id) => `/app-workflow/workflow/${id}`,
      providesTags: (result, error, id) => [{ type: 'Workflow', id }],
    }),

    //rust api
    // getRetryExecutions: builder.mutation({
    //   async queryFn({ executionId, workflowId }, _queryApi, _extraOptions, _baseQuery) {
    //     const username = process.env.REACT_APP_AGENT_USERNAME;
    //     const password = process.env.REACT_APP_AGENT_PASSWORD;
    //     const encodedCredentials = btoa(`${username}:${password}`);
    //     const result = await rustApiBaseQuery(
    //       {
    //         url: `/flow/${executionId}/resume`,
    //         method: "PUT",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Basic ${encodedCredentials}`,
    //         },
    //       },
    //       _queryApi,
    //       _extraOptions
    //     );
    //     return result;
    //   },
    //   invalidatesTags: ["Execution"],
    // }),

    getRetryExecutions: builder.mutation({
      async queryFn({ executionId, workflowId }, _queryApi, _extraOptions, _baseQuery) {
        const result = await baseQuery(
          {
            url: `/app-workflow/execution/resume_flow?execution_id=${executionId}`,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          },
          _queryApi,
          _extraOptions
        );
        return result;
      },
      invalidatesTags: ['Execution'],
    }),
    getPdfClickAnalytics: builder.query<any, PdfClickAnalyticsParams>({
      query: ({ workflowId, executionId }) =>
        `app-workflow/execution/summary?workflowId=${workflowId}&executionId=${executionId}`,
    }),
    getScheduleTriggerData: builder.query<
      any,
      { page: number; limit: number; schedule_type?: string; search?: string }
    >({
      query: ({ page, limit, schedule_type = '', search }) =>
        `app-workflow/schedule/scheduled/all?page=${page}&limit=${limit}&schedule_type=${schedule_type}&search=${search}`,
    }),

    // getRetryExecutions: builder.mutation({
    //   query: ({  executionId, workflowId  }) => ({
    //     url: `/app-workflow/execution/resume_flow?execution_id=${executionId}`,
    //     method: "PUT",
    //   }),
    //   invalidatesTags: (result, error, { id }) => [{ type: "Workflow", id }, "Workflow"],
    // }),

    // createWorkflow: builder.mutation({
    //   query: (newWorkflow) => ({
    //     url: "/app-workflow/workflow",
    //     method: "POST",
    //     body: newWorkflow,
    //   }),
    //   invalidatesTags: ["Workflow"],
    // }),
    // createWorkflow: builder.mutation({
    //   query: ({ payload, version_type }) => {
    //     const queryParams = new URLSearchParams();
    //     if (version_type) {
    //       queryParams.append("version_type", version_type);
    //     }

    //     console.log("versionNumber", version_type, "payload", payload);

    //     return {
    //       url: `/app-workflow/workflow${queryParams.toString() ? `?${queryParams.toString()}` : ""}`,
    //       method: "POST",
    //       body: payload,
    //     };
    //   },
    //   invalidatesTags: ["Workflow"],
    // }),
    createWorkflow: builder.mutation({
      query: ({
        payload,
        //  ,flowType
      }) => {
        const url = '/app-workflow/workflow';
        console.log('payload slice', payload);
        // if (flowType) {
        //   url += `?flowType=${encodeURIComponent(flowType)}`;
        // }
        return {
          url,
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: ['Workflow'],
    }),

    workflowBookmark: builder.mutation({
      query: (payload) => {
        return {
          url: '/app-workflow/favorites/toggle',
          method: 'POST',
          body: payload,
        };
      },
      invalidatesTags: ['Workflow'],
    }),
    validateWorkflow: builder.mutation({
      query: (data) => ({
        url: '/app-workflow/workflow/validate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Workflow', id }, 'Workflow'],
    }),

    updateWorkflow: builder.mutation({
      query: (data) => {
        const {
          default_version,
          version_type,
          // flowType,
          ...bodyData
        } = data;
        let url = '/app-workflow/workflow';

        const queryParams = new URLSearchParams();

        if (default_version !== undefined && default_version !== '') {
          queryParams.append('default_version', default_version);
        }

        // Only add version_type if it's provided and not empty
        if (version_type !== undefined && version_type !== '') {
          queryParams.append('version_type', version_type);
        }

        // if (flowType) {
        //   queryParams.append("flowType", flowType);
        // }

        // Add query params only if at least one exists
        if (queryParams.toString()) {
          url += `?${queryParams.toString()}`;
        }
        // console.log("api", bodyData);

        return {
          url,
          method: 'PUT',
          body: Object.keys(bodyData.payload).length ? bodyData.payload : undefined, // Only send body if not empty
        };
      },
      invalidatesTags: ['Workflow'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const { default_version, workflowId, page, limit } = arg || {};

        // Only run optimistic update if all required fields exist
        if (default_version && workflowId && page && limit) {
          const patchResult = dispatch(
            workFlowSlice.util.updateQueryData(
              'getWorkflowVersionById',
              { id: workflowId, page, limit },
              (draft) => {
                if (Array.isArray(draft)) {
                  draft.forEach((item) => {
                    item.isdefault = item.versionNumber === default_version;
                  });
                } else if (draft?.data) {
                  draft.data.forEach((item: any) => {
                    item.isdefault = item.versionNumber === default_version;
                  });
                }
              }
            )
          );

          try {
            await queryFulfilled;
          } catch {
            patchResult.undo();
          }
        } else {
          // No optimistic update — normal behavior
          await queryFulfilled;
        }
      },

      // invalidatesTags: (result, error, { id }) => [{ type: "Workflow", id }, "Workflow"],
    }),

    deleteWorkflow: builder.mutation({
      query: (id) => ({
        url: `/app-workflow/workflow/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Workflow'],
    }),

    manualTriggerWorkflow: builder.mutation({
      query: ({ id, hostnames, SIDs, triggeredBy, runtimeVariables, changeNumber }) => ({
        url: `/app-workflow/workflow/execute_trigger?workflow_id=${id}`,
        method: 'POST',
        body: {
          triggeredBy,
          ...(SIDs ? { SIDs } : { hostnames }),
          ...(runtimeVariables ? { runtimeVariables } : {}),
          ...(changeNumber ? { changeNumber } : {}),
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Workflow', id }, 'Workflow'],
    }),

    updateWorkflowIsActive: builder.mutation({
      query: ({ id, is_active }) => ({
        url: `/app-workflow/workflow/execute?workflow_id=${id}&is_active=${is_active}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Workflow', id }, 'Workflow'],
    }),

    getAllExecutions: builder.query({
      query: ({
        workflowId,
        page = 1,
        limit = 10,
        search,
        status,
        startDate,
        endDate,
        versionNumber,
        triggeredBy,
      }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (workflowId) params.append('workflowId', workflowId);
        if (status) params.append('status', status);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (search) params.append('execution_id', search);
        if (versionNumber) params.append('versionNumber', versionNumber);
        if (triggeredBy) params.append('triggeredBy', triggeredBy);

        return `/app-workflow/execution/all?${params.toString()}`;
      },
      providesTags: ['Execution'],
    }),

    getAllExecutionsByWfId: builder.query({
      query: ({ workflowId, page = 1, limit = 10 }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (workflowId) params.append('workflowId', workflowId);
        return `/app-workflow/execution/executions_by_wf_id?${params.toString()}`;
      },
      providesTags: ['Execution'],
    }),

    getExecutionById: builder.query({
      query: ({ executionId, workflowId, version }) => {
        const params = new URLSearchParams({
          execution_id: executionId,
          workflowId: workflowId,
          versionNumber: version || '',
        });
        return `/app-workflow/execution/get_execution?${params.toString()}`;
      },
      providesTags: ['Execution'],
    }),

    // getAllNodes: builder.query({
    //   query: ({ executionId = 1, status, search }) =>
    //     `/app-workflow/node/execution/log?execution_id=${executionId}&required_status=${status}&search=${search}`,
    //   providesTags: ["Execution"],
    // }),

    getAllNodes: builder.query({
      query: ({ displayId = 1, status, search }) =>
        `/app-workflow/node/execution/metadatalogs?display_id=${displayId}&required_status=${status}&search=${search}`,
      providesTags: ['Execution'],
    }),
    getNodeLogs: builder.query({
      query: ({ executionId, nodeId, email }) =>
        `/app-workflow/node/execution/logs?executionId=${executionId}&nodeId=${nodeId}&email=${email}`,
      providesTags: ['Execution'],
    }),

    getWorkflowVersionById: builder.query({
      query: ({ id, page, limit }) => ({
        url: `/app-workflow/workflow/all/versions/${id}`,
        params: { page, limit }, // Send pagination params to backend
      }),
      providesTags: (result, error, { id }) => [{ type: 'Workflow', id }],
    }),

    getVersionById: builder.query({
      query: ({ id, version, email }) => {
        let url = `/app-workflow/workflow/version/${id}?versionNumber=${version}`;
        if (email !== undefined) {
          url += `&email=${encodeURIComponent(email)}`;
        }
        return { url };
      },
      // providesTags: (result, error, { id }) => [{ type: "Workflow", id }],
    }),

    executionFlowAction: builder.mutation({
      async queryFn(
        { flowInstanceId, action, nodeId, reason, body },
        _queryApi,
        _extraOptions,
        _baseQuery
      ) {
        try {
          let queryParams = `flow_instance_id=${flowInstanceId}&action=${action}`;

          // If nodeId exists, append nodeId and reason (empty string if not provided)
          if (nodeId) {
            queryParams += `&nodeId=${nodeId}&reason=${reason ?? ''}`;
          }

          const requestConfig = {
            url: `/app-workflow/execution/control_flow?${queryParams}`,
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            ...(body ? { body: JSON.stringify(body) } : {}), // include body only if exists
          };
          const result = await baseQuery(requestConfig, _queryApi, _extraOptions);

          return result;
        } catch (error) {
          return {
            error: { status: 500, data: 'Failed to perform execution flow action' },
          };
        }
      },
      invalidatesTags: ['Execution'],
    }),

    executionFlowActionByGroup: builder.mutation({
      async queryFn({ groupId, action }, _queryApi, _extraOptions, _baseQuery) {
        try {
          const result = await baseQuery(
            {
              url: `/app-workflow/execution/group_control?group_id=${groupId}&action=${action}`,
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
            },
            _queryApi,
            _extraOptions
          );

          return result;
        } catch (error) {
          return {
            error: { status: 500, data: 'Failed to perform execution flow action' },
          };
        }
      },
      invalidatesTags: ['Execution'],
    }),

    getUsersMetadata: builder.query<any, void>({
      query: () => ({
        url: '/app-workflow/execution/users_metadata',
        method: 'GET',
      }),
      // providesTags: (result, error, { id }) => [{ type: "Workflow", id }],
    }),
    getFileDownloadResponse: builder.mutation({
      query: ({ nodeId, workflowId }) => ({
        url: `/app-workflow/Files/Downloadresponse?nodeId=${nodeId}&workflowId=${workflowId}`,
        method: 'GET',
      }),
    }),

    getWorkflowSettings: builder.query({
      query: (workflowId) => ({
        url: `/app-workflow/workflow/settings/getsettings?workflow_id=${workflowId}`,
        method: 'GET',
      }),
      // providesTags: (result, error, { id }) => [{ type: "Workflow", id }],
    }),

    updateWorkflowSettings: builder.mutation({
      query: ({ workflowId, settings }) => ({
        url: `/app-workflow/workflow/settings/update?workflow_id=${workflowId}`,
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: (result, error, { workflowId }) => [{ type: 'Workflow', id: workflowId }],
    }),
  }),
});

export const {
  useGetAllWorkflowsQuery,
  useCreateWorkflowMutation,
  useWorkflowBookmarkMutation,
  useValidateWorkflowMutation,
  useGetWorkflowByIdQuery,
  useLazyGetWorkflowByIdQuery,
  useUpdateWorkflowMutation,
  useDeleteWorkflowMutation,
  useGetAllExecutionsQuery,
  useGetAllExecutionsByWfIdQuery,
  useGetExecutionByIdQuery,
  useGetRetryExecutionsMutation,
  useGetAllNodesQuery,
  useManualTriggerWorkflowMutation,
  useUpdateWorkflowIsActiveMutation,
  // useGetLiveStatusTokenQuery,
  useGetWorkflowVersionByIdQuery,
  useGetVersionByIdQuery,
  useExecutionFlowActionMutation,
  useExecutionFlowActionByGroupMutation,
  useGetPdfClickAnalyticsQuery,
  useGetScheduleTriggerDataQuery,
  useGetNodeLogsQuery,
  useGetUsersMetadataQuery,
  useGetFileDownloadResponseMutation,
  useGetWorkflowSettingsQuery,
  useUpdateWorkflowSettingsMutation,
} = workFlowSlice;
