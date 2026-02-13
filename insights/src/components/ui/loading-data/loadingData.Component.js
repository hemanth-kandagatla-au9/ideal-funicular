import React from "react";
import loadingImage from "../../../images/agent-management/dashboard.png";
import { UI_TEXTS } from "../../common/Constants/label-contants";

function LoadingData() {
  return (
    <div className="planner_noDataFound" style={{ textAlign: "center" }}>
      <div className="planner_noDataInnerSection">
        <img loading="lazy" src={loadingImage} alt="Loading" />
        <p>{UI_TEXTS.LOADING.PLEASE_WAIT_DATA_LOADING}</p>
      </div>
    </div>
  );
}

export default LoadingData;