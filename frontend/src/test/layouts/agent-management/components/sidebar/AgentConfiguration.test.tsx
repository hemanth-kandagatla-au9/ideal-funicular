import React from "react";
import { render, screen } from "@testing-library/react";
import { Accordion } from "react-bootstrap";
import AgentConfiguration from "../../../../../layouts/agent-management/components/sidebar/AgentConfiguration";
import "@testing-library/jest-dom/extend-expect";
import { agentConfigurationTitle, configurationTitle } from "../../../../../constants/strings";

describe("AgentConfiguration Component", () => {
  const baseProps = {
    applicationProperty: {
      "property.one": "valueOne",
      "property.two": "valueTwo",
    },
    trimAgentPropertyName: jest.fn((key: string) => key.toUpperCase()),
  };

  const renderWithAccordion = (activeKey = "2", props = {}) =>
    render(
      <Accordion activeKey={activeKey}>
        <AgentConfiguration {...baseProps} {...props} />
      </Accordion>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders titles correctly", () => {
  renderWithAccordion();

  expect(screen.getAllByText(agentConfigurationTitle).length).toBeGreaterThan(0);
  expect(screen.getAllByText(configurationTitle).length).toBeGreaterThan(0);
  });

  it("renders rows when applicationProperty has values", () => {
    renderWithAccordion();

    expect(screen.getByText("PROPERTY.ONE")).toBeInTheDocument();
    expect(screen.getByText("PROPERTY.TWO")).toBeInTheDocument();

    expect(screen.getByText("valueOne")).toBeInTheDocument();
    expect(screen.getByText("valueTwo")).toBeInTheDocument();
  });

  it("calls trimAgentPropertyName for each key", () => {
    renderWithAccordion();

    expect(baseProps.trimAgentPropertyName).toHaveBeenCalledTimes(2);
    expect(baseProps.trimAgentPropertyName).toHaveBeenCalledWith("property.one");
    expect(baseProps.trimAgentPropertyName).toHaveBeenCalledWith("property.two");
  });

  it("does not render rows when applicationProperty is empty", () => {
    renderWithAccordion("2", { applicationProperty: {} });

    expect(screen.queryByText("PROPERTY.ONE")).not.toBeInTheDocument();
    expect(screen.queryByText("valueOne")).not.toBeInTheDocument();
  });
it("applies expanded class when accordion is open", () => {
  renderWithAccordion("2");

  const title = screen.getAllByText(agentConfigurationTitle)[0];
  expect(title.className).toContain("titleCollapsed");
});

it("applies collapsed class when accordion is closed", () => {
  renderWithAccordion("1");

  const title = screen.getAllByText(agentConfigurationTitle)[0];
  expect(title.className).toContain("nottitleCollapsed");
});
});

