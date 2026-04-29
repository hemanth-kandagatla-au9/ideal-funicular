import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { useSelector, useDispatch } from "react-redux";
import LeftPanel from "../../../layouts/bulk-action-logs/components/BulkActionsList";

// Mock react-redux hooks
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe("LeftPanel extra coverage", () => {
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

  it("renders ellipsis when many pages exist", () => {
    setupSelectors({ bulkActions: [{ jobId: "J1" }], pagination: { pageNo: 4, totalPages: 10 } });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);

    const ellipses = screen.getAllByText("...");
    expect(ellipses.length).toBeGreaterThan(0);
  });


  it("shows loading spinner when loading", () => {
    setupSelectors({ loading: true });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders total servers from serverSummary on card", () => {
    setupSelectors({ bulkActions: [{ jobId: "J1", type: "t", serverSummary: { total: 5, success: 2 } }], pagination: { pageNo: 0, totalPages: 1 } });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);

    expect(screen.getByText("5 Servers")).toBeInTheDocument();
  });
});
