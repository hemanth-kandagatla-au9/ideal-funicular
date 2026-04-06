import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { isEmpty } from "lodash";
import { cancelButtonText, envUpgradeTitleText, updateButtonText } from "../../../constants/strings";
import { errortoast } from "../helpers/CustomToast";
import "../css/agentStyle.css";
import "../css/common-style.css";

type EnvOption = "predev" | "dev" | "qa" | "prod";

interface EnvUpgradeDialogProps {
  showEnvUpgrade: boolean;
  closeEnvUpgrade: () => void;
  envUpgradeData: { hostname: string; agent_details: { server_port?: string | number } }[];
  onConfirm: (environment: string) => void;
}

const ENV_OPTIONS: EnvOption[] = ["predev", "dev", "qa", "prod"];

const EnvUpgradeDialog: React.FC<EnvUpgradeDialogProps> = ({ showEnvUpgrade, closeEnvUpgrade, envUpgradeData, onConfirm }) => {
  const [selectedEnv, setSelectedEnv] = useState<EnvOption | "">("");

  const handleConfirm = () => {
    if (isEmpty(envUpgradeData)) {
      errortoast("Please select the Agent Server");
      return;
    }

    if (isEmpty(selectedEnv)) {
      errortoast("Please select the target environment");
      return;
    }

    onConfirm(selectedEnv);
    setSelectedEnv("");
  };

  const handleClose = () => {
    setSelectedEnv("");
    closeEnvUpgrade();
  };

  return (
    <div data-testid="envUpgradeModal">
      <Modal show={showEnvUpgrade} onHide={handleClose} backdrop="static" className="riseagent-risebothealthCheckModal">
        <Modal.Header closeButton>
          <Modal.Title className="riseagent-upgradeHeader">{envUpgradeTitleText}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="riseagent-agentVersionsCover">
            <div className="riseagent-subPopVersionCvr" style={{ display: "grid", gap: "12px" }}>
              {ENV_OPTIONS.map(option => (
                <div key={option} className="riseagent-subPopVersionCvr" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <input
                    type="radio"
                    name="env-upgrade-options"
                    value={option}
                    checked={selectedEnv === option}
                    onChange={() => setSelectedEnv(option)}
                    data-testid={`env-upgrade-${option}`}
                    style={{ width: 18, height: 18 }}
                  />
                  <Button
                    className={`riseagent-risebotagentSubVersionBtn riseagent-envUpgradeOptionBtn ${selectedEnv === option ? "riseagent-versionActiveBtn" : ""}`}
                    onClick={() => setSelectedEnv(option)}
                    style={{ minWidth: 120, textTransform: "uppercase" }}
                  >
                    {option.toUpperCase()}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button data-testid="envUpgradeCancel" className="deleteSchedulerCancelBtn" onClick={handleClose}>
            {cancelButtonText}
          </Button>
          <Button data-testid="envUpgradeConfirm" className="saveButtonAgent" onClick={handleConfirm}>
            {updateButtonText}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EnvUpgradeDialog;
