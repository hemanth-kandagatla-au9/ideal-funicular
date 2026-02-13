import React, { useEffect } from "react";
import config from "../../config/config";
import { UI_TEXTS } from "../../components/common/Constants/label-contants";

function LogoutLayout() {
  useEffect(() => {
    document.title = `${config.appName} - Logout`;
  }, []);
  return (
    <div
      style={{
        background: "#ffff",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <h1>{UI_TEXTS.MESSAGES.LOG_OUT_SUCCESS}</h1>
      <br />
      <h2>
        {" "}
        {UI_TEXTS.MESSAGES.THANKYOU_FOR_USING_RISE}{" "}
        <a href="/" style={{ color: "#2b87e3" }}>
          {UI_TEXTS.BUTTONS.CLICK_HERE}
        </a>{" "}
        to login again
      </h2>
    </div>
  );
}

export default LogoutLayout;
