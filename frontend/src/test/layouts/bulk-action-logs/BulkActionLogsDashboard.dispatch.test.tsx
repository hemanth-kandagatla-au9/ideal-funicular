import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../../layouts/bulk-action-logs/components/BulkActionLogsDashboard";
import bulkActionLogsActions from "../../../redux/actions/bulkActionLogs.action";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe("BulkActionLogsDashboard dispatch behavior", () => {
  it("dispatches fetchBulkActionDetails when selectedJobId exists", () => {
    const mockDispatch = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    // return a selectedJobId so Dashboard's effect dispatches
    (useSelector as jest.Mock).mockImplementation(() => "JOB-123");

    render((<Dashboard />) as any);

    const found = mockDispatch.mock.calls.some(c => c[0]?.type === bulkActionLogsActions.fetchBulkActionDetails("JOB-123").type);
    expect(found).toBe(true);
  });
});
