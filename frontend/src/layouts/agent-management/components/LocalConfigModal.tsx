/* eslint-disable */
import { cancelButtonText, globalConfiguration, globalLocalConfigurationTitle, localConfiguration, saveButtonText } from "@/constants/strings";
import { SidebarState } from "@/types/SidebarState";
import { canAccess } from "@/utils/PermissionUtils";
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "../css/common-style.css";
import { AgentConfigDetail } from "../helpers/agentHelpers";

interface LocalConfigModalProps {
  open: boolean;
  onClose: () => void;
  agentConfigDetails: AgentConfigDetail[];
  state: SidebarState;
  addClassConfig: string;
  handleInputChangeForSideBar: (id: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelButtonClick: () => void;
  saveConfigs: (port: string, agentConfigDetails: any) => Promise<void>;
  port: string;
}

const LocalConfigModal: React.FC<LocalConfigModalProps> = ({
  open,
  onClose,
  agentConfigDetails,
  state,
  addClassConfig,
  handleInputChangeForSideBar,
  onCancelButtonClick,
  saveConfigs,
  port,
}) => {
  const isAgentLocalConfigSaveBtnEnabled = canAccess("Agent Local Config Button: Save");

  return (
    <Modal show={open} backdrop="static" onHide={onClose} className="risebot-globalLocalConfig">
      <Modal.Header closeButton>
        <Modal.Title className="risebot-ModalTitle">{globalLocalConfigurationTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="risebot-globeLocalConfigs">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="popupSubHeaders">
                  <p>{globalConfiguration}</p>
                </div>
                {state.riseBotSchema.map(({ label, propertyValue, encrypted }) =>
                  encrypted ? (
                    <div className={`${addClassConfig} fieldDetails localGlobView`} key={label}>
                      <div className="formLabel">{label}</div>
                      <Form.Control type="password" value={propertyValue} className="encryptedPasswordField" readOnly />
                    </div>
                  ) : (
                    <div className={`${addClassConfig} fieldDetails localGlobView`} key={label}>
                      <div className="formLabel">{label}</div>
                      <p>{propertyValue}</p>
                    </div>
                  ),
                )}
              </div>
              <div className="col-md-6">
                <div className="popupSubHeaders localConfigSubHead">
                  <p>{localConfiguration}</p>
                </div>
                <div>
                  {agentConfigDetails.map(({ label, propertyName, propertyValue }, ind) => (
                    <div className="fieldDetails localConfigForm" key={label}>
                      <div className="formLabel">{label}</div>
                      <div>
                        <Form.Control
                          // size="md"
                          size="sm"
                          id={propertyName}
                          name={propertyName}
                          placeholder={propertyValue}
                          onChange={(value: React.ChangeEvent<HTMLInputElement>) => handleInputChangeForSideBar(propertyName, value)}
                          style={{ border: "1px solid #e4e4e4" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="saveButtonsWrapper">
                <div className="cancenBtn">
                  <Button variant="contained" onClick={onCancelButtonClick}>
                    {cancelButtonText}
                  </Button>
                </div>
                <div className="saveBtn">
                  {isAgentLocalConfigSaveBtnEnabled && (
                    <Button variant="contained" onClick={() => saveConfigs(port, agentConfigDetails)}>
                      {saveButtonText}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LocalConfigModal;
