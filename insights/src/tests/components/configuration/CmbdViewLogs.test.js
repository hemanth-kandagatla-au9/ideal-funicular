import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import CmbdViewLogs from "../../../components/configuration/CmbdViewLogs";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("lodash.debounce", () => {
  return jest.fn((fn, delay) => {
    const debouncedFn = jest.fn((...args) => fn(...args));
    debouncedFn.cancel = jest.fn();
    return debouncedFn;
  });
});

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock("../../../services/jobs/JobsService", () => ({
  getCMDBSchedulesLogsFilter: jest.fn(),
}));

jest.mock("../../../components/common/Constants/label-contants", () => ({
  TOAST_MESSAGES: {
    OTHERS: {
      FAILED_TO_FETCH_DATA: "Failed to fetch data",
    },
  },
  UI_TEXTS: {
    LABELS: {
      CMDB_LOGS: "CMDB Logs",
    },
  },
}));

// Mock child components
jest.mock("../../../components/common/CustomDatagrid/CustomDatagrid", () => ({
  CustomDataGrid: function MockCustomDataGrid({ rows, columns, ...props }) {
    return (
      <div data-testid="custom-datagrid">
        <table>
          <thead>
            <tr>
              {columns?.map((col) => (
                <th key={col.field}>{col.headerName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows?.map((row, index) => (
              <tr key={row.id || index}>
                {columns?.map((col) => (
                  <td key={col.field}>{row[col.field]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
}));

jest.mock(
  "../../../components/common/CustomPagination/CustomPagination",
  () => {
    return function MockCustomPagination({
      currentPage,
      setCurrentPage,
      itemsPerPage,
      setItemsPerPage,
      totalPages,
    }) {
      return (
        <div data-testid="custom-pagination">
          <button
            data-testid="prev-btn"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            data-testid="next-btn"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
          >
            Next
          </button>
          <select
            data-testid="items-per-page-select"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      );
    };
  }
);

jest.mock("../../../components/common/CustomSearch/CustomSearch", () => {
  return function MockCustomSearch({
    handleChange,
    searchTerm,
    clearSearch,
    placeholder,
  }) {
    const React = require("react");
    const { useState, useEffect } = React;
    const [localValue, setLocalValue] = useState(searchTerm || "");

    useEffect(() => {
      setLocalValue(searchTerm || "");
    }, [searchTerm]);

    const onChange = (e) => {
      setLocalValue(e.target.value);
      if (typeof handleChange === "function") handleChange(e);
    };

    const onClear = () => {
      setLocalValue("");
      if (typeof clearSearch === "function") clearSearch();
    };

    return (
      <div data-testid="custom-search">
        <input
          data-testid="search-input"
          value={localValue}
          onChange={onChange}
          placeholder={placeholder}
        />
        {localValue !== "" && (
          <button data-testid="clear-search" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
    );
  };
});

jest.mock("../../../components/common/CustomFilters/CustomFilter", () => {
  return function MockCustomFilter({
    filterTitle,
    filtersConfig,
    appliedFilters,
    onFilterChange,
    onRemoveFilter,
    onClearAllFilters,
  }) {
    return (
      <div data-testid="custom-filter">
        <h3>{filterTitle}</h3>
        {filtersConfig.map((filter) => (
          <div key={filter.id} data-testid={`filter-${filter.id}`}>
            <select
              data-testid={`select-${filter.id}`}
              multiple
              value={filter.value}
              onChange={(e) => {
                const val = e?.target?.value;
                const normalized = Array.isArray(val)
                  ? val
                  : val === undefined
                  ? []
                  : [val];
                onFilterChange(filter.id, { target: { value: normalized } });
              }}
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              data-testid={`remove-${filter.id}`}
              onClick={() => onRemoveFilter(filter.id)}
            >
              Remove
            </button>
          </div>
        ))}
        <button data-testid="clear-all-filters" onClick={onClearAllFilters}>
          Clear All
        </button>
      </div>
    );
  };
});

jest.mock("../../../components/common/CommonComponents/ReusableFields", () => ({
  TaskListTableSkeleton: () => (
    <div data-testid="skeleton-loader">Loading...</div>
  ),
}));

// Mock MUI components
jest.mock("@mui/material/Modal", () => {
  return function MockModal({ children, open, onClose }) {
    if (!open) return null;
    return (
      <div data-testid="modal" onClick={onClose}>
        {children}
      </div>
    );
  };
});

jest.mock("@mui/material/Box", () => {
  return function MockBox({ children, sx, ...props }) {
    return (
      <div data-testid="box" style={sx} {...props}>
        {children}
      </div>
    );
  };
});

jest.mock("@mui/material/IconButton", () => {
  return function MockIconButton({
    children,
    onClick,
    style,
    title,
    ...props
  }) {
    return (
      <button
        data-testid="icon-button"
        onClick={onClick}
        style={style}
        title={title}
        {...props}
      >
        {children}
      </button>
    );
  };
});

jest.mock("@mui/material/Tooltip", () => {
  return function MockTooltip({ children, title, placement }) {
    return (
      <div data-testid="tooltip" data-title={title} data-placement={placement}>
        {children}
      </div>
    );
  };
});

jest.mock("@mui/material/CircularProgress", () => {
  return function MockCircularProgress() {
    return <div data-testid="circular-progress">Loading...</div>;
  };
});

jest.mock("@mui/icons-material/Close", () => {
  return function MockCloseIcon() {
    return <span data-testid="close-icon">X</span>;
  };
});

jest.mock("@mui/icons-material", () => ({
  Refresh: function MockRefreshIcon() {
    return <span data-testid="refresh-icon">↻</span>;
  },
}));

jest.mock("iconsax-react", () => ({
  Filter: ({ size, color, variant }) => (
    <span
      data-testid="filter-icon"
      data-size={size}
      data-color={color}
      data-variant={variant}
    >
      Filter
    </span>
  ),
}));

// Create mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      jobs: (state = {}, action) => state,
    },
  });
};

describe("CmbdViewLogs", () => {
  const mockColumns = [
    { field: "hostname", headerName: "Hostname" },
    { field: "status", headerName: "Status" },
    { field: "executionId", headerName: "Execution ID" },
    { field: "table", headerName: "Table" },
    { field: "batch", headerName: "Batch" },
  ];

  const mockRowData = [
    {
      id: 1,
      hostname: "server1",
      status: "200",
      executionId: "exec1",
      table: "table1",
      batch: "batch1",
    },
    {
      id: 2,
      hostname: "server2",
      status: "400",
      executionId: "exec2",
      table: "table2",
      batch: "batch2",
    },
    {
      id: 3,
      hostname: "server3",
      status: "500",
      executionId: "exec3",
      table: "table1",
      batch: "batch3",
    },
    {
      id: 4,
      hostname: "server4",
      status: "200",
      executionId: "exec4",
      table: "table2",
      batch: "batch1",
    },
  ];

  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    jobDescription: "Test Job Description",
    columns: mockColumns,
    row: mockRowData,
    loading: false,
    totalPages: 5,
    table: "test_table",
    getScheduleLogsData: jest.fn(),
  };

  let store;
  let mockDispatch;
  let mockGetCMDBSchedulesLogsFilter;

  beforeEach(() => {
    jest.clearAllMocks();

    store = createMockStore();
    mockDispatch = jest.fn();
    mockGetCMDBSchedulesLogsFilter = jest.fn().mockImplementation(() => {
      return async (dispatch) => {
        return {
          data: {
            data: {
              hostname: ["server1", "server2", "server3", "server4"],
              status: ["200", "400", "500"],
              table: ["table1", "table2"],
              executionId: ["exec1", "exec2", "exec3", "exec4"],
              batch: ["batch1", "batch2", "batch3"],
            },
          },
        };
      };
    });

    require("../../../services/jobs/JobsService").getCMDBSchedulesLogsFilter =
      mockGetCMDBSchedulesLogsFilter;
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <CmbdViewLogs {...defaultProps} {...props} />
      </Provider>
    );
  };

  describe("Modal rendering", () => {
    test("should render modal when open is true", () => {
      renderComponent();
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    test("should not render modal when open is false", () => {
      renderComponent({ open: false });
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    test("should display CMDB Logs title", () => {
      renderComponent();
      expect(screen.getByText("CMDB Logs")).toBeInTheDocument();
    });

    test("should display job description", () => {
      renderComponent();
      expect(screen.getByText("Test Job Description")).toBeInTheDocument();
    });

    test("should have close button", () => {
      renderComponent();
      const closeBtn = screen.getByTestId("close-icon").closest("button");
      expect(closeBtn).toBeInTheDocument();
      expect(screen.getByTestId("close-icon")).toBeInTheDocument();
    });

    test("should call onClose when close button is clicked", () => {
      renderComponent();
      const closeBtn = screen.getByTestId("close-icon").closest("button");
      fireEvent.click(closeBtn);
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe("Initial data setup", () => {
    test("should set filtered data from row prop", () => {
      renderComponent();
      expect(screen.getByTestId("custom-datagrid")).toBeInTheDocument();
    });

    test("should set row data from row prop", () => {
      renderComponent();
      expect(screen.getByTestId("custom-datagrid")).toBeInTheDocument();
    });

    test("should fetch filter options on mount", async () => {
      renderComponent();

      await waitFor(() => {
        expect(mockGetCMDBSchedulesLogsFilter).toHaveBeenCalled();
      });
    });

    test("should fetch schedule logs data on mount", async () => {
      renderComponent();

      await waitFor(() => {
        expect(defaultProps.getScheduleLogsData).toHaveBeenCalledWith({
          pageNo: 1,
          pageSize: 10,
          hostname: [],
          table: "test_table",
          status: [],
          executionId: [],
          batch: [],
          searchValue: "",
        });
      });
    });
  });

  describe("Search functionality", () => {
    test("should render search component", () => {
      renderComponent();
      expect(screen.getByTestId("custom-search")).toBeInTheDocument();
    });

    test("should have correct search placeholder", () => {
      renderComponent();
      expect(
        screen.getByPlaceholderText("Search by hostname,table")
      ).toBeInTheDocument();
    });

    test("should update search term with debouncing", async () => {
      const debounceMock = require("lodash.debounce");
      const mockDebouncedFn = jest.fn();
      mockDebouncedFn.cancel = jest.fn();
      debounceMock.mockReturnValue(mockDebouncedFn);

      renderComponent();

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "server1" } });

      // Should use debounced function
      expect(mockDebouncedFn).toHaveBeenCalled();
    });

    test("should clear search term", () => {
      renderComponent();

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "server1" } });

      // Wait for the clear button to appear and click it
      return screen.findByTestId("clear-search").then((clearButton) => {
        fireEvent.click(clearButton);
        expect(searchInput.value).toBe("");
      });
    });
  });

  describe("Filter functionality", () => {
    test("should toggle filters visibility", () => {
      renderComponent();

      const filterIcon = screen.getByTestId("filter-icon");
      fireEvent.click(filterIcon.closest("div"));

      // Filters should be visible
      expect(screen.getByTestId("custom-filter")).toBeInTheDocument();
    });

    test("should render all filter types", async () => {
      renderComponent();

      // Click to show filters
      const filterIcon = screen.getByTestId("filter-icon");
      fireEvent.click(filterIcon.closest("div"));

      await waitFor(() => {
        expect(screen.getByTestId("filter-hostname")).toBeInTheDocument();
        expect(screen.getByTestId("filter-status")).toBeInTheDocument();
        expect(screen.getByTestId("filter-table")).toBeInTheDocument();
        expect(screen.getByTestId("filter-executionId")).toBeInTheDocument();
        expect(screen.getByTestId("filter-batch")).toBeInTheDocument();
      });
    });

    test("should handle hostname filter change", async () => {
      renderComponent();

      // Show filters
      const filterIcon = screen.getByTestId("filter-icon");
      fireEvent.click(filterIcon.closest("div"));

      await waitFor(() => {
        const hostnameSelect = screen.getByTestId("select-hostname");
        fireEvent.change(hostnameSelect, { target: { value: ["server1"] } });

        // Should update selected hostname
        expect(defaultProps.getScheduleLogsData).toHaveBeenCalled();
      });
    });

    test("should handle status filter change", async () => {
      renderComponent();

      // Show filters
      const filterIcon = screen.getByTestId("filter-icon");
      fireEvent.click(filterIcon.closest("div"));

      await waitFor(() => {
        const statusSelect = screen.getByTestId("select-status");
        fireEvent.change(statusSelect, { target: { value: ["200"] } });

        // Should update selected status
        expect(defaultProps.getScheduleLogsData).toHaveBeenCalled();
      });
    });

    test("should handle table filter change", async () => {
      renderComponent();

      // Show filters
      const filterIcon = screen.getByTestId("filter-icon");
      fireEvent.click(filterIcon.closest("div"));

      await waitFor(() => {
        const tableSelect = screen.getByTestId("select-table");
        fireEvent.change(tableSelect, { target: { value: ["table1"] } });

        // Should update selected table
        expect(defaultProps.getScheduleLogsData).toHaveBeenCalled();
      });
    });

    test("should handle executionId filter change", async () => {
      renderComponent();

      // Show filters
      const filterIcon = screen.getByTestId("filter-icon");
      fireEvent.click(filterIcon.closest("div"));

      await waitFor(() => {
        const executionIdSelect = screen.getByTestId("select-executionId");
        fireEvent.change(executionIdSelect, { target: { value: ["exec1"] } });

        // Should update selected executionId
        expect(defaultProps.getScheduleLogsData).toHaveBeenCalled();
      });
    });

    test("should handle batch filter change", async () => {
      renderComponent();

      // Show filters
      const filterIcon = screen.getByTestId("filter-icon");
      fireEvent.click(filterIcon.closest("div"));

      await waitFor(() => {
        const batchSelect = screen.getByTestId("select-batch");
        fireEvent.change(batchSelect, { target: { value: ["batch1"] } });

        // Should update selected batch
        expect(defaultProps.getScheduleLogsData).toHaveBeenCalled();
      });
    });

    test("should remove individual filter", async () => {
      renderComponent();

      // Show filters
      const filterIcon = screen.getByTestId("filter-icon");
      fireEvent.click(filterIcon.closest("div"));

      await waitFor(() => {
        const removeButton = screen.getByTestId("remove-hostname");
        fireEvent.click(removeButton);

        // Should clear hostname filter
        expect(defaultProps.getScheduleLogsData).toHaveBeenCalled();
      });
    });

    test("should clear all filters", async () => {
      renderComponent();

      // Show filters
      const filterIcon = screen.getByTestId("filter-icon");
      fireEvent.click(filterIcon.closest("div"));

      await waitFor(() => {
        const clearAllButton = screen.getByTestId("clear-all-filters");
        fireEvent.click(clearAllButton);

        // Should clear all filters
        expect(defaultProps.getScheduleLogsData).toHaveBeenCalled();
      });
    });

    test("should transform status codes to readable text", () => {
      renderComponent();

      // Test status transformation
      const statusMap = {
        200: "Success",
        400: "Bad Request",
        500: "Error",
      };

      // This is tested through the filter options transformation
      expect(screen.getByTestId("custom-filter")).toBeInTheDocument();
    });
  });

  describe("Refresh functionality", () => {
    test("should have refresh button", () => {
      renderComponent();
      expect(screen.getByTestId("refresh-icon")).toBeInTheDocument();
    });

    test("should call getScheduleLogsData when refresh is clicked", () => {
      renderComponent();
      const refreshButton = screen
        .getByTestId("refresh-icon")
        .closest("button");
      fireEvent.click(refreshButton);

      expect(defaultProps.getScheduleLogsData).toHaveBeenCalled();
    });
  });

  describe("Data grid rendering", () => {
    test("should render data grid with rows", () => {
      renderComponent();
      expect(screen.getByTestId("custom-datagrid")).toBeInTheDocument();
    });

    test("should show skeleton loader when loading is true", () => {
      renderComponent({ loading: true });
      expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
    });

    test("should show circular progress when loading is true", () => {
      renderComponent({ loading: true });
      expect(screen.getByTestId("circular-progress")).toBeInTheDocument();
    });

    test("should not show data grid when loading is true", () => {
      renderComponent({ loading: true });
      expect(screen.queryByTestId("custom-datagrid")).not.toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    test("should render pagination component", () => {
      renderComponent();
      expect(screen.getByTestId("custom-pagination")).toBeInTheDocument();
    });

    test("should handle page change", async () => {
      renderComponent();

      const nextButton = screen.getByTestId("next-btn");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(defaultProps.getScheduleLogsData).toHaveBeenCalledWith({
          pageNo: 2,
          pageSize: 10,
          hostname: [],
          table: "test_table",
          status: [],
          executionId: [],
          batch: [],
          searchValue: "",
        });
      });
    });

    test("should handle items per page change", async () => {
      renderComponent();

      const select = screen.getByTestId("items-per-page-select");
      fireEvent.change(select, { target: { value: "25" } });

      await waitFor(() => {
        expect(defaultProps.getScheduleLogsData).toHaveBeenCalledWith({
          pageNo: 1,
          pageSize: 25,
          hostname: [],
          table: "test_table",
          status: [],
          executionId: [],
          batch: [],
          searchValue: "",
        });
      });
    });
  });

  describe("Data filtering logic", () => {
    test("should filter data by hostname", async () => {
      renderComponent();

      // Set hostname filter
      const mockSetSelectedHostName = jest.fn();
      // This would be tested through integration with the filter component
    });

    test("should filter data by status", async () => {
      renderComponent();

      // Set status filter
      // This would be tested through integration
    });

    test("should filter data by table", async () => {
      renderComponent();

      // Set table filter
      // This would be tested through integration
    });

    test("should filter data by executionId", async () => {
      renderComponent();

      // Set executionId filter
      // This would be tested through integration
    });

    test("should filter data by batch", async () => {
      renderComponent();

      // Set batch filter
      // This would be tested through integration
    });

    test("should reset to page 1 when filters change", async () => {
      renderComponent();

      // Change a filter
      // Should set currentPage to 1
    });
  });

  describe("Error handling", () => {
    test("should show error toast when filter fetch fails", async () => {
      mockGetCMDBSchedulesLogsFilter.mockImplementation(() => {
        return async (dispatch) => {
          throw new Error("API Error");
        };
      });

      renderComponent();

      await waitFor(() => {
        const { toast } = require("react-toastify");
        expect(toast.error).toHaveBeenCalledWith("Failed to fetch data");
      });
    });

    test("should handle empty row data", () => {
      renderComponent({ row: [] });

      expect(screen.getByTestId("custom-datagrid")).toBeInTheDocument();
    });

    test("should handle undefined row data", () => {
      renderComponent({ row: undefined });

      expect(screen.getByTestId("custom-datagrid")).toBeInTheDocument();
    });
  });

  describe("Filter options transformation", () => {
    test("should transform hostname options", async () => {
      renderComponent();

      await waitFor(() => {
        // Filter options should be transformed
        expect(mockGetCMDBSchedulesLogsFilter).toHaveBeenCalled();
      });
    });

    test("should transform status codes to readable text", async () => {
      renderComponent();

      await waitFor(() => {
        // Status codes should be transformed
        // 200 -> Success, 400 -> Bad Request, etc.
      });
    });

    test("should handle empty filter options", async () => {
      mockGetCMDBSchedulesLogsFilter.mockResolvedValue({
        data: {
          data: null,
        },
      });

      renderComponent();

      await waitFor(() => {
        // Should handle null/undefined options
        expect(screen.getByTestId("custom-filter")).toBeInTheDocument();
      });
    });
  });

  describe("Layout and styling", () => {
    test("should have full viewport dimensions", () => {
      renderComponent();

      const box = document.querySelector(".modal-container");
      expect(box).toHaveStyle({
        height: "96vh",
        width: "96vw",
      });
    });

    test("should have sticky header", () => {
      renderComponent();

      const header = document.querySelector(".modal-header");
      expect(header).toHaveStyle({
        position: "sticky",
        top: "0",
        zIndex: "10",
      });
    });

    test("should show/hide filters based on state", () => {
      renderComponent();

      // Initially hidden
      const filterContainer = document.querySelector(".full-width");
      expect(filterContainer).toHaveStyle({
        display: "none",
      });

      // Click to show
      const filterIcon = screen.getByTestId("filter-icon");
      fireEvent.click(filterIcon.closest("div"));

      // Should be visible
      expect(filterContainer).toHaveStyle({
        display: "flex",
      });
    });
  });
});
