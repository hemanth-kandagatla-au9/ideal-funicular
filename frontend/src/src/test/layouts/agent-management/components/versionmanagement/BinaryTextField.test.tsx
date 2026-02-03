import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import BinaryTextField from "../../../../../layouts/agent-management/components/versionmanagement/BinaryTextField";

describe("BinaryTextField", () => {
  const baseProps = {
    name: "username",
    label: "Username",
    value: "",
    onChange: jest.fn(),
    onBlur: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders label and input", () => {
    render(<BinaryTextField {...baseProps} />);

    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls onChange when typing", () => {
    render(<BinaryTextField {...baseProps} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });

    expect(baseProps.onChange).toHaveBeenCalled();
  });

  it("calls onBlur when blurred", () => {
    render(<BinaryTextField {...baseProps} />);

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    expect(baseProps.onBlur).toHaveBeenCalled();
  });

  it("shows error when touched and error provided", () => {
    render(<BinaryTextField {...baseProps} touched error="Required field" />);

    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("does not show error when not touched", () => {
    render(<BinaryTextField {...baseProps} touched={false} error="Required field" />);

    expect(screen.queryByText("Required field")).not.toBeInTheDocument();
  });

  it("renders placeholder when provided", () => {
    render(<BinaryTextField {...baseProps} placeholder="Enter username" />);

    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
  });

  it("disables input when disabled=true", () => {
    render(<BinaryTextField {...baseProps} disabled />);

    expect(screen.getByRole("textbox")).toBeDisabled();
  });
});
