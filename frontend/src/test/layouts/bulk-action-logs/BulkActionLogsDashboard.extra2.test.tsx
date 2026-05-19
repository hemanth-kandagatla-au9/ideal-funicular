import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { useSelector, useDispatch } from "react-redux";
import Dashboard from "../../../layouts/bulk-action-logs/components/BulkActionLogsDashboard";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Mock Download helper and agentManagement service to throw
jest.mock("../../../layouts/bulk-action-logs/helpers/DownloadBulkActionsLogsToExcel", () => jest.fn());
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockDownload = require("../../../layouts/bulk-action-logs/helpers/DownloadBulkActionsLogsToExcel");
jest.mock("../../../services/agent/agentManagement.service", () => ({
  getBulkActionLogs: jest.fn().mockImplementation(() => {
    throw new Error("fetch failed");
  }),
}));

describe("BulkActionLogsDashboard export error handling", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useSelector as jest.Mock).mockImplementation((sel: any) => sel({ bulkActionLogs: { pagination: { totalRecords: 0 } } }));
  });

  afterEach(() => jest.clearAllMocks());

  it("still calls Download helper with default pageNo when pagination has no pageNo", async () => {
    render((<Dashboard />) as any);

    const exportBtn = await screen.findByText("Export");
    fireEvent.click(exportBtn);

    expect(mockDownload).toHaveBeenCalledWith(0, 10);
  });
});
