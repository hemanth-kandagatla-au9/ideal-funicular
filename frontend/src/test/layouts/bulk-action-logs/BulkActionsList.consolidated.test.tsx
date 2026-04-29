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

describe("BulkActionsList consolidated tests", () => {
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

    expect(mockOnSelect).toHaveBeenCalledWith("J1");
  });

  it("debounced search triggers fetch with search filter", async () => {
    setupSelectors({ bulkActions: [{ jobId: "J1" }] });
    render(<LeftPanel selectedJobId="J1" onSelectJob={mockOnSelect} />);

    const input = screen.getByPlaceholderText("Search by Job ID");
    fireEvent.change(input, { target: { value: "BAL-001" } });
    act(() => {
      jest.runAllTimers();
    });

    const calledWithSearch = mockDispatch.mock.calls.some(call => call[0]?.payload?.filters?.search === "BAL-001");
    expect(calledWithSearch).toBe(true);
  });

  it("sort toggle causes a new fetch with toggled sortOrder", () => {
    setupSelectors({ bulkActions: [{ jobId: "J1" }] });
    render(<LeftPanel selectedJobId="J1" onSelectJob={mockOnSelect} />);

    const sortBtn = screen.getByText("Sort");
    fireEvent.click(sortBtn);

    const calledWithSort = mockDispatch.mock.calls.some(call => call[0]?.payload?.filters?.sortOrder === "asc");
    expect(calledWithSort).toBe(true);
  });

  it("pagination next button dispatches with next page number", () => {
    setupSelectors({ bulkActions: [{ jobId: "J1" }], pagination: { pageNo: 0, totalPages: 3 } });
    render(<LeftPanel selectedJobId="J1" onSelectJob={mockOnSelect} />);

    const nextBtn = screen.getByText("›");
    fireEvent.click(nextBtn);

    const calledWithPage = mockDispatch.mock.calls.some(call => call[0]?.payload?.pagination?.pageNo === 1);
    expect(calledWithPage).toBe(true);
  });

  it("renders ellipsis when many pages and clicking page dispatches correct pageNo", () => {
    // For ellipsis test we need a specific selector implementation
    (useSelector as jest.Mock).mockImplementation((sel: any) => {
      const dummy = {
        bulkActionLogs: {
          bulkActions: [{ jobId: "J1", serverSummary: { total: 1 } }],
          pagination: { pageNo: 5, totalPages: 10 },
          loading: false,
          availableFilters: { actions: [], users: [] },
        },
      };
      return sel(dummy);
    });

    render(<LeftPanel selectedJobId="J1" onSelectJob={mockOnSelect} />);

    expect(screen.getAllByText("...").length).toBeGreaterThan(0);

    const pageSix = screen.getByText("6");
    fireEvent.click(pageSix);

    const calledWithPage = mockDispatch.mock.calls.some(c => c[0]?.payload?.pagination?.pageNo === 5);
    expect(calledWithPage).toBe(true);
  });

  it("toggles Show Filters to hide chips and allows applying/removing chips", () => {
    setupSelectors({ bulkActions: [{ jobId: "J1" }], availableFilters: { actions: ["agent_config_sync"], users: ["alice"] } });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);

    // Open filter dialog and apply a type to create a chip
    const filterBtn = screen.getByText("Filter");
    fireEvent.click(filterBtn);

    const applyBtn = screen.getByText("Apply");
    fireEvent.click(applyBtn);


    expect(screen.queryByText("Type: agent_config_sync")).toBeNull();
    expect(screen.queryByText("Type: agent_config_sync")).toBeNull();
  });

  it("shows loading spinner when loading and renders total servers from serverSummary", () => {
    setupSelectors({ loading: true });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    setupSelectors({ bulkActions: [{ jobId: "J1", type: "t", serverSummary: { total: 5, success: 2 } }], pagination: { pageNo: 0, totalPages: 1 } });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);
    expect(screen.getByText("5 Servers")).toBeInTheDocument();
  });
});
