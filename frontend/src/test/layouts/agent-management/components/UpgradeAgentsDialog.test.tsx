import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as reactRedux from "react-redux";
import { getUpgradeAgentVersion } from "../../../../redux/selectors/agentManagement.selectors";
import agentManagementActions from "../../../../redux/actions/agentManagement.action";
import UpgradeAgentsDialog from "../../../../layouts/agent-management/components/UpgradeAgentsDialog";
import { errortoast } from "../../../../layouts/agent-management/helpers/CustomToast";
import '@testing-library/jest-dom/extend-expect';
jest.mock("../../../../redux/selectors/agentManagement.selectors.ts", () => ({
  getUpgradeAgentVersion: jest.fn(),
}));

jest.mock("../../../../redux/actions/agentManagement.action.ts", () => ({
  __esModule: true,
  default: {
    upgradeSelectedAgents: jest.fn(),
  },
}));

jest.mock("../../../../layouts/agent-management/helpers/CustomToast.tsx", () => ({
  errortoast: jest.fn(),
}));

jest.mock("../../../../layouts/agent-management/helpers/agentHelpers.tsx", () => ({
  convertDateTime: jest.fn().mockReturnValue("2024-07-01 12:00 PM"),
}));

const mockDispatch = jest.fn();

const mockUpgradeVersions = {
  risebotVersions: [
    { version: "1.0.1", buildDate: "1720000000000", agentpath: "/path/to/agent" },
    { version: "1.0.2", buildDate: "1730000000000", agentpath: "/path/to/agent2" },
  ],
};

const mockUpgradeAgentData = [
  {
    hostname: "host1",
    agent_details: {
      server_port: 1234,
    },
  },
  {
    hostname: "host2",
    agent_details: {
      server_port: 5678,
    },
  },
];

describe("UpgradeAgentsDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getUpgradeAgentVersion.mockReturnValue(mockUpgradeVersions);
    jest.spyOn(reactRedux, "useSelector").mockImplementation(cb => cb());
    jest.spyOn(reactRedux, "useDispatch").mockReturnValue(mockDispatch);
  });

  const setup = (props = {}) => {
    return render(
      <UpgradeAgentsDialog
        showAgentUpgrade={true}
        closeAgentUpgrade={props.closeAgentUpgrade || jest.fn()}
        upgradeAgentData={mockUpgradeAgentData}
      />
    );
  };

  it("renders the modal when showAgentUpgrade is true", () => {
    setup();
    expect(screen.getByTestId("upgradeAgentTestId")).toBeInTheDocument();
    expect(screen.getByText("Upgrade RISEAGENT")).toBeInTheDocument();
  });

  it("displays available agent versions", () => {
    setup();
    expect(screen.getByText("v1.0.1")).toBeInTheDocument();
    expect(screen.getByText("v1.0.2")).toBeInTheDocument();
  });

  it("selects and deselects agent version", () => {
    setup();
  
    const versionBtn = screen.getByTestId("agentManagerVersionBtn-risebotVersions-0");
    const radios = screen.getAllByRole("radio");
  
    expect(radios[0].checked).toBe(false);
  
    fireEvent.click(versionBtn);
    expect(radios[0].checked).toBe(true);
  
    fireEvent.click(versionBtn);
    expect(radios[0].checked).toBe(false);
  });
  

  it("shows error toast if upgrade is clicked without selecting version", () => {
    setup();
    fireEvent.click(screen.getByTestId("upgradeBtnTestId"));
    expect(errortoast).toHaveBeenCalledWith("Please select the RISEAGENT version");
  });
  


  it("calls closeAgentUpgrade and resets versions on cancel", () => {
    const closeMock = jest.fn();
    const { getByTestId } = render(
      <UpgradeAgentsDialog showAgentUpgrade={true} closeAgentUpgrade={closeMock} upgradeAgentData={mockUpgradeAgentData} />
    );

    fireEvent.click(getByTestId("agentManagerVersionBtn-risebotVersions-1")); // select version
    fireEvent.click(getByTestId("upgradeCancelTestid")); // cancel
    expect(closeMock).toHaveBeenCalled();
  });

  it("handles hidden unknown version button click", () => {
    setup();
    const unknownBtn = screen.getByTestId("unknownTypeBtn");
    fireEvent.click(unknownBtn);
  });
    
 
  
  
});



