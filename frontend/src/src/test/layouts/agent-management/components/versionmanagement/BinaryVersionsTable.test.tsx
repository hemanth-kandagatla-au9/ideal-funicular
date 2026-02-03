import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import BinaryVersionsTable from "../../../../../layouts/agent-management/components/versionmanagement/BinaryVersionsTable";

jest.mock("@mui/x-data-grid", () => ({
  DataGrid: ({ rows, columns }: any) => (
    <div data-testid="data-grid">
      <div data-testid="grid-rows">{rows.length} rows</div>
      <div data-testid="grid-columns">{columns.length} columns</div>
    </div>
  ),
}));
jest.mock("@mui/material", () => ({
  Box: ({ children, ...props }: any) => (
    <div data-testid="mui-box" {...props}>
      {children}
    </div>
  ),
}));
jest.mock("../../../../../components/ui/pagination/Pagination.component", () => {
  return function MockPagination({ handlePagination, handlePageClick, ...props }: any) {
    return (
      <div data-testid="pagination">
        <button data-testid="pagination-button" onClick={() => handlePagination(10, 2)}>
          Mock Pagination
        </button>
      </div>
    );
  };
});
jest.mock("../../../../../layouts/agent-management/components/versionmanagement/BinaryVersionsColumns", () => {
  return function MockBinaryVersionsColumns({ onEdit, onView, onDelete }: any) {
    return [
      {
        field: "version",
        headerName: "VERSION",
        renderCell: ({ row }: any) => (
          <div>
            {row.version}
            <button data-testid="edit-btn" onClick={() => onEdit(row)}>
              Edit
            </button>
            <button data-testid="view-btn" onClick={() => onView(row)}>
              View
            </button>
            <button data-testid="delete-btn" onClick={() => onDelete(row.id, row.version)}>
              Delete
            </button>
          </div>
        ),
      },
    ];
  };
});

describe("BinaryVersionsTable Component", () => {
  const mockOnEdit = jest.fn();
  const mockOnView = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnChange = jest.fn();

  const mockVersions = [
    {
      id: 1,
      version: "v1.0.0",
      osCompatibility: ["Linux"] as ("Windows" | "Linux")[],
      upgradeType: "Mandatory" as "Mandatory" | "Optional",
      isMandatory: true,
      status: "Current" as const,
      releaseDate: "2023-01-01",
      rustcversion: "1.60.0",
      osVersion: "20.04",
      osEntries: [],
      s3Url: "",
      checksumValid: true,
    },
    {
      id: 2,
      version: "v1.1.0",
      osCompatibility: ["Windows"] as ("Windows" | "Linux")[],
      upgradeType: "Optional" as "Mandatory" | "Optional",
      isMandatory: false,
      status: "Beta" as const,
      releaseDate: "2023-02-01",
      rustcversion: "1.61.0",
      osVersion: "10",
      osEntries: [],
      s3Url: "",
      checksumValid: true,
    },
  ];

  const defaultPagination = {
    current: 1,
    pageSize: 10,
    total: 20,
    onChange: mockOnChange,
    showSizeChanger: true,
  };

  const defaultProps = {
    versions: mockVersions,
    onEdit: mockOnEdit,
    onView: mockOnView,
    onDelete: mockOnDelete,
    pagination: defaultPagination,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(<BinaryVersionsTable {...defaultProps} {...props} />);
  };

  test("renders table with versions data", () => {
    renderComponent();

    expect(screen.getByTestId("data-grid")).toBeInTheDocument();
    expect(screen.getByTestId("grid-rows")).toHaveTextContent("2 rows");
    expect(screen.getByTestId("grid-columns")).toHaveTextContent("1 columns");
  });

  test("renders pagination component", () => {
    renderComponent();

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  test("handles empty versions array", () => {
    renderComponent({ versions: [] });

    expect(screen.getByTestId("data-grid")).toBeInTheDocument();
    expect(screen.getByTestId("grid-rows")).toHaveTextContent("0 rows");
  });

  test("handles pagination change", () => {
    renderComponent();

    const paginationButton = screen.getByTestId("pagination-button");
    fireEvent.click(paginationButton);

    expect(mockOnChange).toHaveBeenCalledWith(2, 10);
  });

  test("renders with different pagination settings", () => {
    const customPagination = {
      current: 3,
      pageSize: 20,
      total: 100,
      onChange: mockOnChange,
      showSizeChanger: false,
    };

    renderComponent({ pagination: customPagination });

    expect(screen.getByTestId("data-grid")).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  test("renders with single version", () => {
    const singleVersion = [mockVersions[0]];
    renderComponent({ versions: singleVersion });

    expect(screen.getByTestId("grid-rows")).toHaveTextContent("1 rows");
  });

  test("handles large dataset", () => {
    const largeVersions = Array.from({ length: 50 }, (_, index) => ({
      ...mockVersions[0],
      id: index + 1,
      version: `v1.0.${index}`,
    }));

    renderComponent({ versions: largeVersions });

    expect(screen.getByTestId("grid-rows")).toHaveTextContent("50 rows");
  });

  test("renders with different version statuses", () => {
    const mixedVersions = [
      { ...mockVersions[0], status: "Current" as const },
      { ...mockVersions[1], status: "Previous" as const },
    ];

    renderComponent({ versions: mixedVersions });

    expect(screen.getByTestId("data-grid")).toBeInTheDocument();
    expect(screen.getByTestId("grid-rows")).toHaveTextContent("2 rows");
  });

  test("renders table container with proper styling", () => {
    renderComponent();

    const boxes = screen.getAllByTestId("mui-box");
    const container = boxes.find(box => {
      const scoped = within(box);
      return Boolean(scoped.queryByTestId("data-grid") && scoped.queryByTestId("pagination"));
    });
    expect(container).toBeTruthy();
  });
});
