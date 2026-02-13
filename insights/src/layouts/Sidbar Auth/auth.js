import React, { useState } from "react";
import Sidebar from "../../components/planning/Sidebar.component";
import SubHeader from "../../components/planning/SubHeader.component";
import { UI_TEXTS } from "../../components/common/Constants/label-contants";

function Auth() {
  const [sidebarActiveTab, setSidebarActiveTab] = useState("auth");

  return (
    <div>
      <SubHeader />
    <div style={{ display: "flex", height: "91vh" }}>
      <Sidebar
        activeTab={sidebarActiveTab}
        setActiveTab={setSidebarActiveTab}
      />
      <div style={{ padding: "25px" }}>
        <h1>{UI_TEXTS.HEADINGS.AUTH}</h1>
        <p>{UI_TEXTS.MESSAGES.PAGE_DISPLAYS_AUTH_INFO}</p>
      </div>
    </div>
    </div>
  );
}

export default Auth;
