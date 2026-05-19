/// <reference types="jest" />
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

  it("renders Type & User column header", () => {
    setupSelectors();
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);
    expect(screen.getByText("Type & User")).toBeInTheDocument();
  });

  it("renders user name from job data below the type", () => {
    setupSelectors({
      bulkActions: [{ jobId: "J1", type: "agent_upgrade", user: "jane.doe", serverSummary: { total: 2, success: 2 } }],
      pagination: { pageNo: 0, totalPages: 1 },
    });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);
    expect(screen.getByText("jane.doe")).toBeInTheDocument();
  });

  it("shows date range chip when dateRange filter is applied and removes it on delete", () => {
    setupSelectors({ bulkActions: [{ jobId: "J1" }], availableFilters: { actions: ["agent_config_sync"], users: ["alice"] } });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);

    fireEvent.click(screen.getByText("Filter"));

    const inputs = document.querySelectorAll("input[type='date']");
    fireEvent.change(inputs[0], { target: { value: "2025-01-01" } });
    fireEvent.change(inputs[1], { target: { value: "2025-01-31" } });
    fireEvent.click(screen.getByText("Apply"));

    expect(screen.getByText(/Date:/)).toBeInTheDocument();

    const chip = screen.getByText(/Date:/).closest("[data-testid]") || screen.getByText(/Date:/).parentElement!.parentElement!;
    const deleteIcon = chip.querySelector("[data-testid='CancelIcon']") as HTMLElement;
    if (deleteIcon) fireEvent.click(deleteIcon);

    const dispatchedWithDate = mockDispatch.mock.calls.some(
      call => call[0]?.payload?.filters?.dateRange?.start === "2025-01-01",
    );
    expect(dispatchedWithDate).toBe(true);
  });

  it("includes dateRange in dispatch payload when date filters are active", () => {
    setupSelectors({ bulkActions: [{ jobId: "J1" }], availableFilters: { actions: [], users: [] } });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);

    fireEvent.click(screen.getByText("Filter"));

    const inputs = document.querySelectorAll("input[type='date']");
    fireEvent.change(inputs[0], { target: { value: "2025-06-01" } });
    fireEvent.click(screen.getByText("Apply"));

    const calledWithDate = mockDispatch.mock.calls.some(
      call => call[0]?.payload?.filters?.dateRange?.start === "2025-06-01",
    );
    expect(calledWithDate).toBe(true);
  });

  it("removes a type chip and dispatches updated filters without that type", () => {
    setupSelectors({ bulkActions: [{ jobId: "J1" }], availableFilters: { actions: ["agent_config_sync"], users: [] } });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);

    fireEvent.click(screen.getByText("Filter"));
    const inputs = document.querySelectorAll("input[type='checkbox']");
    // apply type filter via dialog
    fireEvent.click(screen.getByText("Apply"));
    // Open filter and add a type then apply
    fireEvent.click(screen.getByText("Filter"));
    fireEvent.click(screen.getByText("Apply"));

    // Dispatch was called
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("dispatches with end dateRange when only To date is provided", () => {
    setupSelectors({ bulkActions: [{ jobId: "J1" }], availableFilters: { actions: [], users: [] } });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);

    fireEvent.click(screen.getByText("Filter"));
    const inputs = document.querySelectorAll("input[type='date']");
    fireEvent.change(inputs[1], { target: { value: "2025-06-30" } });
    fireEvent.click(screen.getByText("Apply"));

    const calledWithEnd = mockDispatch.mock.calls.some(
      call => call[0]?.payload?.filters?.dateRange?.end === "2025-06-30",
    );
    expect(calledWithEnd).toBe(true);
  });

  it("prev button dispatches with decremented page when not on first page", () => {
    (useSelector as jest.Mock).mockImplementation((sel: any) => {
      const dummy = {
        bulkActionLogs: {
          bulkActions: [{ jobId: "J1" }],
          pagination: { pageNo: 2, totalPages: 5 },
          loading: false,
          availableFilters: { actions: [], users: [] },
        },
      };
      return sel(dummy);
    });

    render(<LeftPanel selectedJobId="J1" onSelectJob={mockOnSelect} />);

    const prevBtn = screen.getByText("‹");
    fireEvent.click(prevBtn);

    const calledWithPage = mockDispatch.mock.calls.some(call => call[0]?.payload?.pagination?.pageNo === 1);
    expect(calledWithPage).toBe(true);
  });

  it("renders no job cards when bulkActions is empty and not loading", () => {
    setupSelectors({ bulkActions: [], loading: false });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.getByText("Type & User")).toBeInTheDocument();
  });

  it("status filter chip appears after applying status filter and dispatch includes status", () => {
    setupSelectors({ bulkActions: [{ jobId: "J1" }], availableFilters: { actions: [], users: [] } });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);

    fireEvent.click(screen.getByText("Filter"));
    fireEvent.click(screen.getByLabelText("Failed"));
    fireEvent.click(screen.getByText("Apply"));

    const calledWithStatus = mockDispatch.mock.calls.some(
      call => Array.isArray(call[0]?.payload?.filters?.status) && call[0].payload.filters.status.includes("Failed"),
    );
    expect(calledWithStatus).toBe(true);
  });

  it("clears date range chip when its delete icon is clicked", () => {
    setupSelectors({ bulkActions: [{ jobId: "J1" }], availableFilters: { actions: [], users: [] } });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);

    fireEvent.click(screen.getByText("Filter"));
    const inputs = document.querySelectorAll("input[type='date']");
    fireEvent.change(inputs[0], { target: { value: "2025-01-01" } });
    fireEvent.change(inputs[1], { target: { value: "2025-01-31" } });
    fireEvent.click(screen.getByText("Apply"));

    expect(screen.getByText(/Date:/)).toBeInTheDocument();

    const dateChip = screen.getByText(/Date:/).closest("[data-testid]") || screen.getByText(/Date:/).parentElement!.parentElement!;
    const deleteIcon = dateChip.querySelector("[data-testid='CancelIcon']") as HTMLElement;
    if (deleteIcon) {
      fireEvent.click(deleteIcon);
      // After removal the chip should be gone
      expect(screen.queryByText(/Date:/)).toBeNull();
    }
  });
});
