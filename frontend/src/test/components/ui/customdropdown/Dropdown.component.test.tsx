/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import DropdownComponent from "../../../../components/ui/customdropdown/Dropdown.component";
import "@testing-library/jest-dom/extend-expect";
import { searchPlaceholderText } from "../../../../constants/strings";

const mockData = [
  { value: "10", id: "1" },
  { value: "20", id: "2" },
  { value: "50", id: "3" },
];

describe("DropdownComponent", () => {
  const baseProps = {
    data: mockData,
    value: "10",
    handleChange: jest.fn(),
    id: "test-dropdown",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<DropdownComponent {...baseProps} />);
    expect(screen.getByTestId("dropdown-test-id")).toBeInTheDocument();
  });

  it("shows initial selected value", () => {
    render(<DropdownComponent {...baseProps} />);
    expect(screen.getByText("10 per page")).toBeInTheDocument();
  });

  it("updates value when prop value changes", () => {
    const { rerender } = render(<DropdownComponent {...baseProps} />);
    rerender(<DropdownComponent {...baseProps} value="50" />);
    expect(screen.getByText("50 per page")).toBeInTheDocument();
  });


  it("calls custom handler when handleChangeCustom provided", () => {
    const customHandler = jest.fn();

    render(
      <DropdownComponent
        {...baseProps}
        handleChangeCustom={customHandler}
      />
    );

    fireEvent.click(screen.getByTestId("dropdown-test-id"));
    fireEvent.click(screen.getByTestId("option-10"));

    expect(customHandler).toHaveBeenCalled();
  });

  it("shows search input in compliance mode", () => {
    render(
      <DropdownComponent
        {...baseProps}
        isCompliancePage={true}
      />
    );

    fireEvent.click(screen.getByTestId("dropdown-test-id"));
    expect(screen.getByPlaceholderText(searchPlaceholderText)).toBeInTheDocument();
  });

  it("filters dropdown options on search", () => {
    render(
      <DropdownComponent
        {...baseProps}
        isCompliancePage={true}
      />
    );

    fireEvent.click(screen.getByTestId("dropdown-test-id"));

    const input = screen.getByPlaceholderText(searchPlaceholderText);
    fireEvent.change(input, { target: { value: "50" } });

    expect(screen.getByTestId("option-50")).toBeInTheDocument();
    expect(screen.queryByTestId("option-10")).not.toBeInTheDocument();
  });


  it("applies cnameDropdownMenu class when provided", () => {
    render(
      <DropdownComponent
        {...baseProps}
        cnameDropdownMenu="custom-menu"
      />
    );

    fireEvent.click(screen.getByTestId("dropdown-test-id"));

    const option = screen.getByTestId("option-10");
    expect(option.className).toContain("custom-menu");
  });

  it("disables dropdown when disabled=true", () => {
    render(<DropdownComponent {...baseProps} disabled={true} />);
    expect(screen.getByTestId("dropdown-test-id")).toBeDisabled();
  });

  it("resets search text when filter click changes", () => {
    const { rerender } = render(
      <DropdownComponent
        {...baseProps}
        isCompliancePage={true}
        onHandleFilterClick={() => {}}
      />
    );

    fireEvent.click(screen.getByTestId("dropdown-test-id"));
    const input = screen.getByPlaceholderText(searchPlaceholderText);

    fireEvent.change(input, { target: { value: "20" } });
    expect(input).toHaveValue("20");

    rerender(
      <DropdownComponent
        {...baseProps}
        isCompliancePage={true}
        onHandleFilterClick={() => console.log("changed")}
      />
    );

    expect(input).toHaveValue("");
  });

  it("does not crash when dropdownData is empty", () => {
    render(
      <DropdownComponent
        {...baseProps}
        data={[]}
      />
    );

    fireEvent.click(screen.getByTestId("dropdown-test-id"));
    expect(screen.queryByTestId("option-10")).not.toBeInTheDocument();
  });
});

