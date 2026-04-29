import * as selectors from "../../../redux/selectors/bulkActionLog.selectors";

describe("bulkActionLog selectors", () => {
  const state: any = {
    bulkActionLogs: {
      selectedBulkAction: {
        jobId: "JOB-1",
        servers: [
          { serverId: "s1", serverName: "server-1", status: "Success" },
          { serverId: "s2", serverName: "server-2", status: "Failure" },
          { serverId: "s3", serverName: "server-3", status: "Pending" },
          { serverId: "s4", serverName: "server-4", status: "In Progress" },
        ],
      },
      pagination: { pageNo: 1, limit: 10, totalRows: 5, totalPage: 1 },
      bulkActions: [
        { jobId: "JOB-1", type: "T1", status: "Completed" },
        { jobId: "JOB-2", type: "T2", status: "Failed" },
      ],
      selectedJobId: "JOB-1",
      availableFilters: { actions: ["T1"], users: ["u1"] },
    },
  };

  it("calculates server counts correctly", () => {
    expect(selectors.getSuccessfulServerCount(state)).toBe(1);
    expect(selectors.getFailedServerCount(state)).toBe(1);
    expect(selectors.getPendingServerCount(state)).toBe(2);
  });

  it("returns pagination totals", () => {
    expect(selectors.getTotalBulkActionCount(state)).toBe(5);
    expect(selectors.getPageSize(state)).toBe(10);
  });

  it("composite selectors work", () => {
    const byId = selectors.getBulkActionById("JOB-2");
    expect(byId(state)).toEqual({ jobId: "JOB-2", type: "T2", status: "Failed" });

    const isSelected = selectors.isJobSelected("JOB-1");
    expect(isSelected(state)).toBe(true);
  });
});
