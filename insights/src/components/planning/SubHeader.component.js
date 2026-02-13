import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Stack } from "react-bootstrap";
import { Logout, LogoutCurve } from "iconsax-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import classes from "./css/subheader.module.css";

import { SideDrawerAddJob } from "./SideDrawerAddJob.component";
import IconStart from "../../assets/images/Icon start.png";
import SettingIcon from "../../assets/images/Settings.png";
import Setting from "../../assets/images/SettingIcon.png";
import InsightIcon from "../../assets/images/InsightIcon.png";
import Insightlogo from "../../assets/images/Insightslogo.png";
import JNJLogo from "../../assets/images/jnj_logo.svg";
import Profile from "../../assets/images/Ellipse 13.png";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";
import { Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import User from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useMsal } from "@azure/msal-react";
import Cookies from "universal-cookie";
import { useHistory } from "react-router-dom";
import {
  authLogoutAction,
  loginActionInsight,
} from "../../services/configurations/configService";
import { jwtDecode } from "jwt-decode";
import { UI_TEXTS } from "../common/Constants/label-contants";

// declare component
function SubHeader(props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const location = useLocation();
  const cookies = new Cookies();
  const loggedIn = cookies.get("isAuthenticated") ?? false;
  const loggedInUser = cookies.get("user_fullname") ?? "";
  const [anchorElUser, setAnchorElUser] = useState(null);
  const history = useHistory();
  const { instance } = useMsal();

  const permissionState = useSelector((state) => state.jobs?.permissions);

  // Function to check reports permission
  const hasReportsAccess = () => {
    if (!permissionState) return false;

    const insightsProject = permissionState.find(
      (project) => project.project === "insights"
    );
    if (!insightsProject) return false;

    const reportsModule = insightsProject.modules.find(
      (module) => module.module === "Reports"
    );
    if (!reportsModule) return false;

    return (
      reportsModule.hasAccess &&
      reportsModule.permissions.some(
        (p) => p.label === "Reports : read" && p.hasAccess
      )
    );
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
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

  useEffect(() => {
    if (loggedIn || !process.env.ENABLE_SSO) {
    }
  }, [loggedIn]);

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoutRedirect = async () => {
    const access_token = cookies.get("msal_access_token") ?? "";
    const decoded = access_token ? jwtDecode(access_token) : null;

    if (!decoded) {
      console.error("No valid token found");
      return;
    }

    const logoutPayload = {
      action: "logout",
      accessToken: access_token,
    };

    try {
      await loginActionInsight(logoutPayload);
    } catch (error) {
      console.error("Failed to log logout action:", error);
    }

    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: "/logout",
      });
    } catch (error) {
      console.error("Failed to perform logout redirect:", error);
    }
  };

  return (
    <>
      <Stack direction="horizontal" gap={4} id="iabotHeader">
        <div
          style={{
            display: "flex",
            height: "64px",
            borderBottom: "1px solid #E2E8F0",
            position: "relative",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          data-testid="plannerTest1"
        >
          <img
            style={{
              width: "180px",
              height: "70px",
              marginLeft: "15px",
            }}
            src={JNJLogo}
            alt=""
          ></img>

          <img
            src={Insightlogo}
            style={{ width: "7rem", mixBlendMode: "multiply" }}
            alt=""
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginRight: "15px",
            }}
          >
            <div
              className="profile-container"
              onClick={handleOpenUserMenu}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginRight: "8px",
                cursor: "pointer",
                border: "1px solid #e5e4e4",
                padding: "4px 4px 4px 12px",
                borderRadius: "32px",
              }}
            >
              <Typography
                style={{
                  marginRight: "8px",
                  fontWeight: "500",
                }}
              >
                {loggedInUser || UI_TEXTS.LABELS.COMPANY}
              </Typography>
              <AccountCircleIcon color="primary" />
            </div>

            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                style: {
                  backgroundColor: "#ffffff",
                },
              }}
            >
              <MenuItem
                onClick={handleLogoutRedirect}
                sx={{ backgroundColor: "#ffffff" }}
              >
                <Logout color="black" style={{ marginRight: "8px" }} />
                {UI_TEXTS.TEXTS.LOGOUT}
              </MenuItem>
            </Menu>
          </div>
        </div>
      </Stack>
    </>
  );
}
export default SubHeader;
