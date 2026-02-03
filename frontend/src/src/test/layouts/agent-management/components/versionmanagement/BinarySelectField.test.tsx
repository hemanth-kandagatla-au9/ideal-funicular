import { render, screen, fireEvent } from "@testing-library/react";
import BinarySelectField from "../../../../../layouts/agent-management/components/versionmanagement/BinarySelectField";
import "@testing-library/jest-dom";

describe("BinarySelectField", () => {
  const baseProps = {
    name: "type",
    label: "Type",
    value: "",
    options: ["Agent", "Worker"],
    onChange: jest.fn(),
    onBlur: jest.fn(),
    error: undefined,
    touched: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders label and placeholder", () => {
    render(<BinarySelectField {...baseProps} />);

    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText(/select type/i)).toBeInTheDocument();
  });

  it("calls onChange when value changes", () => {
    render(<BinarySelectField {...baseProps} />);

    const select = screen.getByRole("combobox");

    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByRole("option", { name: "Agent" }));

    expect(baseProps.onChange).toHaveBeenCalled();
  });

  it("calls onBlur when blurred", () => {
    render(<BinarySelectField {...baseProps} />);

    const select = screen.getByRole("combobox");
    fireEvent.blur(select);

    expect(baseProps.onBlur).toHaveBeenCalled();
  });

  it("shows error when touched and error provided", () => {
    render(<BinarySelectField {...baseProps} touched error="Required field" />);

    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("does not show error when not touched", () => {
    render(<BinarySelectField {...baseProps} touched={false} error="Required field" />);

    expect(screen.queryByText("Required field")).not.toBeInTheDocument();
  });

  it("disables select when disabled=true", () => {
    render(<BinarySelectField {...baseProps} disabled />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("aria-disabled", "true");
  });

  it("supports multiple select", () => {
    render(<BinarySelectField {...baseProps} multiple value={[]} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
  });
});
