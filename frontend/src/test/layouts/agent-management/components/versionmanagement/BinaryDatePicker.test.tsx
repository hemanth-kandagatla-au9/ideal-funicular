import { render, screen, fireEvent } from "@testing-library/react";
import BinaryDatePickerField from "../../../../../layouts/agent-management/components/versionmanagement/BinaryDatePickerField";
import "@testing-library/jest-dom";
import { format } from "date-fns";

describe("BinaryDatePickerField", () => {
  const baseProps = {
    name: "date",
    label: "Select Date",
    value: null,
    onChange: jest.fn(),
    onBlur: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders label correctly", () => {
    render(<BinaryDatePickerField {...baseProps} />);
    expect(screen.getByText("Select Date")).toBeInTheDocument();
  });

  it("renders input field", () => {
    render(<BinaryDatePickerField {...baseProps} />);
    const input = screen.getByPlaceholderText(/\d{2}\/\d{2}\/\d{4}/);
    expect(input).toBeInTheDocument();
  });

  it("uses today's date as placeholder when showToday=true", () => {
    render(<BinaryDatePickerField {...baseProps} showToday />);
    const formatted = format(new Date(), "MM/dd/yyyy");
    expect(screen.getByPlaceholderText(formatted)).toBeInTheDocument();
  });

  it("uses default placeholder when showToday=false", () => {
    render(<BinaryDatePickerField {...baseProps} showToday={false} />);
    expect(screen.getByPlaceholderText("MM/DD/YYYY")).toBeInTheDocument();
  });

  it("calls onBlur when input loses focus", () => {
    render(<BinaryDatePickerField {...baseProps} />);
    const input = screen.getByRole("textbox");
    fireEvent.blur(input);
    expect(baseProps.onBlur).toHaveBeenCalled();
  });

  it("shows error text when touched=true and error exists", () => {
    render(
      <BinaryDatePickerField
        {...baseProps}
        error="Date is required"
        touched={true}
      />
    );
    expect(screen.getByText("Date is required")).toBeInTheDocument();
  });

  it("does not show error when not touched", () => {
    render(
      <BinaryDatePickerField
        {...baseProps}
        error="Date is required"
        touched={false}
      />
    );
    expect(screen.queryByText("Date is required")).not.toBeInTheDocument();
  });
});
