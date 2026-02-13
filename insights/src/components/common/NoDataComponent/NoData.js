import React from "react";
import "./nodata.css"
import NoDataIcon from "../../../assets/images/NoData.svg";
import { UI_TEXTS } from "../Constants/label-contants";

const NoData = () => {

    return (
        <div className="nodata-container">
            <div className="item-align">
                <img src={NoDataIcon} alt="timeout"  style={{ fill: 'blue' }} className="my-icon"></img>
                <br></br>
                <h6>{UI_TEXTS.NOT_FOUND.NO_DATA_FOUND}</h6>
            </div>

        </div>
    );
};

export default NoData