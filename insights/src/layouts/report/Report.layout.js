import React, { useEffect, useState } from "react";
import { useHistory, Route, Switch } from "react-router-dom";
import { Container, Tab, Tabs } from "react-bootstrap";
import "./css/report.css";
import SubHeader from "../../components/planning/SubHeader.component";
import MyReports from "./MyReports";
import GlobalReport from "./GlobalReports";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Sidebar from "../../components/planning/Sidebar.component";
import {
  MODULES,
  UI_TEXTS,
} from "../../components/common/Constants/label-contants";
import { useLocation } from "react-router-dom";
import ReportModal from "./reportModal";
import GlobalReports from "./GlobalReports";
import { isLoadingInHost } from "../../utils/DetectHost";

function Report() {
  const history = useHistory();
  const user = sessionStorage.getItem("user");
  const [activeTab, setActiveTab] = useState("myReports");
  const [sidebarActiveTab, setSidebarActiveTab] = useState("reports");
  const location = useLocation();
  const [planningFilters, setPlanningFilters] = useState({
    // assetFilter: false,
    // platformFilter: false,
    categoryFilter: false,
    // hostFilter: false,
    // categoryTypeFilter: false,
    // TargetFilter: false,
    TagsFilter: false,
    // FrequencyFilter: false,
    // ScheduleByFilter: false,
    // actionTypeByFilter:false
  });
  const [myReportsFilters, setMyReportsFilters] = useState({
    categoryFilter: false,
    TagsFilter: false,
    CreatedByFilter: false,
    dateRangeFilter: false,
  });

  const [globalReportsFilters, setGlobalReportsFilters] = useState({
    categoryFilter: false,
    TagsFilter: false,
    CreatedByFilter: false,
    dateRangeFilter: false,
  });

  const getActiveTabFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "myReports";
  };

  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    history.push(`/report?tab=${tabKey}`);
  };

  useEffect(() => {
    setActiveTab(getActiveTabFromURL());
  }, [location.search]);

  return (
    <Switch>
      <Route path="/report/create" exact>
        <ReportModal />
      </Route>
      <Route path="/report/edit/:reportId" exact>
        <ReportModal />
      </Route>
      <Route path="/report">
        <div
          className="topwrapper"
          data-testid="landingPageTestId"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <SubHeader
            data-test="planner-layout-subheader"
            data-testid="subheader-test"
          />
          <div style={{ display: "flex", flex: 1 }}>
            <Sidebar activeTab="report" setActiveTab={setSidebarActiveTab} />
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div
                style={{
                  padding: "10px 0px 0px 22px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      lineHeight: "28px",
                      letterSpacing: "0%",
                      paddingLeft: "5px",
                      fontFamily: "Manrope",
                      color: " rgb(16, 24, 40)",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    {!isLoadingInHost ? MODULES.REPORTS : ""}
                  </span>
                </div>
                <span
                  style={{
                    width: "40vw",
                    paddingLeft: "4px",
                    fontSize: "13px",
                    color: "#94a3b8",
                    fontFamily: "Manrope",
                    fontWeight: "600",
                  }}
                >
                  {!isLoadingInHost ? UI_TEXTS.MESSAGES.GENERATE_REPORTS : ""}
                </span>
              </div>
              <Container
                id="discoveryLogTab"
                style={{ padding: "0px 10px" }}
                fluid
              >
                <Tabs
                  id="uncontrolled-tab-example"
                  activeKey={activeTab}
                  onSelect={handleTabSelect}
                >
                  <Tab eventKey="myReports" title="My Reports" className="tabs">
                    <MyReports
                      filters={myReportsFilters}
                      setFilters={setMyReportsFilters}
                      showFilters={false}
                    />
                  </Tab>
                  {/* <Tab
                    eventKey="globalReports"
                    title="Global Reports"
                    className="tabs"
                  >
                    <GlobalReport />
                  </Tab> */}
                  <Tab
                    eventKey="globalReports"
                    title="Global Reports"
                    className="tabs"
                  >
                    <GlobalReports
                      filters={globalReportsFilters}
                      setFilters={setGlobalReportsFilters}
                      showFilters={false}
                    />
                  </Tab>
                </Tabs>
              </Container>
            </div>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

export default Report;
