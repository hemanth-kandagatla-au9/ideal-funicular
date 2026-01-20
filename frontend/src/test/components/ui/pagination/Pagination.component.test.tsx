import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Pagination from "../../../../components/ui/pagination/Pagination.component";
import "@testing-library/jest-dom/extend-expect";

// Mock Dropdown
jest.mock("../../../../components/ui/customdropdown/Dropdown.component", () => {
  return ({ handleChange }: any) => (
    <button data-testid="mock-dropdown" onClick={() => handleChange("20")}>
      Mock Dropdown
    </button>
  );
});

// Mock ReactPaginate
jest.mock("react-paginate", () => {
  return ({ onPageChange }: any) => (
    <button data-testid="mock-paginate" onClick={() => onPageChange({ selected: 1 })}>
      Paginate
    </button>
  );
});

describe("Pagination Component", () => {
  const baseProps = {
    pagination: {
      pageNo: 1,
      totalPage: 5,
      totalRows: 50,
      limit: 10,
    },
    handlePagination: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders pagination when totalPage > 0", () => {
    render(<Pagination {...baseProps} />);
    expect(screen.getByText(/Page 1 of 5/i)).toBeInTheDocument();
  });

  it("does not render when totalPage is 0", () => {
    render(
      <Pagination
        {...baseProps}
        pagination={{ pageNo: 0, totalPage: 0, totalRows: 0, limit: 10 }}
      />
    );

    expect(screen.queryByText(/Page/i)).not.toBeInTheDocument();
  });

  it("calls handlePagination when dropdown value changes", () => {
    render(<Pagination {...baseProps} />);

    fireEvent.click(screen.getByTestId("mock-dropdown"));

    expect(baseProps.handlePagination).toHaveBeenCalledWith(20, 1);
  });

  it("calls handlePagination when paginate changes page", () => {
    render(<Pagination {...baseProps} />);

    fireEvent.click(screen.getByTestId("mock-paginate"));

    expect(baseProps.handlePagination).toHaveBeenCalledWith(10, 2);
  });

  it("handles jump page input and GO click", () => {
    render(<Pagination {...baseProps} />);

    const input = screen.getByPlaceholderText(/enter/i);
    fireEvent.change(input, { target: { value: "3" } });

    const goBtn = screen.getByTestId("btn");
    fireEvent.click(goBtn);

    expect(baseProps.handlePagination).toHaveBeenCalledWith(10, 3);
  });

  it("prevents invalid jump page", () => {
    render(<Pagination {...baseProps} />);

    const input = screen.getByPlaceholderText(/enter/i);
    fireEvent.change(input, { target: { value: "abc" } });

    const goBtn = screen.getByTestId("btn");
    fireEvent.click(goBtn);

    expect(baseProps.handlePagination).not.toHaveBeenCalled();
  });

  it("disables controls when only one page", () => {
    render(
      <Pagination
        {...baseProps}
        pagination={{ pageNo: 1, totalPage: 1, totalRows: 10, limit: 10 }}
      />
    );

    const input = screen.queryByPlaceholderText(/enter/i);
    expect(input).not.toBeInTheDocument();
  });

  it("caps jumpPage to totalPage when exceeding", () => {
    render(<Pagination {...baseProps} />);

    const input = screen.getByPlaceholderText(/enter/i);
    fireEvent.change(input, { target: { value: "999" } });

    const goBtn = screen.getByTestId("btn");
    fireEvent.click(goBtn);

    expect(baseProps.handlePagination).toHaveBeenCalledWith(10, 5);
  });
});
