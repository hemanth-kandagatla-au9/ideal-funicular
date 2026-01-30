/* eslint-disable */
import { useState, useEffect } from "react";
import { Card, Skeleton } from "@mui/material";
import allServersActive from "../../../images/agent-management/assets/QR_Code_active.png";
import allServersInactive from "../../../images/agent-management/assets/QR_Code_inactive.png";
import activeServersActive from "../../../images/agent-management/assets/Check_Circle_active.png";
import activeServersInactive from "../../../images/agent-management/assets/Check_Circle_inactive.png";
import inactiveServersActive from "../../../images/agent-management/assets/Minus_Circle_active.png";
import inactiveServersInactive from "../../../images/agent-management/assets/Minus_Circle_inactive.png";
import failedServersActive from "../../../images/agent-management/assets/Close_Circle_active.png";
import failedServersInactive from "../../../images/agent-management/assets/Close_Circle_inactive.png";
import { activeTitle, allCardTitle, failedTitle, inactiveTitle } from "../../../constants/strings";

export interface AgentMetricsTile {
  name: string;
  count: number;
}

interface AgentCardGridProps {
  agentMetricsTilesData: AgentMetricsTile[] | null;
  onSelectStatus: (status: string) => void;
  currentStatus?: string;
}

interface CardData {
  label: string;
  countKey: string;
  inactiveBgColor: string;
  activeBgColor: string;
  icon: string;
  inactiveIcon: string;
  textColor: string;
  activeTextColor: string;
  action: string;
}

const AgentCardGrid = ({ agentMetricsTilesData, onSelectStatus, currentStatus = "Recent" }: AgentCardGridProps) => {
  const cardData: CardData[] = [
    {
      label: allCardTitle,
      countKey: "allCount",
      inactiveBgColor: "#050815ff",
      activeBgColor: "linear-gradient(54.29deg, #5E49B7 -64.17%, #906DD9 98.21%)",
      icon: allServersActive,
      inactiveIcon: allServersInactive,
      textColor: "#000",
      activeTextColor: "#000",
      action: "Recent",
    },
    {
      label: activeTitle,
      countKey: "activeCount",
      inactiveBgColor: "#060815ff",
      activeBgColor: "linear-gradient(54.29deg, #5E49B7 -64.17%, #906DD9 98.21%)",
      icon: activeServersActive,
      inactiveIcon: activeServersInactive,
      textColor: "#000",
      activeTextColor: "#000",
      action: "Active",
    },
    {
      label: inactiveTitle,
      countKey: "inactiveCount",
      inactiveBgColor: "#121319ff",
      activeBgColor: "linear-gradient(54.29deg, #5E49B7 -64.17%, #906DD9 98.21%)",
      icon: inactiveServersActive,
      inactiveIcon: inactiveServersInactive,
      textColor: "#000",
      activeTextColor: "#000",
      action: "Inactive",
    },
    {
      label: failedTitle,
      countKey: "failedCount",
      inactiveBgColor: "#090e25ff",
      activeBgColor: "linear-gradient(54.29deg, #5E49B7 -64.17%, #906DD9 98.21%)",
      icon: failedServersActive,
      inactiveIcon: failedServersInactive,
      textColor: "#000",
      activeTextColor: "#000",
      action: "Failed",
    },
  ];

  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getCount = (status: string): number => {
    if (!agentMetricsTilesData || !Array.isArray(agentMetricsTilesData)) return 0;

    const statusItem = agentMetricsTilesData.find(item => item.name === status);
    return statusItem ? statusItem.count : 0;
  };

  const getAllCount = (): number => {
    if (!agentMetricsTilesData || !Array.isArray(agentMetricsTilesData)) return 0;
    return agentMetricsTilesData.reduce((total, item) => total + item.count, 0);
  };

  return (
    <div className="card-grid">
      {cardData.map((card, index) =>
        initialLoading ? (
          <Card key={index} className="card-container" sx={{ borderRadius: "16px", marginBottom: "20px", width: "24%" }}>
            <div className="card-inner">
              <div className="card-left">
                <div className="card-icon-wrapper">
                  <Skeleton animation="wave" variant="circular" width={40} height={40} />
                </div>
                <Skeleton animation="wave" variant="text" width="50px" height={25} />
              </div>
              <div className="card-icon-wrapper">
                <Skeleton animation="wave" variant="circular" width={40} height={40} />
              </div>
            </div>
          </Card>
        ) : (
          <div
            key={index}
            style={{
              position: "relative",
              width: "24%",
              marginBottom: currentStatus === card.action ? "20px" : "0",
            }}
          >
            <div
              className={`card-container${currentStatus === card.action ? " selected" : ""}`}
              style={{
                background: currentStatus === card.action 
                  ? "linear-gradient(135deg, #E8EEFF 0%, #F4F6FF 100%)"
                  : "#fff",
                border: currentStatus === card.action ? "1px solid #2961F4" : "1px solid #eeeeee",
                boxShadow: currentStatus === card.action
                  ? "0 0 0 3px rgba(41, 97, 244, 0.08)"
                  : "0 2px 8px 0 rgba(44, 98, 255, 0.04)",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "80px",
                borderRadius: "16px",
                transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
              }}
              onMouseEnter={e => {
                if (currentStatus !== card.action) {
                  e.currentTarget.style.background = "linear-gradient(135deg, #E8EEFF 0%, #F4F6FF 100%)";
                  e.currentTarget.style.boxShadow = "0 4px 16px 0 rgba(44, 98, 255, 0.08)";
                }
              }}
              onMouseLeave={e => {
                if (currentStatus !== card.action) {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.boxShadow = "0 2px 8px 0 rgba(44, 98, 255, 0.04)";
                }
              }}
              onClick={() => {
                onSelectStatus(card.action);
              }}
            >
              <div className="card-inner">
                <div className="card-left">
                  <div
                    className="card-icon-wrapper"
                    style={{
                      backgroundColor: currentStatus === card.action ? "rgba(41, 97, 244, 1)" : "rgba(234, 236, 240, 1)",
                    }}
                  >
                    <img src={currentStatus === card.action ? card.icon : card.inactiveIcon} alt="icon" />
                  </div>
                  <div className="card-label">
                    <p
                      style={{
                        color: currentStatus === card.action ? card.activeTextColor : card.textColor,
                      }}
                    >
                      {card.label}
                    </p>
                  </div>
                </div>
                <div className="card-right">
                  <p
                    style={{
                      color: currentStatus === card.action ? card.activeTextColor : card.textColor,
                    }}
                  >
                    {card.action === "Recent" ? getAllCount() : getCount(card.action)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AgentCardGrid;
