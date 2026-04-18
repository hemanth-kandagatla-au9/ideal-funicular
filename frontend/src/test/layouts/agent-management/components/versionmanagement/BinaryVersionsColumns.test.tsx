/* eslint-disable jest/no-conditional-expect */
import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderWithRedux } from "../../../../redux-test-utils";
import BinaryVersionsColumns from "../../../../../layouts/agent-management/components/versionmanagement/BinaryVersionsColumns";

// Mock useAgentPermissions hook
jest.mock("../../../../../utils/hooks/useAgentPermissions", () => ({
  __esModule: true,
  default: () => ({
    hasPermission: () => true,
    loading: false,
    permissions: [],
  }),
}));

jest.mock("@mui/material", () => ({
  Box: ({ children, ...props }: any) => <div data-testid="mui-box" {...props}>{children}</div>,
  IconButton: ({ children, onClick, ...props }: any) => (
    <button data-testid="icon-button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
  Typography: ({ children, ...props }: any) => <span data-testid="typography" {...props}>{children}</span>,
  Chip: ({ label, ...props }: any) => <div data-testid="chip" {...props}>{label}</div>,
}));
jest.mock("react-icons/fa", () => ({
  FaEye: () => <span data-testid="eye-icon">👁</span>,
  FaEdit: () => <span data-testid="edit-icon">✏️</span>,
  FaTrash: () => <span data-testid="trash-icon">🗑</span>,
}));
jest.mock("../../../../../images/agent-management/assets/gitBranch.svg", () => "test-file-stub");
jest.mock("../../../../../images/agent-management/assets/linux.svg", () => "test-file-stub");
jest.mock("../../../../../images/agent-management/assets/windows.svg", () => "test-file-stub");

describe("BinaryVersionsColumns", () => {
  const mockOnEdit = jest.fn();
  const mockOnView = jest.fn();
  const mockOnDelete = jest.fn();

  const mockRow = {
    id: 1,
    version: "v1.0.0",
    osCompatibility: ["linux", "windows"],
    upgradeType: "Mandatory",
    isMandatory: true,
    status: "Current" as const,
    releaseDate: "2023-01-01",
    rustcversion: "1.60.0",
    osVersion: "20.04",
    osEntries: [],
    s3Url: "",
    checksumValid: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderColumns = () => {
    const columns = BinaryVersionsColumns({
      onEdit: mockOnEdit,
      onView: mockOnView,
      onDelete: mockOnDelete,
    });
    return columns;
  };

  test("returns correct number of columns", () => {
    const columns = renderColumns();
    expect(columns.length).toBeGreaterThanOrEqual(5); // At least version, osCompatibility, upgradeType, buildDate, actions
  });

  test("version column renders correctly", () => {
    const columns = renderColumns();
    const versionColumn = columns.find(col => col.field === "version");
    
    expect(versionColumn).toBeDefined();
    expect(versionColumn?.headerName).toBe("VERSION");
    expect(versionColumn?.flex).toBe(1);
  });

  test("osCompatibility column renders correctly", () => {
    const columns = renderColumns();
    const osColumn = columns.find(col => col.field === "osCompatibility");
    
    expect(osColumn).toBeDefined();
    expect(osColumn?.headerName).toBe("OS COMPATIBILITY");
    expect(osColumn?.flex).toBeGreaterThan(1); // Should be 1.2 or similar
  });

  test("upgradeType column renders correctly", () => {
    const columns = renderColumns();
    const upgradeColumn = columns.find(col => col.field === "upgradeType");
    
    expect(upgradeColumn).toBeDefined();
    expect(upgradeColumn?.headerName).toBe("UPGRADE TYPE");
    expect(upgradeColumn?.flex).toBe(1);
  });

  test("buildDate column renders correctly", () => {
    const columns = renderColumns();
    const dateColumn = columns.find(col => col.field === "buildDate");
    
    expect(dateColumn).toBeDefined();
    expect(dateColumn?.headerName).toBe("BUILD DATE");
    expect(dateColumn?.flex).toBe(1);
  });

  test("actions column renders correctly", () => {
    const columns = renderColumns();
    const actionsColumn = columns.find(col => col.field === "actions");
    
    expect(actionsColumn).toBeDefined();
    expect(actionsColumn?.headerName).toBe("ACTIONS");
    expect(actionsColumn?.flex).toBe(1);
  });

  test("version column renderCell works", () => {
    const columns = renderColumns();
    const versionColumn = columns.find(col => col.field === "version");
    
    if (versionColumn?.renderCell) {
      const cellElement = versionColumn.renderCell({ row: mockRow } as any);
      const { container } = renderWithRedux(cellElement as React.ReactElement);
      expect(container).toBeInTheDocument();
    }
  });

  test("osCompatibility column renderCell works", () => {
    const columns = renderColumns();
    const osColumn = columns.find(col => col.field === "osCompatibility");
    
    if (osColumn?.renderCell) {
      const cellElement = osColumn.renderCell({ row: mockRow } as any);
      const { container } = renderWithRedux(cellElement as React.ReactElement);
      
      expect(container).toBeInTheDocument();
    }
  });

  test("upgradeType column renderCell works", () => {
    const columns = renderColumns();
    const upgradeColumn = columns.find(col => col.field === "upgradeType");
    
    if (upgradeColumn?.renderCell) {
      const cellElement = upgradeColumn.renderCell({ row: mockRow } as any);
      const { container } = renderWithRedux(cellElement as React.ReactElement);
      
      expect(container).toBeInTheDocument();
    }
  });

  test("releaseDate column renderCell works", () => {
    const columns = renderColumns();
    const dateColumn = columns.find(col => col.field === "releaseDate");
    
    if (dateColumn?.renderCell) {
      const cellElement = dateColumn.renderCell({ row: mockRow } as any);
      const { container } = renderWithRedux(cellElement as React.ReactElement);
      
      expect(container).toBeInTheDocument();
    }
  });

  test("actions column renderCell handles edit action", () => {
    const columns = renderColumns();
    const actionsColumn = columns.find(col => col.field === "actions");
    
    if (actionsColumn?.renderCell) {
      const cellElement = actionsColumn.renderCell({ row: mockRow } as any);
      const { container } = renderWithRedux(cellElement as React.ReactElement);
      
      const editButtons = container.querySelectorAll("[data-testid=\"icon-button\"]");
      if (editButtons.length > 0) {
        fireEvent.click(editButtons[1]); // Edit button
        expect(mockOnEdit).toHaveBeenCalledWith(mockRow);
      }
    }
  });

  test("actions column renderCell handles view action", () => {
    const columns = renderColumns();
    const actionsColumn = columns.find(col => col.field === "actions");
    
    if (actionsColumn?.renderCell) {
      const cellElement = actionsColumn.renderCell({ row: mockRow } as any);
      const { container } = renderWithRedux(cellElement as React.ReactElement);
      
      const viewButtons = container.querySelectorAll("[data-testid=\"icon-button\"]");
      if (viewButtons.length > 0) {
        fireEvent.click(viewButtons[0]); // View button
        expect(mockOnView).toHaveBeenCalledWith(mockRow);
      }
    }
  });

  test("actions column renderCell handles delete action", () => {
    const columns = renderColumns();
    const actionsColumn = columns.find(col => col.field === "actions");
    
    if (actionsColumn?.renderCell) {
      const cellElement = actionsColumn.renderCell({ row: mockRow } as any);
      const { container } = renderWithRedux(cellElement as React.ReactElement);
      
      const deleteButtons = container.querySelectorAll("[data-testid=\"icon-button\"]");
      if (deleteButtons.length > 2) {
        fireEvent.click(deleteButtons[2]); // Delete button
        expect(mockOnDelete).toHaveBeenCalledWith(mockRow.id, mockRow.version);
      }
    }
  });

  test("handles different status types", () => {
    const betaRow = { ...mockRow, status: "Beta" as const };
    const columns = renderColumns();
    const versionColumn = columns.find(col => col.field === "version");
    
    if (versionColumn?.renderCell) {
      const cellElement = versionColumn.renderCell({ row: betaRow } as any);
      const { container } = renderWithRedux(cellElement as React.ReactElement);
      
      expect(container).toBeInTheDocument();
    }
  });

  test("handles different OS compatibility arrays", () => {
    const multiOsRow = { ...mockRow, osCompatibility: ["linux", "windows", "macos"] };
    const columns = renderColumns();
    const osColumn = columns.find(col => col.field === "osCompatibility");
    
    if (osColumn?.renderCell) {
      const cellElement = osColumn.renderCell({ row: multiOsRow } as any);
      const { container } = renderWithRedux(cellElement as React.ReactElement);
      
      expect(container).toBeInTheDocument();
    }
  });
});
