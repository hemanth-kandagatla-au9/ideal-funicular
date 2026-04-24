/* eslint-disable */
import { BULK_ACTION_LOGS } from "../../config/actions";
import {
  FetchBulkActionsPayload,
  FetchBulkActionDetailsPayload,
  UpdateFiltersPayload,
  UpdatePaginationPayload,
  BulkActionLogsFilter,
} from "@/types/BulkActionLogsState";

/**
 * ACTION 1: Fetch Bulk Actions List (Left Section - API 1)
 * Fetches paginated list of bulk actions with filters
 */
const fetchBulkActions = (payload?: FetchBulkActionsPayload) => ({
  type: BULK_ACTION_LOGS.FETCH_BULK_ACTIONS,
  payload,
});

const requestFetchBulkActions = () => ({
  type: BULK_ACTION_LOGS.REQUEST_FETCH_BULK_ACTIONS,
});

const successFetchBulkActions = (response: any) => ({
  type: BULK_ACTION_LOGS.SUCCESS_FETCH_BULK_ACTIONS,
  payload: response,
});

const failureFetchBulkActions = (error: { message: string }) => ({
  type: BULK_ACTION_LOGS.FAILURE_FETCH_BULK_ACTIONS,
  error: error.message || "Failed to fetch bulk actions",
});

/**
 * ACTION 2: Fetch Single Bulk Action Details (Right Section - API 2)
 * Fetches detailed information for a specific job including servers
 * Triggered when user clicks a job in the left panel
 */
const fetchBulkActionDetails = (jobId: string) => ({
  type: BULK_ACTION_LOGS.FETCH_BULK_ACTION_DETAILS,
  payload: { jobId },
});

const requestFetchBulkActionDetails = () => ({
  type: BULK_ACTION_LOGS.REQUEST_FETCH_BULK_ACTION_DETAILS,
});

const successFetchBulkActionDetails = (response: any) => ({
  type: BULK_ACTION_LOGS.SUCCESS_FETCH_BULK_ACTION_DETAILS,
  payload: response,
});

const failureFetchBulkActionDetails = (error: { message: string }) => ({
  type: BULK_ACTION_LOGS.FAILURE_FETCH_BULK_ACTION_DETAILS,
  error: error.message || "Failed to fetch bulk action details",
});

/**
 * ACTION 3: Update Filters
 * Updates filter state and triggers re-fetch of API 1
 */
const updateBulkActionFilters = (filters: Partial<BulkActionLogsFilter>) => ({
  type: BULK_ACTION_LOGS.UPDATE_BULK_ACTION_FILTERS,
  payload: { filters },
});

/**
 * ACTION 4: Update Pagination
 * Updates pagination state and triggers re-fetch of API 1
 */
const updateBulkActionPagination = (payload: UpdatePaginationPayload) => ({
  type: BULK_ACTION_LOGS.UPDATE_BULK_ACTION_PAGINATION,
  payload,
});

/**
 * ACTION 5: Select Bulk Action
 * Updates selected job ID in UI
 */
const selectBulkAction = (jobId: string | null) => ({
  type: BULK_ACTION_LOGS.SELECT_BULK_ACTION,
  payload: { jobId },
});

/**
 * ACTION 6: Sync Bulk Action Config
 * Triggers configuration sync for a bulk action
 */
const syncBulkActionConfig = (jobId: string) => ({
  type: BULK_ACTION_LOGS.SYNC_BULK_ACTION_CONFIG,
  payload: { jobId },
});

const requestSyncBulkActionConfig = () => ({
  type: BULK_ACTION_LOGS.REQUEST_SYNC_BULK_ACTION_CONFIG,
});

const successSyncBulkActionConfig = (response: any) => ({
  type: BULK_ACTION_LOGS.SUCCESS_SYNC_BULK_ACTION_CONFIG,
  payload: response,
});

const failureSyncBulkActionConfig = (error: { message: string }) => ({
  type: BULK_ACTION_LOGS.FAILURE_SYNC_BULK_ACTION_CONFIG,
  error: error.message || "Failed to sync bulk action config",
});

/**
 * ACTION 7: Export Bulk Action Logs
 * Exports bulk action logs to CSV or PDF
 */
const exportBulkActionLogs = (filters?: BulkActionLogsFilter) => ({
  type: BULK_ACTION_LOGS.EXPORT_BULK_ACTION_LOGS,
  payload: { filters },
});

const requestExportBulkActionLogs = () => ({
  type: BULK_ACTION_LOGS.REQUEST_EXPORT_BULK_ACTION_LOGS,
});

const successExportBulkActionLogs = (response: any) => ({
  type: BULK_ACTION_LOGS.SUCCESS_EXPORT_BULK_ACTION_LOGS,
  payload: response,
});

const failureExportBulkActionLogs = (error: { message: string }) => ({
  type: BULK_ACTION_LOGS.FAILURE_EXPORT_BULK_ACTION_LOGS,
  error: error.message || "Failed to export bulk action logs",
});

/** Export all actions as object for easy consumption */
const bulkActionLogsActions = {
  // Fetch Bulk Actions (API 1)
  fetchBulkActions,
  requestFetchBulkActions,
  successFetchBulkActions,
  failureFetchBulkActions,

  // Fetch Bulk Action Details (API 2)
  fetchBulkActionDetails,
  requestFetchBulkActionDetails,
  successFetchBulkActionDetails,
  failureFetchBulkActionDetails,

  // Filter & Pagination
  updateBulkActionFilters,
  updateBulkActionPagination,
  selectBulkAction,

  // Sync Config
  syncBulkActionConfig,
  requestSyncBulkActionConfig,
  successSyncBulkActionConfig,
  failureSyncBulkActionConfig,

  // Export
  exportBulkActionLogs,
  requestExportBulkActionLogs,
  successExportBulkActionLogs,
  failureExportBulkActionLogs,
};

export default bulkActionLogsActions;
