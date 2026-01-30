import moment from "moment";
import React, { useState } from "react";
import { get, isEmpty } from "lodash";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Radio, RadioGroup } from "@mui/material";
import { getUpgradeAgentVersion } from "../../../redux/selectors/agentManagement.selectors";
import agentManagementActions from "../../../redux/actions/agentManagement.action";
import "../css/agentStyle.css";
import "../css/common-style.css";
import { errortoast } from "../helpers/CustomToast";
import { buildDateText, cancelButtonText, upgradeAgentText, upgradeJobButtonText } from "../../../constants/strings";

interface AgentDetail {
  server_port?: string | number;
  [key: string]: unknown; // For any additional properties that might exist
}

interface UpgradeAgentData {
  hostname: string;
  agent_details: AgentDetail;
}

interface VersionInfo {
  version: string;
  buildDate: string;
  agentpath?: string;
}

interface UpgradeVersions {
  risebotVersions: VersionInfo[];
  [key: string]: VersionInfo[]; // For any additional version types that might exist
}

interface UpgradeAgentsDialogProps {
  showAgentUpgrade: boolean;
  closeAgentUpgrade: () => void;
  upgradeAgentData: UpgradeAgentData[];
}

const UpgradeAgentsDialog: React.FC<UpgradeAgentsDialogProps> = ({ showAgentUpgrade, closeAgentUpgrade, upgradeAgentData }) => {
  const dispatch = useDispatch();
  const upgradeVersions = useSelector(getUpgradeAgentVersion) as UpgradeVersions;
  const [risebotAgentVersion, setRisebotAgentVersion] = useState<string>("");

  const selectAgentVersion = (version: string) => {
    setRisebotAgentVersion(prev => (prev === version ? "" : version));
  };

  const resetVersions = () => {
    setRisebotAgentVersion("");
  };

  const closeUpgradeModal = () => {
    resetVersions();
    closeAgentUpgrade();
  };

  const upgradeAgents = () => {
    const data = upgradeAgentData.map(({ hostname, agent_details }) => ({
      hostname,
      port: String(get(agent_details, "server_port", "")),
    }));

    if (isEmpty(risebotAgentVersion)) {
      errortoast("Please select the RISEAGENT version");
    } else {
      const jsonData = {
        data,
        risebotAgentVersion,
      };
      dispatch(agentManagementActions.upgradeSelectedAgents(jsonData));
      closeAgentUpgrade();
      resetVersions();
    }
  };

  const renderAccordionData = (versionType: keyof UpgradeVersions, selectedVersion: string, agentType: string) => {
    return (
      <div>
        {get(upgradeVersions, versionType, [] as VersionInfo[]).map(({ version, buildDate }, index) => (
          <div className="subPopVersionCvr" key={version}>
            <Radio
              name="agentAgent"
              value={version}
              checked={risebotAgentVersion === version}
              onClick={() => selectAgentVersion(version)}
              sx={{
                "&.Mui-checked": {
                  color: risebotAgentVersion === version ? "#2961F4" : "",
                },
              }}
            />
            <div className="subPopVersionCvrBtn risebotmdlBtn">
              <Button data-testid={`agentManagerVersionBtn-${agentType}-${index}`} className="risebotagentSubVersionBtn" onClick={() => selectAgentVersion(version)}>
                v{version}
              </Button>
            </div>
            <div className="subPopVersionCvrBtn risebotmdlCont">
              <p>
                <span className="buildDateLabel">{buildDateText}</span>
                <time dateTime={buildDate} className="buildDate">
                  {(() => {
                    const timestamp = Number(buildDate);
                    if (moment(timestamp).isValid() && timestamp > 1000000000000) {
                      return moment(timestamp).format("DD-MMMM-YYYY");
                    }
                    if (moment(timestamp * 1000).isValid()) {
                      return moment(timestamp * 1000).format("DD-MMMM-YYYY");
                    }
                    if (moment(buildDate).isValid()) {
                      return moment(buildDate).format("DD-MMMM-YYYY");
                    }
                    return "Invalid Date";
                  })()}
                </time>
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div data-testid="upgradeAgentTestId">
      <Modal show={showAgentUpgrade} onHide={closeUpgradeModal} backdrop="static" className="risebothealthCheckModal">
        <Modal.Header closeButton>
          <Modal.Title className="upgradeHeader">{upgradeAgentText}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="agentVersionsCover">
            <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="agents" name="radio-buttons-group">
              {renderAccordionData("risebotVersions", risebotAgentVersion, "risebotVersions")}
            </RadioGroup>
          </div>
          <Button hidden data-testid="unknownTypeBtn" onClick={() => selectAgentVersion("Unknown")} />
        </Modal.Body>
        <Modal.Footer>
          <Button data-testid="upgradeCancelTestid" className="deleteSchedulerCancelBtn" onClick={closeUpgradeModal}>
            {cancelButtonText}
          </Button>
          <Button data-testid="upgradeBtnTestId" className="saveButtonAgent" onClick={upgradeAgents}>
            {upgradeJobButtonText}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UpgradeAgentsDialog;
