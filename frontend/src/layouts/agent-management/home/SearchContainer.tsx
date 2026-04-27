/* eslint-disable */
import { filtersToViewAllAgentsText,viewEditConfigurationButtonText, refreshTooltipText,userAuthorisationTooltipText, risebotAgentTitleText, searchByHostnamePlaceholderText, syncStatusButtonText } from "@/constants/strings";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { AgentManagementState } from "@/types/AgentManagementState";
import { isEmpty, debounce } from "lodash";
import agentManagementAction from "@/redux/actions/agentManagement.action";
import syncStatus from "../../../images/agent-management/assets/Refresh.svg";
import restartIcon from "../../../images/agent-management/assets/RestartIcon.svg";
import searchIcon from "../../../images/agent-management/assets/searchIcon.svg";
import userAuthIcon from "../../../images/agent-management/assets/Button_base.png";
import actionIcon from "../../../images/agent-management/assets/bulkActionLog.svg";
import { useHistory } from "react-router-dom";
import GlobalConfigurationModal from '../components/GlobalConfigurationModal';
import useAgentPermissions from "../../../utils/hooks/useAgentPermissions";
import AGENT_PERMISSIONS from "../../../config/agentPermissionLabels";

interface SearchContainerProps {
  state: any;
  getJsonData: () => {
    pageSize: string;
    pageNo: number;
    status: string;
    agentSearch: string;
    os: string[];
    region: string[];
    environment: string[];
    platform: string[];
    sid: string[];
    agentVersion: string[];
    serviceName: string[];
  };
  setStatus: (status: any) => void;
  loadFilterData: () => void;
  filterAgentSearch: () => void;
  setState: React.Dispatch<React.SetStateAction<AgentManagementState>>;
}

const SearchContainer: React.FC<SearchContainerProps> = ({ state, getJsonData, setStatus, loadFilterData, filterAgentSearch, setState }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { hasPermission } = useAgentPermissions();
  const [refreshspin, setRefreshspin] = useState(false);
  const [syncspin, setSyncspin] = useState(false);
  const [showGlobalConfigModal, setShowGlobalConfigModal] = useState(false);
  const { showFilters, agentSearch, ...rest } = state;
  const updateState = useCallback((newState: Partial<AgentManagementState>) => setState(prevState => ({ ...prevState, ...newState })), []);
  const timeoutRef = useRef<number | null>(null);
  const getJsonDataRef = useRef(getJsonData);

  useEffect(() => {
    getJsonDataRef.current = getJsonData;
  }, [getJsonData]);

  const handleInputChange = useCallback(
    async (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      if (id === "pageSize") updateState({ pageNo: 1 });
      await updateState({ [id]: value } as Partial<AgentManagementState>);
    },
    [updateState],
  );
  const debouncedFetch = useRef(
    debounce((searchValue: string) => {
      dispatch(
        agentManagementAction.fetchAgentManagementServices({
          ...getJsonDataRef.current(),
          agentSearch: searchValue,
        }),
      );
    }, 1000),
  ).current;

  useEffect(() => {
    if (isEmpty(agentSearch)) {
      debouncedFetch.cancel();
      dispatch(
        agentManagementAction.fetchAgentManagementServices({
          ...getJsonDataRef.current(),
          agentSearch: "",
        }),
      );
    } else {
      debouncedFetch(agentSearch);
    }
  }, [agentSearch, debouncedFetch, dispatch]);

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = useCallback((type: 'refreshspin' | 'syncspin') => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (type === 'refreshspin') {
      setRefreshspin(true);
      timeoutRef.current = window.setTimeout(() => {
        setRefreshspin(false);
        timeoutRef.current = null;
      }, 1500);
    } else {
      setSyncspin(true);
      timeoutRef.current = window.setTimeout(() => {
        setSyncspin(false);
        timeoutRef.current = null;
      }, 1500);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        paddingLeft: "10px",
        paddingRight: "8px",
        margin: "10px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h3 className="riseagent-agentTitle">{risebotAgentTitleText}</h3>
        {showFilters && (
          <p
            style={{
              color: "#82807c",
              fontSize: "14px",
              fontFamily: "Roboto",
              fontWeight: "400",
            }}
          >
            {filtersToViewAllAgentsText}
          </p>
        )}
      </div>

      <div className="riseagent-topBtnsWrapper" style={{ display: "flex", gap: "10px", width: "70%" }}>
        <div className="riseagent-searchfilter">
          <Form.Control
            data-testid="agentFilterSearch"
            size="sm"
            type="text"
            id="agentSearch"
            name="agentSearch"
            placeholder={searchByHostnamePlaceholderText}
            value={agentSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("agentSearch", e)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter" && (e.currentTarget as HTMLInputElement).value) {
                debouncedFetch.cancel();
                const trimmedValue = (e.currentTarget as HTMLInputElement).value.trim();
                dispatch(agentManagementAction.fetchAgentManagementServices({
                  ...getJsonDataRef.current(),
                  agentSearch: trimmedValue,
                }));
              }
            }}
          />
          <Button data-testId="searchBtnId" className="riseagent-btnSearchIcon" onClick={filterAgentSearch}>
            <img src={searchIcon} alt="search" style={{ padding: "0 0 2px 4px" }} />
          </Button>
        </div>
        {hasPermission(AGENT_PERMISSIONS.RISE_AGENT_VERSION_MANAGEMENT) && (
        <Button
          className="riseagent-topbar-hover-btn"
          style={{
            height: "40px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #EEEEEE",
            borderRadius: "36px",
            color: "#344054",
          }}
          onClick={() => history.push("/versionManagement")}
          data-testid="versionManagementBtn"
        >
          Version Management
        </Button>
        )}
        {hasPermission(AGENT_PERMISSIONS.RISE_AGENT_SYNC_STATUS) && (
        <div
          className="riseagent-syncUpStatusBtn riseagent-popOne riseagent-topbar-hover-btn"
          style={{ display: "flex", gap: "8px", height: "40px" }}
          onClick={() => {
            dispatch(agentManagementAction.syncAgentHealthConfigs());
            handleClick('syncspin')
          }
          }
          data-testid="forceUpdateTestId"
        >
          <img
            className={syncspin ? "riseagent-refresh_spin" : ""} src={syncStatus} alt="search" style={{ height: "20px", alignSelf: "center" }} />
          <Button style={{ all: "unset" }}>{syncStatusButtonText}</Button>
        </div>
        )}
        
        {hasPermission(AGENT_PERMISSIONS.RISE_AGENT_BULK_LOGS_VIEW) && (
        <Button
          className="riseagent-topbar-hover-btn"
          style={{
            height: "40px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #EEEEEE",
            borderRadius: "36px",
          }}
          onClick={() => history.push("/bulkActionLogs")}
          data-testid="bulkActionLogsBtn"
          title="Bulk Action Logs"
        >
          <img
            src={actionIcon}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "20px",
            }}
            alt="bulk action logs"
          />
        </Button>
        )}

        {hasPermission(AGENT_PERMISSIONS.RISE_AGENT_USER_AUTHORIZATION_READ) && (
        <div>
          <Button
            title={userAuthorisationTooltipText}
            className="riseagent-topbar-hover-btn"
            style={{
              height: "40px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #EEEEEE",
              borderRadius: "36px",
            }}
            onClick={() => history.push("/userAuthorization")}
            data-testid="userAuthorizationBtn"
          >
            <img
              src={userAuthIcon}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "20px",
              }}
              alt="user authorization"
            />
          </Button>
        </div>
        )}

        <div>
          <Button
            title={refreshTooltipText}
            className="riseagent-topbar-hover-btn"
            style={{
              height: "40px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #EEEEEE",
              borderRadius: "36px",
            }}
            onClick={() => {
              handleClick('refreshspin');
              updateState({
                pageNo: 1,
                pageSize: "10",
                agentSearch: "",
                selectedHostName: "",
              });
              setStatus("Recent");
              dispatch(agentManagementAction.fetchAgentManagementServices(getJsonData()));
              dispatch(agentManagementAction.fetchAgentMetrics());
              loadFilterData();
            }}
            data-testid="refreshBtn"
          >

            <img
              className={refreshspin ? "riseagent-refresh_spin" : ""}
              src={restartIcon}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "black",
              }}
              alt="refresh"
            />
          </Button>
        </div>
           {hasPermission(AGENT_PERMISSIONS.RISE_AGENT_GLOBAL_CONFIG_READ) && (
           <Button
                    className="riseagent-sidebar-action-btn"
                    onClick={() => setShowGlobalConfigModal(true)}
                  >
                    {viewEditConfigurationButtonText}
            </Button>
           )}
        
      </div>
      <GlobalConfigurationModal
              show={showGlobalConfigModal}
              onHide={() => setShowGlobalConfigModal(false)}
            />
    </div>
    
  );
};

export default SearchContainer;
