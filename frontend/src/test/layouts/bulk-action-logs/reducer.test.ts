import reducer from "../../../redux/reducers/bulkActionLogsReducer";
import { BULK_ACTION_LOGS } from "../../../config/actions";
import { INITIAL_BULK_ACTION_LOGS_STATE } from "../../../types/BulkActionLogsState";

describe("bulkActionLogs reducer", () => {
  it("returns initial state when unknown action", () => {
    const result = reducer(undefined as any, { type: "UNKNOWN" } as any);
    expect(result).toEqual(INITIAL_BULK_ACTION_LOGS_STATE);
  });

  it("handles SUCCESS_FETCH_BULK_ACTIONS", () => {
    const payload = {
      data: {
        data: [{ jobId: "JOB-1" }],
        pagination: { pageNo: 0, limit: 10, totalRows: 1, totalPage: 1 },
        filters: { actions: ["T1"], users: ["u1"] },
      },
    };

    const newState = reducer(undefined as any, { type: BULK_ACTION_LOGS.SUCCESS_FETCH_BULK_ACTIONS, payload } as any);
    expect(newState.loading).toBe(false);
    expect(newState.bulkActions).toHaveLength(1);
    expect(newState.availableFilters.actions).toContain("T1");
  });

  it("handles SELECT_BULK_ACTION", () => {
    const newState = reducer(undefined as any, { type: BULK_ACTION_LOGS.SELECT_BULK_ACTION, payload: { jobId: "JOB-2" } } as any);
    expect(newState.selectedJobId).toBe("JOB-2");
  });

  it("updates selectedBulkAction status on SUCCESS_SYNC_BULK_ACTION_CONFIG", () => {
    const base = {
      ...INITIAL_BULK_ACTION_LOGS_STATE,
      selectedBulkAction: { jobId: "JOB-3", status: "Pending" } as any,
    } as any;

    const result = reducer(base, { type: BULK_ACTION_LOGS.SUCCESS_SYNC_BULK_ACTION_CONFIG } as any);
    expect(result.syncInProgress).toBe(false);
    expect(result.selectedBulkAction.status).toBe("In Progress");
  });
});
