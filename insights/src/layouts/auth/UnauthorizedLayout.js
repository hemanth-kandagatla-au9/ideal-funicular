import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import config from "../../config/config";
import { UI_TEXTS } from "../../components/common/Constants/label-contants";

function UnauthorizedLayout() {
  useEffect(() => {
    document.title = `${config.appName} - Unauthorized Access`;
  }, []);
  return (
    <div
      style={{
        background: "#c4321d",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
      data-test="unauthorized-testID"
    >
      <p style={{ color: "#FFFF", fontFamily: "Manrope", fontSize: "150px" }}>
        4<FontAwesomeIcon icon={faLock} />3
      </p>
      <h1 style={{ fontFamily: "Manrope", color: "#ffff" }}>{UI_TEXTS.TEXTS.ACCESS_DENIED}</h1>
      <h2 style={{ fontFamily: "Manrope", color: "#ffff" }}>
        You have been logged out.
        <a style={{ fontFamily: "Manrope", color: "white" }} href="/">
          {UI_TEXTS.BUTTONS.CLICK_HERE}
        </a>
        &nbsp; to login again
      </h2>
    </div>
  );
}

export default UnauthorizedLayout;
