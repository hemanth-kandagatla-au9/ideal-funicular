/* eslint-disable */
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Accordion, Offcanvas } from "react-bootstrap";
import { get, isEmpty } from "lodash";
import "../../css/common-style.css";
import DeleteModal from "@/layouts/agent-management/components/DeleteModal";
import JobLogsModal from "@/layouts/agent-management/components/JobLogsModal";
import { GlobalConfigs, SideBarProps, SidebarState } from "@/types/SidebarState";
import LocalConfigModal from "@/layouts/agent-management/components/LocalConfigModal";
import {
  fetchScheduledJobsByCommandId,
  getAgentGlobalConfig,
  getRepositories,
  isLocalConfigReload,
  isJobReload,
  isSchedulerLoading,
  isServiceLoading,
  listScheduledJob,
  getAgentInfo,
  isAgentDetailsLoading,
} from "../../../../redux/selectors/agentManagement.selectors";
import agentPropertySchema from "../../../../config/agentPropertySchema";
import AgentTasks from "./AgentTasks";
import AgentDetails from "./AgentDetails";
import AgentConfiguration from "./AgentConfiguration";
import AgentLogs from "./AgentLogs";
import SchedulerDialog from "../SchedulerDialog";
import agentManagementAction from "../../../../redux/actions/agentManagement.action";
import { canAccess } from "../../../../utils/PermissionUtils";
import agentManagementService from "../../../../services/agent/agentManagement.service";
import { errortoast, successtoast } from "../../helpers/CustomToast";
import { viewDetailsTitle } from "../../../../constants/strings";
import { prepareAgentDetails, prepareAgentConfigDetails } from "../../helpers/agentHelpers";

const SideBar: React.FC<SideBarProps> = ({ open, setOpenSidebar, openBar: initialOpenBar, configureModal, agentSelected, port }) => {
  const dispatch = useDispatch();
  const logsBodyRef = useRef<HTMLUListElement>(null);
  const jobsLogRef = useRef<HTMLUListElement>(null);

  const [state, setState] = useState<SidebarState>({
    editAgentLocalConfiguration: false,
    openBar: initialOpenBar,
    openSchedulerCommand: false,
    openEditSchedule: false,
    openScheduleView: false,
    filledConfigDetails: false,
    deleteSchedulerModal: false,
    JobLogModal: false,
    isGlobalConfig: false,
    resetScheduleCommands: false,
    commandJob: "",
    selectedAgentVersion: "",
    selectedSubAgentsID: "",
    hostName: "",
    schedulerJobId: "",
    openLocalConfigModal: configureModal,
    riseBotSchema: get(agentPropertySchema, ["riseBot", "0.0.1"], []).map((obj: any) => ({ ...obj, propertyValue: "" })),
    localRiseBotSchema: get(agentPropertySchema, ["localRiseBotSchema", "0.0.1"], []).map((obj: any) => ({ ...obj, propertyValue: "" })),
    agentlocalconfig: [],
    versionDialogOpen: false,
    agentLog: [],
    limit: 100,
    skip: 0,
    jobName: "",
    isLogsLoading: false,
    loadMore: true,
    port: "",
  });

  const globalConfigs: GlobalConfigs = useSelector(getAgentGlobalConfig) as GlobalConfigs;
  const jobReload = useSelector(isJobReload);
  const serviceLoad = useSelector(isServiceLoading);
  const agentDetailsLoading: boolean = useSelector(isAgentDetailsLoading);
  const schedulerLoading = useSelector(isSchedulerLoading);
  const localConfigsReload = useSelector(isLocalConfigReload);
  const agentRepos = useSelector(getRepositories);
  const scheduledJobs = useSelector(listScheduledJob);
  const fetchScheduler = useSelector(fetchScheduledJobsByCommandId);
  const agentInfo = useSelector(getAgentInfo);
  const agentsVersion = get(agentRepos, "data.data", []);
  const risebot = get(agentSelected, "risebot", {});
  const agentId = get(risebot, "agentId", null);
  const applicationProperty = get(agentInfo, "agent_config", {});
  const type = get(agentSelected, ["risebotProperties", "agent.type"], "");
  const osVersion = get(agentSelected, ["agent_details", "os_version"], "");
  const { hostname } = agentSelected;
  const agentDetails = prepareAgentDetails(agentInfo);

  const agentConfigDetails = prepareAgentConfigDetails(agentInfo);

  const isAgentDetailsAccordionEnabled = canAccess("Agent Accordion: RISEBOT Details");
  const isAgentConfigAccordionEnabled = canAccess("Agent Accordion: RISEBOT Configuration");
  const isAgentTaskAccordionEnabled = canAccess("Agent Accordion: RISEBOT Tasks");
  const isAgentLogAccordionEnabled = canAccess("Agent Accordion: RISEBOT Logs");

  useEffect(() => {
    if (open && !state.openBar) {
      setState(prev => ({ ...prev, openBar: true }));
      loadAgentInfo();
    }
  }, [open]);

  useEffect(() => {
    if (!isEmpty(globalConfigs)) {
      prefillGlobalConfigDataForSideBar();
    }
  }, [globalConfigs]);

  useEffect(() => {
    if (localConfigsReload) {
      loadLocalConfiguration();
    }
  }, [localConfigsReload]);

  useEffect(() => {
    if (!isEmpty(fetchScheduler)) {
      setState(prev => ({ ...prev, openSchedulerCommand: true }));
    }
  }, [fetchScheduler]);

  useEffect(() => {
    if (!isEmpty(agentSelected)) {
      prefillLocalConfigData();
    }
  }, [agentSelected]);

  useEffect(() => {
    if (jobReload) {
      listScheduledCommands(port, hostname);
    }
  }, [jobReload, port, hostname]);

  useEffect(() => {
    const logsBody = jobsLogRef.current;
    if (!logsBody) return;

    const handleScroll = () => {
      if (logsBody.scrollTop + logsBody.clientHeight + 60 >= logsBody.scrollHeight && state.loadMore) {
        loadMoreAgentLogs(hostname, agentId, state.jobName);
      }
    };
    if (logsBody) {
      logsBody.addEventListener("scroll", handleScroll);
      return () => logsBody.removeEventListener("scroll", handleScroll);
    }
  }, [state.loadMore, hostname, agentId, state.jobName]);

  useEffect(() => {
    const logsBody = logsBodyRef.current;
    const handleScroll = () => {
      if (logsBody && logsBody.scrollTop + logsBody.clientHeight + 50 >= logsBody.scrollHeight && state.loadMore) {
        loadMoreAgentLogs(hostname, agentId, "");
      }
    };
    if (logsBody) {
      logsBody.addEventListener("scroll", handleScroll);
      return () => logsBody.removeEventListener("scroll", handleScroll);
    }
  }, [state.loadMore, hostname, agentId]);

  const loadLocalConfiguration = () => {
    dispatch(agentManagementAction.fetchLocalConfigs({ hostname }));
  };

  const loadAgentInfo = () => {
    dispatch(agentManagementAction.fetchAgentInfo({ hostname }));
  };

  const prefillGlobalConfigDataForSideBar = () => {
    const { riseBot } = globalConfigs;
    if (!isEmpty(riseBot)) {
      const updatedData = state.riseBotSchema.map(item => {
        const existingValues = riseBot?.find(({ propertyName }: any) => propertyName === item.propertyName);
        return existingValues ? { ...item, ...existingValues } : item;
      });
      setState(prev => ({ ...prev, riseBotSchema: updatedData }));
    }
  };

  const prefillLocalConfigData = () => {
    const { risebotProperties } = agentSelected;
    const finalPropertyData = Object.keys(risebotProperties).map(el => ({ propertyName: el, propertyValue: risebotProperties[el] }));
    const updatedDataOSAgent = state.localRiseBotSchema.map(item => {
      const existingValues = finalPropertyData.find(({ propertyName }) => propertyName === item.propertyName);
      return existingValues ? { ...item, ...existingValues } : item;
    });
    setState(prev => ({ ...prev, localRiseBotSchema: updatedDataOSAgent }));
  };

  const handleClose = () => {
    setState(prev => {
      const newState = { ...prev, openBar: false };
      setOpenSidebar(false);
      return newState;
    });
  };

  const hanldeLocalModal = () => setState(prev => ({ ...prev, openLocalConfigModal: false }));

  const handleInputChangeForSideBar = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const requestArr = [...state.agentlocalconfig];
    const existingIndex = requestArr.findIndex(item => item.propertyName === id);
    if (existingIndex !== -1) {
      requestArr[existingIndex].propertyValue = value;
    } else {
      requestArr.push({ propertyName: id, propertyValue: value });
    }
    setState(prev => ({ ...prev, agentlocalconfig: requestArr }));
  };

  const saveConfigs = async (port: string, agentConfigDetails: any) => {
    await handleValidation();
    const isErrorExist = false;
    if (!isErrorExist) {
      const propertiesSchemas = state.agentlocalconfig;
      const jsonData = { hostname, port, propertiesSchemas };
      dispatch(agentManagementAction.saveLocalConfigs(jsonData));
    }
  };

  const startJob = (hostname: string, port: string) => {
    dispatch(agentManagementAction.startAgentService({ hostname, port }));
  };

  const stopJob = (hostname: string, port: string) => {
    dispatch(agentManagementAction.stopAgentServices({ hostname, port }));
  };

  const restartJob = (hostname: string, port: string) => {
    dispatch(agentManagementAction.restartJobService({ hostname, port }));
  };

  const shutDownAgent = (hostname: string, port: string) => {
    dispatch(agentManagementAction.shutDownAgentService({ hostname, port }));
  };

  const restartAgent = (hostname: string, port: string) => {
    dispatch(agentManagementAction.restartAgentService({ hostname, port }));
  };

  const startAgentviaSSH = (hostname: string, port: string, osVersion: string) => {
    dispatch(agentManagementAction.startSSHAgentService({ hostname, port, osVersion }));
  };

  const checkAgentStatus = (hostname: string, port: string) => {
    dispatch(agentManagementAction.fetchHealthCheckup({ hostname, port }));
  };

  const openScheduler = (port: string) => {
    setState(prev => ({
      ...prev,
      openSchedulerCommand: !prev.openSchedulerCommand,
      selectedSubAgentsID: port,
      openEditSchedule: false,
      openScheduleView: true,
      resetScheduleCommands: true,
    }));
  };

  const upgradeAgent = (agentId: string, type: string) => {
    setState(prev => ({
      ...prev,
      versionDialogOpen: true,
      isGlobalConfig: false,
      selectedSubAgentsID: agentId,
      selectedAgentVersion: "",
    }));
    dispatch(agentManagementAction.fetchRepositories({ type }));
  };

  const handleSelectAgentVersion = (version: string) => {
    setState(prev => ({ ...prev, selectedAgentVersion: prev.selectedAgentVersion === version ? "" : version }));
  };

  const agentVersionUpgrade = (port: string, agentsVersion: any) => {
    if (!isEmpty(state.selectedAgentVersion)) {
      const jsonData = {
        data: [{ hostname, port }],
        risebotAgentVersion: state.selectedAgentVersion,
      };
      dispatch(agentManagementAction.upgradeSelectedAgents(jsonData));
      setState(prev => ({ ...prev, versionDialogOpen: false, isGlobalConfig: false, selectedAgentVersion: "" }));
    } else {
      errortoast("Please select the RISEBOT version");
    }
  };

  const closeSubModal = () => {
    setState(prev => ({ ...prev, versionDialogOpen: false, isGlobalConfig: false, selectedAgentVersion: "" }));
  };

  const listScheduledCommands = (port: string, hostname: string) => {
    dispatch(agentManagementAction.listSchedulerCommand({ port, hostname }));
  };

  const deleteSchedulerJob = (hostname: string, port: string, scheduledJob: string) => {
    setState(prev => ({ ...prev, hostName: hostname, port, schedulerJobId: scheduledJob, deleteSchedulerModal: true }));
  };

  const deleteSchedulerConfirm = () => {
    deleteScheduler(state.hostName, state.port, state.schedulerJobId);
  };

  const deleteScheduler = (hostname: string, port: string, scheduledJob: string) => {
    try {
      dispatch(agentManagementAction.deleteSchedulerCommand({ hostname, port, scheduledJobId: scheduledJob }));
      setState(prev => ({ ...prev, deleteSchedulerModal: false }));
    } catch (error) {
      console.log("Error while deleting", error);
    }
  };

  const editSchedulerCommands = (hostname: string, port: string, scheduledJob: string) => {
    dispatch(agentManagementAction.fetchScheduledJobsByCommandId({ hostname, port, scheduledJobId: scheduledJob }));
    setState(prev => ({
      ...prev,
      commandJob: scheduledJob,
      selectedSubAgentsID: port,
      openEditSchedule: true,
      openScheduleView: false,
      resetScheduleCommands: false,
    }));
  };

  const handleSchedulerClose = () => {
    setState(prev => ({ ...prev, openSchedulerCommand: false }));
  };

  const trimAgentPropertyName = (key: string) => {
    const trimKeyName = key.replace(/[.-]/g, " ");
    return trimKeyName.charAt(0).toUpperCase() + trimKeyName.slice(1);
  };

  const handleValidation = async () => {
    const updatedData = state.localRiseBotSchema.map(item => ({ ...item, error: isEmpty(item.propertyValue) }));
    setState(prev => ({ ...prev, localRiseBotSchema: updatedData }));
  };

  const handleDeleteSchedulerModalClose = () => {
    setState(prev => ({ ...prev, deleteSchedulerModal: false, hostName: "", schedulerJobId: "" }));
  };

  const handleJobLogModalClose = () => {
    setState(prev => ({ ...prev, JobLogModal: false, hostName: "", schedulerJobId: "" }));
  };

  const copyToClipboard = (content: any) => {
    const jsonString = JSON.stringify(content);
    navigator.clipboard
      .writeText(jsonString)
      .then(() => successtoast("Logs copied to clipboard"))
      .catch(error => console.error("Failed to copy:", error));
  };

  const loadAgentLogs = async (hostname: string, agentId: string | null, jobName: string) => {
    setState(prev => ({ ...prev, skip: 0, isLogsLoading: true }));
    const reqBody = { hostname, agentId, limit: state.limit, skip: state.skip, jobname: jobName };
    const logsRes = await agentManagementService.fetchAgentLogs(reqBody);
    const logData = logsRes?.data?.data || [];
    setState(prev => ({ ...prev, agentLog: Array.isArray(logData) ? logData : [], isLogsLoading: false }));
  };

  const refreshAgentLogs = async (hostname: string, agentId: string | null, jobName: string) => {
    setState(prev => ({ ...prev, skip: 0, agentLog: [] }));
    loadAgentLogs(hostname, agentId, jobName);
  };

  const loadMoreAgentLogs = async (hostname: string, agentId: string | null, jobName: string) => {
    setState(prev => ({ ...prev, skip: prev.skip + 100, loadMore: false }));
    const reqBody = { hostname, agentId, limit: state.limit, skip: state.skip + 100, jobname: jobName };
    const data = await agentManagementService.fetchAgentLogs(reqBody);
    const logData = data?.data?.data || [];
    setState(prev => ({
      ...prev,
      agentLog: [...prev.agentLog, ...(Array.isArray(logData) ? logData : [])],
      loadMore: true,
    }));
  };

  const addClassConfig = state.filledConfigDetails ? "editMode" : "saveMode";

  return (
    <div data-testid="sidebarId">
      <Offcanvas show={state.openBar} onHide={handleClose} placement="end" className="risebot-agentDrawer">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="risebot-offcanvas-title">
            {viewDetailsTitle} ({hostname ? hostname.toUpperCase() : ""})
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="risebot-sidebarAccodions">
            <Accordion defaultActiveKey="0">
              {isAgentTaskAccordionEnabled && (
                <AgentTasks
                  hostname={hostname}
                  port={port}
                  type={type}
                  osVersion={osVersion}
                  scheduledJobs={scheduledJobs}
                  openScheduler={openScheduler}
                  upgradeAgent={upgradeAgent}
                  startJob={startJob}
                  stopJob={stopJob}
                  restartJob={restartJob}
                  startAgentviaSSH={startAgentviaSSH}
                  shutDownAgent={shutDownAgent}
                  restartAgent={restartAgent}
                  checkAgentStatus={checkAgentStatus}
                  editSchedulerCommands={editSchedulerCommands}
                  deleteSchedulerJob={deleteSchedulerJob}
                  loadAgentLogs={loadAgentLogs}
                  versionDialogOpen={state.versionDialogOpen}
                  selectedAgentVersion={state.selectedAgentVersion}
                  handleSelectAgentVersion={handleSelectAgentVersion}
                  agentVersionUpgrade={agentVersionUpgrade}
                  closeSubModal={closeSubModal}
                  agentsVersion={agentsVersion}
                  serviceLoad={serviceLoad}
                  schedulerLoading={schedulerLoading}
                  agentId={agentId}
                  setJobName={(jobName: string) => setState(prev => ({ ...prev, jobName }))}
                  setJobLogModal={(JobLogModal: boolean) => setState(prev => ({ ...prev, JobLogModal }))}
                />
              )}
              {isAgentDetailsAccordionEnabled && <AgentDetails agentDetails={agentDetails} agentDetailsLoading={agentDetailsLoading} />}
              {isAgentConfigAccordionEnabled && <AgentConfiguration applicationProperty={applicationProperty} trimAgentPropertyName={trimAgentPropertyName} />}
              {isAgentLogAccordionEnabled && (
                <AgentLogs
                  hostname={hostname}
                  agentId={agentId}
                  agentLog={state.agentLog}
                  isLogsLoading={state.isLogsLoading}
                  loadAgentLogs={loadAgentLogs}
                  refreshAgentLogs={refreshAgentLogs}
                  copyToClipboard={copyToClipboard}
                  logsBodyRef={logsBodyRef}
                />
              )}
            </Accordion>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <LocalConfigModal
        open={state.openLocalConfigModal}
        onClose={hanldeLocalModal}
        agentConfigDetails={agentConfigDetails}
        state={state}
        addClassConfig={addClassConfig}
        handleInputChangeForSideBar={handleInputChangeForSideBar}
        onCancelButtonClick={hanldeLocalModal}
        saveConfigs={saveConfigs}
        port={port}
      />

      <DeleteModal
        open={state.deleteSchedulerModal}
        onClose={handleDeleteSchedulerModalClose}
        onCancelButtonClick={handleDeleteSchedulerModalClose}
        onDeleteButtonClick={deleteSchedulerConfirm}
      />

      <JobLogsModal
        open={state.JobLogModal}
        onClose={handleJobLogModalClose}
        onCancelButtonClick={handleJobLogModalClose}
        refreshAgentLogs={refreshAgentLogs}
        copyToClipboard={copyToClipboard}
        state={state}
        hostname={hostname}
        agentId={state.selectedSubAgentsID}
        jobsLogRef={jobsLogRef}
      />

      <SchedulerDialog
        schedulerCommand={state.openSchedulerCommand}
        closeDialog={() => setState(prev => ({ ...prev, openSchedulerCommand: !prev.openSchedulerCommand }))}
        hostname={hostname}
        agentId={state.selectedSubAgentsID}
        scheduledData={fetchScheduler}
        openEditScheduleCommand={state.openEditSchedule}
        openScheduleView={state.openScheduleView}
        commandJob={state.commandJob}
        onHide={handleSchedulerClose}
        resetSchedule={state.resetScheduleCommands}
      />
    </div>
  );
};

export default SideBar;
