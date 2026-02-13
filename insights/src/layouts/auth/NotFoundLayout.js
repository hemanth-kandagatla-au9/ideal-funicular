import React, { useEffect } from "react";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import config from "../../config/config";
import { UI_TEXTS } from "../../components/common/Constants/label-contants";

function NotFoundLayout() {
  useEffect(() => {
    document.title = `${config.appName} - ${UI_TEXTS.NOT_FOUND.PAGE_NOT_FOUND}`;
  }, []);
  return (
    <div
      style={{
        backgroundColor: "#2B87E3",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        color: "#ffffff",
        fontFamily: "Manrope",
      }}
    >
      <span style={{ fontSize: "90px" }}> {UI_TEXTS.NOT_FOUND.OOPS_TEXT}</span>
      <br />
      <span style={{ fontSize: "20px", marginBottom: "20px" }}>{`404 - ${UI_TEXTS.NOT_FOUND.PAGE_NOT_FOUND}`}</span>
      <p>
        <span>{UI_TEXTS.NOT_FOUND.PAGE_MIGHT_REMOVED}</span><br />
        <span>{UI_TEXTS.NOT_FOUND.TEMPORARLY_UNAVAILABLE}</span>
      </p>

      <a style={{ fontFamily: "Manrope", color: "white" }} href="/app">
        <FontAwesomeIcon icon={faHome} /> {UI_TEXTS.BUTTONS.BACK_TO_HOME}
      </a>
    </div>
  );
}

export default NotFoundLayout;
