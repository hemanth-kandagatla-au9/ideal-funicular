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
  const isAgentTaskScheduleCmdBtnEnabled = canAccess("Agent Task Button: Schedule Command");
  const isAgentTaskEditBtnEnabled = canAccess("Agent Task Button: Edit");
  const isAgentTaskDeleteBtnEnabled = canAccess("Agent Task Button: Delete");

  const [buttonDisabled, setButtonDisabled] = useState<{ [key: string]: boolean }>({});

  const dispatch = useDispatch();
  const listScheduledCommands = (port: string, hostname: string) => {
    dispatch(agentManagementActions.listSchedulerCommand({ port, hostname }));
  };

  useEffect(() => {
    // Cleanup function to clear all pending timeouts when component unmounts
    return () => {
      setButtonDisabled({});
    };
  }, []);

  const handleButtonClick = (buttonKey: string, action: () => void) => {
    if (buttonDisabled[buttonKey]) return;
    
    setButtonDisabled(prev => ({ ...prev, [buttonKey]: true }));
    action();
    
    const timer = setTimeout(() => {
      setButtonDisabled(prev => ({ ...prev, [buttonKey]: false }));
    }, 3000); // 3 seconds delay
    
    // Store timer reference for potential cleanup (optional enhancement)
    return () => clearTimeout(timer);
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
                className="agentTriggerBtn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('startJob', () => startJob(hostname, port))}
                disabled={buttonDisabled['startJob']}
                data-testid="agentSubServiceStartBtn"
              >
                {startJobButtonText}
              </Button>
          )}
          {isAgentTaskStopBtnEnabled && (
              <Button 
                className="agentTriggerBtn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('stopJob', () => stopJob(hostname, port))}
                disabled={buttonDisabled['stopJob']}
                data-testid="agentSubServiceStopBtn"
              >
                {stopJobButtonText}
              </Button>
          )}
          {isAgentTaskRestartBtnEnabled && (
              <Button 
                className="agentTriggerBtn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('restartJob', () => restartJob(hostname, port))}
                disabled={buttonDisabled['restartJob']}
                data-testid="restartAgentStatusId"
              >
                {restartJobButtonText}
              </Button>
          )}
          {isAgentTaskUpgradeBtnEnabled && (
              <Button 
                className="agentTriggerBtn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('upgradeAgent', () => upgradeAgent(port, type))}
                disabled={buttonDisabled['upgradeAgent']}
                data-testid="agentSubServiceUpdateBtn"
              >
                {upgradeJobButtonText}
              </Button>
          )}
          {isAgentTaskCheckStatusBtnEnabled && (
              <Button 
                className="agentTriggerBtn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('checkStatus', () => checkAgentStatus(hostname, port))}
                disabled={buttonDisabled['checkStatus']}
                data-testid="checkAgentStatusId"
              >
                {checkStatusAgentButtonText}
              </Button>
          )}
          {isAgentTaskRestartBtnEnabled && (
              <Button 
                className="agentTriggerBtn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('startSSH', () => startAgentviaSSH(hostname, port, osVersion))}
                disabled={buttonDisabled['startSSH']}
                data-testid="startAgentviaSSHId"
              >
                {startAgentButtonText}
              </Button>
          )}
          {isAgentTaskRestartBtnEnabled && (
              <Button 
                className="agentTriggerBtn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('shutDown', () => shutDownAgent(hostname, port))}
                disabled={buttonDisabled['shutDown']}
                data-testid="shutDownAgentId"
              >
                {stopAgentButtonText}
              </Button>
          )}
          {isAgentTaskRestartBtnEnabled && (
              <Button 
                className="agentTriggerBtn"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleButtonClick('restartAgent', () => restartAgent(hostname, port))}
                disabled={buttonDisabled['restartAgent']}
                data-testid="restartAgentId"
              >
                {restartAgentButtonText}
              </Button>
          )}
          {/* {isAgentTaskScheduleCmdBtnEnabled && (
              <Button className="agentTriggerBtn" onMouseDown={(e) => e.preventDefault()} onClick={() => openScheduler(port)} data-testid="agentSubServiceSchedulerBtn">
                {scheduleJobButtonText}
              </Button>
          )} */}
          {/* {!isEmpty(scheduledJobs) && (
            <div className="taskButtonWrapper globConfigsDetails">
              <div className="schduledJobHead">
                <p className="agentSubLogTitle">{scheduleJobsButtonText}</p>
              </div>
              {scheduledJobs.map(el => (
                <div className="scheduledJobsWrapper" key={el}>
                  <div className="scheduledJobsName">{el}</div>
                  <div className="scheduledJobsBtns">
                    {isAgentTaskEditBtnEnabled && (
                        <Button className="editConfigButton" onClick={() => editSchedulerCommands(hostname, port, el)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                            <path d="M3.33203 18.8721H16.6654" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                            <path
                              d="M11.5721 3.59183L12.19 2.97391C13.2138 1.9501 14.8737 1.9501 15.8975 2.97391C16.9213 3.99771 16.9213 5.65762 15.8975 6.68142L15.2796 7.29934M11.5721 3.59183C11.5721 3.59183 11.6493 4.90491 12.8079 6.06351C13.9665 7.2221 15.2796 7.29934 15.2796 7.29934M11.5721 3.59183L5.89125 9.27265C5.50647 9.65743 5.31409 9.84982 5.14863 10.0619C4.95345 10.3122 4.78612 10.5829 4.64959 10.8694C4.53385 11.1123 4.44782 11.3704 4.27574 11.8866L3.54657 14.0741M15.2796 7.29934L9.59877 12.9802C9.21399 13.3649 9.0216 13.5573 8.80947 13.7228C8.55924 13.918 8.28849 14.0853 8.00202 14.2218C7.75916 14.3376 7.50105 14.4236 6.98482 14.5957L4.79731 15.3248M4.79731 15.3248L4.26259 15.5031C4.00855 15.5878 3.72847 15.5217 3.53912 15.3323C3.34977 15.1429 3.28365 14.8629 3.36833 14.6088L3.54657 14.0741M4.79731 15.3248L3.54657 14.0741"
                              stroke="#1C274C"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </Button>
                    )}
                    {isAgentTaskDeleteBtnEnabled && (
                        <IconButton className="deleteScheduledJobBtn" onClick={() => deleteSchedulerJob(hostname, port, el)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                            <path d="M2.5 5.53906H17.5" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path
                              d="M15.8332 5.53906V17.2057C15.8332 18.0391 14.9998 18.8724 14.1665 18.8724H5.83317C4.99984 18.8724 4.1665 18.0391 4.1665 17.2057V5.53906"
                              stroke="#1C274C"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M6.6665 5.53939V3.87272C6.6665 3.03939 7.49984 2.20605 8.33317 2.20605H11.6665C12.4998 2.20605 13.3332 3.03939 13.3332 3.87272V5.53939"
                              stroke="#1C274C"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </IconButton>
                    )}
                    {isAgentTaskEditBtnEnabled && (
                        <IconButton
                          className="editConfigButton"
                          onClick={() => {
                            setJobName(el);
                            loadAgentLogs(hostname, agentId, el);
                            setJobLogModal(true);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                            <path d="M10.8335 10.5391H17.5002" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10.8335 15.5391H17.5002" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10.8335 5.53906H17.5002" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2.5 10.5391H3.33333" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2.5 15.5391H3.33333" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2.5 5.53906H3.33333" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6.6665 10.5391H7.49984" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6.6665 15.5391H7.49984" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6.6665 5.53906H7.49984" stroke="#1C274C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </IconButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )} */}
        </>
        <div className="coverAlertModal">
          {versionDialogOpen && (
            <Modal show={versionDialogOpen} onHide={closeSubModal} backdrop="static" className="risebothealthCheckModal">
              <Modal.Header closeButton>
                {/* <div className="agentVersionsHeader"> */}
                <Modal.Title className="upgradeHeader">{upgradeVersionText}</Modal.Title>
                {/* <Button variant="outline" onClick={closeSubModal} className="closeIconBtn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                    <path d="M13.3346 14.1032L2.66797 3.43652M13.3346 3.43652L2.66797 14.1032" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </Button> */}
                {/* </div> */}
              </Modal.Header>
              <Modal.Body>
                <div className="agentVersionsCover">
                  <RadioGroup aria-labelledby="demo-radio-buttons-group-label" defaultValue="agent-task" name="radio-buttons-group">
                    {!isEmpty(agentsVersion) &&
                      (agentsVersion as AgentsVersionData)?.risebotVersions.map(({ version, buildDate }) => (
                        <div className="subPopVersionCvr" key={version}>
                          <Radio
                            // type="radio"
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
                            <Button className="risebotagentSubVersionBtn" onClick={() => handleSelectAgentVersion(version)}>
                              v {version}
                            </Button>
                          </div>
                          <div className="subPopVersionCvrBtn risebotmdlCont">
                            <p>
                              <span className="buildDateLabel">{buildDateText}</span>
                              <time dateTime={buildDate} className="buildDate">
                                {(() => {
                                  const timestamp = Number(buildDate);
                                  // Try milliseconds first
                                  if (moment(timestamp).isValid() && timestamp > 1000000000000) {
                                    return moment(timestamp).format("DD-MMMM-YYYY");
                                  }
                                  // Try seconds (multiply by 1000)
                                  if (moment(timestamp * 1000).isValid()) {
                                    return moment(timestamp * 1000).format("DD-MMMM-YYYY");
                                  }
                                  // Try as string date
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
        {/* {(serviceLoad || schedulerLoading) && (
          <div className="risebot_spinnerLoader">
            <div className="risebot_innerSpinner">
              <div className="spinner-border" role="status">
                <span className="sr-only">{loadingText}</span>
              </div>
            </div>
          </div>
        )} */}
      </Accordion.Body>
    </Accordion.Item>
  );
};

export default AgentTasks;
