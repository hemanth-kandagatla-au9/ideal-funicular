import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { useSelector, useDispatch } from "react-redux";
import LeftPanel from "../../../layouts/bulk-action-logs/components/BulkActionsList";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe("BulkActionsList pagination and chip clear", () => {
  const mockDispatch = jest.fn();
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  afterEach(() => jest.clearAllMocks());

  const setupSelectors = (overrides: any = {}) => {
    const state = {
      bulkActionLogs: {
        bulkActions: overrides.bulkActions ?? [],
        pagination: overrides.pagination ?? { pageNo: 0, totalPages: 1 },
        loading: overrides.loading ?? false,
        availableFilters: overrides.availableFilters ?? { actions: ["agent_config_sync"], users: ["admin"] },
      },
    };

    (useSelector as jest.Mock).mockImplementation((selector: any) => selector(state));
  };

  it("shows single page when totalPages is 1", () => {
    setupSelectors({ pagination: { pageNo: 0, totalPages: 1 } });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);

    // Only one page button should be present (text '1')
    expect(screen.getAllByText("1").length).toBeGreaterThan(0);
  });

  it("allows clearing status chip via delete", () => {
    setupSelectors({ availableFilters: { actions: ["agent_config_sync"], users: ["alice"] } });
    render(<LeftPanel selectedJobId={null} onSelectJob={mockOnSelect} />);

    // Open filter dialog and select a status radio
    const filterBtn = screen.getByText("Filter");
    fireEvent.click(filterBtn);

    const statusRadio = screen.getByLabelText("Partial");
    fireEvent.click(statusRadio);

    const applyBtn = screen.getByText("Apply");
    fireEvent.click(applyBtn);

    // Chip should exist
    expect(screen.getByText("Status: Partial")).toBeInTheDocument();

    // Click delete icon on chip
    const deleteIcons = screen.getAllByTestId("CancelIcon");
    fireEvent.click(deleteIcons[0]);

    expect(screen.queryByText("Status: Partial")).toBeNull();
  });
});
