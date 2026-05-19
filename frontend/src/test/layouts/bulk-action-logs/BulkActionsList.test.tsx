import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { useSelector, useDispatch } from "react-redux";
import LeftPanel from "../../../layouts/bulk-action-logs/components/BulkActionsList";
import { BULK_ACTION_LOGS } from "../../../config/actions";

// Mock react-redux hooks
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe("LeftPanel (BulkActionsList) behaviour", () => {
  const mockDispatch = jest.fn();
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    mockDispatch.mockReset();
    mockOnSelect.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const setupSelectors = (overrides: any = {}) => {
    const state = {
      bulkActionLogs: {
        bulkActions: overrides.bulkActions ?? [],
        pagination: overrides.pagination ?? { pageNo: 0, totalPages: 3 },
        loading: overrides.loading ?? false,
        availableFilters: overrides.availableFilters ?? { actions: ["agent_config_sync"], users: ["admin"] },
      },
    };

    (useSelector as jest.Mock).mockImplementation((selector: any) => selector(state));
  };

  it("dispatches fetchBulkActions on mount", () => {
    setupSelectors();
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);

    expect(mockDispatch).toHaveBeenCalled();
    const calledWithFetch = mockDispatch.mock.calls.some(call => call[0]?.type === BULK_ACTION_LOGS.FETCH_BULK_ACTIONS);
    expect(calledWithFetch).toBe(true);
  });

  it("auto-selects the first job when jobs list exists", () => {
    setupSelectors({ bulkActions: [{ jobId: "J1" }, { jobId: "J2" }] });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);

    // onSelectJob should be called with first jobId
    expect(mockOnSelect).toHaveBeenCalledWith("J1");
  });

});
