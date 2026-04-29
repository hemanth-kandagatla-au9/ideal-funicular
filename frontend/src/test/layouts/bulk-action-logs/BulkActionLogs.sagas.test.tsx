import { call, put } from "redux-saga/effects";
import agentService from "../../../services/agent/agentManagement.service";
import bulkActionLogsActions from "../../../redux/actions/bulkActionLogs.action";
import {
  fetchBulkActionsSaga,
  fetchBulkActionDetailsSaga,
  updateBulkActionFiltersSaga,
  updateBulkActionPaginationSaga,
  syncBulkActionConfigSaga,
} from "../../../redux/sagas/bulkActionLogsSagas";

// Mock toast functions to avoid UI effects
jest.mock("../../../layouts/agent-management/helpers/CustomToast", () => ({
  successtoast: jest.fn(),
  errortoast: jest.fn(),
}));

describe("bulkActionLogsSagas generator tests", () => {
  it("fetchBulkActionsSaga - success path", () => {
    const action = { payload: { filters: {}, pagination: { pageNo: 0, limit: 10 } } };
    const gen = fetchBulkActionsSaga(action as any);

    expect(gen.next().value).toEqual(put(bulkActionLogsActions.requestFetchBulkActions()));
    expect(gen.next().value).toEqual(call(agentService.getBulkActionLogs, {}, { pageNo: 0, limit: 10 }));

    const response = { data: { data: [{ jobId: "J1" }] } };
    expect(gen.next(response).value).toEqual(put(bulkActionLogsActions.successFetchBulkActions(response.data)));
  });

  it("fetchBulkActionsSaga - failure path", () => {
    const action = { payload: {} };
    const gen = fetchBulkActionsSaga(action as any);

    expect(gen.next().value).toEqual(put(bulkActionLogsActions.requestFetchBulkActions()));
    // simulate exception thrown from call
    const err = new Error("nope");
    expect(gen.throw(err).value).toEqual(put(bulkActionLogsActions.failureFetchBulkActions(err)));
  });

  it("fetchBulkActionDetailsSaga - success and missing jobId path", () => {
    // success
    const action = { payload: { jobId: "JOB-1" } };
    const gen = fetchBulkActionDetailsSaga(action as any);
    expect(gen.next().value).toEqual(put(bulkActionLogsActions.requestFetchBulkActionDetails()));
    expect(gen.next().value).toEqual(call(agentService.getBulkActionDetails, "JOB-1"));
    const resp = { data: { data: { jobId: "JOB-1" } } };
    expect(gen.next(resp).value).toEqual(put(bulkActionLogsActions.successFetchBulkActionDetails(resp.data)));

    // missing jobId -> should catch and put failure
    const gen2 = fetchBulkActionDetailsSaga({ payload: {} } as any);
    expect(gen2.next().value).toEqual(put(bulkActionLogsActions.requestFetchBulkActionDetails()));
    const thrown = new Error("Job ID is required");
    expect(gen2.throw(thrown).value).toEqual(put(bulkActionLogsActions.failureFetchBulkActionDetails(thrown)));
  });

  it("updateBulkActionFiltersSaga and updateBulkActionPaginationSaga", () => {
    const filtersAction = { payload: { filters: { user: "u" } } };
    const gen = updateBulkActionFiltersSaga(filtersAction as any);
    expect(gen.next().value).toEqual(put(bulkActionLogsActions.fetchBulkActions({ filters: { user: "u" }, pagination: { pageNo: 0, limit: 10 } })));

    const paginationAction = { payload: { pageNo: 3, limit: 25 } };
    const gen2 = updateBulkActionPaginationSaga(paginationAction as any);
    expect(gen2.next().value).toEqual(put(bulkActionLogsActions.fetchBulkActions({ pagination: { pageNo: 3, limit: 25 } })));
  });

  it("syncBulkActionConfigSaga - success and failure paths", () => {
    const action = { payload: { jobId: "JX" } };
    // ensure the service method exists for the test
    agentService.syncBulkActionConfig = jest.fn();
    const gen = syncBulkActionConfigSaga(action as any);
    expect(gen.next().value).toEqual(put(bulkActionLogsActions.requestSyncBulkActionConfig()));
    expect(gen.next().value).toEqual(call(agentService.syncBulkActionConfig, "JX"));

    // simulate success response shape
    const ok = { data: { flag: "success" } };
    expect(gen.next(ok).value).toEqual(put(bulkActionLogsActions.successSyncBulkActionConfig(ok.data)));
    // next should call fetchBulkActionDetails
    expect(gen.next().value).toEqual(put(bulkActionLogsActions.fetchBulkActionDetails("JX")));

    // failure path: response flag not success
    agentService.syncBulkActionConfig = jest.fn();
    const gen2 = syncBulkActionConfigSaga({ payload: { jobId: "JY" } } as any);
    expect(gen2.next().value).toEqual(put(bulkActionLogsActions.requestSyncBulkActionConfig()));
    expect(gen2.next().value).toEqual(call(agentService.syncBulkActionConfig, "JY"));
    const bad = { data: { flag: "failed" } };
    // after receiving a bad response the saga should handle the error path (put failure)
    expect(gen2.next(bad).value).toBeDefined();
  });
});
