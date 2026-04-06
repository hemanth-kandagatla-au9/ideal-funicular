/* eslint-disable */
import { clone, get, isEmpty, size } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Agent, Pagination, FilteredData, DropdownOption, AgentManagementState } from "@/types/AgentManagementState";
import PopUp from "../../components/popup/popUp.component";
import agentManagementAction from "../../redux/actions/agentManagement.action";
import {
  getAgentEnvironments,
  getMetricsTilesData,
  getAgentGlobalConfig,
  getAgentOsTypes,
  getAgentPlatforms,
  getAgentRegions,
  getAgentServiceNames,
  getAgentSids,
  getAgentsService,
  getAgentVersions,
  isLoading,
  isReload,
} from "../../redux/selectors/agentManagement.selectors";
import useAgentPermissions from "../../utils/hooks/useAgentPermissions";
import AGENT_PERMISSIONS from "../../config/agentPermissionLabels";
import userAuthorizationActions from "../../redux/actions/userAuthorization.action";
import UpgradeAgentsDialog from "./components/UpgradeAgentsDialog";
import EnvUpgradeDialog from "./components/EnvUpgradeDialog";
import { AGENT_ACTIONS, ERROR_MESSAGE } from "./components/constants";
import "./css/agentStyle.css";
import "./css/common-style.css";
import AgentCardGrid from "./home/AgentCardGrid";
import AgentList from "./home/AgentList";
import FilterBar from "./home/FilterBar";
import agentManagementService from "../../services/agent/agentManagement.service";
import { errortoast, infotoast } from "./helpers/CustomToast";
import SideBar from "./components/sidebar/SideBar";
import { startAgentsPopupText, startButtonText, startedText, stopAgentsPopupText, stopButtonText, stoppedText, selectedItemsText, clearSelectionText } from "../../constants/strings";
import DownloadToExcel from "./helpers/DownloadToExcel";
import SearchContainer from "./home/SearchContainer";
import { Spin } from "antd";


const AgentManagement = () => {
  const dispatch = useDispatch();
  const reload = useSelector(isReload);
  const { hasPermission } = useAgentPermissions();
  const agentServices = useSelector(getAgentsService);
  const globalConfigs = useSelector(getAgentGlobalConfig);
  const loading = useSelector(isLoading);
  const regionsFilter = useSelector(getAgentRegions);
  const platformsFilter = useSelector(getAgentPlatforms);
  const environmentsFilter = useSelector(getAgentEnvironments);
  const sidsFilter = useSelector(getAgentSids);
  const osTypesFilter = useSelector(getAgentOsTypes);
  const serviceNamesFilter = useSelector(getAgentServiceNames);
  const agentVersionsFilter = useSelector(getAgentVersions);
  const getAgents = useCallback(() => get(agentServices, "pagination.totalRows", []) as Agent[], [agentServices]);
  const agentMetricsTilesData = useSelector(getMetricsTilesData);

  const [state, setState] = useState<AgentManagementState>({
    selectedAgent: {},
    openDrawer: false,
    agentSearch: "",
    pageSize: 10,
    pageNo: 1,
    openAgentModal: false,
    showFilters: false,
    selectedHostName: "",
    selectedHostPort: "",
    selectedHostnameAgents: [],
    openAgentUpgrade: false,
    selectedUpgradeAgents: [],
    openEnvUpgrade: false,
    selectedEnvUpgradeAgents: [],
    selectedOption: AGENT_ACTIONS.UPDATE,
    dropdownOptionsobj: {
      os: [],
      region: [],
      serviceName: [],
      agentVersions: [],
      platform: [],
      environment: [],
      sid: [],
    },
    multiselectOfset: "",
    serviceLineOptions: [],
    isOptionsLoading: false,
    globalConfigs: {},
  });

  const [status, setStatus] = useState<string>("Recent");
  const [showAgentModal, setShowAgentModal] = useState<boolean>(false);
  const [startBulkAgent, setStartBulkAgent] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<FilteredData>({
    os: [],
    region: [],
    serviceName: [],
    agentVersions: [],
    platform: [],
    environment: [],
    sid: [],
  });
  const [selectedHostnameAgentsData, setSelectedHostnameAgentsData] = useState<Agent[]>([]);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const updateState = useCallback((newState: Partial<AgentManagementState>) => setState(prevState => ({ ...prevState, ...newState })), []);

  useEffect(() => {
    dispatch(agentManagementAction.fetchAgentManagementServices(getJsonData()));
    dispatch(agentManagementAction.fetchAgentMetrics());
    loadFilterData();
    // Fetch the current user's permissions on mount so hasPermission() works
    dispatch(userAuthorizationActions.fetchMyPermissions());
  }, []);

  useEffect(() => {
    dispatch(agentManagementAction.fetchAgentManagementServices(getJsonData()));
  }, [state.pageSize, state.pageNo, filteredData, sortBy, sortOrder]);

  useEffect(() => {
    if (JSON.stringify(globalConfigs) !== JSON.stringify(state.globalConfigs)) {
      updateState({ globalConfigs });
    }
  }, [globalConfigs]);

  useEffect(() => {
    if (reload) {
      loadFilterData();
    }
  }, [reload]);

  const getJsonData = useCallback(
    () => {
      const jsonData = {
        pageSize: String(state.pageSize),
        pageNo: state.pageNo - 1,
        status,
        agentSearch: state.agentSearch,
        os: filteredData.os.map(el => el.value),
        region: filteredData.region.map(el => el.value),
        environment: filteredData.environment.map(el => el.value),
        platform: filteredData.platform.map(el => el.value),
        sid: filteredData.sid.map(el => el.value),
        agentVersion: filteredData.agentVersions.map(el => el.value),
        serviceName: filteredData.serviceName.map(el => el.value),
        ...(sortBy && sortOrder ? { sortBy, sortOrder } : {}),
      };
      return jsonData;
    },
    [state, filteredData, status, sortBy, sortOrder],
  );

  const loadFilterData = useCallback(() => {
    dispatch(agentManagementAction.fetchAgentRegions());
    dispatch(agentManagementAction.fetchAgentPlatforms());
    dispatch(agentManagementAction.fetchAgentEnvironments());
    dispatch(agentManagementAction.fetchAgentSids());
    dispatch(agentManagementAction.fetchAgentOsTypes());
    dispatch(agentManagementAction.fetchAgentServiceNames());
    dispatch(agentManagementAction.fetchAgentVersions());
    dispatch(agentManagementAction.fetchMetricsTilesData());
  }, [dispatch]);

  const toggleSideBar = useCallback(
    async (selectedAgentHostName: string) => {
      const selectedAgent = getAgents().find(({ hostname }) => hostname === selectedAgentHostName);
      if (!selectedAgent) {
        errortoast("Selected RISEAGENT not found");
        return;
      }
      const serverPort = selectedAgent.agent_details?.server_port ?? "";
      updateState({
        selectedAgent,
        openDrawer: !state.openDrawer,
        selectedHostName: selectedAgentHostName,
        selectedHostPort: String(serverPort),
      });
      dispatch(agentManagementAction.reloadFetchAgentLogs());
    },
    [state.openDrawer, getAgents, updateState, dispatch],
  );

  const filterAgentSearch = useCallback(() => {
    if (isEmpty(state.agentSearch)) errortoast("Enter hostname");
    else dispatch(agentManagementAction.fetchAgentManagementServices(getJsonData()));
  }, [state.agentSearch, dispatch, getJsonData]);

  const getTotalPageNumber = (): number => {
    const totalCount = get(agentServices, "pagination.totalPage", 0);
    return Math.ceil(totalCount / Number(state.pageSize));
  };

  const regionFilterData = useCallback((): DropdownOption[] => get(regionsFilter, "regions", []).map(el => ({ label: el, value: el, name: el })), [regionsFilter]);

  const platformFilterData = useCallback((): DropdownOption[] => get(platformsFilter, "platforms", []).map(el => ({ label: el, value: el, name: el })), [platformsFilter]);

  const environmentFilterData = useCallback(
    (): DropdownOption[] => get(environmentsFilter, "environments", []).map(el => ({ label: el, value: el, name: el })),
    [environmentsFilter],
  );

  const sidFilterData = useCallback((): DropdownOption[] => get(sidsFilter, "sids", []).map(el => ({ label: el, value: el, name: el })), [sidsFilter]);

  const osFilterData = useCallback((): DropdownOption[] => get(osTypesFilter, "os", []).map(el => ({ label: el, value: el, name: el })), [osTypesFilter]);

  const serviceNameFilterData = useCallback(
    (): DropdownOption[] => get(serviceNamesFilter, "serviceNames", []).map(el => ({ label: el, value: el, name: el })),
    [serviceNamesFilter],
  );

  const VersionFilterData = useCallback((): DropdownOption[] => get(agentVersionsFilter, "versions", []).map(el => ({ label: el, value: el, name: el })), [agentVersionsFilter]);

  const dropdownOptionsobj = {
    os: osFilterData(),
    region: regionFilterData(),
    serviceName: serviceNameFilterData(),
    agentVersions: VersionFilterData(),
    platform: platformFilterData(),
    environment: environmentFilterData(),
    sid: sidFilterData(),
  };

  const pagination: Pagination = {
    totalRows: get(agentServices, "pagination.totalPage", 0),
    limit: state.pageSize,
    pageNo: state.pageNo,
    totalPage: getTotalPageNumber(),
    page: state.pageNo,
    total: get(agentServices, "pagination.allCount", 0),
  };

  const handlePagination = (pageSize: number = 10, pageNo: number = 1) => {
    updateState({ pageSize: pageSize, pageNo: pageNo });
  };

  const handleSelectHostAgent = (agentHostName: string) => {
    const found = selectedHostnameAgentsData.find(({ hostname }) => hostname === agentHostName);
    if (!isEmpty(found)) {
      setSelectedHostnameAgentsData(selectedHostnameAgentsData.filter(({ hostname }) => hostname !== agentHostName));
    } else {
      const agent = getAgents().find(({ hostname: filterHostName }) => agentHostName === filterHostName);
      if (agent) {
        setSelectedHostnameAgentsData([...selectedHostnameAgentsData, agent]);
      }
    }
  };

  const filterOptions = {
    os: dropdownOptionsobj.os || [],
    region: dropdownOptionsobj.region || [],
    serviceName: dropdownOptionsobj.serviceName || [],
    agentVersions: dropdownOptionsobj.agentVersions || [],
    platform: dropdownOptionsobj.platform || [],
    environment: dropdownOptionsobj.environment || [],
    sid: dropdownOptionsobj.sid || [],
  };

  const filters = {
    os: filteredData.os,
    region: filteredData.region,
    serviceName: filteredData.serviceName,
    agentVersions: filteredData.agentVersions,
    platform: filteredData.platform,
    environment: filteredData.environment,
    sid: filteredData.sid,
  };

  const setFilters = useCallback((newFilters: Partial<FilteredData>) => {
    setFilteredData(prev => ({ ...prev, ...newFilters }));
    updateState({ pageNo: 1 });
  }, []);

  const handleCustomFilterCallback = async (e: DropdownOption[] | any, catName: keyof FilteredData, displayName: string) => {
    let data: DropdownOption[] = [];
    if (Array.isArray(e)) {
      data = e.map(el => ({
        value: el?.value,
        name: el?.name,
      }));
    }

    setFilteredData(prev => ({
      ...prev,
      [catName]: data,
    }));
    updateState({ pageNo: 1 });
  };

  const handleClearFilter = async () => {
    setFilteredData({
      os: [],
      region: [],
      serviceName: [],
      agentVersions: [],
      platform: [],
      environment: [],
      sid: [],
    });
    updateState({ pageNo: 1 });
    loadAgentServices();
  };

  const loadAgentServices = () => {
    dispatch(agentManagementAction.fetchAgentManagementServices(getJsonData()));
  };

  const isViewAgentEnabled         = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_READ);
  const isStartAgentEnabled        = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_START);
  const isStopAgentEnabled         = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_STOP);
  const isRestartAgentEnabled      = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_RESTART);
  const isCheckStatusAgentEnabled  = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_CHECK_STATUS);
  const isForceUpgradeAgentEnabled = hasPermission(AGENT_PERMISSIONS.RISE_AGENT_UPGRADE);

  const startAgents = () => {
    if (!isEmpty(selectedHostnameAgentsData)) {
      setShowAgentModal(true);
      setStartBulkAgent(true);
    } else {
      errortoast("Please select the Agent Server");
    }
  };

  const stopAgents = () => {
    if (!isEmpty(selectedHostnameAgentsData)) {
      setShowAgentModal(true);
      setStartBulkAgent(false);
    } else {
      errortoast("Please select the Agent Server");
    }
  };

  const restartAgents = () => {
    const finalRestartData = agentSelectedData();
    if (!isEmpty(finalRestartData)) {
      dispatch(agentManagementAction.restartSelectedAgentService(finalRestartData));
      if (finalRestartData.length > 10) {
        infotoast(ERROR_MESSAGE.AGENT_SELECTION_LIMIT);
      }
      updateState({ selectedOption: AGENT_ACTIONS.RESTART });
    }
  };

  const agentSelectedData = (): Array<{ hostname: string}> => {
    if (isEmpty(selectedHostnameAgentsData)) {
      errortoast("Please select the Agent Server");
      return [];
    }
    return selectedHostnameAgentsData.map(({ hostname }) => ({
      hostname
    }));
  };

  const upgradeSelectedAgents = (): Agent[] => {
    const clonedUpgradeAgents = clone(selectedHostnameAgentsData);
    if (isEmpty(clonedUpgradeAgents)) {
      errortoast("Please select the Agent Server");
      return [];
    }
    return clonedUpgradeAgents;
  };

  const getTotalRowsCount = (): number => {
    return get(agentServices, "pagination.allCount", 0);
  };

  const syncAgentConfig = () => {
    const data = selectedHostnameAgentsData.map(({ hostname, agent_details }) => ({
      hostname,
      port: String(get(agent_details, "server_port", "")),
    })).filter(({ port }) => port);

    if (isEmpty(data)) {
      errortoast("Please select the Agent Server");
      return;
    }

    dispatch(agentManagementAction.syncAgentConfig(data));
  };

  const executeStartStopAgents = () => {
    const finalData = agentSelectedData();
    if (startBulkAgent) {
      dispatch(agentManagementAction.startSelectedAgentService(finalData));
      if (finalData.length > 10) {
        infotoast(ERROR_MESSAGE.AGENT_SELECTION_LIMIT);
      }
      updateState({ selectedOption: AGENT_ACTIONS.START });
    } else {
      dispatch(agentManagementAction.stoptSelectedAgentService(finalData));
      if (finalData.length > 10) {
        infotoast(ERROR_MESSAGE.AGENT_SELECTION_LIMIT);
      }
      updateState({ selectedOption: AGENT_ACTIONS.STOP });
    }
    setShowAgentModal(false);
    setStartBulkAgent(false);
  };

  const healthCheckAgents = () => {
    const finalHealthCheckData = agentSelectedData();
    if (!isEmpty(finalHealthCheckData)) {
      if (size(finalHealthCheckData) < 2) {
        const [UpdatedFinalHealthCheckData] = finalHealthCheckData;
        dispatch(agentManagementAction.fetchHealthCheckup(UpdatedFinalHealthCheckData));
        updateState({ selectedOption: AGENT_ACTIONS.UPDATE });
      } else {
        errortoast("Please Select Only One Agent Server");
      }
    }
  };

  const openAgentUpgradeModal = () => {
    const finalUpgradedAgents = upgradeSelectedAgents();
    if (!isEmpty(finalUpgradedAgents)) {
      dispatch(agentManagementAction.fetchUpgradeAgents());
      updateState({ openAgentUpgrade: true, selectedUpgradeAgents: finalUpgradedAgents });
    }
  };

  const openEnvUpgradeModal = () => {
    const finalEnvUpgradeAgents = upgradeSelectedAgents();
    if (!isEmpty(finalEnvUpgradeAgents)) {
      updateState({ openEnvUpgrade: true, selectedEnvUpgradeAgents: finalEnvUpgradeAgents });
    }
  };

  const triggerEnvUpgrade = (env: string) => {
    if (isEmpty(env)) {
      errortoast("Please select the target environment");
      return;
    }

    const data = state.selectedEnvUpgradeAgents
      .map(({ hostname, agent_details }) => ({
        hostname,
        port: String(get(agent_details, "server_port", "")),
      }))
      .filter(({ port }) => port);

    if (isEmpty(data)) {
      errortoast("Please select the Agent Server");
      return;
    }

    dispatch(agentManagementAction.envUpgradeSelectedAgents({ data, env, mode: "bulk" }));
    updateState({ openEnvUpgrade: false, selectedEnvUpgradeAgents: [] });
  };

  const fetchDataForDownload = async (pageSize: number): Promise<any[]> => {
    const jsonData = getJsonData();
    jsonData.pageSize = String(pageSize);
    const agentsRes = await agentManagementService.fetchAgentService(jsonData);
    return get(agentsRes?.data.data, "pagination.totalRows", []);
  };

  const downloadToExcel = async () => {
    try {
      await DownloadToExcel(getTotalRowsCount, fetchDataForDownload);
    } catch (error) {
      errortoast("Failed to download. please try again.");
    }
  };

  const handleStatusSelect = (action: string) => {
    setStatus(action);
    updateState({ pageNo: 1 });
    dispatch(
      agentManagementAction.fetchAgentManagementServices({
        ...getJsonData(),
        status: action,
        pageNo: 0,
      }),
    );
  };
   const handleSortChange = (field: string, order: 'asc' | 'desc' | null) => {
    setSortBy(field);
    setSortOrder(order);
  };

  return (
    <>
      <AgentCardGrid agentMetricsTilesData={agentMetricsTilesData} onSelectStatus={handleStatusSelect} currentStatus={status} />

      <div className="riseagent-overallWrapper">
        <Container>
          <SearchContainer
            state={state}
            setState={setState}
            setStatus={setStatus}
            loadFilterData={loadFilterData}
            getJsonData={getJsonData}
            filterAgentSearch={filterAgentSearch}
          />

          {selectedHostnameAgentsData.length > 0 && (
            <div className="riseagent-selectionCounterBadge">
              <div className="riseagent-selectionCounterContent">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="riseagent-selectionCounterText">
                  <strong>{selectedHostnameAgentsData.length}</strong> {selectedItemsText}
                </span>
                <button 
                  className="riseagent-clearSelectionButton"
                  onClick={() => setSelectedHostnameAgentsData([])}
                  title={clearSelectionText}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L4 12M4 4L12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          <FilterBar
            filterOptions={filterOptions}
            filters={filters}
            setFilters={setFilters}
            handleCustomFilterCallback={handleCustomFilterCallback}
            clearFilters={handleClearFilter}
            isStartAgentEnabled={isStartAgentEnabled}
            isStopAgentEnabled={isStopAgentEnabled}
            isRestartAgentEnabled={isRestartAgentEnabled}
            isCheckStatusAgentEnabled={isCheckStatusAgentEnabled}
            isForceUpgradeAgentEnabled={isForceUpgradeAgentEnabled}
            startAgents={startAgents}
            stopAgents={stopAgents}
            restartAgents={restartAgents}
            healthCheckAgents={healthCheckAgents}
            openAgentUpgradeModal={openAgentUpgradeModal}
            openEnvUpgradeModal={openEnvUpgradeModal}
            syncAgentConfig={syncAgentConfig}
            downloadToExcel={downloadToExcel}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
          
          <Spin spinning={loading}>
            <AgentList
              loading={loading}
              agents={getAgents()}
              pagination={pagination}
              collapseToken={status}
              selectedHostnameAgentsData={selectedHostnameAgentsData}
              handlePagination={handlePagination}
              handleSelectHostAgent={handleSelectHostAgent}
              toggleSideBar={toggleSideBar}
              dispatch={dispatch}
              setSelectedHostnameAgentsData={setSelectedHostnameAgentsData}
              isViewAgentEnabled={isViewAgentEnabled}
              isCheckStatusAgentEnabled={isCheckStatusAgentEnabled}
            />
          </Spin>
        </Container>
      </div>

      <SideBar
        open={state.openDrawer}
        setOpenSidebar={(val: boolean) => setState(prev => ({ ...prev, openDrawer: val }))}
        agentSelected={state.selectedAgent}
        openBar={false}
        configureModal={false}
        port={state.selectedHostPort}
      />
      <UpgradeAgentsDialog
        showAgentUpgrade={state.openAgentUpgrade}
        closeAgentUpgrade={() => updateState({ openAgentUpgrade: false })}
        upgradeAgentData={state.selectedUpgradeAgents}
      />
      <EnvUpgradeDialog
        showEnvUpgrade={state.openEnvUpgrade}
        closeEnvUpgrade={() => updateState({ openEnvUpgrade: false })}
        envUpgradeData={state.selectedEnvUpgradeAgents}
        onConfirm={triggerEnvUpgrade}
      />
      <PopUp
        show={showAgentModal}
        dataObj={{
          header: `${startBulkAgent ? startAgentsPopupText : stopAgentsPopupText}`,
          body: `RISEAGENT will be ${startBulkAgent ? startedText : stoppedText}.`,
          button: {
            buttonTwo: { buttonTwoName: "Cancel", buttonBg: "modalButtonWhite" },
            buttonOne: { buttonBg: "modalButtonBlue", buttonOneName: `${startBulkAgent ? startButtonText : stopButtonText}` },
          },
        }}
        onHide={() => setShowAgentModal(false)}
        handleClick={executeStartStopAgents}
      />
    </>
  );
};

export default AgentManagement;
