import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./css/sidebar.css";
import { People, Setting2, Shop } from "iconsax-react";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { FaRegAddressCard } from "react-icons/fa";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { GoGitPullRequest } from "react-icons/go";
import { AiOutlineAudit } from "react-icons/ai";
import { TfiServer } from "react-icons/tfi";
import { CiServer } from "react-icons/ci";
import {
  PERMISSION_LIST,
  hasInsightsPermission,
} from "../../utils/permissionUtil";
import { UI_TEXTS } from "../common/Constants/label-contants";
import { isLoadingInHost } from "../../utils/DetectHost";

function Sidebar({ activeTab = "jobs", setActiveTab }) {
  const history = useHistory();
  const location = useLocation();
  const permissionState = useSelector((state) => state.jobs?.permissions);
  const [isExpanded, setIsExpanded] = useState(() => {
    const savedState = localStorage.getItem("sidebarExpanded");
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarExpanded", JSON.stringify(isExpanded));
  }, [isExpanded]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const routes = {
      schedule: "/dashboard",
      report: "/report",
      server: "/server",
      settings: "/settings",
      approvals: "/approvals",
      approval_status: "/approval_status",
      auth: "/auth",
      users: "/users",
      auditLogs: "/auditLogs",
      MarketPlace: "/market-place",
      cmdb_schedules: "/cmdb_schedules",
    };
    history.push(routes[tab]);
  };

  useEffect(() => {
    const pathToTab = {
      "/dashboard": "schedule",
      "/report": "report",
      "/server": "server",
      "/settings": "settings",
      "/approvals": "approvals",
      "/approval_status": "approval_status",
      "/auth": "auth",
      "/users": "users",
      "/auditLogs": "auditLogs",
      "/market-place": "MarketPlace",
    };

    const currentTab = pathToTab[location.pathname];
    if (currentTab) {
      setActiveTab(currentTab);
    }
  }, [location.pathname, setActiveTab]);

  const toggleSidebar = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Permission checks
  const canShow = {
    schedule: hasInsightsPermission(
      permissionState,
      "Schedule",
      PERMISSION_LIST.SCHEDULE_READ
    ),
    report: hasInsightsPermission(
      permissionState,
      "Reports",
      PERMISSION_LIST.REPORTS_READ
    ),
    marketplace: hasInsightsPermission(
      permissionState,
      "Code Marketplace",
      PERMISSION_LIST.CODE_MARKETPLACE_READ
    ),
    server: hasInsightsPermission(
      permissionState,
      "SAP Facts",
      PERMISSION_LIST.SAP_FACTS_READ
    ),
    cmdb_schedules: hasInsightsPermission(
      permissionState,
      "CMDB",
      PERMISSION_LIST.CMDB_READ
    ),
    approvalStatus: hasInsightsPermission(
      permissionState,
      "Request Status",
      PERMISSION_LIST.REQUEST_STATUS_READ
    ),
    approvals: hasInsightsPermission(
      permissionState,
      "Request Approval",
      PERMISSION_LIST.REQUEST_APPROVAL_READ
    ),
    auth: hasInsightsPermission(
      permissionState,
      "Auth",
      PERMISSION_LIST.AUTH_READ
    ),
    users: hasInsightsPermission(
      permissionState,
      "Users",
      PERMISSION_LIST.USERS_READ
    ),
    auditLogs: hasInsightsPermission(
      permissionState,
      "Audit Logs",
      PERMISSION_LIST.AUDIT_LOGS_READ
    ),

    // Settings section: show if any one of these READ permissions exists
    settings:
      hasInsightsPermission(
        permissionState,
        "Schedule Categories",
        PERMISSION_LIST.SCHDEULE_CATEGORIES_READ
      ) ||
      hasInsightsPermission(
        permissionState,
        "Open Search",
        PERMISSION_LIST.OPEN_SEARCH_READ
      ) ||
      hasInsightsPermission(
        permissionState,
        "Command Category",
        PERMISSION_LIST.COMMAND_CATEGORY_READ
      ) ||
      hasInsightsPermission(
        permissionState,
        "Config",
        PERMISSION_LIST.CONFIG_READ
      ) ||
      hasInsightsPermission(
        permissionState,
        "Approval Flow",
        PERMISSION_LIST.APPROVAL_FLOW_READ
      ) ||
      hasInsightsPermission(
        permissionState,
        "Internal Jobs",
        PERMISSION_LIST.INTERNAL_JOBS_READ
      ) ||
      hasInsightsPermission(
        permissionState,
        "Run As Config",
        PERMISSION_LIST.RUN_AS_CONFIG_READ
      ) ||
      hasInsightsPermission(
        permissionState,
        "Schedule System Publish Config",
        PERMISSION_LIST.SCHEDULE_SYSTEM_PUBLISH_CONFIG_READ
      ),
  };
  return (
    <div
      className={`sidebar-container ${isExpanded ? "expanded" : ""}`}
      style={{ display: !isLoadingInHost ? undefined : "none" }}
    >
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isExpanded ? (
          <ChevronLeftIcon sx={{ fontSize: "16px" }} />
        ) : (
          <ChevronRightIcon sx={{ fontSize: "16px" }} />
        )}
      </div>
      <nav className="sidebar">
        {canShow.schedule && (
          <div
            className={`sidebar-item ${
              activeTab === "schedule" ? "active" : ""
            }`}
            onClick={() => handleTabClick("schedule")}
            title={UI_TEXTS.HEADER_TEXT.SCHEDULE}
          >
            <DashboardIcon className="sidebar-icon" />
            {isExpanded && <span>{UI_TEXTS.HEADER_TEXT.SCHEDULE}</span>}
          </div>
        )}

        {canShow.report && (
          <div
            className={`sidebar-item ${activeTab === "report" ? "active" : ""}`}
            onClick={() => handleTabClick("report")}
            title={UI_TEXTS.HEADER_TEXT.REPORT}
          >
            <InsertChartOutlinedIcon className="sidebar-icon" />
            {isExpanded && <span>{UI_TEXTS.HEADER_TEXT.REPORTS}</span>}
          </div>
        )}

        {canShow.marketplace && (
          <div
            className={`sidebar-item ${
              activeTab === "MarketPlace" ? "active" : ""
            }`}
            onClick={() => handleTabClick("MarketPlace")}
            title={UI_TEXTS.HEADER_TEXT.MARKET_PLACE}
          >
            <Shop size="20" className="sidebar-icon" />
            {isExpanded && <span>{UI_TEXTS.TEXTS.CODE_MARKETE_PLACE}</span>}
          </div>
        )}

        {canShow.server && (
          <div
            className={`sidebar-item ${activeTab === "server" ? "active" : ""}`}
            onClick={() => handleTabClick("server")}
            title={UI_TEXTS.HEADER_TEXT.SAP_FACTS}
          >
            <TfiServer className="sidebar-icon" />
            {isExpanded && <span>{UI_TEXTS.HEADER_TEXT.SAP_FACTS}</span>}
          </div>
        )}
        {canShow.cmdb_schedules && (
          <div
            className={`sidebar-item ${
              activeTab === "cmdb_schedules" ? "active" : ""
            }`}
            onClick={() => handleTabClick("cmdb_schedules")}
            title={UI_TEXTS.HEADER_TEXT.CMDB_SERVER_SCHEDULES}
          >
            <CiServer size="20" className="sidebar-icon" />
            {isExpanded && (
              <span>{UI_TEXTS.HEADER_TEXT.CMDB_SERVER_SCHEDULES}</span>
            )}
          </div>
        )}
        {canShow.approvalStatus && (
          <div
            className={`sidebar-item ${
              activeTab === "approval_status" ? "active" : ""
            }`}
            onClick={() => handleTabClick("approval_status")}
            title={UI_TEXTS.HEADER_TEXT.APPROVAL_STATUS}
          >
            <GoGitPullRequest className="sidebar-icon" />
            {isExpanded && <span>{UI_TEXTS.TEXTS.REQUEST_STATUS}</span>}
          </div>
        )}

        {canShow.approvals && (
          <div
            className={`sidebar-item ${
              activeTab === "approvals" ? "active" : ""
            }`}
            onClick={() => handleTabClick("approvals")}
            title={UI_TEXTS.HEADER_TEXT.APPROVAL_REQUEST}
          >
            <MdOutlineVerifiedUser size="20" className="sidebar-icon" />
            {isExpanded && <span>{UI_TEXTS.TEXTS.REQUEST_APPROVAL}</span>}
          </div>
        )}

        {canShow.auth && (
          <div
            className={`sidebar-item ${activeTab === "auth" ? "active" : ""}`}
            onClick={() => handleTabClick("auth")}
            title={UI_TEXTS.HEADINGS.AUTH}
          >
            <FaRegAddressCard className="sidebar-icon" />
            {isExpanded && <span>{UI_TEXTS.HEADINGS.AUTH}</span>}
          </div>
        )}

        {canShow.settings && (
          <div
            className={`sidebar-item ${
              activeTab === "settings" ? "active" : ""
            }`}
            onClick={() => handleTabClick("settings")}
            title={UI_TEXTS.HEADINGS.SETTINGS}
          >
            <Setting2 size="20" className="sidebar-icon" />
            {isExpanded && <span>{UI_TEXTS.HEADINGS.SETTINGS}</span>}
          </div>
        )}

        {canShow.users && (
          <div
            className={`sidebar-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => handleTabClick("users")}
            title={UI_TEXTS.HEADINGS.USERS}
          >
            <People size="20" className="sidebar-icon" />
            {isExpanded && <span>{UI_TEXTS.HEADINGS.USERS}</span>}
          </div>
        )}

        {canShow.auditLogs && (
          <div
            className={`sidebar-item ${
              activeTab === "auditLogs" ? "active" : ""
            }`}
            onClick={() => handleTabClick("auditLogs")}
            title={UI_TEXTS.TEXTS.AUDIT_LOGS}
          >
            <AiOutlineAudit size="20" className="sidebar-icon" />
            {isExpanded && <span>{UI_TEXTS.TEXTS.AUDIT_LOGS}</span>}
          </div>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;
