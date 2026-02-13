import React from "react";
import NoDataFoundImg from "../../../images/agent-management/NoDATA.png";
import { UI_TEXTS } from "../../common/Constants/label-contants";

function NoDataFound() {
  return (
    <div className="planner_noDataFound" style={{ textAlign: "center" }}>
      <div className="planner_noDataInnerSection">
        <img loading="lazy" src={NoDataFoundImg} alt="No Data" />
        <p>{UI_TEXTS.NOT_FOUND.OOPS_NO_DATA_FOUND}</p>
      </div>
    </div>
  );
}

export default NoDataFound;