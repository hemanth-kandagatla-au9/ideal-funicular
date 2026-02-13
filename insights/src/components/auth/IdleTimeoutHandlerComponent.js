import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import config from "../../config/config";
import UserService from "../../services/auth/UserService";
import { Logout } from "../../utils/AuthUtils";
import { refreshUserPermissions } from "../../utils/PermissionUtils";
import {
  getLocalAccessToken,
  getLocalRefreshToken,
  getLocalUserId,
  isTokenExpired,
  updateLocalTokens,
} from "../../utils/TokenUtils";
import IdleTimeoutModalComponent from "./IdleTimeoutModalComponent";

function IdleTimeOutHandlerComponent(props) {
  const {
    onActive,
    timeOutInterval: propsTimeOutInterval,
    onLogout,
    onIdle,
    propsShowModal,
    propsIsLogout,
  } = props;
  const [showModal, setShowModal] = useState(propsShowModal || false);
  const [isLogout, setLogout] = useState(propsIsLogout || false);

  let timer;
  let refreshPermissionTimer;
  let userActivitityTimer;
  let userRefreshTimer;
  const events = ["click", "load", "keydown", "mousemove", "DOMMouseScroll"];
  const eventHandler = () => {
    if (!isLogout) {
      localStorage.setItem("lastInteractionTime", moment());
      if (timer) {
        onActive();
        startTimer();
      }
    }
  };
  useEffect(() => {
    let refreshPermissionCounter;
    addEvents();
    refreshPermissionTimer = setInterval(async () => {
      refreshUserPermissions();
      refreshPermissionCounter += 1;
    }, config.REFRESH_PERMISSION_TIME);
    userActivitityTimer = setInterval(async () => {
      const userId = getLocalUserId();
      if (userId) {
        await UserService.updateUser(userId, {
          lastActiveTime: new Date().toISOString(),
        });
      }
    }, Number("600000"));
    userRefreshTimer = setInterval(async () => {
      const localAccessToken = getLocalAccessToken();
      const localRefreshToken = getLocalRefreshToken();
      if (localAccessToken && localRefreshToken) {
        if (isTokenExpired(localAccessToken)) {
          const userId = getLocalUserId();
          if (userId) {
            const rs = await axios.patch(
              `${config.apiEndpoints.auth.baseUrl}${config.apiEndpoints.auth.patch.refreshToken}/${userId}`,
              {
                refreshToken: localRefreshToken,
              }
            );
            const { accessToken, refreshToken } = rs.data.data;
            updateLocalTokens(accessToken, refreshToken);
          }
        }
      }
    }, Number("5000"));
    return () => {
      removeEvents();
      clearTimeout(timer);
      clearTimeout(refreshPermissionTimer);
      clearTimeout(userActivitityTimer);
    };
  }, []);

  const startTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }
    const timeOutInterval = propsTimeOutInterval;

    timer = setInterval(() => {
      const lastInteractionTime = localStorage.getItem("lastInteractionTime");
      const diff = moment.duration(moment().diff(moment(lastInteractionTime)));
      if (isLogout) {
        clearTimeout(timer);
      } else if (diff._milliseconds < timeOutInterval) {
        startTimer();
        onActive();
      } else if (diff._data.seconds > config.AUTOLOGOUT_TIME) {
        Logout();
        clearTimeout(timer);
        clearTimeout(refreshPermissionTimer);
      } else {
        onIdle();
        setShowModal(true);
      }
    }, Number("10000"));
  };
  const addEvents = () => {
    events.forEach((eventName) => {
      window.addEventListener(eventName, eventHandler);
    });
    startTimer();
  };

  const removeEvents = () => {
    events.forEach((eventName) => {
      window.removeEventListener(eventName, eventHandler);
    });
  };

  const handleContinueSession = () => {
    setShowModal(false);
    setLogout(false);
    startTimer();
  };

  const handleLogout = () => {
    removeEvents();
    clearTimeout(timer);
    setLogout(true);
    onLogout();
    setShowModal(false);
    Logout();
  };

  return (
    <IdleTimeoutModalComponent
      showModal={showModal}
      handleContinue={handleContinueSession}
      handleLogout={handleLogout}
    />
  );
}

export default IdleTimeOutHandlerComponent;
