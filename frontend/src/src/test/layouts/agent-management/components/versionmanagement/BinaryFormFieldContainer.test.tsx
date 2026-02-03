import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormFieldsContainer from "../../../../../layouts/agent-management/components/versionmanagement/BinaryFormFieldsContainer";

describe("FormFieldsContainer", () => {
  it("renders children correctly", () => {
    render(
      <FormFieldsContainer>
        <div>Field 1</div>
        <div>Field 2</div>
      </FormFieldsContainer>,
    );

    expect(screen.getByText("Field 1")).toBeInTheDocument();
    expect(screen.getByText("Field 2")).toBeInTheDocument();
  });
});
