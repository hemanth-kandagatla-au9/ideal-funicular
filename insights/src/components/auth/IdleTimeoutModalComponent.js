import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import "./css/timer.css";
import config from "../../config/config";
import { UI_TEXTS } from "../common/Constants/label-contants";

export const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">{UI_TEXTS.LOADING.TOO_LATE}</div>;
  }
  return (
    <div className="timer">
      <div className="timer-text">{UI_TEXTS.LABELS.REMAINING}</div>
      <div className="timer-value">{remainingTime}</div>
      <div className="timer-text">{UI_TEXTS.LABELS.SECONDS}</div>
    </div>
  );
};

export default function IdleTimeoutModalComponent({
  showModal,
  handleContinue,
  handleLogout,
}) {
  return (
    <Modal show={showModal} onHide={handleContinue}>
      <Modal.Header closeButton>
        <h1>{UI_TEXTS.MESSAGES.YOU_HAVE_BEEN_IDLE}</h1>
      </Modal.Header>
      <Modal.Body
        style={{
          display: "flex",
          justifyContent: "center",
          paddingLeft: "30%",
          flexDirection: "column",
        }}
      >
        <CountdownCircleTimer
          isPlaying
          duration={config.AUTOLOGOUT_TIME}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={["10", "6", "3", 0]}
          onComplete={() => {
            handleLogout();
            return { shouldRepeat: false, delay: 1 };
          }}
        >
          {renderTime}
        </CountdownCircleTimer>
        <h3 style={{ marginLeft: "-15%" }}>
          {" "}
          {UI_TEXTS.MESSAGES.YOUR_SESSION_IS_TIMED_OUT_YOU_WANT_TO_STAY}
        </h3>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleLogout}>
          {UI_TEXTS.TEXTS.LOGOUT}
        </Button>
        <Button variant="primary" onClick={handleContinue}>
          {UI_TEXTS.BUTTONS.CONTINUE_SESSION}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
