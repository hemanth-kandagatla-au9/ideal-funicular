import { lazy, useState } from "react";
import ModuleHOC from "./ModuleHOC";
import { Typography } from "@mui/material";
import SubHeader from "../components/planning/SubHeader.component";
import Sidebar from "../components/planning/Sidebar.component";

const AuthPage = lazy(() => import(/* webpackChunkName: "authModule" */ "Auth/authApp"));

// Wrapper component with layout
const AuthWithLayout = () => {
  const [sidebarActiveTab, setSidebarActiveTab] = useState("auth");

  return (
    <div>
      <SubHeader />
      <div style={{ display: "flex", height: "88vh" }}>
        <Sidebar
          activeTab={sidebarActiveTab}
          setActiveTab={setSidebarActiveTab}
        />
        <div style={{  width: "100%" }}>
          <AuthPage />
        </div>
      </div>
    </div>
  );
};

// Use the HOC
const AuthApp = ModuleHOC(AuthWithLayout);

export default AuthApp;