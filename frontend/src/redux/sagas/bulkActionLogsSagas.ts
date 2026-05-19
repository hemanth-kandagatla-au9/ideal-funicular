/* eslint-disable */
import { get, isEmpty, debounce } from "lodash";
import { takeLatest, put, call, all, fork } from "redux-saga/effects";
import { BULK_ACTION_LOGS } from "../../config/actions";
import bulkActionLogsActions from "../actions/bulkActionLogs.action";
import agentManagementService from "../../services/agent/agentManagement.service";
import { successtoast, errortoast } from "../../layouts/agent-management/helpers/CustomToast";
import {
  FetchBulkActionsPayload,
  FetchBulkActionDetailsPayload,
  BulkActionLogsFilter,
} from "@/types/BulkActionLogsState";

interface ActionProps {
  type: string;
  payload?: any;
  [key: string]: any;
}

// ==================== SAGA 1: Fetch Bulk Actions List (API 1) ====================
/**
 * Saga for API Endpoint 1: GET /agents/bulk/action-logs
 * Fetches paginated list of bulk actions with filters
 * Triggered on: Component mount, filter changes, pagination changes
 */
export function* fetchBulkActionsSaga({ payload }: ActionProps): Generator<any, void, any> {
  try {
    yield put(bulkActionLogsActions.requestFetchBulkActions());

    const response = yield call(
      agentManagementService.getBulkActionLogs,
      payload?.filters || {},
      payload?.pagination || { pageNo: 0, limit: 10 }
    );

    yield put(bulkActionLogsActions.successFetchBulkActions(response?.data || response));
  } catch (error: any) {
    yield put(bulkActionLogsActions.failureFetchBulkActions(error));
    errortoast("Failed to fetch bulk actions");
  }
}

// ==================== SAGA 2: Fetch Bulk Action Details (API 2) ====================
/**
 * Saga for API Endpoint 2: GET /agents/bulk/action-logs/:jobId
 * Fetches detailed information for a specific job including servers
 * Triggered on: User clicks a job in the left panel
 */
export function* fetchBulkActionDetailsSaga({
  payload,
}: ActionProps): Generator<any, void, any> {
  try {
    yield put(bulkActionLogsActions.requestFetchBulkActionDetails());

    const { jobId } = payload || {};
    if (isEmpty(jobId)) {
      throw new Error("Job ID is required");
    }

    const response = yield call(
      agentManagementService.getBulkActionDetails,
      jobId
    );

    yield put(bulkActionLogsActions.successFetchBulkActionDetails(response?.data || response));
  } catch (error: any) {
    yield put(bulkActionLogsActions.failureFetchBulkActionDetails(error));
    errortoast("Failed to fetch bulk action details");
  }
}

// ==================== SAGA 3: Debounced Fetch on Filter Changes ====================
/**
 * Saga for handling filter updates
 * Debounces API calls when filters change to avoid excessive requests
 */
export function* updateBulkActionFiltersSaga({
  payload,
}: ActionProps): Generator<any, void, any> {
  try {
    // Debounced fetch will be called with new filters
    // Resets pagination to page 0
    yield put(
      bulkActionLogsActions.fetchBulkActions({
        filters: payload?.filters,
        pagination: { pageNo: 0, limit: 10 },
      })
    );
  } catch (error: any) {
    errortoast("Failed to update filters");
  }
}

// ==================== SAGA 4: Pagination Change ====================
/**
 * Saga for handling pagination changes
 * Triggers API call with new page number
 */
export function* updateBulkActionPaginationSaga({
  payload,
}: ActionProps): Generator<any, void, any> {
  try {
    // Fetch with updated pagination
    yield put(
      bulkActionLogsActions.fetchBulkActions({
        pagination: {
          pageNo: payload?.pageNo || 0,
          limit: payload?.limit || 10,
        },
      })
    );
  } catch (error: any) {
    errortoast("Failed to update pagination");
  }
}

// ==================== SAGA 5: Sync Bulk Action Config ====================
/**
 * Saga for triggering configuration sync for a bulk action
 */
export function* syncBulkActionConfigSaga({
  payload,
}: ActionProps): Generator<any, void, any> {
  try {
    yield put(bulkActionLogsActions.requestSyncBulkActionConfig());

    const { jobId } = payload || {};
    if (isEmpty(jobId)) {
      throw new Error("Job ID is required for sync");
    }

    const response = yield call(
      agentManagementService.syncBulkActionConfig,
      jobId
    );

    if (get(response, "data.flag") === "success" || get(response, "flag") === "success") {
      yield put(bulkActionLogsActions.successSyncBulkActionConfig(response?.data || response));
      successtoast("Configuration sync initiated successfully");

      // Optionally refresh details after sync
      yield put(bulkActionLogsActions.fetchBulkActionDetails(jobId));
    } else {
      throw new Error("Sync request failed");
    }
  } catch (error: any) {
    yield put(bulkActionLogsActions.failureSyncBulkActionConfig(error));
    errortoast("Failed to trigger configuration sync");
  }
}

// ==================== SAGA 6: Export Bulk Action Logs ====================
export function* exportBulkActionLogsSaga({ payload }: ActionProps): Generator<any, void, any> {
  try {
    yield put(bulkActionLogsActions.requestExportBulkActionLogs());
    const { pageNo = 0, pageSize = 10 } = payload?.pagination || {};
    const response = yield call(agentManagementService.exportBulkActionLogs, pageNo, pageSize);
    yield put(bulkActionLogsActions.successExportBulkActionLogs(response?.data || response));
    successtoast("Export initiated successfully");
  } catch (error: any) {
    yield put(bulkActionLogsActions.failureExportBulkActionLogs(error));
    errortoast("Failed to export bulk action logs");
  }
}

// ==================== Root Saga ====================
/**
 * Root saga that registers all watchers
 */
export function* bulkActionLogsSaga(): Generator<any, void, any> {
  yield all([
    fork(function* () {
      yield takeLatest(
        BULK_ACTION_LOGS.FETCH_BULK_ACTIONS,
        fetchBulkActionsSaga
      );
    }),
    fork(function* () {
      yield takeLatest(
        BULK_ACTION_LOGS.FETCH_BULK_ACTION_DETAILS,
        fetchBulkActionDetailsSaga
      );
    }),
    fork(function* () {
      yield takeLatest(
        BULK_ACTION_LOGS.UPDATE_BULK_ACTION_FILTERS,
        updateBulkActionFiltersSaga
      );
    }),
    fork(function* () {
      yield takeLatest(
        BULK_ACTION_LOGS.UPDATE_BULK_ACTION_PAGINATION,
        updateBulkActionPaginationSaga
      );
    }),
    fork(function* () {
      yield takeLatest(
        BULK_ACTION_LOGS.SYNC_BULK_ACTION_CONFIG,
        syncBulkActionConfigSaga
      );
    }),
    fork(function* () {
      yield takeLatest(
        BULK_ACTION_LOGS.EXPORT_BULK_ACTION_LOGS,
        exportBulkActionLogsSaga
      );
    }),
  ]);
}

export default bulkActionLogsSaga;
