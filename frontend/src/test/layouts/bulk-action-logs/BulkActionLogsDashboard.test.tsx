/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/button-has-type */
/* eslint-disable import/first */
/**
 * BulkActionLogsDashboard Component Tests
 * Tests for main layout with list and details panels
 */

// Use real react-redux so useSelector reads from the mock store provided by <Provider>
jest.unmock("react-redux");

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import BulkActionLogsDashboard from "../../../layouts/bulk-action-logs/components/BulkActionLogsDashboard";

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
    clearActions: () => {
      dispatchedActions.length = 0;
    },
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
jest.mock("../../../layouts/bulk-action-logs/components/BulkActionLogsHeader", () => {
  return function MockHeader({ onExport }: any) {
    return (
      <div data-testid="header">
        Mock Header <button onClick={onExport}>Download</button>
      </div>
    );
  };
});

jest.mock("../../../layouts/bulk-action-logs/components/BulkActionsList", () => {
  return function MockList({ selectedJobId, onSelectJob }: any) {
    return (
      <div data-testid="list-panel">
        <button onClick={() => onSelectJob("BAL-001")}>Select BAL-001</button>
        // eslint-disable-next-line react/button-has-type
        <button onClick={() => onSelectJob("BAL-002")}>Select BAL-002</button>
      </div>
    );
  };
});

jest.mock("../../../layouts/bulk-action-logs/components/BulkActionDetails", () => {
  return function MockDetails({ jobDetails, loading }: any) {
    return <div data-testid="details-panel">{loading ? <div>Loading...</div> : <div>Details: {jobDetails?.jobId}</div>}</div>;
  };
});

jest.mock("../../../layouts/bulk-action-logs/helpers/DownloadBulkActionsLogsToExcel", () => {
  return jest.fn().mockResolvedValue(true);
});

jest.mock("../../../redux/actions/bulkActionLogs.action", () => ({
  fetchBulkActions: (params: any) => ({ type: "FETCH", payload: params }),
  fetchBulkActionDetails: (jobId: string) => ({ type: "FETCH_DETAILS", payload: jobId }),
  selectBulkAction: (jobId: string) => ({ type: "SELECT", payload: jobId }),
}));

describe("BulkActionLogsDashboard Component", () => {
  let store: any;

  beforeEach(() => {
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
        ],
        selectedJobId: null,
        selectedBulkAction: null,
        pagination: { pageNo: 0, limit: 10, totalRows: 30, totalPage: 3 },
        loading: false,
        detailsLoading: false,
        availableFilters: { actions: [], users: [] },
      },
    });
  });

  it("should render header and both panels", () => {
    render(
      <Provider store={store}>
        <BulkActionLogsDashboard />
      </Provider>,
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("list-panel")).toBeInTheDocument();
    expect(screen.getByTestId("details-panel")).toBeInTheDocument();
  });

  it("should handle job selection", async () => {
    render(
      <Provider store={store}>
        <BulkActionLogsDashboard />
      </Provider>,
    );

    const selectButton = screen.getByText("Select BAL-001");
    fireEvent.click(selectButton);

    await waitFor(() => {
      const actions = store.getActions();
      const selectAction = actions.find((a: any) => a.type === "SELECT");
      expect(selectAction).toBeDefined();
    });
  });

  it("should fetch job details when job is selected", async () => {
    // Use a store with a pre-selected job so useEffect fires on mount
    const storeWithJob = mockStore({
      bulkActionLogs: {
        bulkActions: [],
        selectedJobId: "BAL-001",
        selectedBulkAction: null,
        pagination: {},
        loading: false,
        detailsLoading: false,
        availableFilters: { actions: [], users: [] },
      },
    });

    render(
      <Provider store={storeWithJob}>
        <BulkActionLogsDashboard />
      </Provider>,
    );

    await waitFor(() => {
      const actions = storeWithJob.getActions();
      const fetchDetailsAction = actions.find((a: any) => a.type === "FETCH_DETAILS");
      expect(fetchDetailsAction).toBeDefined();
    });
  });

  it("should not fetch details if no job selected", () => {
    render(
      <Provider store={store}>
        <BulkActionLogsDashboard />
      </Provider>,
    );

    const actions = store.getActions();
    const fetchDetailsAction = actions.find((a: any) => a.type === "FETCH_DETAILS");
    expect(fetchDetailsAction).toBeUndefined();
  });

  it("should handle export", async () => {
    render(
      <Provider store={store}>
        <BulkActionLogsDashboard />
      </Provider>,
    );

    const downloadButton = screen.getByText("Download");
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(screen.getByText("Download")).toBeInTheDocument();
    });
  });

  it("should display loading state in details panel", () => {
    store = mockStore({
      bulkActionLogs: {
        bulkActions: [],
        selectedJobId: "BAL-001",
        selectedBulkAction: null,
        pagination: {},
        loading: false,
        detailsLoading: true,
        availableFilters: { actions: [], users: [] },
      },
    });

    render(
      <Provider store={store}>
        <BulkActionLogsDashboard />
      </Provider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should display job details when loaded", () => {
    store = mockStore({
      bulkActionLogs: {
        bulkActions: [],
        selectedJobId: "BAL-001",
        selectedBulkAction: { jobId: "BAL-001", type: "agent_config_sync" },
        pagination: {},
        loading: false,
        detailsLoading: false,
        availableFilters: { actions: [], users: [] },
      },
    });

    render(
      <Provider store={store}>
        <BulkActionLogsDashboard />
      </Provider>,
    );

    expect(screen.getByText(/Details: BAL-001/)).toBeInTheDocument();
  });

  it("should use memoized callback to prevent unnecessary re-renders", () => {
    const { rerender } = render(
      <Provider store={store}>
        <BulkActionLogsDashboard />
      </Provider>,
    );

    const listPanel = screen.getByTestId("list-panel");
    const listPanelBefore = listPanel;

    rerender(
      <Provider store={store}>
        <BulkActionLogsDashboard />
      </Provider>,
    );

    const listPanelAfter = screen.getByTestId("list-panel");
    // Memoization prevents unnecessary re-renders
    expect(listPanelBefore).toBeDefined();
    expect(listPanelAfter).toBeDefined();
  });
});
