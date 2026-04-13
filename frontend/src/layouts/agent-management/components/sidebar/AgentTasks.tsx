/* eslint-disable */
import { useEffect, useState } from "react";
import { Accordion, Button, Modal} from "react-bootstrap";
import { IconButton, Radio, RadioGroup, Typography } from "@mui/material";
import { isEmpty, isNull } from "lodash";
import moment from "moment";
import { AccordionContext } from "react-bootstrap";
import { canAccess } from "../../../../utils/PermissionUtils";
import useAgentPermissions from "../../../../utils/hooks/useAgentPermissions";
import AGENT_PERMISSIONS from "../../../../config/agentPermissionLabels";
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
  const { hasPermission } = useAgentPermissions();
    // Job-level operations
  const isAgentTaskStartBtnEnabled       = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_JOB_START);
  const isAgentTaskStopBtnEnabled        = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_JOB_STOP);
  const isAgentTaskRestartBtnEnabled     = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_JOB_RESTART);
  // Agent-level operations (same permissions as FilterBar bulk actions)
  const isAgentStartBtnEnabled           = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_START);
  const isAgentStopBtnEnabled            = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_STOP);
  const isAgentRestartBtnEnabled         = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_RESTART);
  const isAgentTaskUpgradeBtnEnabled     = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_UPGRADE);
  const isAgentTaskCheckStatusBtnEnabled = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_CHECK_STATUS);
  const isAgentTaskSyncConfigBtnEnabled  = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_SYNC_CONFIG);
  const isAgentTaskScheduleCmdBtnEnabled = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_WRITE);   // no specific label yet
  const isAgentTaskEditBtnEnabled        = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_WRITE);   // no specific label yet
  const isAgentTaskDeleteBtnEnabled      = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_WRITE);   // no specific label yet
  const isAgentEnvUpgradeBtnEnabled      = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_UPDATE_ENV);

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
      <Accordion.Header className="riseagent-accordionHead" onClick={e => !isNull(e) && listScheduledCommands(port, hostname)}>
        <AccordionContext.Consumer>
          {({ activeEventKey }) => (
            <>
              <Typography className={`riseagent-accordionTitle ${activeEventKey === "0" ? "riseagent-titleCollapsed" : "riseagent-nottitleCollapsed"}`}>{agentTasksTitle}</Typography>
              <span className={`riseagent-agentDetailsArrow ${activeEventKey !== "0" ? "riseagent-collapsedSvg" : "riseagent-notcollapsedSvg"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#102459" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </>
          )}
        </AccordionContext.Consumer>
      </Accordion.Header>
      <Accordion.Body className="riseagent-buttonBody riseagent-risebotagentHealCheck" style={{ position: "relative" }}>
         <>
          {isAgentTaskStartBtnEnabled && (
              <Button 
                className={`riseagent-agentTriggerBtn ${clickedButton === 'startJob' ? 'riseagent-button-clicked' : ''}`}
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
                className={`riseagent-agentTriggerBtn ${clickedButton === 'stopJob' ? 'riseagent-button-clicked' : ''}`}
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
                className={`riseagent-agentTriggerBtn ${clickedButton === 'restartJob' ? 'riseagent-button-clicked' : ''}`}
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
                className={`riseagent-agentTriggerBtn ${clickedButton === 'upgradeAgent' ? 'riseagent-button-clicked' : ''}`}
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
                className={`riseagent-agentTriggerBtn ${clickedButton === 'checkStatus' ? 'riseagent-button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('checkStatus', () => checkAgentStatus(hostname, port))}
                disabled={allButtonsDisabled}
                data-testid="checkAgentStatusId"
              >
                {checkStatusAgentButtonText}
              </Button>
          )}
          {isAgentStartBtnEnabled && (
              <Button 
                className={`riseagent-agentTriggerBtn ${clickedButton === 'startSSH' ? 'riseagent-button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('startSSH', () => startAgentviaSSH(hostname, port, osVersion))}
                disabled={allButtonsDisabled}
                data-testid="startAgentviaSSHId"
              >
                {startAgentButtonText}
              </Button>
          )}
          {isAgentStopBtnEnabled && (
              <Button 
                className={`riseagent-agentTriggerBtn ${clickedButton === 'shutDown' ? 'riseagent-button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('shutDown', () => shutDownAgent(hostname, port))}
                disabled={allButtonsDisabled}
                data-testid="shutDownAgentId"
              >
                {stopAgentButtonText}
              </Button>
          )}
          {isAgentRestartBtnEnabled && (
              <Button 
                className={`riseagent-agentTriggerBtn ${clickedButton === 'restartAgent' ? 'riseagent-button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('restartAgent', () => restartAgent(hostname, port))}
                disabled={allButtonsDisabled}
                data-testid="restartAgentId"
              >
                {restartAgentButtonText}
              </Button>
          )}
          {isAgentEnvUpgradeBtnEnabled && (
              <Button 
                className={`riseagent-agentTriggerBtn ${clickedButton === 'envUpgrade' ? 'riseagent-button-clicked' : ''}`}
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
                className={`riseagent-agentTriggerBtn ${clickedButton === 'syncAgentConfig' ? 'riseagent-button-clicked' : ''}`}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('syncAgentConfig', () => syncAgentConfig())}
                disabled={allButtonsDisabled}
                data-testid="syncAgentConfigId"
              >
                {syncAgentConfigButtonText}
              </Button>
          )}
        </>
        <div className="riseagent-coverAlertModal">
          {versionDialogOpen && (
            <Modal show={versionDialogOpen} onHide={closeSubModal} backdrop="static" className="riseagent-risebothealthCheckModal">
              <Modal.Header closeButton>
                <Modal.Title className="riseagent-upgradeHeader">{upgradeVersionText}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="riseagent-agentVersionsCover">
                  <RadioGroup aria-labelledby="demo-radio-buttons-group-label" value={selectedAgentVersion} name="radio-buttons-group">
                    {!isEmpty(agentsVersion) &&
                      (agentsVersion as AgentsVersionData)?.risebotVersions.map(({ version, buildDate }) => (
                        <div className="riseagent-subPopVersionCvr" key={version}>
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
                          <div className="riseagent-subPopVersionCvrBtn riseagent-risebotmdlBtn">
                            <Button
                              className={`riseagent-risebotagentSubVersionBtn ${selectedAgentVersion === version ? "riseagent-versionActiveBtn" : ""}`}
                              onClick={() => handleSelectAgentVersion(version)}
                            >
                              v {version}
                            </Button>
                          </div>
                          <div className="riseagent-subPopVersionCvrBtn riseagent-risebotmdlCont">
                            <p>
                              <span className="riseagent-buildDateLabel">{buildDateText}</span>
                              <time dateTime={buildDate} className="riseagent-buildDate">
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
              <Modal.Footer className="riseagent-confirmBtnModal">
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
