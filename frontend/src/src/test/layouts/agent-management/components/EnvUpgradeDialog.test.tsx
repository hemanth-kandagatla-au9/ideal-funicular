import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EnvUpgradeDialog from "../../../../layouts/agent-management/components/EnvUpgradeDialog";
import { errortoast } from "../../../../layouts/agent-management/helpers/CustomToast";
import "@testing-library/jest-dom/extend-expect";

jest.mock("../../../../layouts/agent-management/helpers/CustomToast.tsx", () => ({
  errortoast: jest.fn(),
}));

describe("EnvUpgradeDialog", () => {
  const mockAgents = [
    { hostname: "host1", agent_details: { server_port: 1234 } },
    { hostname: "host2", agent_details: { server_port: 5678 } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders environment options", () => {
    render(<EnvUpgradeDialog showEnvUpgrade closeEnvUpgrade={jest.fn()} envUpgradeData={mockAgents} onConfirm={jest.fn()} />);

    expect(screen.getByText(/Environment Upgrade/i)).toBeInTheDocument();
    expect(screen.getByTestId("env-upgrade-dev")).toBeInTheDocument();
    expect(screen.getByText("PREDEV")).toBeInTheDocument();
    expect(screen.getByText("DEV")).toBeInTheDocument();
    expect(screen.getByText("QA")).toBeInTheDocument();
    expect(screen.getByText("PROD")).toBeInTheDocument();
  });

  it("shows error when confirming without selecting env", () => {
    render(<EnvUpgradeDialog showEnvUpgrade closeEnvUpgrade={jest.fn()} envUpgradeData={mockAgents} onConfirm={jest.fn()} />);

    fireEvent.click(screen.getByTestId("envUpgradeConfirm"));
    expect(errortoast).toHaveBeenCalledWith("Please select the target environment");
  });

  it("shows error when no agents provided", () => {
    render(<EnvUpgradeDialog showEnvUpgrade closeEnvUpgrade={jest.fn()} envUpgradeData={[]} onConfirm={jest.fn()} />);

    fireEvent.click(screen.getByTestId("envUpgradeConfirm"));
    expect(errortoast).toHaveBeenCalledWith("Please select the Agent Server");
  });

  it("calls onConfirm with selected env", () => {
    const onConfirm = jest.fn();
    render(<EnvUpgradeDialog showEnvUpgrade closeEnvUpgrade={jest.fn()} envUpgradeData={mockAgents} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByText("QA"));
    fireEvent.click(screen.getByTestId("envUpgradeConfirm"));

    expect(onConfirm).toHaveBeenCalledWith("qa");
  });
});
