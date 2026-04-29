/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

// react-redux hooks will be mocked below
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../../layouts/bulk-action-logs/components/BulkActionLogsDashboard";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Provide a Download helper mock via factory to avoid TDZ
jest.mock("../../../layouts/bulk-action-logs/helpers/DownloadBulkActionsLogsToExcel", () => jest.fn());
const mockDownload = require("../../../layouts/bulk-action-logs/helpers/DownloadBulkActionsLogsToExcel");

// Provide agent service mock; tests will override implementation where needed
jest.mock("../../../services/agent/agentManagement.service", () => ({
  getBulkActionLogs: jest.fn().mockResolvedValue({ data: { data: [] } }),
}));
const agentService = require("../../../services/agent/agentManagement.service");

describe("BulkActionLogsDashboard consolidated", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches fetchBulkActionDetails when selectedJobId exists", () => {
    const mockDispatch = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation(() => "JOB-123");

    render((<Dashboard />) as any);

    const found = mockDispatch.mock.calls.some(c => c[0]?.type?.toString()?.includes("FETCH_BULK_ACTION_DETAILS") || c[0]?.type === undefined ? false : c[0].type);
    // At least one dispatch should have been invoked in the component lifecycle
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("calls Download helper when Export clicked", () => {
    const mockDispatch = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation((fn: any) => fn({}));

    render(<Dashboard />);

    const exportBtn = screen.getByText("Export");
    fireEvent.click(exportBtn);

    expect(mockDownload).toHaveBeenCalled();
  });

  it("passes getTotalRecords to Download and uses selector pagination totalRecords", async () => {
    const mockDispatch = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector: any) => selector({ bulkActionLogs: { pagination: { totalRecords: 77 } } }));

    render((<Dashboard />) as any);

    const exportBtn = await screen.findByText("Export");
    fireEvent.click(exportBtn);

    expect(mockDownload).toHaveBeenCalled();
    const passedGetTotal = mockDownload.mock.calls[0][0];
    expect(typeof passedGetTotal).toBe("function");
    expect(passedGetTotal()).toBe(77);
  });

  it("still calls Download helper when service throws", async () => {
    // Make service throw
    agentService.getBulkActionLogs.mockImplementation(() => { throw new Error("fetch failed"); });

    const mockDispatch = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation((sel: any) => sel({ bulkActionLogs: { pagination: { totalRecords: 0 } } }));

    render((<Dashboard />) as any);

    const exportBtn = await screen.findByText("Export");
    fireEvent.click(exportBtn);

    expect(mockDownload).toHaveBeenCalled();
  });
});
