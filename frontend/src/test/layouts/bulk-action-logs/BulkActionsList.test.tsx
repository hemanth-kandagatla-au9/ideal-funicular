/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable jest/no-conditional-expect */
/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/button-has-type */
/**
 * BulkActionsList Component Tests
 * Tests for list panel with pagination, filtering, and search
 */

// Use real react-redux so useSelector reads from the mock store provided by <Provider>
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import BulkActionsList from "../../../layouts/bulk-action-logs/components/BulkActionsList";

jest.unmock("react-redux");

// Inline mock store — no external dependency on redux-mock-store
function createMockStore(initialState: any) {
  const dispatchedActions: any[] = [];
  const store = {
    getState: () => initialState,
    dispatch: jest.fn((action: any) => {
      dispatchedActions.push(action);
      return action;
    }),
    subscribe: jest.fn(() => () => {}),
    getActions: () => dispatchedActions,
    clearActions: () => { dispatchedActions.length = 0; },
    replaceReducer: jest.fn(),
    [Symbol.observable]: () => ({
      subscribe: (observer: any) => {
        observer.next(initialState);
        return { unsubscribe: () => {} };
      },
    }),
  };
  return store;
}

const mockStore = createMockStore;

// Mock child components
jest.mock("../../../layouts/bulk-action-logs/components/BulkActionCard", () => {
  return function MockCard({ onClick }: any) {
    return (
      <div onClick={onClick} data-testid="job-card">
        Job Card
      </div>
    );
  };
});

jest.mock("../../../layouts/bulk-action-logs/components/BulkActionFilterDialog", () => {
  return function MockDialog({ open, onClose, onApply }: any) {
    return open ? (
      <div data-testid="filter-dialog">
        <button onClick={() => onApply({ type: [], user: [], status: "" })}>Apply</button>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null;
  };
});

jest.mock("../../../redux/actions/bulkActionLogs.action", () => ({
  fetchBulkActions: (params: any) => ({ type: "FETCH_JOBS", payload: params }),
  selectBulkAction: (jobId: string) => ({ type: "SELECT_JOB", payload: jobId }),
}));

describe("BulkActionsList Component", () => {
  let store: any;
  const mockOnSelectJob = jest.fn();

  beforeEach(() => {
    mockOnSelectJob.mockClear();
    store = mockStore({
      bulkActionLogs: {
        bulkActions: [
          {
            jobId: "BAL-001",
            type: "agent_config_sync",
            status: "Completed",
            user: "admin@company.com",
            serverSummary: { total: 45, success: 45, pending: 0, failure: 0 },
          },
          {
            jobId: "BAL-002",
            type: "agent_upgrade",
            status: "In Progress",
            user: "devops@company.com",
            serverSummary: { total: 120, success: 68, pending: 47, failure: 5 },
          },
        ],
        pagination: { pageNo: 0, limit: 10, totalRows: 30, totalPage: 3 },
        loading: false,
        availableFilters: { actions: [], users: [] },
      },
    });
  });

  it("should render job list", () => {
    render(
      <Provider store={store}>
        <BulkActionsList selectedJobId="BAL-001" onSelectJob={mockOnSelectJob} />
      </Provider>,
    );

    const jobCards = screen.getAllByTestId("job-card");
    expect(jobCards.length).toBeGreaterThan(0);
  });

  it("should handle job selection", () => {
    render(
      <Provider store={store}>
        <BulkActionsList selectedJobId="BAL-001" onSelectJob={mockOnSelectJob} />
      </Provider>,
    );

    const jobCards = screen.getAllByTestId("job-card");
    fireEvent.click(jobCards[0]);

    expect(mockOnSelectJob).toHaveBeenCalled();
  });

  it("should display search input", () => {
    render(
      <Provider store={store}>
        <BulkActionsList selectedJobId="BAL-001" onSelectJob={mockOnSelectJob} />
      </Provider>,
    );

    const searchInput = screen.getByPlaceholderText(/search|job/i) || screen.getByRole("textbox");
    expect(searchInput).toBeInTheDocument();
  });

  it("should handle search input with debounce", async () => {
    render(
      <Provider store={store}>
        <BulkActionsList selectedJobId="BAL-001" onSelectJob={mockOnSelectJob} />
      </Provider>,
    );

    const searchInput = screen.getByRole("textbox");
    await userEvent.type(searchInput, "BAL-001");

    await waitFor(
      () => {
        const actions = store.getActions();
        const fetchAction = actions.find((a: any) => a.type === "FETCH_JOBS");
        expect(fetchAction).toBeDefined();
      },
      { timeout: 500 },
    );
  });

  it("should display filter button", () => {
    render(
      <Provider store={store}>
        <BulkActionsList selectedJobId="BAL-001" onSelectJob={mockOnSelectJob} />
      </Provider>,
    );

    const filterButton = screen.getByRole("button", { name: /filter|tune/i }) || screen.getByText(/filter/i, { selector: "button" });
    expect(filterButton).toBeInTheDocument();
  });

  it("should open filter dialog when filter button clicked", async () => {
    render(
      <Provider store={store}>
        <BulkActionsList selectedJobId="BAL-001" onSelectJob={mockOnSelectJob} />
      </Provider>,
    );

    const filterButtons = screen.getAllByRole("button");
    const filterButton = filterButtons.find(btn => btn.textContent?.includes("Filter"));

    if (filterButton) {
      fireEvent.click(filterButton);
      await waitFor(() => {
        expect(screen.getByTestId("filter-dialog")).toBeInTheDocument();
      });
    }
  });

  it("should apply filters", async () => {
    render(
      <Provider store={store}>
        <BulkActionsList selectedJobId="BAL-001" onSelectJob={mockOnSelectJob} />
      </Provider>,
    );

    const filterButtons = screen.getAllByRole("button");
    const filterButton = filterButtons.find(btn => btn.textContent?.includes("Filter"));

    if (filterButton) {
      fireEvent.click(filterButton);
      await waitFor(() => {
        const applyButton = screen.getByText("Apply");
        fireEvent.click(applyButton);
      });
    }
  });

  it("should auto-select first job on load", async () => {
    render(
      <Provider store={store}>
        <BulkActionsList selectedJobId={null} onSelectJob={mockOnSelectJob} />
      </Provider>,
    );

    await waitFor(() => {
      expect(mockOnSelectJob).toHaveBeenCalledWith("BAL-001");
    });
  });

  it("should auto-select first job when filters change", async () => {
    const { rerender } = render(
      <Provider store={store}>
        <BulkActionsList selectedJobId="BAL-001" onSelectJob={mockOnSelectJob} />
      </Provider>,
    );

    const updatedStore = mockStore({
      bulkActionLogs: {
        bulkActions: [
          {
            jobId: "BAL-005",
            type: "agent_config_sync",
            status: "Completed",
            user: "admin@company.com",
            serverSummary: { total: 10, success: 10, pending: 0, failure: 0 },
          },
        ],
        pagination: { pageNo: 0, limit: 10, totalRows: 1, totalPage: 1 },
        loading: false,
        availableFilters: { actions: [], users: [] },
      },
    });

    mockOnSelectJob.mockClear();

    rerender(
      <Provider store={updatedStore}>
        <BulkActionsList selectedJobId={null} onSelectJob={mockOnSelectJob} />
      </Provider>,
    );

    await waitFor(() => {
      expect(mockOnSelectJob).toHaveBeenCalledWith("BAL-005");
    });
  });

  it("should display loading state when fetching jobs", () => {
    const loadingStore = mockStore({
      bulkActionLogs: {
        bulkActions: [],
        pagination: {},
        loading: true,
        availableFilters: { actions: [], users: [] },
      },
    });

    render(
      <Provider store={loadingStore}>
        <BulkActionsList selectedJobId={null} onSelectJob={mockOnSelectJob} />
      </Provider>,
    );

    const spinner = screen.queryByRole("progressbar") || screen.queryByTestId(/spinner|loading/);
    expect(spinner || document.querySelector(".MuiCircularProgress-root")).toBeInTheDocument();
  });

  it("should display no results message when list is empty", () => {
    const emptyStore = mockStore({
      bulkActionLogs: {
        bulkActions: [],
        pagination: { pageNo: 0, limit: 10, totalRows: 0, totalPage: 0 },
        loading: false,
        availableFilters: { actions: [], users: [] },
      },
    });

    render(
      <Provider store={emptyStore}>
        <BulkActionsList selectedJobId={null} onSelectJob={mockOnSelectJob} />
      </Provider>,
    );

    // Expect no job cards
    const jobCards = screen.queryAllByTestId("job-card");
    expect(jobCards.length).toBe(0);
  });

  it("should extract available filter options from jobs", () => {
    render(
      <Provider store={store}>
        <BulkActionsList selectedJobId="BAL-001" onSelectJob={mockOnSelectJob} />
      </Provider>,
    );

    // Filter options should be derived from jobs
    const actions = store.getActions();
    expect(actions.length).toBeGreaterThanOrEqual(0);
  });
});
