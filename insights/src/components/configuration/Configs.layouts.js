import React, { useEffect, useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import { useSelector } from "react-redux";
import HostDetailsList from "./HostDetailsList";
import CategoryDetailsList from "./CategoryDetailsList";
import OpenSearchDetailsList from "./OpenSearchDetailsList";
import CommandCategoryList from "./CommandCategoryList";
import ConfigForm from "./ConfigForm";
import InternalJobsList from "./InternalJobsList";
import ApprovalFlowList from "./ApprovalFlowList";
import RunAsConfig from "./RunAsConfig";
import SubHeader from "../planning/SubHeader.component";
import Sidebar from "../planning/Sidebar.component";
import classes from "../planning/css/tasklist.module.css";
import {
  hasInsightsPermission,
  MODULE_LIST,
  PERMISSION_LIST,
} from "../../utils/permissionUtil";
import { isLoadingInHost } from "../../utils/DetectHost";
import { UI_TEXTS } from "../common/Constants/label-contants";
import PublishAsSystem from "./PublishAsSystem";
import SapFactsColumnsConfig from "./SapFactsColumnsConfig";
import CmdbConfiguration from "./CmdbConfiguration";
function ConfigsLayout() {
  const [key, setKey] = useState(null);
  const [sidebarActiveTab, setSidebarActiveTab] = useState("settings");
  const permissionState = useSelector((state) => state.jobs?.permissions);

  const visibleTabs = [];

  if (
    hasInsightsPermission(
      permissionState,
      MODULE_LIST.SCHEDULE_CATEGORIES,
      PERMISSION_LIST.SCHEDULE_CATEGORIES_READ
    )
  ) {
    visibleTabs.push({
      key: "category",
      title: "Schedule Categories",
      Component: CategoryDetailsList,
    });
  }
  // if (hasInsightsPermission(permissionState, MODULE_LIST.OPEN_SEARCH, PERMISSION_LIST.OPEN_SEARCH_READ)) {
  //   visibleTabs.push({ key: "opensearch", title: "OpenSearch Index Config", Component: OpenSearchDetailsList });
  // }
  if (
    hasInsightsPermission(
      permissionState,
      MODULE_LIST.COMMAND_CATEGORY,
      PERMISSION_LIST.COMMAND_CATEGORY_READ
    )
  ) {
    visibleTabs.push({
      key: "commandCategories",
      title: "Command Category",
      Component: CommandCategoryList,
    });
  }
  if (
    hasInsightsPermission(
      permissionState,
      MODULE_LIST.CONFIG,
      PERMISSION_LIST.CONFIG_READ
    )
  ) {
    visibleTabs.push({
      key: "config",
      title: "Config",
      Component: ConfigForm,
    });
  }
  if (
    hasInsightsPermission(
      permissionState,
      MODULE_LIST.INTERNAL_JOBS,
      PERMISSION_LIST.INTERNAL_JOBS_READ
    )
  ) {
    visibleTabs.push({
      key: "internalJobs",
      title: "Internal Jobs",
      Component: InternalJobsList,
    });
  }
  if (
    hasInsightsPermission(
      permissionState,
      MODULE_LIST.APPROVAL_FLOW,
      PERMISSION_LIST.APPROVAL_FLOW_READ
    )
  ) {
    visibleTabs.push({
      key: "approvalFlow",
      title: "Approval Flow",
      Component: ApprovalFlowList,
    });
  }
  if (
    hasInsightsPermission(
      permissionState,
      MODULE_LIST.RUN_AS_CONFIG,
      PERMISSION_LIST.RUN_AS_CONFIG_READ
    )
  ) {
    visibleTabs.push({
      key: "runAsConfig",
      title: "Run As Config",
      Component: RunAsConfig,
    });
  }
  if (
    hasInsightsPermission(
      permissionState,
      MODULE_LIST.SCHEDULE,
      PERMISSION_LIST.SCHEDULE_READ
    )
  ) {
    visibleTabs.push({
      key: "publishAsSystem",
      title: "Schedule System Publish Config",
      Component: PublishAsSystem,
    });
  }
  if (
    hasInsightsPermission(
      permissionState,
      MODULE_LIST.SAP_FACTS_COLUMNS,
      PERMISSION_LIST.SAP_FACTS_COLUMNS_READ
    )
  ) {
    visibleTabs.push({
      key: "sapFactsColumns",
      title: "SAP Facts Columns Config",
      Component: SapFactsColumnsConfig,
    });
  }
  if (
    hasInsightsPermission(
      permissionState,
      MODULE_LIST.CMDB_SCHEDULES,
      PERMISSION_LIST.CMDB_READ
    )
  ) {
    visibleTabs.push({
      key: "cmdbConfiguration",
      title: "CMDB Table Config",
      Component: CmdbConfiguration,
    });
  }

  useEffect(() => {
    setSidebarActiveTab("settings");
  }, []);

  useEffect(() => {
    if (visibleTabs.length > 0 && !key) {
      setKey(visibleTabs[0].key);
    }
  }, [visibleTabs]);

  const handleSidebarTabChange = (tab) => {
    setSidebarActiveTab(tab);
  };

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    const stored = localStorage.getItem("sidebarExpanded");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const latest = localStorage.getItem("sidebarExpanded");
      setIsSidebarExpanded(latest ? JSON.parse(latest) : false);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <SubHeader />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar
          activeTab={sidebarActiveTab}
          setActiveTab={handleSidebarTabChange}
        />
        <div style={{ flex: 1, paddingTop: "10px" }}>
          <div data-testid="tasklist" className={classes.config_header}>
            <div data-testid="plannerTest1">
              <div
                style={{
                  fontStyle: "normal",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <section
                  style={{
                    marginLeft: "10px",
                    fontFamily: "Manrope",
                    color: " rgb(16, 24, 40)",
                    fontSize: "18px",
                    fontWeight: "600",
                    paddingLeft: "14px",
                  }}
                >
                  {!isLoadingInHost ? UI_TEXTS.SECTIONS.SETTINGS : ""}
                </section>
              </div>
            </div>
          </div>

          <Container id="discoveryLogTab" fluid style={{ overflow: "hidden" }}>
            {visibleTabs.length > 0 ? (
              <Tabs
                id="uncontrolled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                style={{ width: "100%", boxSizing: "border-box" }}
              >
                {visibleTabs.map((tab) => (
                  <Tab key={tab.key} eventKey={tab.key} title={tab.title}>
                    <tab.Component isSidebarExpanded={isSidebarExpanded} />
                  </Tab>
                ))}
              </Tabs>
            ) : (
              <div style={{ padding: "20px" }}>
                {UI_TEXTS.MESSAGES.YOU_DONT_HAVE_ACCESS_TO_ANY_SETTINGS}
              </div>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
}

export default ConfigsLayout;
