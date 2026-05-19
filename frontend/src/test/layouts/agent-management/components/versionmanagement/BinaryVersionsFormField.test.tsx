/* eslint-disable testing-library/no-node-access */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import BinaryVersionsFormField from "../../../../../layouts/agent-management/components/versionmanagement/BinaryVersionsFormField";
jest.mock("../../../../../layouts/agent-management/components/versionmanagement/BinaryTextField", () => (props: any) => (
  <input
    data-testid={props.name}
    value={props.value}
    onChange={props.onChange}
    disabled={props.disabled}
  />
));

jest.mock("../../../../../layouts/agent-management/components/versionmanagement/BinarySelectField", () => (props: any) => (
  <select
    data-testid={props.name}
    value={props.value}
    onChange={props.onChange}
    disabled={props.disabled}
  />
));

jest.mock(
  "../../../../../layouts/agent-management/components/versionmanagement/BinaryDatePickerField",
  () => () => <div data-testid="datepicker" />
);

describe("BinaryVersionsFormField", () => {
  const createFormik = (overrides = {}) => ({
    values: {
      version: "",
      osCompatibility: "",
      osVersion: "",
      osEntries: [],
      status: "",
      upgradeType: "",
      isMandatory: false,
      s3Url: "",
      releaseDate: null,
      rustcversion: "",
      ...overrides.values,
    },
    errors: {},
    touched: {},
    handleChange: jest.fn(),
    handleBlur: jest.fn(),
    setFieldValue: jest.fn(),
    setTouched: jest.fn(),
  });

  it("renders main fields", () => {
    const formik = createFormik();

    render(<BinaryVersionsFormField formik={formik as any} isEditing={false} />);

    expect(screen.getByTestId("version")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("adds OS entry when clicking Add", () => {
    const formik = createFormik({
      values: {
        osCompatibility: "Windows",
        osVersion: "10",
        osEntries: [],
      },
    });

    render(<BinaryVersionsFormField formik={formik as any} isEditing={false} />);

    fireEvent.click(screen.getByText("Add"));

    expect(formik.setFieldValue).toHaveBeenCalledWith("osEntries", [
      { os: "Windows", version: "10" },
    ]);
  });

  it("does not add OS entry when fields empty", () => {
    const formik = createFormik();

    render(<BinaryVersionsFormField formik={formik as any} isEditing={false} />);

    fireEvent.click(screen.getByText("Add"));

    expect(formik.setFieldValue).not.toHaveBeenCalledWith(
      "osEntries",
      expect.anything()
    );
  });

  it("deletes OS entry", () => {
    const formik = createFormik({
      values: {
        osEntries: [{ os: "Windows", version: "10" }],
      },
    });

    render(<BinaryVersionsFormField formik={formik as any} isEditing={false} />);

    fireEvent.click(screen.getByTestId("DeleteIcon").closest("button")!);

    expect(formik.setFieldValue).toHaveBeenCalledWith("osEntries", []);
  });


  it("hides fields when editing", () => {
    const formik = createFormik();

    render(<BinaryVersionsFormField formik={formik as any} isEditing={true} />);

    expect(screen.queryByTestId("datepicker")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Version Download URL")
    ).not.toBeInTheDocument();
  });

  it("disables Add button in view mode", () => {
    const formik = createFormik();

    render(
      <BinaryVersionsFormField
        formik={formik as any}
        isEditing={false}
        isViewMode
      />
    );

    expect(screen.getByText("Add")).toBeDisabled();
  });
});
