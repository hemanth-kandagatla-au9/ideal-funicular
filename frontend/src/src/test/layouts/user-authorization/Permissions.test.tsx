import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Permissions from "../../../layouts/user-authorization/Permissions";

jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useHistory: jest.fn(),
}));
jest.mock("../../../../src/redux/actions/userAuthorization.action", () => ({
  fetchPermissions: jest.fn(payload => ({ type: "FETCH", payload })),
  createPermission: jest.fn(payload => ({ type: "CREATE", payload })),
  deletePermission: jest.fn(id => ({ type: "DELETE", payload: id })),
}));

jest.mock("@/components/ui/pagination/Pagination.component", () => (props: any) => <button onClick={() => props.handlePagination(10, 2)}>Mock Pagination</button>);

jest.mock(
  "@/components/popup/popUp.component",
  () => (props: any) =>
    props.show ? (
      <div>
        <p>Delete Permission</p>
        <button onClick={props.handleClick}>Confirm Delete</button>
        <button onClick={props.onHide}>Cancel Delete</button>
      </div>
    ) : null,
);
const mockDispatch = jest.fn();
const mockPush = jest.fn();

const mockState = {
  permissions: [],
  loading: false,
  pagination: { page: 1, limit: 10, total: 0 },
};

function setupSelectors(stateOverride = {}) {
  const state = { ...mockState, ...stateOverride };

  (useSelector as jest.Mock).mockImplementation(selector =>
    selector({
      userAuthorization: {
        permissions: state.permissions,
        loading: state.loading,
        permissionsPagination: state.pagination,
      },
    }),
  );
}

describe("Permissions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useHistory as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("dispatches fetchPermissions on mount", () => {
    setupSelectors();
    render(<Permissions />);

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "FETCH" }));
  });

  it("shows empty state", () => {
    setupSelectors({ permissions: [] });
    render(<Permissions />);

    expect(screen.getByText("No permissions found")).toBeInTheDocument();
  });

  it("validates empty inputs", () => {
    setupSelectors();
    render(<Permissions />);

    fireEvent.click(screen.getByText("Add"));

    expect(screen.getByText("Project is required")).toBeInTheDocument();
    expect(screen.getByText("Module is required")).toBeInTheDocument();
    expect(screen.getByText("Permission is required")).toBeInTheDocument();
  });

  it("dispatches createPermission on valid submit", () => {
    setupSelectors();
    render(<Permissions />);
    const projectSelect = screen.getAllByRole("combobox")[0];
    fireEvent.change(projectSelect, {
      target: { value: "agent" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter Module"), {
      target: { value: "status" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Permission"), {
      target: { value: "read" },
    });
    fireEvent.click(screen.getByText("Add"));

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "CREATE" }));
  });

  it("opens delete modal and confirms delete", () => {
    setupSelectors({
      permissions: [
        {
          id: "1",
          project: "Agent",
          module: "status",
          permission: "read",
          createdAt: "2024-01-01",
          createdBy: "admin",
        },
      ],
    });

    render(<Permissions />);

    fireEvent.click(document.querySelector(".table-action-btn")!);

    expect(screen.getByText("Delete Permission")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Confirm Delete"));

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "DELETE", payload: "1" }));
  });

  it("pagination dispatches fetchPermissions", () => {
    setupSelectors({
      pagination: { page: 1, limit: 10, total: 50 },
    });

    render(<Permissions />);

    fireEvent.click(screen.getByText("Mock Pagination"));

    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "FETCH" }));
  });

  it("back button navigates", () => {
    setupSelectors();
    render(<Permissions />);

    fireEvent.click(document.querySelector("svg")!);

    expect(mockPush).toHaveBeenCalledWith("/userAuthorization");
  });
});
