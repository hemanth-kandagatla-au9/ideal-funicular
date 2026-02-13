import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./css/popup.modal.css";
import { UI_TEXTS } from "../common/Constants/label-contants";

function PopUp(props) {
  const { show, onHide, dataObj, handleClick } = props;
  return (
    <Modal data-testid="popupModalTestId" dialogClassName="popupModal" show={show} animation={false} onHide={onHide}>
      <Modal.Header id="modalHeader" closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <span id="modalHeaderTitle"> {dataObj.header} </span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span id="modalBody"> {dataObj.body} </span>
        <span id="modalButtonSpan">
          <Button
            variant={dataObj.button.buttonOne.variant || "primary"}
            data-testid="OkButton"
            className="modalButton"
            id={dataObj.button.buttonOne.buttonBg || "modalButtonBlue"}
            onClick={handleClick || dataObj.button.buttonOne.onClick}
          >
            {dataObj.button.buttonOne.buttonOneName || UI_TEXTS.BUTTONS.OK}
          </Button>
          <Button
            variant={dataObj.button.buttonOne.variant || "secondary"}
            className="modalButton"
            data-testid="CloseButton"
            id={dataObj.button.buttonTwo.buttonBg || "modalButtonWhite"}
            onClick={onHide}
          >
            {dataObj.button.buttonTwo.buttonTwoName || UI_TEXTS.BUTTONS.CANCEL}
          </Button>
        </span>
      </Modal.Body>
    </Modal>
  );
}
export default PopUp;
