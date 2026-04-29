import bulkActionLogsReducer from "../../../redux/reducers/bulkActionLogsReducer";
import { INITIAL_BULK_ACTION_LOGS_STATE } from "../../../types/BulkActionLogsState";
import { BULK_ACTION_LOGS } from "../../../config/actions";

describe("bulkActionLogsReducer", () => {
  it("returns initial state by default", () => {
    const next = bulkActionLogsReducer(undefined, { type: 'NOOP' });
    expect(next).toEqual(INITIAL_BULK_ACTION_LOGS_STATE);
  });

  it("handles FETCH_BULK_ACTIONS and SUCCESS/FAILURE flows", () => {
    const fetching = bulkActionLogsReducer(undefined, { type: BULK_ACTION_LOGS.FETCH_BULK_ACTIONS });
    expect(fetching.loading).toBe(true);

    const successPayload = { payload: { data: { data: [{ jobId: 'J1' }], pagination: { pageNo: 0, limit: 10, totalRows: 1, totalPage: 1 }, filters: { actions: ['a'], users: ['u'] } } } };
    const afterSuccess = bulkActionLogsReducer(fetching, { type: BULK_ACTION_LOGS.SUCCESS_FETCH_BULK_ACTIONS, ...successPayload });
    expect(afterSuccess.loading).toBe(false);
    expect(afterSuccess.bulkActions.length).toBe(1);
    expect(afterSuccess.availableFilters.actions).toContain('a');

    const afterFailure = bulkActionLogsReducer(afterSuccess, { type: BULK_ACTION_LOGS.FAILURE_FETCH_BULK_ACTIONS, error: 'err' });
    expect(afterFailure.loading).toBe(false);
    expect(afterFailure.error).toBe('err');
    expect(afterFailure.bulkActions).toEqual([]);
  });

  it("handles FETCH_BULK_ACTION_DETAILS and SUCCESS/FAILURE flows", () => {
    const fetching = bulkActionLogsReducer(undefined, { type: BULK_ACTION_LOGS.FETCH_BULK_ACTION_DETAILS, payload: { jobId: 'JOB-1' } });
    expect(fetching.detailsLoading).toBe(true);
    expect(fetching.selectedJobId).toBe('JOB-1');

    const details = { data: { data: { jobId: 'JOB-1', servers: [] } } };
    const afterSuccess = bulkActionLogsReducer(fetching, { type: BULK_ACTION_LOGS.SUCCESS_FETCH_BULK_ACTION_DETAILS, payload: details });
    expect(afterSuccess.detailsLoading).toBe(false);
    expect(afterSuccess.selectedBulkAction?.jobId).toBe('JOB-1');

    const afterFailure = bulkActionLogsReducer(afterSuccess, { type: BULK_ACTION_LOGS.FAILURE_FETCH_BULK_ACTION_DETAILS, error: 'nope' });
    expect(afterFailure.detailsLoading).toBe(false);
    expect(afterFailure.detailsError).toBe('nope');
  });

  it("updates filters and pagination", () => {
    const prev = INITIAL_BULK_ACTION_LOGS_STATE;
    const updated = bulkActionLogsReducer(prev, { type: BULK_ACTION_LOGS.UPDATE_BULK_ACTION_FILTERS, payload: { filters: { user: 'bob' } } });
    expect(updated.filters.user).toBe('bob');
    expect(updated.pagination.pageNo).toBe(0);

    const paged = bulkActionLogsReducer(updated, { type: BULK_ACTION_LOGS.UPDATE_BULK_ACTION_PAGINATION, payload: { pageNo: 2, limit: 20 } });
    expect(paged.pagination.pageNo).toBe(2);
    expect(paged.pagination.limit).toBe(20);
  });

  it("selects bulk action and sync flows", () => {
    const selected = bulkActionLogsReducer(undefined, { type: BULK_ACTION_LOGS.SELECT_BULK_ACTION, payload: { jobId: 'X' } });
    expect(selected.selectedJobId).toBe('X');

    const syncStart = bulkActionLogsReducer(undefined, { type: BULK_ACTION_LOGS.SYNC_BULK_ACTION_CONFIG });
    expect(syncStart.syncInProgress).toBe(true);

    // simulate having selectedBulkAction and success
    const withSelected = { ...INITIAL_BULK_ACTION_LOGS_STATE, selectedBulkAction: { jobId: 'X', status: 'Pending' } as any };
    const syncSuccess = bulkActionLogsReducer(withSelected as any, { type: BULK_ACTION_LOGS.SUCCESS_SYNC_BULK_ACTION_CONFIG, payload: { data: { flag: 'success' } } });
    expect(syncSuccess.syncInProgress).toBe(false);
    expect(syncSuccess.selectedBulkAction?.status).toBe('In Progress');

    const syncFail = bulkActionLogsReducer(undefined, { type: BULK_ACTION_LOGS.FAILURE_SYNC_BULK_ACTION_CONFIG, error: 'bad' });
    expect(syncFail.syncInProgress).toBe(false);
    expect(syncFail.syncError).toBe('bad');
  });

  it("handles export success/failure", () => {
    const start = bulkActionLogsReducer(undefined, { type: BULK_ACTION_LOGS.EXPORT_BULK_ACTION_LOGS });
    expect(start.loading).toBe(true);

    const ok = bulkActionLogsReducer(start, { type: BULK_ACTION_LOGS.SUCCESS_EXPORT_BULK_ACTION_LOGS });
    expect(ok.loading).toBe(false);

    const fail = bulkActionLogsReducer(ok, { type: BULK_ACTION_LOGS.FAILURE_EXPORT_BULK_ACTION_LOGS, error: 'e' });
    expect(fail.loading).toBe(false);
    expect(fail.error).toBe('e');
  });
});
