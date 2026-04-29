/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Dashboard from "../../../layouts/bulk-action-logs/components/BulkActionLogsDashboard";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn().mockImplementation((fn: any) => fn({})),
}));

const mockDownload = jest.fn();
jest.mock("../../../layouts/bulk-action-logs/helpers/DownloadBulkActionsLogsToExcel", () => ({
  __esModule: true,
  default: () => mockDownload(),
}));

describe("BulkActionLogsDashboard", () => {
  beforeEach(() => {
    mockDownload.mockReset();
  });

  it("calls DownloadBulkActionLogsToExcel when Export clicked", async () => {
    // ensure useDispatch returns a function so component can call dispatch
    const rr = require("react-redux");
    (rr.useDispatch as jest.Mock).mockReturnValue(jest.fn());

    render(<Dashboard />);

    const exportBtn = screen.getByText("Export");
    fireEvent.click(exportBtn);

    expect(mockDownload).toHaveBeenCalled();
  });
});
