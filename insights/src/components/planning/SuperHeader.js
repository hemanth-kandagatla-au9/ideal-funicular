import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Stack } from "react-bootstrap";
import { Setting2, Add } from "iconsax-react";
import classes from "./css/subheader.module.css";
import IconStart from "../../assets/images/Icon start.png";
import { SideDrawerAddJob } from "./SideDrawerAddJob.component";
import Cookies from "universal-cookie";
import { PERMISSION_LIST, hasInsightsPermission } from "../../utils/permissionUtil";
import { UI_TEXTS } from "../common/Constants/label-contants";

function SuperHeader() {
  const cookies = new Cookies();
  const loggedInUser = cookies.get("user_fullname") ?? "";
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const permissionState = useSelector((state) => state.jobs?.permissions);

  // Function to check settings permission
  const hasSettingsAccess = () => {
    if (!permissionState) return false;

    const insightsProject = permissionState.find(
      (project) => project.project === "insights"
    );
    if (!insightsProject) return false;

    const settingsModule = insightsProject.modules.find(
      (module) => module.module === "Settings"
    );
    if (!settingsModule) return false;

    return (
      settingsModule.hasAccess &&
      settingsModule.permissions.some(
        (p) => p.label === "Settings : read" && p.hasAccess
      )
    );
  };

  // Check Dashboard access
  const hasDashboardAccess = () => {
    if (!permissionState) return false;
    const insightsProject = permissionState.find(
      (project) => project.project === "insights"
    );
    if (!insightsProject) return false;
    const dashboardModule = insightsProject.modules.find(
      (module) => module.module === "Dashboard"
    );
    return dashboardModule?.hasAccess;
  };

  // Check Dashboard write permission (for New Job button)
  const hasDashboardWriteAccess = () => {
    if (!permissionState) return false;
    const insightsProject = permissionState.find(
      (project) => project.project === "insights"
    );
    if (!insightsProject) return false;
    const dashboardModule = insightsProject.modules.find(
      (module) => module.module === "Dashboard"
    );
    return dashboardModule?.permissions?.some(
      (p) => p.label === "Dashboard : write" && p.hasAccess
    );
  };

  const setModalIsOpenToTrue = () => {
    if (document.querySelector("#TaskList thead"))
      document.querySelector("#TaskList thead").style.position = "relative";
    setModalIsOpen(true);
  };

  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
    if (document.querySelector("#TaskList thead"))
      document.querySelector("#TaskList thead").style.position = "sticky";
  };
  return (
    <>
      <Stack>
        <div className={classes.iabot_addJob_action}>
          <div
            style={{
              paddingLeft: "3%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              style={{
                fontFamily: "Manrope",
                fontWeight: 600,
                fontSize: "18px",
                color: "black",
                display: "flex",
              }}
            >
              {UI_TEXTS.LABELS.WELCOME},{" "}
              <p style={{ color: "#2961F4", paddingLeft: "4px", margin: "0" }}>
                {loggedInUser}
              </p>
            </span>
            <span
              style={{
                width: "30vw",
                fontFamily: "Manrope",
                color: "#39465F",
                fontWeight: 500,
              }}
            >
              {UI_TEXTS.LABELS.CREATE_AND_UPDATE_JOBS_WITH_EASE}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              width: "83%",
              paddingRight: "15px",
            }}
          >
            {/* Conditionally render Settings icon based on permission */}
            {hasSettingsAccess() && (
              <div className={[classes.iabot_addTemplate].join(" ")} size="sm">
                <Link to="/settings">
                  <div className={classes.settings_icon}>
                    <Setting2 size="20" color="#344054" />
                  </div>
                </Link>
              </div>
            )}
            {hasInsightsPermission(permissionState, "Dashboard", PERMISSION_LIST.JOBS_DASHBOARD_WRITE) && (
              <div
                data-testid="addplannerTaskBtn"
                id="AddTask"
                className={[
                  classes.iabot_addTemplate,
                  classes.iabot_addjob_btn,
                ].join(" ")}
                onClick={setModalIsOpenToTrue}
              >
                <Add size="20" color="#FFFFFF" />
                <span
                  style={{
                    fontFamily: "Manrope",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                >
                  {UI_TEXTS.LABELS.NEW_JOB}
                </span>
              </div>
            )}
          </div>
          <br />
        </div>

        {/* ========================================== Upload Job ==================================== */}
      </Stack>
      {/* Only show SideDrawer if write permission exists */}
      {hasDashboardWriteAccess() && (
        <SideDrawerAddJob
          data-testid="sidedrawer-component-test"
          modalIsOpen={modalIsOpen}
          setModalIsOpenToFalse={setModalIsOpenToFalse}
          componentTriggered={"SubHeaader"}
        />
      )}
    </>
  );
}
export default SuperHeader;
