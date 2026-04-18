import { Skeleton } from "@mui/material";
import { clone, get, isEmpty, uniqBy } from "lodash";
import { useEffect, useState } from "react";
import { Button, Row } from "react-bootstrap";
import { Dispatch } from "redux";
import { Agent } from "@/types/AgentList";
import HostnameAccordionDetails from "./HostnameAccordionDetails";
import NoDataFoundImg from "../../../images/agent-management/NoDATA.png";
import checkSquare from "../../../images/agent-management/assets/checkSquare.svg";
import vieweye from "../../../images/agent-management/assets/eyeIcon.svg";
import blueTick from "../../../images/agent-management/Squaretick.png";
import selecttick from "../../../images/agent-management/assets/squareTick.svg";
import downArrow from "../../../images/agent-management/assets/downArrow.svg";
import Pagination from "../../../components/ui/pagination/Pagination.component";
import agentManagementActions from "../../../redux/actions/agentManagement.action";
import useAgentPermissions from "../../../utils/hooks/useAgentPermissions";
import AGENT_PERMISSIONS from "../../../config/agentPermissionLabels";
import { emptyDataText, statusButtonText, viewText } from "../../../constants/strings";

interface Pagination {
  pageNo: number;
  totalPage: number;
  totalRows: number;
  limit: number;
  // Allow extra pagination fields if caller provides them
  [key: string]: any;
}

interface AgentListProps {
  loading: boolean;
  agents: Agent[];
  pagination: Pagination;
  collapseToken?: string | number;
  setSelectedHostnameAgentsData: React.Dispatch<React.SetStateAction<Agent[]>>;
  selectedHostnameAgentsData: Agent[];
  handlePagination: (limit: number, pageNo: number) => void;
  handleSelectHostAgent: (hostname: string) => void;
  toggleSideBar: (hostname: string) => void;
  dispatch: Dispatch;
  isViewAgentEnabled?: boolean;
  isCheckStatusAgentEnabled?: boolean;
}

const AgentList = ({
  loading,
  agents,
  pagination,
  collapseToken,
  setSelectedHostnameAgentsData,
  selectedHostnameAgentsData,
  handlePagination,
  handleSelectHostAgent,
  toggleSideBar,
  dispatch,
  isViewAgentEnabled = true,
  isCheckStatusAgentEnabled = true,
}: AgentListProps) => {
  const agentCardsLabel = ["Hostname", "OS", "Uptime", "Version", "Status", "Action"];
  const [expandedHostname, setExpandedHostname] = useState<string | null>(null);
  const { hasPermission } = useAgentPermissions();

  // Close any open accordion when filters/status change or when a data refresh starts.
  useEffect(() => {
    setExpandedHostname(null);
  }, [collapseToken]);

  useEffect(() => {
    if (loading) setExpandedHostname(null);
  }, [loading]);

  const toggleExpanded = (hostname: string) => {
    setExpandedHostname(prev => (prev === hostname ? null : hostname));
  };

  if (loading) {
    return (
      <>
        <div className="riseagent-agentHeaderRow">
          <div className="riseagent-agentRowFirst">
            <Button className="riseagent-btnFocusActive" data-testid="agentTickBtn" variant="outline">
              <img src={selecttick} alt="Select All" />
            </Button>
          </div>
          {agentCardsLabel.map((ele, index) => (
            <div key={index} className={`${index === 0 ? "riseagent-agentRowSecond" : "riseagent-agentRow"}`}>
              <span className="riseagent-fieldLabel">{ele}</span>
            </div>
          ))}
        </div>
        {Array.from({ length: pagination.limit }).map((_, i) => (
          <div className="riseagent-agentRowWrapper" key={i}>
            <div className="riseagent-cardsAgent">
              <div className="riseagent-agentRowFirst">
                <Skeleton animation="wave" variant="circular" width={40} height={40} />
              </div>
              <div className="riseagent-agentRowSecond riseagent-ellipsis">
                <Skeleton animation="wave" variant="text" width="120px" height={25} />
              </div>
              <div className="riseagent-agentRow">
                <Skeleton animation="wave" variant="text" width="45px" height={25} />
              </div>
              <div className="riseagent-agentRow">
                <Skeleton animation="wave" variant="text" width="80px" height={25} />
              </div>
              <div className="riseagent-agentRow">
                <Skeleton animation="wave" variant="text" width="40px" height={25} />
              </div>
              <div className="riseagent-agentRow">
                <Skeleton animation="wave" variant="text" width="70px" height={25} />
              </div>
              <div className="riseagent-agentActions riseagent-agentRow">
                <Skeleton animation="wave" variant="circular" width={40} height={40} />
                <Skeleton animation="wave" variant="circular" width={40} height={40} />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (isEmpty(agents)) {
    return (
      <div className="riseagent-noDataFound">
        <div className="riseagent-noDataInnerSection">
          <img src={NoDataFoundImg} alt="No Data" />
          <p>{emptyDataText}</p>
        </div>
      </div>
    );
  }

  const areAllAgentsSelected = (): boolean => {
    const selectedHostnames = selectedHostnameAgentsData.map(a => a.hostname);
    const allHostnames = agents.map(agent => agent.hostname);
    return allHostnames.every(hostname => selectedHostnames.includes(hostname));
  };

  const toggleSelectOrDeselectAllAgents = (): void => {
    if (areAllAgentsSelected()) {
      const allHostnames = agents.map(agent => agent.hostname);
      const filteredData = selectedHostnameAgentsData.filter(({ hostname }) => !allHostnames.includes(hostname));
      setSelectedHostnameAgentsData(filteredData);
    } else {
      const combined = uniqBy([...clone(selectedHostnameAgentsData), ...agents], "hostname") as Agent[];
      setSelectedHostnameAgentsData(combined);
    }
  };

  return (
    <>
      <div className="riseagent-agentHeaderRow">
        <div className="riseagent-agentRowFirst">
          <Button className="riseagent-btnFocusActive" data-testid="agentTickBtn" variant="outline" onClick={toggleSelectOrDeselectAllAgents}>
            <img height="18px" width="18px" src={areAllAgentsSelected() ? blueTick : selecttick} alt="Select All" />
          </Button>
        </div>
        {agentCardsLabel.map((ele, index) => (
          <div key={index} className={`${index === 0 ? "riseagent-agentRowSecond" : "riseagent-agentRow"}`}>
            <span className="riseagent-fieldLabel">{ele}</span>
          </div>
        ))}
      </div>
      <div className="riseagent-agentContainer">
        {agents.map(agent => {
          const { hostname, os, agent_details, status, risebotProperties } = agent;
          const isExpanded = expandedHostname === hostname;
          return (
            <div key={hostname}>
              {hostname != "" && (
                <div className="riseagent-agentRowWrapper">
                  <div className="riseagent-cardsAgent">
                    <div className="riseagent-agentRowFirst">
                      <Button data-testid="agentTickBtn" className="riseagent-btnFocusActive" variant="outline" onClick={() => handleSelectHostAgent(hostname)}>
                        <img
                          src={
                            !isEmpty(selectedHostnameAgentsData) &&
                            hostname ===
                              get(
                                selectedHostnameAgentsData.find(({ hostname: agentHost }) => hostname === agentHost),
                                "hostname",
                                "",
                              )
                              ? blueTick
                              : selecttick
                          }
                          alt="tick"
                          style={{ height: "18px", width: "18px", border: "none" }}
                        />
                      </Button>
                    </div>
                    <div className="riseagent-agentRowSecond riseagent-ellipsis">
                      <span className="riseagent-fieldValue riseagent-fontWeightEven">{hostname}</span>
                    </div>
                    <div className="riseagent-agentRow">
                      <span className="riseagent-fieldValue riseagent-fontWeightEven">{os}</span>
                    </div>
                    <div className="riseagent-agentRow">
                      <span className="riseagent-fieldValue riseagent-fontWeightOdd">{get(agent_details, "up_time", "0")}</span>
                    </div>
                    <div className="riseagent-agentRow">
                      <span className="riseagent-versionBadge">{get(risebotProperties, "agent.version") ? `v${get(risebotProperties, "agent.version")}` : ""}</span>
                    </div>
                    <div className="riseagent-agentRow">
                      <span className={`riseagent-statusBadge ${status.toLowerCase()}`}>{status}</span>
                    </div>
                    <div className="riseagent-agentActions riseagent-agentRow">
                      {isCheckStatusAgentEnabled && (
                        <Button
                          variant="outline"
                          className="riseagent-btnFocusActive"
                          data-testid="agentHealthChecktBtn"
                          title={statusButtonText}
                          disabled={loading || risebotProperties?.server?.port === undefined || risebotProperties?.server?.port === null}
                          onClick={() => {
                            const port = risebotProperties?.server?.port;
                            if (port === undefined || port === null) return;
                            dispatch(agentManagementActions.fetchHealthCheckup({ hostname, port }));
                          }}
                        >
                          <img src={checkSquare} alt="view" />
                        </Button>
                      )}
                      {!isEmpty(agents) && isViewAgentEnabled && (
                        <Button
                          title={viewText}
                          data-testid="viewSidebar"
                          variant="outline"
                          disabled={loading}
                          className="riseagent-btnFocusActive"
                          onClick={() => toggleSideBar(hostname)}
                        >
                          <img src={vieweye} alt="view" />
                        </Button>
                      )}

                      {hasPermission(AGENT_PERMISSIONS.RISE_AGENT_ACCORDION) && (
                        <Button
                          variant="outline"
                          className="riseagent-btnFocusActive riseagent-accordionToggleBtn"
                          data-testid="hostnameAccordionToggle"
                          title={isExpanded ? "Collapse" : "Expand"}
                          onClick={() => toggleExpanded(hostname)}
                        >
                          <img
                            className={`riseagent-hostnameAccordionChevron ${isExpanded ? "riseagent-expanded" : ""}`}
                            src={downArrow}
                            alt={isExpanded ? "collapse" : "expand"}
                          />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* {hostname !== "" && isExpanded && hasPermission(AGENT_PERMISSIONS.RISE_AGENT_ACTION_VIEW) && (
              <div className="riseagent-agentAccordionPanel">
                <HostnameAccordionDetails agent={agent as any} />
              </div>
            )} */}
              {hostname !== "" && isExpanded && (
                <div className="riseagent-agentAccordionPanel">
                  <HostnameAccordionDetails agent={agent as any} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Row>
        <Pagination handlePagination={handlePagination} pagination={pagination} />
      </Row>
    </>
  );
};

export default AgentList;
