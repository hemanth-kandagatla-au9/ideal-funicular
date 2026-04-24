/* eslint-disable */
import { BULK_ACTION_LOGS } from "../../config/actions";
import {
  BulkActionLogsState,
  INITIAL_BULK_ACTION_LOGS_STATE,
  BulkAction,
  BulkActionDetails,
} from "@/types/BulkActionLogsState";

/**
 * Redux Reducer for Bulk Action Logs
 * Handles:
 * - API 1: Fetch bulk actions list (left panel)
 * - API 2: Fetch bulk action details (right panel)
 * - Filters, pagination, UI state
 */
export default function bulkActionLogsReducer(
  state: BulkActionLogsState = INITIAL_BULK_ACTION_LOGS_STATE,
  action: {
    type: string;
    [key: string]: any;
  },
): BulkActionLogsState {
  switch (action.type) {
    // ==================== API 1: Fetch Bulk Actions List ====================
    case BULK_ACTION_LOGS.FETCH_BULK_ACTIONS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case BULK_ACTION_LOGS.REQUEST_FETCH_BULK_ACTIONS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case BULK_ACTION_LOGS.SUCCESS_FETCH_BULK_ACTIONS:
      return {
        ...state,
        loading: false,
        bulkActions: action.payload?.data?.data || [],
        pagination: action.payload?.data?.pagination || state.pagination,
        availableFilters: {
          actions: action.payload?.data?.filters?.actions || state.availableFilters.actions,
          users: action.payload?.data?.filters?.users || state.availableFilters.users,
        },
        error: null,
      };

    case BULK_ACTION_LOGS.FAILURE_FETCH_BULK_ACTIONS:
      return {
        ...state,
        loading: false,
        error: action.error,
        bulkActions: [],
      };

    // ==================== API 2: Fetch Bulk Action Details ====================
    case BULK_ACTION_LOGS.FETCH_BULK_ACTION_DETAILS:
      return {
        ...state,
        detailsLoading: true,
        detailsError: null,
        selectedJobId: action.payload?.jobId,
      };

    case BULK_ACTION_LOGS.REQUEST_FETCH_BULK_ACTION_DETAILS:
      return {
        ...state,
        detailsLoading: true,
        detailsError: null,
      };

    case BULK_ACTION_LOGS.SUCCESS_FETCH_BULK_ACTION_DETAILS:
      return {
        ...state,
        detailsLoading: false,
        selectedBulkAction: action.payload?.data?.data || action.payload?.data || null,
        detailsError: null,
      };

    case BULK_ACTION_LOGS.FAILURE_FETCH_BULK_ACTION_DETAILS:
      return {
        ...state,
        detailsLoading: false,
        detailsError: action.error,
        selectedBulkAction: null,
      };

    // ==================== Filter & Pagination ====================
    case BULK_ACTION_LOGS.UPDATE_BULK_ACTION_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload.filters,
        },
        pagination: {
          ...state.pagination,
          pageNo: 0, // Reset to first page when filtering
        },
      };

    case BULK_ACTION_LOGS.UPDATE_BULK_ACTION_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          pageNo: action.payload.pageNo,
          ...(action.payload.limit && { limit: action.payload.limit }),
        },
      };

    case BULK_ACTION_LOGS.SELECT_BULK_ACTION:
      return {
        ...state,
        selectedJobId: action.payload.jobId,
      };

    // ==================== Sync Bulk Action Config ====================
    case BULK_ACTION_LOGS.SYNC_BULK_ACTION_CONFIG:
      return {
        ...state,
        syncInProgress: true,
        syncError: null,
      };

    case BULK_ACTION_LOGS.REQUEST_SYNC_BULK_ACTION_CONFIG:
      return {
        ...state,
        syncInProgress: true,
        syncError: null,
      };

    case BULK_ACTION_LOGS.SUCCESS_SYNC_BULK_ACTION_CONFIG:
      return {
        ...state,
        syncInProgress: false,
        syncError: null,
        // Optionally refresh details after sync
        ...(state.selectedBulkAction && {
          selectedBulkAction: {
            ...state.selectedBulkAction,
            status: "In Progress", // Update status to reflect sync
          },
        }),
      };

    case BULK_ACTION_LOGS.FAILURE_SYNC_BULK_ACTION_CONFIG:
      return {
        ...state,
        syncInProgress: false,
        syncError: action.error,
      };

    // ==================== Export Bulk Action Logs ====================
    case BULK_ACTION_LOGS.EXPORT_BULK_ACTION_LOGS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case BULK_ACTION_LOGS.REQUEST_EXPORT_BULK_ACTION_LOGS:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case BULK_ACTION_LOGS.SUCCESS_EXPORT_BULK_ACTION_LOGS:
      return {
        ...state,
        loading: false,
        error: null,
        // Export succeeds, file is downloaded via browser
      };

    case BULK_ACTION_LOGS.FAILURE_EXPORT_BULK_ACTION_LOGS:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    // ==================== Default ====================
    default:
      return state;
  }
}
