import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import { useSelector, useDispatch } from "react-redux";
import LeftPanel from "../../../layouts/bulk-action-logs/components/BulkActionsList";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe("BulkActionsList pagination and ellipsis", () => {
  const mockDispatch = jest.fn();
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    mockDispatch.mockReset();
    (useSelector as jest.Mock).mockImplementation((sel: any) => {
      // selectors used in component
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
  });

  afterEach(() => jest.clearAllMocks());

  it("renders ellipsis when many pages and clicking page dispatches correct pageNo", () => {
    render(<LeftPanel selectedJobId="J1" onSelectJob={mockOnSelect} />);

    // Ellipsis should appear
    expect(screen.getAllByText("...").length).toBeGreaterThan(0);

    // Click page '6' (UI displays 1-based pages)
    const pageSix = screen.getByText("6");
    fireEvent.click(pageSix);

    // Dispatch should be called with pagination.pageNo = 5 (zero-based)
    const calledWithPage = mockDispatch.mock.calls.some(c => c[0]?.payload?.pagination?.pageNo === 5);
    expect(calledWithPage).toBe(true);
  });
});
