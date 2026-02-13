import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

// Mock MUI Tooltip so the `title` content is rendered inline for testing
jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  const React = require("react");
  const Tooltip = ({ title, children }) => (
    <div data-testid="mock-tooltip">
      <div data-testid="mock-tooltip-title">
        {typeof title === "string" ? title : title}
      </div>
      {children}
    </div>
  );
  return { ...actual, Tooltip };
});

// Mock the CommandEditorDialog to avoid rendering MUI Dialog + Monaco in tests
jest.mock("../../../components/common/commonEditorDialogue", () => (props) => {
  const React = require("react");
  return props.open
    ? React.createElement(
        "div",
        { "data-testid": "mock-command-editor" },
        `CMD:${props.command || ""}`
      )
    : null;
});

import {
  DetailTooltip,
  TemplateTooltip,
  RecordDetailTooltip,
} from "../../../components/CustomTooltip/CustomTooltip";

describe("CustomTooltip components", () => {
  test("DetailTooltip shows title, values and custom component", () => {
    const details = [
      { label: "Name", value: "Alice" },
      { label: "Info", customComponent: <span data-testid="cc">CUSTOM</span> },
    ];

    render(
      <DetailTooltip details={details} title="My Title">
        <button>Child</button>
      </DetailTooltip>
    );

    // Because Tooltip is mocked to render title content inline, these should be present
    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByTestId("cc")).toHaveTextContent("CUSTOM");
    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  test("TemplateTooltip parses variableParameters (object values) and opens editor", () => {
    const template = {
      templateName: "Temp1",
      description: "desc",
      templateType: "type",
      accessType: "access",
      tags: ["a", "b"],
      commandScripts: "echo hi",
      variableParameters: JSON.stringify({ p1: "v1" }),
      templateVersion: "1",
      createdAt: "2020-01-01T00:00:00",
      updatedAt: "2020-01-02T00:00:00",
    };

    render(
      <TemplateTooltip template={template}>
        <span>Child</span>
      </TemplateTooltip>
    );

    // The tooltip content is rendered inline (mocked Tooltip)
    expect(screen.getByText("Template Name:")).toBeInTheDocument();
    const temps = screen.getAllByText("Temp1");
    expect(temps.length).toBeGreaterThanOrEqual(1);

    // Input variable should show key and value
    expect(screen.getByText("p1:")).toBeInTheDocument();
    expect(screen.getByText("v1")).toBeInTheDocument();

    // Click the script icon/button to open the editor (mocked dialog)
    const img = screen.getByAltText("code editor");
    fireEvent.click(img);
    expect(screen.getByTestId("mock-command-editor")).toHaveTextContent(
      "CMD:echo hi"
    );
  });

  test("TemplateTooltip handles empty variableParameters (show keys only and 'None') and invalid JSON", () => {
    const tmplEmpty = {
      templateName: "TEmpty",
      variableParameters: {},
    };

    const { rerender } = render(
      <TemplateTooltip template={tmplEmpty}>
        <span>Child</span>
      </TemplateTooltip>
    );

    // No input variables -> should show 'None' text
    expect(screen.getByText("Input Variables:")).toBeInTheDocument();
    expect(screen.getByText("None")).toBeInTheDocument();

    // Invalid JSON string in variableParameters should be handled gracefully
    const tmplInvalid = {
      templateName: "TInv",
      variableParameters: "{ not: json",
    };
    rerender(
      <TemplateTooltip template={tmplInvalid}>
        <span>Child</span>
      </TemplateTooltip>
    );

    // Still renders, and shows Input Variables header
    expect(screen.getByText("Input Variables:")).toBeInTheDocument();
  });

  test("TemplateTooltip shows keys-only when all variable values are empty", () => {
    const tmplKeysOnly = {
      templateName: "TKeys",
      variableParameters: { a: "", b: "   ", c: null },
    };

    render(
      <TemplateTooltip template={tmplKeysOnly}>
        <span>Child</span>
      </TemplateTooltip>
    );

    // Keys should be shown without colon (keys-only branch)
    expect(screen.getByText("Input Variables:")).toBeInTheDocument();
    expect(screen.getByText("a")).toBeInTheDocument();
    // Ensure the colon variant is not present for the key
    expect(screen.queryByText("a:")).toBeNull();
  });

  test("TemplateTooltip shows zero value correctly", () => {
    const tmplZero = {
      templateName: "TZero",
      variableParameters: { p: 0 },
    };

    render(
      <TemplateTooltip template={tmplZero}>
        <span>Child</span>
      </TemplateTooltip>
    );

    // Key with colon and zero value should be present
    expect(screen.getByText("p:")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("RecordDetailTooltip handles objects that fail JSON.stringify (circular)", () => {
    const circ = {};
    circ.self = circ;
    const record = { circular: circ };

    render(
      <RecordDetailTooltip record={record}>
        <span>Child</span>
      </RecordDetailTooltip>
    );

    // String conversion fallback should be used when stringify fails
    expect(screen.getByText("Circular:")).toBeInTheDocument();
    expect(screen.getByText("[object Object]")).toBeInTheDocument();
  });

  test("TemplateTooltip returns children unchanged when no template provided", () => {
    render(
      <TemplateTooltip template={null}>
        <div data-testid="plain-child">OK</div>
      </TemplateTooltip>
    );
    expect(screen.getByTestId("plain-child")).toHaveTextContent("OK");
  });

  test("RecordDetailTooltip formats different value types and truncates long JSON", () => {
    const longObj = { a: "x".repeat(300) };
    const record = {
      command: "ls",
      hostname: null,
      startTime: "2020-02-02T12:00:00",
      output: ["one", "two"],
      large: longObj,
      timestamp: "2020-03-03T10:00:00",
    };

    render(
      <RecordDetailTooltip record={record}>
        <button>Child</button>
      </RecordDetailTooltip>
    );

    // Preferred fields and formatted values
    expect(screen.getByText("Command:")).toBeInTheDocument();
    expect(screen.getByText("ls")).toBeInTheDocument();

    // Null hostname becomes '-'
    expect(screen.getByText("Hostname:")).toBeInTheDocument();
    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBeGreaterThanOrEqual(1);

    // Array joins
    expect(screen.getByText("Output:")).toBeInTheDocument();
    expect(screen.getByText("one, two")).toBeInTheDocument();

    // Large object should be stringified and truncated (ends with ...)
    const largeText = screen.getByText((content, node) =>
      content.includes("...")
    );
    expect(largeText).toBeTruthy();

    // Dates formatted via formattedDate are present
    expect(screen.getAllByText(/\|/).length).toBeGreaterThanOrEqual(1);
  });
});
