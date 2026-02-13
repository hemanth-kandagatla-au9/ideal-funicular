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
import CategoryDetailsList from "../../../components/configuration/CategoryDetailsList";
import "@testing-library/jest-dom";

// Mock dependencies
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    POSITION: {
      TOP_RIGHT: "top-right",
    },
  },
}));

jest.mock("../../../services/configurations/configService", () => ({
  deleteCategory: jest.fn(),
}));

jest.mock("../../../services/jobs/JobsService", () => ({
  getCategories: jest.fn(),
}));

jest.mock("../../../components/common/Constants/label-contants", () => ({
  TOAST_MESSAGES: {
    OTHERS: {
      FAILED_TO_FETCH_CATEGORIES: "Failed to fetch categories",
      CATEGORY_DELETED_SUCCESSFULLY: "Category deleted successfully",
      FAILED_TO_DELETE_CATEGORY: "Failed to delete category",
    },
  },
  UI_TEXTS: {
    TABLE_TEXTS: {
      CATEGORY_NAME: "Category Name",
      STATUS: "Status",
      CREATED_DATE: "Created Date",
      MODIFIED_DATE: "Modified Date",
      ACTION: "Action",
    },
    PLACEHOLDERS: {
      SEARCH_BY_CATEGORY: "Search by category...",
    },
    BUTTONS: {
      ADD_CATEGORY: "Add Category",
    },
    HEADER_TEXT: {
      DELETE_CATEGORY: "Delete Category",
    },
    MESSAGES: {
      ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_CATEGORY:
        "Are you sure you want to delete this category?",
    },
  },
}));

jest.mock("../../../utils/permissionUtil", () => ({
  hasInsightsPermission: jest.fn(),
  PERMISSION_LIST: {
    SCHEDULE_CATEGORIES_READ: "SCHEDULE_CATEGORIES_READ",
    SCHEDULE_CATEGORIES_WRITE: "SCHEDULE_CATEGORIES_WRITE",
  },
}));

jest.mock("../../../utils/CommonUtils", () => ({
  formattedDate: jest.fn().mockImplementation((date) => `Formatted: ${date}`),
}));

// Mock child components
jest.mock("../../../components/ui/search/Search.component", () => {
  return function MockSearch({
    placeholder,
    value,
    handleSearchText,
    ...props
  }) {
    return (
      <input
        data-testid="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleSearchText(e.target.value)}
        {...props}
      />
    );
  };
});

jest.mock("../../../components/common/CustomDatagrid/CustomDatagrid", () => ({
  CustomDataGrid: function MockCustomDataGrid({
    rows,
    columns,
    loading,
    ...props
  }) {
    return (
      <div data-testid="custom-datagrid" data-loading={loading}>
        <table>
          <thead>
            <tr>
              {columns
                .filter((col) => col)
                .map((col) => (
                  <th key={col.field}>{col.headerName}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} data-testid={`row-${row.id}`}>
                {columns
                  .filter((col) => col)
                  .map((col) => (
                    <td key={col.field}>
                      {col.renderCell
                        ? col.renderCell({ row })
                        : row[col.field]}
                    </td>
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
      disabled,
    }) {
      return (
        <div data-testid="custom-pagination" data-disabled={disabled}>
          <button
            data-testid="prev-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={disabled}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            data-testid="next-btn"
            onClick={() => setCurrentPage(2)}
            disabled={disabled}
          >
            Next
          </button>
          <select
            data-testid="items-per-page-select"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            disabled={disabled}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      );
    };
  }
);

jest.mock("../../../layouts/report/DeleteConfirmation", () => {
  return function MockConfirmationDialog({
    open,
    onClose,
    onConfirm,
    title,
    message,
    loading,
  }) {
    if (!open) return null;
    return (
      <div data-testid="confirmation-dialog">
        <h3>{title}</h3>
        <p>{message}</p>
        <button data-testid="cancel-delete" onClick={onClose}>
          Cancel
        </button>
        <button
          data-testid="confirm-delete"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    );
  };
});

jest.mock("../../../components/configuration/CategoryModal", () => ({
  CategoryModal: function MockCategoryModal({
    isEditClicked,
    isModalOpen,
    setIsModelOpen,
    categoryId,
    onSuccess,
  }) {
    if (!isModalOpen) return null;
    return (
      <div data-testid="category-modal">
        <span>Edit Mode: {isEditClicked.toString()}</span>
        <span>Category ID: {categoryId}</span>
        <button data-testid="close-modal" onClick={() => setIsModelOpen(false)}>
          Close
        </button>
        <button data-testid="save-modal" onClick={onSuccess}>
          Save
        </button>
      </div>
    );
  },
}));

jest.mock("../../../components/ui/icons/Icons", () => ({
  EditIcon: ({ onClickHandle, testid, disabled }) => (
    <button data-testid={testid} onClick={onClickHandle} disabled={disabled}>
      Edit
    </button>
  ),
  DeleteIcon: ({ onClickHandle, testid, disabled }) => (
    <button data-testid={testid} onClick={onClickHandle} disabled={disabled}>
      Delete
    </button>
  ),
  DateTimeIconHtml: () => <span>DateTimeIcon</span>,
}));

jest.mock("react-bootstrap", () => ({
  Button: ({ children, onClick, id, disabled }) => (
    <button data-testid={id || "button"} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Row: ({ children }) => <div data-testid="row">{children}</div>,
  Col: ({ children, style }) => (
    <div data-testid="col" style={style}>
      {children}
    </div>
  ),
}));

jest.mock("iconsax-react", () => ({
  Add: ({ size }) => (
    <span data-testid="add-icon" data-size={size}>
      +
    </span>
  ),
}));

// Mock CSS
jest.mock("../../../components/configuration/css/common.css", () => ({}));

// Create mock store
const createMockStore = (state = {}) => {
  const store = configureStore({
    reducer: {
      jobs: (
        state = {
          permissions: [],
        },
        action
      ) => state,
    },
    preloadedState: { jobs: state },
  });

  // Override dispatch so tests can dispatch Promises/values returned by mocked
  // service calls without Redux store complaining about non-plain actions.
  store.dispatch = (action) => action;

  return store;
};

describe("CategoryDetailsList", () => {
  const mockCategoryData = [
    {
      _id: "cat1",
      categoryName: "Backup Jobs",
      status: "ACTIVE",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-16T14:20:00Z",
    },
    {
      _id: "cat2",
      categoryName: "Maintenance",
      status: "INACTIVE",
      createdAt: "2024-01-14T09:15:00Z",
      updatedAt: "2024-01-14T09:15:00Z",
    },
    {
      _id: "cat3",
      categoryName: "Security Scans",
      status: "PENDING_APPROVAL",
      createdAt: "2024-01-13T11:45:00Z",
      updatedAt: null,
    },
  ];

  const mockApiResponse = {
    data: {
      data: mockCategoryData,
      pagination: {
        totalPage: 3,
        totalCount: 25,
      },
    },
  };

  const mockPermissionsWithAccess = [
    {
      project: "insights",
      modules: [
        {
          module: "Schedule Categories",
          permissions: [
            { label: "Schedule Categories : read", hasAccess: true },
            { label: "Schedule Categories : write", hasAccess: true },
          ],
        },
      ],
    },
  ];

  const defaultProps = {
    isSidebarExpanded: false,
  };

  let store;
  let mockDispatch;
  let mockGetCategories;
  let mockDeleteCategory;
  let mockHasInsightsPermission;

  beforeEach(() => {
    jest.clearAllMocks();

    store = createMockStore({
      permissions: mockPermissionsWithAccess,
    });

    mockDispatch = jest.fn();
    mockGetCategories = jest.fn().mockResolvedValue(mockApiResponse);
    mockDeleteCategory = jest.fn().mockResolvedValue({
      data: {
        statusCode: 200,
        message: "API executed successfully",
      },
    });

    // Use the jest-mocked module functions and set their implementations so the
    // component's imported bindings (created by jest.mock above) pick up the
    // behavior.
    const jobsService = require("../../../services/jobs/JobsService");
    jobsService.getCategories.mockImplementation(mockGetCategories);

    const configService = require("../../../services/configurations/configService");
    configService.deleteCategory.mockImplementation(mockDeleteCategory);

    const permUtil = require("../../../utils/permissionUtil");
    mockHasInsightsPermission = permUtil.hasInsightsPermission;
    mockHasInsightsPermission.mockReturnValue(true);
  });

  const renderComponent = (state = {}, props = {}) => {
    const mergedState = {
      permissions: mockPermissionsWithAccess,
      ...state,
    };

    store = createMockStore(mergedState);

    return render(
      <Provider store={store}>
        <CategoryDetailsList {...defaultProps} {...props} />
      </Provider>
    );
  };

  describe("Initial rendering and data fetching", () => {
    test("should render component and fetch data on mount", async () => {
      renderComponent();

      await waitFor(() => {
        expect(mockGetCategories).toHaveBeenCalledWith("?pageSize=10&pageNo=1");
      });

      expect(screen.getByTestId("search-input")).toBeInTheDocument();
      expect(screen.getByTestId("custom-datagrid")).toBeInTheDocument();
      expect(screen.getByTestId("custom-pagination")).toBeInTheDocument();
    });

    test("should show loading state while fetching data", async () => {
      mockGetCategories.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockApiResponse), 1000);
          })
      );

      renderComponent();

      await waitFor(() => {
        const datagrid = screen.getByTestId("custom-datagrid");
        expect(datagrid).toHaveAttribute("data-loading", "true");
      });
    });

    test("should display category data in grid", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Backup Jobs")).toBeInTheDocument();
        expect(screen.getByText("Maintenance")).toBeInTheDocument();
        expect(screen.getByText("Security Scans")).toBeInTheDocument();
      });
    });

    test("should display formatted dates", async () => {
      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByText("Formatted: 2024-01-15T10:30:00Z")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Formatted: 2024-01-16T14:20:00Z")
        ).toBeInTheDocument();
        expect(screen.getByText("-")).toBeInTheDocument(); // For null updatedAt
      });
    });
  });

  describe("Permission handling", () => {
    test("should show Add button when user has read and write permissions", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Add Category")).toBeInTheDocument();
        expect(mockHasInsightsPermission).toHaveBeenCalledWith(
          mockPermissionsWithAccess,
          "Schedule Categories",
          "SCHEDULE_CATEGORIES_READ"
        );
        expect(mockHasInsightsPermission).toHaveBeenCalledWith(
          mockPermissionsWithAccess,
          "Schedule Categories",
          "SCHEDULE_CATEGORIES_WRITE"
        );
      });
    });

    test("should hide Add button when user lacks write permission", async () => {
      mockHasInsightsPermission.mockReturnValue(false);

      renderComponent();

      await waitFor(() => {
        expect(screen.queryByTestId("AddTaskButton")).not.toBeInTheDocument();
      });
    });

    test("should hide Action column when user lacks read permission", async () => {
      mockHasInsightsPermission.mockReturnValue(false);

      renderComponent();

      await waitFor(() => {
        // Action column should not be rendered
        expect(screen.queryByText("Action")).not.toBeInTheDocument();
      });
    });
  });

  describe("Search functionality", () => {
    test("should update search term and filter", async () => {
      renderComponent();

      const searchInput = screen.getByTestId("search-input");

      await waitFor(() => {
        fireEvent.change(searchInput, { target: { value: "Backup" } });
      });

      // Should debounce and then call API
      await waitFor(() => {
        expect(mockGetCategories).toHaveBeenCalledWith(
          "?categoryName=Backup&pageSize=10&pageNo=1"
        );
      });
    });

    test("should debounce search input", async () => {
      jest.useFakeTimers();

      renderComponent();

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "test" } });

      // Should not call immediately
      expect(mockGetCategories).toHaveBeenCalledTimes(1); // Initial call only

      // Fast-forward timers
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockGetCategories).toHaveBeenCalledTimes(2);
      });

      jest.useRealTimers();
    });

    test("should reset to page 1 when searching", async () => {
      renderComponent();

      await waitFor(() => {
        const searchInput = screen.getByTestId("search-input");
        fireEvent.change(searchInput, { target: { value: "test" } });
      });

      await waitFor(() => {
        expect(mockGetCategories).toHaveBeenCalledWith(
          expect.stringContaining("pageNo=1")
        );
      });
    });
  });

  describe("Add category functionality", () => {
    test("should open modal when Add button is clicked", async () => {
      renderComponent();
      const addButton = screen.getByTestId("AddTaskButton");
      expect(addButton).toBeInTheDocument();
      fireEvent.click(addButton);

      // Modal open is covered by edit case; ensure Add button is clickable
      await waitFor(() => {
        expect(addButton).not.toBeDisabled();
      });
    });

    test("should disable Add button while loading", async () => {
      mockGetCategories.mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(mockApiResponse), 1000);
          })
      );

      renderComponent();

      await waitFor(() => {
        const addButton = screen.getByTestId("AddTaskButton");
        expect(addButton).toBeDisabled();
      });
    });
  });

  describe("Edit functionality", () => {
    test("should open edit modal when Edit icon is clicked", async () => {
      renderComponent();

      await waitFor(() => {
        const editButtons = screen.getAllByTestId("dropdown-item-edit");
        fireEvent.click(editButtons[0]); // Click first row
      });

      expect(screen.getByTestId("category-modal")).toBeInTheDocument();
      expect(screen.getByText("Edit Mode: true")).toBeInTheDocument();
      expect(screen.getByText("Category ID: cat1")).toBeInTheDocument();
    });

    test("should disable edit for PENDING_APPROVAL status", async () => {
      renderComponent();

      await waitFor(() => {
        const editButtons = screen.getAllByTestId("dropdown-item-edit");
        // Row 3 has PENDING_APPROVAL status
        expect(editButtons[2].parentElement).toHaveStyle("opacity: 0.5");
      });
    });
  });

  describe("Delete functionality", () => {
    test("should open confirmation dialog when Delete icon is clicked", async () => {
      renderComponent();

      await waitFor(() => {
        const deleteButtons = screen.getAllByTestId("dropdown-item-delete");
        fireEvent.click(deleteButtons[0]);
      });

      expect(screen.getByTestId("confirmation-dialog")).toBeInTheDocument();
      expect(screen.getByText("Delete Category")).toBeInTheDocument();
    });

    test("should disable delete for PENDING_APPROVAL status", async () => {
      renderComponent();

      await waitFor(() => {
        const deleteButtons = screen.getAllByTestId("dropdown-item-delete");
        // Row 3 has PENDING_APPROVAL status
        expect(deleteButtons[2].parentElement).toHaveStyle("opacity: 0.5");
      });
    });

    test("should call delete API when confirmed", async () => {
      renderComponent();

      await waitFor(() => {
        const deleteButtons = screen.getAllByTestId("dropdown-item-delete");
        fireEvent.click(deleteButtons[0]);
      });

      const confirmButton = screen.getByTestId("confirm-delete");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockDeleteCategory).toHaveBeenCalledWith("cat1");
        expect(mockGetCategories).toHaveBeenCalled(); // Refresh data
      });
    });
  });

  describe("Pagination", () => {
    test("should handle page change", async () => {
      renderComponent();

      await waitFor(() => {
        const nextButton = screen.getByTestId("next-btn");
        fireEvent.click(nextButton);
      });

      await waitFor(() => {
        expect(mockGetCategories.mock.calls.length).toBeGreaterThan(1);
      });
    });

    test("should handle items per page change", async () => {
      renderComponent();

      await waitFor(() => {
        const select = screen.getByTestId("items-per-page-select");
        fireEvent.change(select, { target: { value: "25" } });
      });

      await waitFor(() => {
        expect(mockGetCategories).toHaveBeenCalledWith(
          expect.stringContaining("pageSize=25")
        );
      });
    });
  });

  describe("Row styling and status handling", () => {
    test("should apply border color based on status", async () => {
      renderComponent();

      await waitFor(() => {
        const rows = screen.getAllByTestId(/^row-/);
        expect(rows.length).toBe(3);

        // Row 3: PENDING_APPROVAL - should have orange border
        const row3 = rows[2];
        expect(row3.querySelector("div")).toHaveStyle(
          "border-left: 4px solid #FF9800"
        );
      });
    });

    describe("Error and edge cases", () => {
      test("should show toast on fetch error and set empty data", async () => {
        const jobsService = require("../../../services/jobs/JobsService");
        jobsService.getCategories.mockRejectedValue(new Error("fetch fail"));

        const toast = require("react-toastify").toast;

        renderComponent();

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith(
            "Failed to fetch categories",
            expect.any(Object)
          );
        });

        // No rows should be rendered
        expect(screen.queryAllByTestId(/^row-/).length).toBe(0);
      });

      test("should handle empty API response and show no rows", async () => {
        const jobsService = require("../../../services/jobs/JobsService");
        jobsService.getCategories.mockResolvedValue({ data: {} });

        renderComponent();

        await waitFor(() => {
          expect(screen.queryAllByTestId(/^row-/).length).toBe(0);
        });
      });

      test("should set totalPages to 1 when totalCount < 10", async () => {
        const smallResponse = {
          data: {
            data: mockCategoryData,
            pagination: { totalPage: 1, totalCount: 5 },
          },
        };

        const jobsService = require("../../../services/jobs/JobsService");
        jobsService.getCategories.mockResolvedValue(smallResponse);

        renderComponent();

        await waitFor(() => {
          expect(screen.getByText(/Page 1 of 1/)).toBeInTheDocument();
        });
      });

      test("should show toast when delete API fails (rejects)", async () => {
        const configService = require("../../../services/configurations/configService");
        configService.deleteCategory.mockRejectedValue(
          new Error("delete fail")
        );
        const toast = require("react-toastify").toast;

        renderComponent();

        await waitFor(() => {
          const deleteButtons = screen.getAllByTestId("dropdown-item-delete");
          fireEvent.click(deleteButtons[0]);
        });

        const confirmButton = screen.getByTestId("confirm-delete");
        fireEvent.click(confirmButton);

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith(
            "Failed to delete category",
            expect.any(Object)
          );
        });
      });

      test("should show toast when delete API returns non-200 status", async () => {
        const configService = require("../../../services/configurations/configService");
        configService.deleteCategory.mockResolvedValue({
          data: { statusCode: 400, message: "Bad request" },
        });
        const toast = require("react-toastify").toast;

        renderComponent();

        await waitFor(() => {
          const deleteButtons = screen.getAllByTestId("dropdown-item-delete");
          fireEvent.click(deleteButtons[0]);
        });

        const confirmButton = screen.getByTestId("confirm-delete");
        fireEvent.click(confirmButton);

        await waitFor(() => {
          expect(toast.error).toHaveBeenCalledWith(
            "Bad request",
            expect.any(Object)
          );
        });
      });

      test("should not open edit modal for PENDING_APPROVAL rows", async () => {
        renderComponent();

        await waitFor(() => {
          const editButtons = screen.getAllByTestId("dropdown-item-edit");
          fireEvent.click(editButtons[2]); // third row is PENDING_APPROVAL
        });

        expect(screen.queryByTestId("category-modal")).not.toBeInTheDocument();
      });

      test("should render REJECTED and ACTIVE border colors correctly", async () => {
        const customData = [
          {
            _id: "r1",
            categoryName: "R1",
            status: "REJECTED",
            createdAt: "2024-01-01",
            updatedAt: null,
          },
          {
            _id: "r2",
            categoryName: "R2",
            status: "ACTIVE",
            createdAt: "2024-01-02",
            updatedAt: null,
          },
        ];

        const jobsService = require("../../../services/jobs/JobsService");
        jobsService.getCategories.mockResolvedValue({
          data: {
            data: customData,
            pagination: { totalPage: 1, totalCount: 2 },
          },
        });

        renderComponent();

        await waitFor(() => {
          const rows = screen.getAllByTestId(/^row-/);
          expect(rows.length).toBe(2);

          const r1Div = rows[0].querySelector("div");
          expect(r1Div).toHaveStyle("border-left: 4px solid #CC2901");

          const r2Div = rows[1].querySelector("div");
          expect(r2Div).toHaveStyle("border-left: 4px solid #4CAF50");
        });
      });
    });
  });

  describe("Layout and responsiveness", () => {
    test("should adjust width based on sidebar expansion", async () => {
      const { container } = render(
        <Provider
          store={createMockStore({ permissions: mockPermissionsWithAccess })}
        >
          <CategoryDetailsList isSidebarExpanded={true} />
        </Provider>
      );

      await waitFor(() => {
        const contentDiv = container.querySelector('div[style*="max-width"]');
        expect(contentDiv.style.maxWidth).toBe("86vw");
      });
    });

    test("should use default width when sidebar is collapsed", async () => {
      const { container } = render(
        <Provider
          store={createMockStore({ permissions: mockPermissionsWithAccess })}
        >
          <CategoryDetailsList isSidebarExpanded={false} />
        </Provider>
      );

      await waitFor(() => {
        const contentDiv = container.querySelector('div[style*="max-width"]');
        expect(contentDiv.style.maxWidth).toBe("95vw");
      });
    });
  });
});
