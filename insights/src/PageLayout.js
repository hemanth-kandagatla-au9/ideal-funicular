import React, { useEffect, useState } from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";
import { Route, Switch, useHistory, Redirect } from "react-router-dom";
import Cookies from "universal-cookie";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { getLocalAccessToken } from "./utils/TokenUtils";
import insightConfigServiceMngt from "./store/actions/configManagement";
import IABOT from "./layouts/operations/planning/Planning.layout";
import Report from "./layouts/report/Report.layout";
import Settings from "./components/configuration/Configs.layouts";
import Unauthorized from "./layouts/auth/UnauthorizedPage";
import LoginComp from "./layouts/Login/Login.jsx";
import ReportDetails from "./layouts/report/ReportDetails";
import { getPermissionAction } from "./services/configurations/configService";
import HostDetailsList from "./components/configuration/HostDetailsList.js";
import AddSchedulePage from "./layouts/schedule/AddSchedulePage.jsx";
import {
  authAction,
  loginActionInsight,
} from "./services/configurations/configService.js";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
// import { MODULES } from "./components/common/label-contants.js";
import ApprovalsPage from "./layouts/Approval/ApprovalsPage.js";
import ApprovalStatus from "./layouts/Approval/ApprovalStatus.js";
import Users from "./layouts/users/users.js";
import AuthApp from "./modules/AuthApp.js";
import AuditLogs from "./layouts/AuditLogs/AuditLogs.js";
import AppStore from "./layouts/Marketplace/AppStore.js";
import { MODULE_LIST } from "./utils/permissionUtil.js";
import LogoutPage from "./layouts/auth/LogoutPage.js";
import SessionExpired from "./layouts/Login/SessionExpired.jsx";
import CMDBHostLists from "./components/configuration/CmdbHostList.js";
const cookies = new Cookies();
const TOKEN_COOKIE_NAME = "msal_access_token";
const MODULE_ROUTE_MAP = {
  [MODULE_LIST.SCHEDULE]: "/dashboard",
  [MODULE_LIST.REPORTS]: "/report",
  [MODULE_LIST.SERVERS]: "/server",
  [MODULE_LIST.REQUEST_STATUS]: "/approval_status",
  [MODULE_LIST.REQUEST_APPROVAL]: "/approvals",
  [MODULE_LIST.AUTH]: "/auth",
  [MODULE_LIST.USERS]: "/users",
  [MODULE_LIST.AUDIT_LOGS]: "/auditLogs",
  [MODULE_LIST.CODE_MARKETPLACE]: "/market-place",
  [MODULE_LIST.CONFIG]: "/settings",
  [MODULE_LIST.CMDB_SCHEDULES]: "/cmdb_schedules",
};

const SETTINGS_TAB_MODULES = [
  MODULE_LIST.JOB_CATEGORIES,
  MODULE_LIST.OPEN_SEARCH,
  MODULE_LIST.COMMAND_CATEGORY,
  MODULE_LIST.CONFIG,
  MODULE_LIST.APPROVAL_FLOW,
  MODULE_LIST.INTERNAL_JOBS,
  MODULE_LIST.RUN_AS_CONFIG,
  MODULE_LIST.SCHEDULE_SYSTEM_PUBLISH_CONFIG,
];

function PageLayout() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, inProgress, accounts } = useMsal();
  const [isTokenAvailable, setIsTokenAvailable] = useState(null);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const token = getLocalAccessToken();

  const configState = useSelector((state) => state.jobs?.configSetting);
  const permissionState = useSelector((state) => state.jobs?.permissions);

  useEffect(() => {
    // Step 1: Check if user is logged in and session is ready
    if (token && isSessionReady) {
      // Step 2: Ask the server "What can this user do?"
      dispatch(getPermissionAction())
        .unwrap()
        .then((response) => {
          // Step 3: SUCCESS - We got the permissions!
          setPermissionsLoaded(true);
        })
        .catch((error) => {
          // Step 4: FAILED - Something went wrong
          history.push("/unauthorized");
        });
    }
  }, [dispatch, token, isSessionReady]);

  useEffect(() => {
    console.log("Permission state updated:", permissionState);
    // Step 1: Find permissions for "insights" project
    if (permissionState) {
      const projectPermissions = permissionState.find(
        (project) => project?.project === "insights"
      );
      if (projectPermissions) {
        // Step 2: Check if user can access AT LEAST ONE module
        const hasAccessToAtLeastOneModule = projectPermissions.modules.some(
          (module) => module.hasAccess === true
        );

        // Step 3: If user has NO access to ANY module
        if (!hasAccessToAtLeastOneModule) {
          history.push("/unauthorized");
        }
      } else {
        // Step 4: If no insights project found
        history.push("/unauthorized");
      }
    }
  }, [permissionState, history]);

  {
    /** Don't remove this code */
  }
  //   useEffect(() => {
  //   if (token) {
  //     dispatch(getPermissionAction());
  //   }
  // }, [dispatch, token]);
  // useEffect(() => {
  //   if (permissionState) {
  //     const projectPermissions = permissionState.find(
  //       (project) => project?.project === "insights"
  //     ); // Find the specific project

  //     if (projectPermissions) {
  //       const hasNoAccessToModules = projectPermissions.modules.every(
  //         (module) => module.hasAccess === false
  //       );

  //       if (hasNoAccessToModules) {
  //         history.push("/unauthorized"); // Redirect to unauthorized page
  //       }
  //     }
  //   }
  // }, [permissionState, history]);

  const getFirstAccessibleRoute = () => {
    if (!permissionState) {
      return null;
    }
    const project = permissionState.find((p) => p.project === "insights");
    if (!project || !Array.isArray(project.modules)) {
      return null;
    }

    for (const [moduleKey, routePath] of Object.entries(MODULE_ROUTE_MAP)) {
      if (moduleKey === MODULE_LIST.CONFIG) {
        // If user has access to any settings-related tab
        const tabHasAccess = SETTINGS_TAB_MODULES.some((tabModule) =>
          project.modules.some((m) => m.module === tabModule && m.hasAccess)
        );
        if (tabHasAccess) {
          return "/settings";
        }
      } else {
        const hasAccess = project.modules.some(
          (m) =>
            (m.module === "All" && m.hasAccess) ||
            (m.module?.toLowerCase?.() === moduleKey.toLowerCase() &&
              m.hasAccess)
        );
        if (hasAccess) {
          return routePath;
        }
      }
    }

    return "/unauthorized";
  };

  const renewTokenService = async (instance) => {
    try {
      if (
        !instance.getActiveAccount() &&
        instance.getAllAccounts().length > 0
      ) {
        instance.setActiveAccount(instance.getAllAccounts()[0]);
      }

      const request = {
        scopes: [],
        account: accounts[0],
      };

      if (accounts.length > 0) {
        const apiResponse = await instance.acquireTokenSilent(request);
        console.log("apiResponse?.expiresOn => ", apiResponse?.expiresOn);
        const loginPayload = {
          action: "login",
          accessToken: apiResponse?.accessToken,
        };
        // await authAction(loginPayload);
        await loginActionInsight(loginPayload);
        cookies.set(TOKEN_COOKIE_NAME, apiResponse?.accessToken, {
          path: "/",
          secure: true,
          sameSite: "strict",
          maxAge: apiResponse?.expiresIn,
        });
        sessionStorage.setItem("msal_id_token", apiResponse?.idToken);
        cookies.set("tokenValidity", apiResponse?.expiresOn);
      }
    } catch (error) {
      console.log("Token renewal error:", error);
      if (error instanceof InteractionRequiredAuthError) {
        // If silent token acquisition fails, try interactive method
        try {
          // const apiResponse = await instance.acquireTokenRedirect(request);
          // Handle the response as needed
        } catch (redirectError) {
          console.error("Redirect error:", redirectError);
        }
      }
    }
  };

  const clearSessionData = () => {
    cookies?.remove("token");
    cookies?.remove("refreshToken");
    cookies?.remove("isAuthenticated");
    cookies?.remove("username");
    cookies?.remove("user_fullname");
    cookies?.remove("permissions");
    cookies?.remove("tokenValidity");
    cookies?.remove("msal_access_token");

    sessionStorage?.removeItem("msal_id_token");
    localStorage?.removeItem("user");
    localStorage?.removeItem("permissions");
  };

  const generateToken = async () => {
    if (!instance.getActiveAccount() && instance.getAllAccounts().length > 0) {
      instance.setActiveAccount(instance.getAllAccounts()[0]);
    }

    if (isAuthenticated) {
      const request = {
        scopes: [],
        account: accounts[0],
      };

      if (accounts.length > 0) {
        try {
          const response = await instance.acquireTokenSilent(request);
          console.log("response?.expiresOn => ", response?.expiresOn);
          if (response.accessToken) {
            cookies.set(TOKEN_COOKIE_NAME, response.accessToken, {
              path: "/",
              secure: true,
              sameSite: "strict",
              maxAge: response.expiresIn,
            });
            sessionStorage.setItem("msal_id_token", response.idToken);
            const loginPayload = {
              action: "login",
              accessToken: response?.accessToken,
            };
            // await authAction(loginPayload);
            await loginActionInsight(loginPayload);
            const decodedToken = jwtDecode(response.idToken);
            cookies.set(
              "permissions",
              JSON.stringify(decodedToken?.roles ?? [])
            );
            const decoded = jwtDecode(response.accessToken);
            cookies.set("isAuthenticated", true);
            cookies.set("username", decoded?.unique_name.split("@")[0]);
            cookies.set(
              "user_fullname",
              `${decoded?.given_name ?? ""} ${decoded?.family_name ?? ""}`
            );
            setIsSessionReady(true);
            cookies.set("tokenValidity", response?.expiresOn);
          } else {
            setIsTokenAvailable(false);
            cookies.set("isAuthenticated", false);
            console.error("Error while authenticating. Please login again");
            clearSessionData();
            history.replace("/session-expired");
            history.push("/session-expired");
          }
        } catch (error) {
          setIsTokenAvailable(false);
          cookies.set("isAuthenticated", false);
          console.error("Error while authenticating. Please login again");
          clearSessionData();
          history.replace("/session-expired");
          history.push("/session-expired");
        }
      }
    }
  };

  useEffect(() => {
    // // Initialize MSAL and handle any pending redirects
    // const initializeAuth = async () => {
    //   // await instance.initialize();
    //   await instance.handleRedirectPromise();
    //   await generateToken();
    // };

    // initializeAuth();
    generateToken();
  }, [isAuthenticated]);

  const checkTokenValidity = async () => {
    await instance.initialize();
    const apiToken = cookies.get(TOKEN_COOKIE_NAME);

    if (apiToken) renewTokenService(instance);
  };

  useEffect(() => {
    if (inProgress !== "login" && inProgress !== "handleRedirect") {
      checkTokenValidity();
      const intervalId = setInterval(checkTokenValidity, 300000);
      return () => clearInterval(intervalId);
    }
  }, []);

  const Loader = (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  );

  if (
    inProgress === "startup" ||
    inProgress === "login" ||
    inProgress === "handleRedirect"
  ) {
    return Loader;
  }

  if (!isSessionReady && isTokenAvailable === null && isAuthenticated) {
    return Loader;
  }

  // Show loader while permissions are being loaded
  if (isSessionReady && !permissionsLoaded && !permissionState) {
    return Loader;
  }

  if (window.location.pathname === "/logout") {
    return <LogoutPage />;
  } else if (!isAuthenticated) {
    return <LoginComp />;
  }

  return (
    <>
      <ToastContainer />

      <Switch>
        <Route path="/session-expired" component={SessionExpired} />
        <Route path="/unauthorized" component={Unauthorized} />
        <ProtectedRoute
          path="/reports/:reportType/:id"
          component={ReportDetails}
          module={MODULE_LIST.REPORTS}
          permissions={permissionState}
        />
        <Route path="/login" component={LoginComp} />
        <Route path="/logout" component={LogoutPage} />

        <ProtectedRoute
          path="/settings"
          component={Settings}
          module="SETTINGS"
          permissions={permissionState}
        />
        <ProtectedRoute
          path="/schedule/:id?"
          component={AddSchedulePage}
          module={MODULE_LIST.SCHEDULE}
          permissions={permissionState}
        />
        <ProtectedRoute
          path="/dashboard"
          component={IABOT}
          module={MODULE_LIST.SCHEDULE}
          permissions={permissionState}
        />
        <ProtectedRoute
          path="/server"
          component={HostDetailsList}
          module={MODULE_LIST.SAP_FACTS}
          permissions={permissionState}
        />
        <ProtectedRoute
          path="/cmdb_schedules"
          component={CMDBHostLists}
          module={MODULE_LIST.CMDB_SCHEDULES}
          permissions={permissionState}
        />

        <ProtectedRoute
          path="/approval_status"
          component={ApprovalStatus}
          module={MODULE_LIST.REQUEST_STATUS}
          permissions={permissionState}
        />
        <ProtectedRoute
          path="/approvals"
          component={ApprovalsPage}
          module={MODULE_LIST.REQUEST_APPROVAL}
          permissions={permissionState}
        />
        <ProtectedRoute
          path="/auth"
          component={AuthApp}
          module={MODULE_LIST.AUTH}
          permissions={permissionState}
        />

        <ProtectedRoute
          path="/report"
          component={Report}
          module={MODULE_LIST.REPORTS}
          permissions={permissionState}
        />
        <ProtectedRoute
          path="/market-place"
          component={AppStore}
          module={MODULE_LIST.CODE_MARKETPLACE}
          permissions={permissionState}
        />
        {/* <ProtectedRoute
          path="/"
          component={IABOT}
          module={MODULE_LIST.DASHBOARD}
          permissions={permissionState}
          exact
        /> */}
        <Route
          exact
          path="/"
          render={() => {
            const redirectTo = getFirstAccessibleRoute();
            return redirectTo ? <Redirect to={redirectTo} /> : Loader;
          }}
        />
        <ProtectedRoute
          path="/users"
          component={Users}
          module={MODULE_LIST.USERS}
          permissions={permissionState}
        />
        <ProtectedRoute
          path="/auditLogs"
          component={AuditLogs}
          module={MODULE_LIST.AUDIT_LOGS}
          permissions={permissionState}
        />
      </Switch>
    </>
  );
}

export default PageLayout;
