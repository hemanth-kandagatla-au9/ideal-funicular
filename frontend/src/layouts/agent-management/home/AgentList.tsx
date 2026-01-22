import { Skeleton } from "@mui/material";
import { clone, get, isEmpty, uniqBy } from "lodash";
import { Button, Row } from "react-bootstrap";
import { Dispatch } from "redux";
import { Agent, AgentDetails } from "@/types/AgentList";
import NoDataFoundImg from "../../../images/agent-management/NoDATA.png";
import checkSquare from "../../../images/agent-management/assets/checkSquare.svg";
import vieweye from "../../../images/agent-management/assets/eyeIcon.svg";
import blueTick from "../../../images/agent-management/Squaretick.png";
import selecttick from "../../../images/agent-management/assets/squareTick.svg";
import Pagination from "../../../components/ui/pagination/Pagination.component";
import agentManagementActions from "../../../redux/actions/agentManagement.action";
import { emptyDataText, statusButtonText, viewText } from "../../../constants/strings";

interface Pagination {
  limit: number;
  page: number;
  total: number;
}

interface AgentListProps {
  loading: boolean;
  agents: Agent[];
  pagination: Pagination;
  setSelectedHostnameAgentsData: React.Dispatch<React.SetStateAction<Agent[]>>;
  selectedHostnameAgentsData: { hostname: string; agent_details: AgentDetails }[];
  handlePagination: (page: number) => void;
  handleSelectHostAgent: (hostname: string) => void;
  toggleSideBar: (hostname: string) => void;
  dispatch: Dispatch;
}

const AgentList = ({
  loading,
  agents,
  pagination,
  setSelectedHostnameAgentsData,
  selectedHostnameAgentsData,
  handlePagination,
  handleSelectHostAgent,
  toggleSideBar,
  dispatch,
}: AgentListProps) => {
  const agentCardsLabel = ["Hostname", "PID", "OS", "Uptime", "Version", "Status", "Action"];

  if (loading) {
    return (
      <>
        <div className="agentHeaderRow">
          <div className="agentRowFirst">
            <Button className="btnFocusActive" data-testid="agentTickBtn" variant="outline">
              <img src={selecttick} alt="Select All" />
            </Button>
          </div>
          {agentCardsLabel.map((ele, index) => (
            <div key={index} className={`${index === 0 ? "agentRowSecond" : "agentRow"}`}>
              <span className="fieldLabel">{ele}</span>
            </div>
          ))}
        </div>
        {Array.from({ length: pagination.limit }).map((_, i) => (
          <div className="agentRowWrapper" key={i}>
            <div className="cardsAgent">
              <div className="agentRowFirst">
                <Skeleton animation="wave" variant="circular" width={40} height={40} />
              </div>
              <div className="agentRowSecond ellipsis">
                <Skeleton animation="wave" variant="text" width="120px" height={25} />
              </div>
              <div className="agentRow">
                <Skeleton animation="wave" variant="text" width="60px" height={25} />
              </div>
              <div className="agentRow">
                <Skeleton animation="wave" variant="text" width="45px" height={25} />
              </div>
              <div className="agentRow">
                <Skeleton animation="wave" variant="text" width="80px" height={25} />
              </div>
              <div className="agentRow">
                <Skeleton animation="wave" variant="text" width="40px" height={25} />
              </div>
              <div className="agentRow">
                <Skeleton animation="wave" variant="text" width="70px" height={25} />
              </div>
              <div className="agentActions agentRow">
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
      <div className="noDataFound">
        <div className="noDataInnerSection">
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
      const clonedAgentsData = clone(selectedHostnameAgentsData);
      const additionalData = agents.map(({ hostname, agent_details }) => ({
        hostname,
        agent_details,
      }));
      const combined = uniqBy([...clonedAgentsData, ...additionalData], "hostname");
      setSelectedHostnameAgentsData(combined);
    }
  };

  return (
    <>
        <div className="agentHeaderRow">
          <div className="agentRowFirst">
            <Button className="btnFocusActive" data-testid="agentTickBtn" variant="outline" onClick={toggleSelectOrDeselectAllAgents}>
              <img height="18px" width="18px" src={areAllAgentsSelected() ? blueTick : selecttick} alt="Select All" />
            </Button>
          </div>
          {agentCardsLabel.map((ele, index) => (
            <div key={index} className={`${index === 0 ? "agentRowSecond" : "agentRow"}`}>
              <span className="fieldLabel">{ele}</span>
            </div>
          ))}
        </div>
       <div className="agentContainer">
        {agents.map(({ hostname, os, agent_details, risebot, status, risebotProperties }) => (
          <div key={hostname}>
            {hostname != "" && (
              <div className="agentRowWrapper">
                <div className="cardsAgent">
                  <div className="agentRowFirst">
                    <Button data-testid="agentTickBtn" className="btnFocusActive" variant="outline" onClick={() => handleSelectHostAgent(hostname)}>
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
                  <div className="agentRowSecond ellipsis">
                    <span className="fieldValue fontWeightEven">{hostname}</span>
                  </div>
                  <div className="agentRow">
                    <span className="fieldValue fontWeightOdd">{get(risebot, "pid", "N/A")}</span>
                  </div>
                  <div className="agentRow">
                    <span className="fieldValue fontWeightEven">{os}</span>
                  </div>
                  <div className="agentRow">
                    <span className="fieldValue fontWeightOdd">{get(agent_details, "up_time", "0")}</span>
                  </div>
                  <div className="agentRow">
                    <span className="versionBadge">{get(risebotProperties, "agent.version") ? `v${get(risebotProperties, "agent.version")}` : ""}</span>
                  </div>
                  <div className="agentRow">
                    <span className={`statusBadge ${status.toLowerCase()}`}>{status}</span>
                  </div>
                  <div className="agentActions agentRow">
                    <Button
                      variant="outline"
                      className="btnFocusActive"
                      data-testid="agentHealthChecktBtn"
                      title={statusButtonText}
                      onClick={() =>
                        dispatch(
                          agentManagementActions.fetchHealthCheckup({
                            hostname,
                            port: risebotProperties.server?.port,
                          }),
                        )
                      }
                    >
                      <img src={checkSquare} alt="view" />
                    </Button>
                    {!isEmpty(agents) && (
                      <Button  title={viewText} data-testid="viewSidebar" variant="outline" disabled={loading} className="btnFocusActive" onClick={() => toggleSideBar(hostname)}>
                        <img src={vieweye} alt="view" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Row>
        <Pagination handlePagination={handlePagination} pagination={pagination} />
      </Row>
    </>
  );
};

export default AgentList;

