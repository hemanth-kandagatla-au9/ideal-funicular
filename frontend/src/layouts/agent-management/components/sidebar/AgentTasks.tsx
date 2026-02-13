/* eslint-disable */
import { useEffect, useState } from "react";
import { Accordion, Button, Modal} from "react-bootstrap";
import { IconButton, Radio, RadioGroup, Typography } from "@mui/material";
import { isEmpty, isNull } from "lodash";
import moment from "moment";
import { AccordionContext } from "react-bootstrap";
import { canAccess } from "../../../../utils/PermissionUtils";
import { convertDateTime } from "../../helpers/agentHelpers";
import { useDispatch } from "react-redux";
import agentManagementActions from "../../../../redux/actions/agentManagement.action";
import {
  agentTasksTitle,
  buildDateText,
  checkStatusAgentButtonText,
  confirmButtonText,
  deleteJobButtonText,
  editJobButtonText,
  jobLogTooltipText,
  loadingText,
  restartAgentButtonText,
  envUpgradeButtonText,
  syncAgentConfigButtonText,
  restartJobButtonText,
  scheduleJobButtonText,
  scheduleJobsButtonText,
  startAgentButtonText,
  startJobButtonText,
  stopAgentButtonText,
  stopJobButtonText,
  upgradeJobButtonText,
  upgradeVersionText,
} from "../../../../constants/strings";

interface AgentTasksProps {
  hostname: string;
  port: string;
  type: string;
  osVersion: string;
  scheduledJobs: string[];
  openScheduler: (port: string) => void;
  upgradeAgent: (agentId: string, type: string) => void;
  startJob: (hostname: string, port: string) => void;
  stopJob: (hostname: string, port: string) => void;
  restartJob: (hostname: string, port: string) => void;
  startAgentviaSSH: (hostname: string, port: string, osVersion: string) => void;
  shutDownAgent: (hostname: string, port: string) => void;
  restartAgent: (hostname: string, port: string) => void;
  openEnvUpgradeModal: () => void;
  syncAgentConfig: () => void;
  checkAgentStatus: (hostname: string, port: string) => void;
  editSchedulerCommands: (hostname: string, port: string, scheduledJob: string) => void;
  deleteSchedulerJob: (hostname: string, port: string, scheduledJob: string) => void;
  loadAgentLogs: (hostname: string, agentId: string | null, jobName: string) => void;
  versionDialogOpen: boolean;
  selectedAgentVersion: string;
  handleSelectAgentVersion: (version: string) => void;
  agentVersionUpgrade: (port: string, agentsVersion: any) => void;
  closeSubModal: () => void;
  agentsVersion: any;
  serviceLoad: boolean;
  schedulerLoading: boolean;
  agentId: string | null;
  setJobName: (jobName: string) => void;
  setJobLogModal: (show: boolean) => void;
}

interface AgentVersion {
  version: string;
  buildDate: string;
  agentpath?: string;
}

interface AgentsVersionData {
  risebotVersions: AgentVersion[];
}

const AgentTasks: React.FC<AgentTasksProps> = ({
  hostname,
  port,
  type,
  osVersion,
  scheduledJobs,
  openScheduler,
  upgradeAgent,
  startJob,
  stopJob,
  restartJob,
  startAgentviaSSH,
  shutDownAgent,
  restartAgent,
  openEnvUpgradeModal,
  syncAgentConfig,
  checkAgentStatus,
  editSchedulerCommands,
  deleteSchedulerJob,
  loadAgentLogs,
  versionDialogOpen,
  selectedAgentVersion,
  handleSelectAgentVersion,
  agentVersionUpgrade,
  closeSubModal,
  agentsVersion,
  serviceLoad,
  schedulerLoading,
  agentId,
  setJobName,
  setJobLogModal,
}) => {
  const isAgentTaskStartBtnEnabled = canAccess("Agent Task Button: Start");
  const isAgentTaskStopBtnEnabled = canAccess("Agent Task Button: Stop");
  const isAgentTaskRestartBtnEnabled = canAccess("Agent Task Button: Restart");
  const isAgentTaskUpgradeBtnEnabled = canAccess("Agent Task Button: Upgrade");
  const isAgentTaskCheckStatusBtnEnabled = canAccess("Agent Task Button: Check Status");
  const isAgentTaskSyncConfigBtnEnabled = canAccess("Agent Task Button: Sync Agent Config");
  const isAgentTaskScheduleCmdBtnEnabled = canAccess("Agent Task Button: Schedule Command");
  const isAgentTaskEditBtnEnabled = canAccess("Agent Task Button: Edit");
  const isAgentTaskDeleteBtnEnabled = canAccess("Agent Task Button: Delete");

  const [allButtonsDisabled, setAllButtonsDisabled] = useState<boolean>(false);
  const [clickedButton, setClickedButton] = useState<string | null>(null);


  const dispatch = useDispatch();
  const listScheduledCommands = (port: string, hostname: string) => {
    dispatch(agentManagementActions.listSchedulerCommand({ port, hostname }));
  };

  useEffect(() => {
    return () => {
      setAllButtonsDisabled(false);
      setClickedButton(null);
    };
  }, []);

  const handleButtonClick = (buttonKey: string, action: () => void) => {
    if (allButtonsDisabled) return;
    
    setAllButtonsDisabled(true);
    setClickedButton(buttonKey);
    action();
    setTimeout(() => {
      setAllButtonsDisabled(false);
      setClickedButton(null);
    }, 4000);
  };

  useEffect(() => {
    listScheduledCommands(port, hostname);
  }, [hostname, port]);

  return (
    <Accordion.Item eventKey="0">
      <Accordion.Header className="accordionHead" onClick={e => !isNull(e) && listScheduledCommands(port, hostname)}>
        <AccordionContext.Consumer>
          {({ activeEventKey }) => (
            <>
              <Typography className={`accordionTitle ${activeEventKey === "0" ? "titleCollapsed" : "nottitleCollapsed"}`}>{agentTasksTitle}</Typography>
              <span className={`agentDetailsArrow ${activeEventKey !== "0" ? "collapsedSvg" : "notcollapsedSvg"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#102459" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </>
          )}
        </AccordionContext.Consumer>
      </Accordion.Header>
      <Accordion.Body className="buttonBody risebotagentHealCheck" style={{ position: "relative" }}>
         <>
          {isAgentTaskStartBtnEnabled && (
              <Button 
                className={`agentTriggerBtn ${clickedButton === 'startJob' ? 'button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('startJob', () => startJob(hostname, port))}
                disabled={allButtonsDisabled}
                data-testid="agentSubServiceStartBtn"
              >
                {startJobButtonText}
              </Button>
          )}
          {isAgentTaskStopBtnEnabled && (
              <Button 
                className={`agentTriggerBtn ${clickedButton === 'stopJob' ? 'button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('stopJob', () => stopJob(hostname, port))}
                disabled={allButtonsDisabled}
                data-testid="agentSubServiceStopBtn"
              >
                {stopJobButtonText}
              </Button>
          )}
          {isAgentTaskRestartBtnEnabled && (
              <Button 
                className={`agentTriggerBtn ${clickedButton === 'restartJob' ? 'button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('restartJob', () => restartJob(hostname, port))}
                disabled={allButtonsDisabled}
                data-testid="restartAgentStatusId"
              >
                {restartJobButtonText}
              </Button>
          )}
          {isAgentTaskUpgradeBtnEnabled && (
              <Button 
                className={`agentTriggerBtn ${clickedButton === 'upgradeAgent' ? 'button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('upgradeAgent', () => upgradeAgent(port, type))}
                disabled={allButtonsDisabled}
                data-testid="agentSubServiceUpdateBtn"
              >
                {upgradeJobButtonText}
              </Button>
          )}
          {isAgentTaskCheckStatusBtnEnabled && (
              <Button 
                className={`agentTriggerBtn ${clickedButton === 'checkStatus' ? 'button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('checkStatus', () => checkAgentStatus(hostname, port))}
                disabled={allButtonsDisabled}
                data-testid="checkAgentStatusId"
              >
                {checkStatusAgentButtonText}
              </Button>
          )}
          {isAgentTaskRestartBtnEnabled && (
              <Button 
                className={`agentTriggerBtn ${clickedButton === 'startSSH' ? 'button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('startSSH', () => startAgentviaSSH(hostname, port, osVersion))}
                disabled={allButtonsDisabled}
                data-testid="startAgentviaSSHId"
              >
                {startAgentButtonText}
              </Button>
          )}
          {isAgentTaskRestartBtnEnabled && (
              <Button 
                className={`agentTriggerBtn ${clickedButton === 'shutDown' ? 'button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('shutDown', () => shutDownAgent(hostname, port))}
                disabled={allButtonsDisabled}
                data-testid="shutDownAgentId"
              >
                {stopAgentButtonText}
              </Button>
          )}
          {isAgentTaskRestartBtnEnabled && (
              <Button 
                className={`agentTriggerBtn ${clickedButton === 'restartAgent' ? 'button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('restartAgent', () => restartAgent(hostname, port))}
                disabled={allButtonsDisabled}
                data-testid="restartAgentId"
              >
                {restartAgentButtonText}
              </Button>
          )}
          {isAgentTaskUpgradeBtnEnabled && (
              <Button 
                className={`agentTriggerBtn ${clickedButton === 'envUpgrade' ? 'button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('envUpgrade', () => openEnvUpgradeModal())}
                disabled={allButtonsDisabled}
                data-testid="envUpgradeAgentBtn"
              >
                {envUpgradeButtonText}
              </Button>
          )}
          {isAgentTaskSyncConfigBtnEnabled && (
              <Button 
                className={`agentTriggerBtn ${clickedButton === 'syncAgentConfig' ? 'button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('syncAgentConfig', () => syncAgentConfig())}
                disabled={allButtonsDisabled}
                data-testid="syncAgentConfigId"
              >
                {syncAgentConfigButtonText}
              </Button>
          )}
        </>
        <div className="coverAlertModal">
          {versionDialogOpen && (
            <Modal show={versionDialogOpen} onHide={closeSubModal} backdrop="static" className="risebothealthCheckModal">
              <Modal.Header closeButton>
                <Modal.Title className="upgradeHeader">{upgradeVersionText}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="agentVersionsCover">
                  <RadioGroup aria-labelledby="demo-radio-buttons-group-label" value={selectedAgentVersion} name="radio-buttons-group">
                    {!isEmpty(agentsVersion) &&
                      (agentsVersion as AgentsVersionData)?.risebotVersions.map(({ version, buildDate }) => (
                        <div className="subPopVersionCvr" key={version}>
                          <Radio
                            name="agentVersion"
                            value={version}
                            checked={selectedAgentVersion === version}
                            onChange={() => handleSelectAgentVersion(version)}
                            sx={{
                              "&.Mui-checked": {
                                color: selectedAgentVersion === version ? "#2961F4" : "",
                              },
                            }}
                          />
                          <div className="subPopVersionCvrBtn risebotmdlBtn">
                            <Button
                              className={`risebotagentSubVersionBtn ${selectedAgentVersion === version ? "versionActiveBtn" : ""}`}
                              onClick={() => handleSelectAgentVersion(version)}
                            >
                              v {version}
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
                  </RadioGroup>
                </div>
              </Modal.Body>
              <Modal.Footer className="confirmBtnModal">
                <Button className="" onClick={() => agentVersionUpgrade(port, agentsVersion)} data-testid="agentSubServiceVersionControlBtn">
                  {confirmButtonText}
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </div>  
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default AgentTasks;
