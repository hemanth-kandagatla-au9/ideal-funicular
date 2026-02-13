import { createSlice } from "@reduxjs/toolkit";
import { getPermissionAction } from "../../services/configurations/configService";
const initialState = {
  loading: true,
  permissions: [
    {
      project: "insights",
      modules: [
        {
          module: "All",
          hasAccess: true,
          permissions: [
            {
              label: "All : read",
              hasAccess: true,
            },
          ],
        },
        {
          module: "Reports",
          hasAccess: true,
          permissions: [
            {
              label: "Reports : read",
              hasAccess: true,
            },
            {
              label: "Reports : write",
              hasAccess: true,
            },
          ],
        },
        {
          module: "CMDB",
          hasAccess: true,
          permissions: [
            {
              label: "CMDB : read",
              hasAccess: true,
            },
            {
              label: "CMDB : write",
              hasAccess: true,
            },
          ],
        },
        {
          module: "Dashboard",
          hasAccess: true,
          permissions: [
            {
              label: "Dashboard : read",
              hasAccess: true,
            },
            {
              label: "Dashboard : write",
              hasAccess: true,
            },
          ],
        },
        {
          module: "Settings",
          hasAccess: true,
          permissions: [
            {
              label: "Settings : read",
              hasAccess: true,
            },
            {
              label: "Settings : write",
              hasAccess: true,
            },
          ],
        },
        {
          module: "Marketplace",
          hasAccess: true,
          permissions: [
            {
              label: "Marketplace : read",
              hasAccess: true,
            },
            {
              label: "Marketplace : write",
              hasAccess: true,
            },
          ],
        },
      ],
    },
  ],
  workflows: [],
  jobs: [],
  hosts: [],
  categories: [],
  tags: [],
  reportTags: [],
  targets: [],
  frequencies: [],
  commandCategories: [],
  jobDetail: null,
  loading: false,
  error: null,
  totalCount: 0,
  logFilters: {
    hostnames: [],
    runAs: [],
    categoryName: [],
    command: [],
    tags: [],
    jobTags: [],
  },
  configSetting: {
    isLoading: true,
    data: {},
  },
  osTypes: [],
  approvalConfig: [],
  internalJobs: [],
  IAMGroups: [],
  internalJobsLoading: false,
  internalJobsError: null,
  requestStatusList: [],
  requestStatusLoading: false,
  requestStatusError: null,
  requestStatusPagination: {
    currentPage: 1,
    pageSize: 10,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,

    approvalRequests: [],
    approvalRequestsLoading: false,
    approvalRequestsError: null,
    approvalRequestsPagination: {
      currentPage: 1,
      pageSize: 10,
      totalRecords: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
  userConfigurations: [],
  userConfigurationsLoading: false,
  userConfigurationsError: null,
  saveUserConfigLoading: false,
  saveUserConfigError: null,
  publishAsSystemConfigurations: [],
  publishAsSystemConfigurationsLoading: false,
  publishAsSystemConfigurationsError: null,
  savePublishAsSystemConfigLoading: false,
  savePublishAsSystemError: null,
  sapFactsColumnsConfig: {},
  sapFactsColumnsConfigLoading: false,
  sapFactsColumnsConfigError: false,
  cmdbConfigurations: [],
  cmdbConfigurationsLoading: false,
  cmdbConfigurationsError: null,
  saveCmdbConfigLoading: false,
  saveCmdbConfigurationError: null,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess(state, action) {
      state.loading = false;

      if (action.payload.type === "jobs") {
        state.jobs = action.payload.data;
        state.totalCount = action.payload.totalCount || 0;
      } else if (action.payload.type === "hosts") {
        state.hosts = action.payload.data;
      } else if (action.payload.type === "categories") {
        state.categories = action.payload.data;
      } else if (action.payload.type === "tags") {
        state.tags = action.payload.data;
      } else if (action.payload.type === "reportTags") {
        state.reportTags = action.payload.data.data;
      } else if (action.payload.type === "targets") {
        state.targets = action.payload.data;
      } else if (action.payload.type === "frequencies") {
        state.frequencies = action.payload.data;
      } else if (action.payload.type === "jobDetail") {
        state.jobDetail = action.payload.data;
      } else if (action.payload.type === "commandCategories") {
        state.commandCategories = action.payload.data;
      } else if (action.payload.type === "logFilters") {
        state.logFilters = action.payload.data;
      } else if (action.payload.type === "configSetting") {
        state.configSetting = action.payload.data;
      } else if (action.payload.type === "osTypes") {
        state.osTypes = action.payload.data;
      } else if (action.payload.type === "approvalConfig") {
        state.approvalConfig = action.payload.data;
      } else if (action.payload.type === "IAMGroups") {
        state.IAMGroups = action.payload.data;
      } else if (action.payload.type === "approvalStatus") {
        state.requestStatusList = action.payload.data;
        state.requestStatusPagination = action.payload.pagination;
      } else if (action.payload.type === "approvalRequest") {
        state.approvalRequests = action.payload.data;
        state.approvalRequestsPagination = action.payload.pagination;
      } else if (action.payload.type === "userConfigurations") {
        state.userConfigurations = action.payload;
      } else if (action.payload.type === "publishAsSystemConfigurations") {
        state.publishAsSystemConfigurations = action.payload;
      } else if (action.payload.type === "sapFactsFilterOptions") {
        state.sapFactsFilterOptions = action.payload;
      } else if (action.payload.type === "workflows") {
        state.workflows = action.payload.data;
        state.workflowsPagination = action.payload.pagination;
        state.workflowsTotalCount = action.payload.totalCount || 0;
      } else if (action.payload.type === "sapFactsColumns") {
        state.sapFactsColumnsConfig = action.payload;
      } else if (action.payload.type === "cmdbConfigurations") {
        state.cmdbConfigurations = action.payload;
      }
    },
    fetchDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addJobSuccess(state, action) {
      state.loading = false;
    },
    deleteJobSuccess(state, action) {
      state.loading = false;
      state.jobs = state.jobs.filter((job) => job._id !== action.payload);
    },
    fetchCommandCategoriesSuccess(state, action) {
      state.loading = false;
      state.commandCategories = action.payload;
    },
    fetchInternalJobsStart(state) {
      state.internalJobsLoading = true;
      state.internalJobsError = null;
    },
    fetchInternalJobsSuccess(state, action) {
      state.internalJobsLoading = false;
      state.internalJobs = action.payload;
    },
    fetchInternalJobsFailure(state, action) {
      state.internalJobsLoading = false;
      state.internalJobsError = action.payload;
    },
    fetchRequestStatusStart(state) {
      state.requestStatusLoading = true;
      state.requestStatusError = null;
    },
    fetchRequestStatusSuccess(state, action) {
      state.requestStatusLoading = false;
      state.requestStatusList = action.payload.data;
      state.requestStatusPagination = action.payload.pagination;
    },
    fetchRequestStatusFailure(state, action) {
      state.requestStatusLoading = false;
      state.requestStatusError = action.payload;
    },
    fetchApprovalRequestsStart(state) {
      state.approvalRequestsLoading = true;
      state.approvalRequestsError = null;
    },
    fetchApprovalRequestsSuccess(state, action) {
      state.approvalRequestsLoading = false;
      state.approvalRequests = action.payload.data;
      state.approvalRequestsPagination = action.payload.pagination;
    },
    fetchApprovalRequestsFailure(state, action) {
      state.approvalRequestsLoading = false;
      state.approvalRequestsError = action.payload;
    },
    approveRejectRequestStart(state) {
      state.loading = true;
      state.error = null;
    },
    approveRejectRequestSuccess(state, action) {
      state.loading = false;
      // Update the approval request in the list if it exists
      if (state.approvalRequests.length > 0) {
        const index = state.approvalRequests.findIndex(
          (request) => request._id === action.payload.requestId
        );
        if (index !== -1) {
          state.approvalRequests[index].status = action.payload.action;
          state.approvalRequests[index].updatedBy = action.payload.username;
          if (action.payload.rejectionReason) {
            state.approvalRequests[index].rejectionReason =
              action.payload.rejectionReason;
          }
        }
      }
    },
    approveRejectRequestFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    // In the reducers object of createSlice
    bulkActionStart(state) {
      state.loading = true;
      state.error = null;
    },
    bulkActionSuccess(state) {
      state.loading = false;
    },
    bulkActionFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchUserConfigurationsStart(state) {
      state.userConfigurationsLoading = true;
      state.userConfigurationsError = null;
    },
    fetchUserConfigurationsSuccess(state, action) {
      state.userConfigurationsLoading = false;
      state.userConfigurations = action.payload;
    },
    fetchUserConfigurationsFailure(state, action) {
      state.userConfigurationsLoading = false;
      state.userConfigurationsError = action.payload;
    },
    saveUserConfigStart(state) {
      state.saveUserConfigLoading = true;
      state.saveUserConfigError = null;
    },
    saveUserConfigSuccess(state, action) {
      state.saveUserConfigLoading = false;
      state.userConfigurations = action.payload;
    },
    saveUserConfigFailure(state, action) {
      state.saveUserConfigLoading = false;
      state.saveUserConfigError = action.payload;
    },
    savePublishAsSystemSuccess(state, action) {
      state.savePublishAsSystemConfigLoading = false;
      state.publishAsSystemConfigurations = action.payload;
    },
    savePublishAsSystemStart(state) {
      state.savePublishAsSystemConfigLoading = true;
      state.savePublishAsSystemError = null;
    },
    fetchPublishAsSystemConfigurationsFailure(state, action) {
      state.publishAsSystemConfigurationsLoading = false;
      state.publishAsSystemConfigurationsError = action.payload;
    },
    fetchPublishAsSytemConfigurationsStart(state) {
      state.publishAsSystemConfigurationsLoading = true;
      state.publishAsSystemConfigurationsError = null;
    },
    fetchSapFactsColumnsConfigRequest(state) {
      state.sapFactsColumnsConfigLoading = true;
      state.sapFactsColumnsConfigError = null;
    },
    fetchSapFactsColumnsConfigSuccess(state, action) {
      state.sapFactsColumnsConfigLoading = false;
      state.sapFactsColumnsConfig = action.payload;
    },
    fetchSapFactsColumnsConfigFailure(state, action) {
      state.sapFactsColumnsConfigLoading = false;
      state.sapFactsColumnsConfigError = action.payload;
    },
    saveCmdbConfigurationSuccess(state, action) {
      state.saveCmdbConfigLoading = false;
      state.cmdbConfigurations = action.payload;
    },
    saveCmdbConfigurationStart(state) {
      state.saveCmdbConfigLoading = true;
      state.saveCmdbConfigurationError = null;
    },
    fetchCmdbConfigurationsFailure(state, action) {
      state.cmdbConfigurationsLoading = false;
      state.cmdbConfigurationsError = action.payload;
    },
    fetchCmdbConfigurationsStart(state) {
      state.cmdbConfigurationsLoading = true;
      state.cmdbConfigurationsError = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getPermissionAction.pending, (state) => {
        state.loading = false;
      })
      .addCase(getPermissionAction.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getPermissionAction.fulfilled, (state, action) => {
        console.log("payload:::::", action);
        state.permissions = action?.payload?.data?.data?.permissions || [];
        state.loading = false;
      });
  },
});

export const {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
  addJobSuccess,
  deleteJobSuccess,
  fetchCommandCategoriesSuccess,
  fetchInternalJobsStart,
  fetchInternalJobsSuccess,
  fetchInternalJobsFailure,
  updateApprovalConfigSuccess,
  fetchRequestStatusStart,
  fetchRequestStatusSuccess,
  fetchRequestStatusFailure,
  fetchApprovalRequestsStart,
  fetchApprovalRequestsSuccess,
  fetchApprovalRequestsFailure,
  approveRejectRequestStart,
  approveRejectRequestSuccess,
  approveRejectRequestFailure,
  bulkActionFailure,
  bulkActionSuccess,
  bulkActionStart,
  fetchUserConfigurationsStart,
  fetchUserConfigurationsSuccess,
  fetchUserConfigurationsFailure,
  saveUserConfigStart,
  saveUserConfigSuccess,
  saveUserConfigFailure,
  savePublishAsSystemStart,
  savePublishAsSystemSuccess,
  fetchPublishAsSytemConfigurationsStart,
  fetchSapFactsColumnsConfigRequest,
  fetchSapFactsColumnsConfigSuccess,
  fetchSapFactsColumnsConfigFailure,
  saveCmdbConfigurationStart,
  saveCmdbConfigurationSuccess,
  fetchCmdbConfigurationsStart,
} = jobsSlice.actions;

export default jobsSlice.reducer;
