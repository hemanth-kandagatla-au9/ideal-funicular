import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddUserModal from "../../../layouts/user-authorization/AddUserModal";

describe("AddUserModal", () => {
  const baseProps = {
    show: true,
    onHide: jest.fn(),
    onAdd: jest.fn(),
    loading: false,
    users: [
      {
        id: "1",
        userName: "admin",
        rolesCount: 2,
        isActive: true,
      },
      {
        id: "2",
        userName: "guest",
        rolesCount: 0,
        isActive: true,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders modal", () => {
    render(<AddUserModal {...baseProps} />);
    expect(screen.getByText("Add New User")).toBeInTheDocument();
  });

  test("Add button disabled initially", () => {
    render(<AddUserModal {...baseProps} />);
    expect(screen.getByText("Add User")).toBeDisabled();
  });

  test("valid input enables Add button and calls onAdd", () => {
    render(<AddUserModal {...baseProps} />);

    const usernameInput = screen.getByPlaceholderText("Enter username");
    fireEvent.change(usernameInput, {
      target: { value: "john_doe" },
    });

    const passwordInput = screen.getByPlaceholderText("Enter password");
    fireEvent.change(passwordInput, {
      target: { value: "Password@" },
    });

    const addBtn = screen.getByText("Add User");
    expect(addBtn).toBeEnabled();

    fireEvent.click(addBtn);

    expect(baseProps.onAdd).toHaveBeenCalledWith({
      username: "john_doe",
      password: "Password@",
      isActive: true,
      cloneFromUserId: undefined,
    });
  });

  test("shows username validation error", () => {
    render(<AddUserModal {...baseProps} />);

    const input = screen.getByPlaceholderText("Enter username");
    fireEvent.blur(input);

    expect(screen.getByText("Username is required")).toBeInTheDocument();
  });

  test("shows password validation error", () => {
    render(<AddUserModal {...baseProps} />);

    const pwd = screen.getByPlaceholderText("Enter password");
    fireEvent.blur(pwd);

    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  test("toggle show/hide password", () => {
    render(<AddUserModal {...baseProps} />);

    const pwdInput = screen.getByPlaceholderText("Enter password");
    expect(pwdInput).toHaveAttribute("type", "password");

    const toggle = screen.getByLabelText("Show password");
    fireEvent.click(toggle);

    expect(pwdInput).toHaveAttribute("type", "text");
  });

  test("opens clone dropdown and selects user", () => {
    render(<AddUserModal {...baseProps} />);

    fireEvent.click(screen.getByText("Select"));

    expect(screen.getByText("admin")).toBeInTheDocument();

    fireEvent.click(screen.getByText("admin"));

    expect(screen.getByText("admin")).toBeInTheDocument();
  });

  test("filters clone users by search", () => {
    render(<AddUserModal {...baseProps} />);

    fireEvent.click(screen.getByText("Select"));

    const search = screen.getByPlaceholderText("Search users...");
    fireEvent.change(search, { target: { value: "adm" } });

    expect(screen.getByText("admin")).toBeInTheDocument();
  });

  test("Cancel clears and calls onHide", () => {
    render(<AddUserModal {...baseProps} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(baseProps.onHide).toHaveBeenCalled();
  });

  test("Enter key submits when valid", () => {
    render(<AddUserModal {...baseProps} />);

    fireEvent.change(screen.getByPlaceholderText("Enter username"), {
      target: { value: "tester" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "Test123@" },
    });

    fireEvent.keyDown(screen.getByPlaceholderText("Enter password"), {
      key: "Enter",
      code: "Enter",
    });

    expect(baseProps.onAdd).toHaveBeenCalled();
  });

  test("loading disables everything", () => {
    render(<AddUserModal {...baseProps} loading={true} />);

    expect(screen.getByText("Adding...")).toBeDisabled();
    expect(screen.getByText("Cancel")).toBeDisabled();
  });
});

