/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { useSelector, useDispatch } from "react-redux";
import Dashboard from "../../../layouts/bulk-action-logs/components/BulkActionLogsDashboard";

// Mock react-redux hooks
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

// Mock Download helper and agentManagement service
jest.mock("../../../layouts/bulk-action-logs/helpers/DownloadBulkActionsLogsToExcel", () => jest.fn());
const mockDownload = require('../../../layouts/bulk-action-logs/helpers/DownloadBulkActionsLogsToExcel');
jest.mock("../../../services/agent/agentManagement.service", () => ({
  getBulkActionLogs: jest.fn().mockResolvedValue({ data: { data: [{ jobId: "J1" }] } }),
}));

describe("BulkActionLogsDashboard export behavior", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setupSelectors = (overrides: any = {}) => {
    const state = {
      bulkActionLogs: {
        selectedJobId: overrides.selectedJobId ?? null,
        selectedBulkAction: overrides.selectedBulkAction ?? null,
        loading: overrides.loading ?? false,
        bulkActions: overrides.bulkActions ?? [],
        pagination: overrides.pagination ?? { totalRecords: overrides.totalRecords ?? 0 },
      },
    };

    (useSelector as jest.Mock).mockImplementation((selector: any) => selector(state));
  };

  it("calls DownloadBulkActionLogsToExcel when Export clicked with correct pageNo and pageSize", async () => {
    setupSelectors({ pagination: { pageNo: 1, totalRecords: 77 } });

    render((<Dashboard />) as any);

    const exportBtn = await screen.findByText("Export");
    fireEvent.click(exportBtn);

    expect(mockDownload).toHaveBeenCalledWith(1, 10);
  });
});
