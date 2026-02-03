/* eslint-disable import/first */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AssignPermissionsModal from "@/layouts/user-authorization/AssignPermissionModal";

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(),
}));

jest.mock("@/redux/actions/userAuthorization.action", () => ({
  fetchGlobalPermissions: (id: string) => ({
    type: "FETCH_GLOBAL_PERMS",
    payload: id,
  }),
}));

import { useSelector } from "react-redux";

const user = {
  id: "u1",
  userName: "Hemanth",
};

const permissionsMock = {
  projects: [
    {
      project: "Project A",
      modules: [
        {
          module: "Module A",
          permissions: [
            { code: "read", permission: "Read", granted: true },
            { code: "write", permission: "Write", granted: false },
          ],
        },
      ],
    },
  ],
};

const renderUI = (overrideProps = {}) =>
  render(<AssignPermissionsModal show onHide={jest.fn()} selectedUser={user as any} onAssign={jest.fn()} loading={false} {...overrideProps} />);

describe("AssignPermissionsModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useSelector as jest.Mock).mockImplementation(cb =>
      cb({
        userAuthorization: {
          globalPermissions: permissionsMock,
        },
      }),
    );
  });

  it("renders modal title", () => {
    renderUI();
    expect(screen.getByText("Assign Permission: Hemanth")).toBeInTheDocument();
  });

  it("dispatches fetchGlobalPermissions on open", () => {
    renderUI();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "FETCH_GLOBAL_PERMS",
      payload: "u1",
    });
  });

  it("renders permissions UI", () => {
    renderUI();
    expect(screen.getByText("Project A")).toBeInTheDocument();
    expect(screen.getByText("Module A")).toBeInTheDocument();
    expect(screen.getByText("Read")).toBeInTheDocument();
    expect(screen.getByText("Write")).toBeInTheDocument();
  });

  it("toggle individual permission", () => {
    renderUI();

    const writeCheckbox = screen.getByLabelText("Write") as HTMLInputElement;
    expect(writeCheckbox.checked).toBe(false);

    fireEvent.click(writeCheckbox);
    expect(writeCheckbox.checked).toBe(true);
  });

  it("select all toggles all permissions", () => {
    renderUI();

    const selectAll = screen.getByLabelText("Select All") as HTMLInputElement;
    fireEvent.click(selectAll);

    const read = screen.getByLabelText("Read") as HTMLInputElement;
    const write = screen.getByLabelText("Write") as HTMLInputElement;

    expect(read.checked).toBe(true);
    expect(write.checked).toBe(true);
  });

  it("save button disabled when no changes", () => {
    renderUI();
    const saveBtn = screen.getByText("Grant : Permissions");
    expect(saveBtn).toBeDisabled();
  });

  it("save button enabled when changes happen", () => {
    renderUI();

    fireEvent.click(screen.getByLabelText("Write"));
    const saveBtn = screen.getByText("Grant : Permissions");

    expect(saveBtn).not.toBeDisabled();
  });

  it("submit calls onAssign with selected permissions", () => {
    const onAssign = jest.fn();

    render(<AssignPermissionsModal show onHide={jest.fn()} selectedUser={user as any} onAssign={onAssign} loading={false} />);

    fireEvent.click(screen.getByLabelText("Write"));
    fireEvent.click(screen.getByText("Grant : Permissions"));

    expect(onAssign).toHaveBeenCalledWith("u1", ["read", "write"]);
  });

  it("cancel button calls onHide", () => {
    const onHide = jest.fn();

    render(<AssignPermissionsModal show onHide={onHide} selectedUser={user as any} onAssign={jest.fn()} />);

    fireEvent.click(screen.getByText("Cancel"));
    expect(onHide).toHaveBeenCalled();
  });

  it("shows loading state", () => {
    renderUI({ loading: true });
    expect(screen.getByText("Loading permissions...")).toBeInTheDocument();
  });

  it("returns null if no user", () => {
    const { container } = render(<AssignPermissionsModal show onHide={jest.fn()} selectedUser={null} onAssign={jest.fn()} />);

    expect(container.firstChild).toBeNull();
  });
});
