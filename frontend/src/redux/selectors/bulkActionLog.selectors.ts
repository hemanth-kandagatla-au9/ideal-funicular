/* eslint-disable */
import { get } from "lodash";
import { createSelector } from "reselect";
import { BulkActionLogsState } from "@/types/BulkActionLogsState";

interface RootState {
  bulkActionLogs: BulkActionLogsState;
}

/**
 * Root selector for bulk action logs state
 */
const bulkActionLogsSelector = (state: RootState) => state.bulkActionLogs;

// ==================== Data Selectors ====================

/**
 * Selector: Get all bulk actions (for left panel list)
 */
export const getBulkActions = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "bulkActions", []),
);

/**
 * Selector: Get selected bulk action details (for right panel)
 */
export const getSelectedBulkAction = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "selectedBulkAction", null),
);

/**
 * Selector: Get current filters
 */
export const getBulkActionFilters = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "filters", {}),
);

/**
 * Selector: Get pagination data
 */
export const getBulkActionPagination = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "pagination", {}),
);

/**
 * Selector: Get selected job ID
 */
export const getSelectedJobId = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "selectedJobId", null),
);

/**
 * Selector: Get all available filters from API response (stored globally)
 */
export const getAvailableFilters = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "availableFilters", { actions: [], users: [] }),
);

// ==================== Loading State Selectors ====================

/**
 * Selector: Check if loading bulk actions list (API 1)
 */
export const isLoadingBulkActions = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "loading", false),
);

/**
 * Selector: Check if loading bulk action details (API 2)
 */
export const isLoadingBulkActionDetails = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "detailsLoading", false),
);

/**
 * Selector: Check if sync is in progress
 */
export const isSyncInProgress = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "syncInProgress", false),
);

// ==================== Error State Selectors ====================

/**
 * Selector: Get error from bulk actions list fetch
 */
export const getBulkActionsError = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "error", null),
);

/**
 * Selector: Get error from bulk action details fetch
 */
export const getBulkActionDetailsError = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "detailsError", null),
);

/**
 * Selector: Get error from sync operation
 */
export const getSyncError = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "syncError", null),
);

// ==================== Derived Selectors ====================

/**
 * Selector: Get servers from selected bulk action
 */
export const getSelectedBulkActionServers = createSelector(
  getSelectedBulkAction,
  (selectedAction) => get(selectedAction, "servers", []),
);

/**
 * Selector: Count successful servers from selected action
 */
export const getSuccessfulServerCount = createSelector(
  getSelectedBulkActionServers,
  (servers) => servers.filter((s) => s.status === "Success").length,
);

/**
 * Selector: Count failed servers from selected action
 */
export const getFailedServerCount = createSelector(
  getSelectedBulkActionServers,
  (servers) => servers.filter((s) => s.status === "Failure").length,
);

/**
 * Selector: Count pending servers from selected action
 */
export const getPendingServerCount = createSelector(
  getSelectedBulkActionServers,
  (servers) => servers.filter((s) => s.status === "Pending" || s.status === "In Progress").length,
);

/**
 * Selector: Get total number of jobs
 */
export const getTotalBulkActionCount = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "pagination.totalRows", 0),
);

/**
 * Selector: Get total pages
 */
export const getTotalPages = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "pagination.totalPage", 0),
);

/**
 * Selector: Get current page number
 */
export const getCurrentPageNumber = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "pagination.pageNo", 0),
);

/**
 * Selector: Get page size (limit)
 */
export const getPageSize = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "pagination.limit", 10),
);

/**
 * Selector: Check if filter panel is open
 */
export const isFilterPanelOpen = createSelector(
  bulkActionLogsSelector,
  (state: BulkActionLogsState) => get(state, "filterPanelOpen", false),
);

// ==================== Composite Selectors ====================

/**
 * Selector: Get bulk action by ID from list
 */
export const getBulkActionById = (jobId: string) =>
  createSelector(
    getBulkActions,
    (actions) => actions.find((action) => action.jobId === jobId) || null,
  );

/**
 * Selector: Check if a specific job is currently selected
 */
export const isJobSelected = (jobId: string) =>
  createSelector(
    getSelectedJobId,
    (selectedId) => selectedId === jobId,
  );

/**
 * Selector: Get bulk actions filtered by type
 */
export const getBulkActionsByType = (type: string) =>
  createSelector(
    getBulkActions,
    (actions) => actions.filter((action) => action.type === type),
  );

/**
 * Selector: Get bulk actions filtered by status
 */
export const getBulkActionsByStatus = (status: string) =>
  createSelector(
    getBulkActions,
    (actions) => actions.filter((action) => action.status === status),
  );
