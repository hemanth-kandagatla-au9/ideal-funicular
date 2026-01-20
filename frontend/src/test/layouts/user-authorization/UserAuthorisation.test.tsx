import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import UserAuthorization from "../../../../src/layouts/user-authorization/UserAuthorization";

import {
  getUsers,
  isUsersLoading,
  getUsersError,
  getUsersPagination,
  getSelectedUsers,
} from "@/redux/selectors/userAuthorization.selectors";

// ---------------- mocks ----------------

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: (selector: any) => selector(),
}));

jest.mock("react-router-dom", () => ({
  useHistory: jest.fn(),
}));

jest.mock("@/redux/selectors/userAuthorization.selectors", () => ({
  getUsers: jest.fn(),
  isUsersLoading: jest.fn(),
  getUsersError: jest.fn(),
  getUsersPagination: jest.fn(),
  getSelectedUsers: jest.fn(),
}));

jest.mock("../../../../src/redux/actions/userAuthorization.action", () => ({
  fetchUsers: jest.fn((payload) => ({ type: "FETCH_USERS", payload })),
  createUser: jest.fn((payload) => ({ type: "CREATE_USER", payload })),
  deleteUser: jest.fn((payload) => ({ type: "DELETE_USER", payload })),
  assignUserPermissions: jest.fn((id, perms) => ({ type: "ASSIGN", payload: { id, perms } })),
}));

jest.mock("@/components/ui/pagination/Pagination.component", () => (props: any) => (
  <button onClick={() => props.handlePagination(10, 2)}>Mock Pagination</button>
));

jest.mock("../../../layouts/user-authorization/Permissions", () => (props: any) =>
  props.show ? <button onClick={() => props.onAdd({ username: "test", password: "pass", isActive: true })}>Mock Add User</button> : null
);

jest.mock("../../../layouts/user-authorization/AssignPermissionModal", () => (props: any) =>
  props.show ? <button onClick={() => props.onAssign("1", ["p1"])}>Mock Assign</button> : null
);

jest.mock("../../../layouts/user-authorization/AddUserModal", () => (props: any) => {
  if (!props.show) return null;

  return (
    <div>
      <p>Add User Modal</p>
      <button onClick={() => props.onAdd({ username: "test", password: "Test@123", isActive: true })}>
        Mock Add User
      </button>
    </div>
  );
});

jest.mock("@/components/popup/popUp.component", () => (props: any) =>
  props.show ? (
    <div>
      <p>Delete User</p>
      <button onClick={props.handleClick}>Confirm Delete</button>
      <button onClick={props.onHide}>Cancel</button>
    </div>
  ) : null
);

// ---------------- setup ----------------

const mockDispatch = jest.fn();
const mockPush = jest.fn();

describe("UserAuthorization", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useHistory as jest.Mock).mockReturnValue({ push: mockPush });

    (getUsers as jest.Mock).mockReturnValue([]);
    (isUsersLoading as jest.Mock).mockReturnValue(false);
    (getUsersError as jest.Mock).mockReturnValue(null);
    (getUsersPagination as jest.Mock).mockReturnValue({
      page: 1,
      limit: 10,
      total: 0,
    });
    (getSelectedUsers as jest.Mock).mockReturnValue([]);
  });

  it("dispatches fetchUsers on mount", () => {
    render(<UserAuthorization />);

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "FETCH_USERS" })
    );
  });

  it.skip("renders dummy users when no users from store", () => {
  render(<UserAuthorization />);

  // Dummy users include "Test User 1"
  expect(screen.getByText("Test User 1")).toBeInTheDocument();
});


  it("renders users list", () => {
    (getUsers as jest.Mock).mockReturnValue([
      {
        id: "1",
        userName: "testuser",
        createdBy: "Admin",
        updatedBy: "Admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      },
    ]);

    render(<UserAuthorization />);

    expect(screen.getByText("testuser")).toBeInTheDocument();
    expect(screen.getAllByText("Admin").length).toBeGreaterThan(0);
  });

  it("navigates back when back arrow clicked", () => {
    render(<UserAuthorization />);

    fireEvent.click(document.querySelector("svg")!);

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("opens add user modal and submits", () => {
    render(<UserAuthorization />);

    fireEvent.click(screen.getByText("Add User"));

    fireEvent.click(screen.getByText("Mock Add User"));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "CREATE_USER" })
    );
  });

  it("opens delete modal and confirms delete", () => {
    (getUsers as jest.Mock).mockReturnValue([
      {
        id: "1",
        userName: "testuser",
        createdBy: "Admin",
        updatedBy: "Admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      },
    ]);

    render(<UserAuthorization />);

    fireEvent.click(document.querySelectorAll(".user-action-btn")[1]); // delete button

    expect(screen.getByText("Delete User")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirm Delete"));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "DELETE_USER" })
    );
  });

  it("pagination triggers fetchUsers", () => {
    (getUsersPagination as jest.Mock).mockReturnValue({
      page: 1,
      limit: 10,
      total: 50,
    });

    render(<UserAuthorization />);

    fireEvent.click(screen.getByText("Mock Pagination"));

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "FETCH_USERS" })
    );
  });
});
