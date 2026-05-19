/* eslint-disable */
/// <reference types="jest" />
import { expectSaga } from "redux-saga-test-plan";
import { call, put } from "redux-saga/effects";
import * as matchers from "redux-saga-test-plan/matchers";

import {
  fetchBulkActionsSaga,
  fetchBulkActionDetailsSaga,
  updateBulkActionFiltersSaga,
  updateBulkActionPaginationSaga,
  syncBulkActionConfigSaga,
  exportBulkActionLogsSaga,
} from "../../../redux/sagas/bulkActionLogsSagas";
import bulkActionLogsActions from "../../../redux/actions/bulkActionLogs.action";
import agentManagementService from "../../../services/agent/agentManagement.service";

jest.mock("../../../layouts/agent-management/helpers/CustomToast", () => ({
  successtoast: jest.fn(),
  errortoast: jest.fn(),
}));

// ──────────────────────────────────────────────────────────────────────────────
// fetchBulkActionsSaga
// ──────────────────────────────────────────────────────────────────────────────
describe("fetchBulkActionsSaga", () => {
  it("dispatches success with response.data on successful call", () => {
    const response = { data: { data: [{ jobId: "J1" }] } };
    return expectSaga(fetchBulkActionsSaga, { type: "test", payload: { filters: { type: ["agent_upgrade"] }, pagination: { pageNo: 0, limit: 10 } } })
      .put(bulkActionLogsActions.requestFetchBulkActions())
      .provide([[matchers.call.fn(agentManagementService.getBulkActionLogs), response]])
      .put(bulkActionLogsActions.successFetchBulkActions(response.data))
      .run();
  });

  it("uses response directly when response.data is absent", () => {
    const response = { jobId: "J1" };
    return expectSaga(fetchBulkActionsSaga, { type: "test", payload: {} })
      .provide([[matchers.call.fn(agentManagementService.getBulkActionLogs), response]])
      .put(bulkActionLogsActions.successFetchBulkActions(response))
      .run();
  });

  it("uses default filters and pagination when payload is undefined", () => {
    const response = { data: [] };
    return expectSaga(fetchBulkActionsSaga, { type: "test" })
      .provide([[matchers.call.fn(agentManagementService.getBulkActionLogs), response]])
      .put(bulkActionLogsActions.successFetchBulkActions(response.data))
      .run();
  });

  it("dispatches failure on error", () => {
    const error = new Error("network failure");
    return expectSaga(fetchBulkActionsSaga, { type: "test", payload: {} })
      .provide([[matchers.call.fn(agentManagementService.getBulkActionLogs), Promise.reject(error)]])
      .put(bulkActionLogsActions.failureFetchBulkActions(error))
      .run();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// fetchBulkActionDetailsSaga
// ──────────────────────────────────────────────────────────────────────────────
describe("fetchBulkActionDetailsSaga", () => {
  it("dispatches success with response.data on valid jobId", () => {
    const response = { data: { jobId: "J1", servers: [] } };
    return expectSaga(fetchBulkActionDetailsSaga, { type: "test", payload: { jobId: "J1" } })
      .put(bulkActionLogsActions.requestFetchBulkActionDetails())
      .provide([[matchers.call.fn(agentManagementService.getBulkActionDetails), response]])
      .put(bulkActionLogsActions.successFetchBulkActionDetails(response.data))
      .run();
  });

  it("dispatches failure when jobId is empty", () => {
    return expectSaga(fetchBulkActionDetailsSaga, { type: "test", payload: { jobId: "" } })
      .put(bulkActionLogsActions.requestFetchBulkActionDetails())
      .put.actionType(bulkActionLogsActions.failureFetchBulkActionDetails(new Error("x")).type)
      .run();
  });

  it("dispatches failure when payload is missing", () => {
    return expectSaga(fetchBulkActionDetailsSaga, { type: "test" })
      .put(bulkActionLogsActions.requestFetchBulkActionDetails())
      .put.actionType(bulkActionLogsActions.failureFetchBulkActionDetails(new Error("x")).type)
      .run();
  });

  it("dispatches failure on service error", () => {
    const error = new Error("service error");
    return expectSaga(fetchBulkActionDetailsSaga, { type: "test", payload: { jobId: "J1" } })
      .provide([[matchers.call.fn(agentManagementService.getBulkActionDetails), Promise.reject(error)]])
      .put.actionType(bulkActionLogsActions.failureFetchBulkActionDetails(error).type)
      .run();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// updateBulkActionFiltersSaga
// ──────────────────────────────────────────────────────────────────────────────
describe("updateBulkActionFiltersSaga", () => {
  it("dispatches fetchBulkActions with reset pagination and provided filters", () => {
    const filters = { type: ["agent_config_sync"] };
    return expectSaga(updateBulkActionFiltersSaga, { type: "test", payload: { filters } })
      .put(bulkActionLogsActions.fetchBulkActions({ filters, pagination: { pageNo: 0, limit: 10 } }))
      .run();
  });

  it("dispatches fetchBulkActions with undefined filters when payload is missing", () => {
    return expectSaga(updateBulkActionFiltersSaga, { type: "test" })
      .put(bulkActionLogsActions.fetchBulkActions({ filters: undefined, pagination: { pageNo: 0, limit: 10 } }))
      .run();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// updateBulkActionPaginationSaga
// ──────────────────────────────────────────────────────────────────────────────
describe("updateBulkActionPaginationSaga", () => {
  it("dispatches fetchBulkActions with provided pageNo and limit", () => {
    return expectSaga(updateBulkActionPaginationSaga, { type: "test", payload: { pageNo: 2, limit: 10 } })
      .put(bulkActionLogsActions.fetchBulkActions({ pagination: { pageNo: 2, limit: 10 } }))
      .run();
  });

  it("defaults pageNo and limit to 0 and 10 when payload is missing", () => {
    return expectSaga(updateBulkActionPaginationSaga, { type: "test" })
      .put(bulkActionLogsActions.fetchBulkActions({ pagination: { pageNo: 0, limit: 10 } }))
      .run();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// syncBulkActionConfigSaga
// ──────────────────────────────────────────────────────────────────────────────
describe("syncBulkActionConfigSaga", () => {
  it("dispatches success and refreshes details when flag is success in data", () => {
    const response = { data: { flag: "success" } };
    return expectSaga(syncBulkActionConfigSaga, { type: "test", payload: { jobId: "J1" } })
      .put(bulkActionLogsActions.requestSyncBulkActionConfig())
      .provide([[matchers.call.fn(agentManagementService.syncBulkActionConfig), response]])
      .put(bulkActionLogsActions.successSyncBulkActionConfig(response.data))
      .put(bulkActionLogsActions.fetchBulkActionDetails("J1"))
      .run();
  });

  it("dispatches success when flag is on root response", () => {
    const response = { flag: "success" };
    return expectSaga(syncBulkActionConfigSaga, { type: "test", payload: { jobId: "J1" } })
      .provide([[matchers.call.fn(agentManagementService.syncBulkActionConfig), response]])
      .put.actionType(bulkActionLogsActions.successSyncBulkActionConfig(response).type)
      .run();
  });

  it("dispatches failure when jobId is empty", () => {
    return expectSaga(syncBulkActionConfigSaga, { type: "test", payload: { jobId: "" } })
      .put(bulkActionLogsActions.requestSyncBulkActionConfig())
      .put.actionType(bulkActionLogsActions.failureSyncBulkActionConfig(new Error("x")).type)
      .run();
  });

  it("dispatches failure when service returns non-success flag", () => {
    const response = { data: { flag: "error" } };
    return expectSaga(syncBulkActionConfigSaga, { type: "test", payload: { jobId: "J1" } })
      .provide([[matchers.call.fn(agentManagementService.syncBulkActionConfig), response]])
      .put.actionType(bulkActionLogsActions.failureSyncBulkActionConfig(new Error("x")).type)
      .run();
  });

  it("dispatches failure on service error", () => {
    const error = new Error("sync failed");
    return expectSaga(syncBulkActionConfigSaga, { type: "test", payload: { jobId: "J1" } })
      .provide([[matchers.call.fn(agentManagementService.syncBulkActionConfig), Promise.reject(error)]])
      .put.actionType(bulkActionLogsActions.failureSyncBulkActionConfig(error).type)
      .run();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// exportBulkActionLogsSaga
// ──────────────────────────────────────────────────────────────────────────────
describe("exportBulkActionLogsSaga", () => {
  it("dispatches success with response.data on successful export", () => {
    const response = { data: { records: [] } };
    return expectSaga(exportBulkActionLogsSaga, { type: "test", payload: { pagination: { pageNo: 1, pageSize: 10 } } })
      .put(bulkActionLogsActions.requestExportBulkActionLogs())
      .provide([[matchers.call.fn(agentManagementService.exportBulkActionLogs), response]])
      .put(bulkActionLogsActions.successExportBulkActionLogs(response.data))
      .run();
  });

  it("defaults pageNo to 0 and pageSize to 10 when pagination is absent", () => {
    const response = { data: {} };
    return expectSaga(exportBulkActionLogsSaga, { type: "test", payload: {} })
      .provide([[matchers.call.fn(agentManagementService.exportBulkActionLogs), response]])
      .put(bulkActionLogsActions.successExportBulkActionLogs(response.data))
      .run();
  });

  it("uses response directly when response.data is absent", () => {
    const response = { records: [] };
    return expectSaga(exportBulkActionLogsSaga, { type: "test", payload: { pagination: { pageNo: 0, pageSize: 10 } } })
      .provide([[matchers.call.fn(agentManagementService.exportBulkActionLogs), response]])
      .put(bulkActionLogsActions.successExportBulkActionLogs(response))
      .run();
  });

  it("dispatches failure on export service error", () => {
    const error = new Error("export failed");
    return expectSaga(exportBulkActionLogsSaga, { type: "test", payload: { pagination: { pageNo: 0, pageSize: 10 } } })
      .provide([[matchers.call.fn(agentManagementService.exportBulkActionLogs), Promise.reject(error)]])
      .put.actionType(bulkActionLogsActions.failureExportBulkActionLogs(error).type)
      .run();
  });
});
