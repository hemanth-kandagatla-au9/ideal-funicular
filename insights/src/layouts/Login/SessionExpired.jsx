import React from "react";
import "./authStyles.css";
import Timeout from "../../assets/images/sessionout.svg";
import Button from "../../components/common/Button/Button";
import "./authStyles.css";

const SessionExpired = () => {
  return (
    <div className="expired-container">
      <div className="item-align">
        <img src={Timeout} alt="timeout"></img>
        <h1>Session Timed Out!</h1>
        <p>
          Your session has expired for security reasons. Please login again to
          continue
        </p>
        <Button
          type="primary"
          onClick={() => {
            window.location.href = "/login";
          }}
        >
          Login
        </Button>
      </div>
    </div>
  );
};

export default SessionExpired;
