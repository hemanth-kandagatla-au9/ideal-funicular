import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./popup.modal.css";
import "../../layouts/agent-management/css/agentStyle.css";
import "../../layouts/agent-management/css/common-style.css";
import { cancelButtonText, okButtonText } from "../../constants/strings";

interface ButtonConfig {
  variant?: string;
  buttonBg?: string;
  buttonOneName?: string;
  buttonTwoName?: string;
  onClick?: () => void;
}
interface DataObj {
  header: string;
  body: string | React.ReactNode;
  button: {
    buttonOne: ButtonConfig;
    buttonTwo: ButtonConfig;
  };
}
interface PopUpProps {
  show: boolean;
  onHide: () => void;
  dataObj: DataObj;
  handleClick?: () => void;
}
const PopUp: React.FC<PopUpProps> = ({ show, onHide, dataObj, handleClick }) => {
  return (
    <Modal data-testid="popupModalTestId" className="risebothealthCheckModal" show={show} animation={false} onHide={onHide}>
      <Modal.Header id="modalHeader" closeButton>
        <Modal.Title className="upgradeHeader">{dataObj.header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body-content">{dataObj.body}</div>
      </Modal.Body>
      <Modal.Footer>
        {}
        <Button
          variant={dataObj.button.buttonTwo.variant || "secondary"}
          className="deleteSchedulerCancelBtn"
          data-testid="CloseButton"
          id={dataObj.button.buttonTwo.buttonBg || "modalButtonWhite"}
          onClick={onHide}
        >
          {dataObj.button.buttonTwo.buttonTwoName || cancelButtonText}
        </Button>
        {}
        <Button
          variant={
            dataObj.button.buttonOne.variant ||
            (dataObj.button.buttonOne.buttonOneName && dataObj.button.buttonOne.buttonOneName.toLowerCase().includes("delete") ? "danger" : "primary")
          }
          data-testid="OkButton"
          className={`saveButtonAgent ${
            dataObj.button.buttonOne.buttonBg ||
            (dataObj.button.buttonOne.buttonOneName && dataObj.button.buttonOne.buttonOneName.toLowerCase().includes("delete")
              ? "modalButton modalButtonDanger"
              : "modalButton modalButtonBlue")
          }`}
          id={
            dataObj.button.buttonOne.buttonBg ||
            (dataObj.button.buttonOne.buttonOneName && dataObj.button.buttonOne.buttonOneName.toLowerCase().includes("delete") ? "modalButtonDanger" : "modalButtonBlue")
          }
          onClick={handleClick || dataObj.button.buttonOne.onClick}
        >
          {dataObj.button.buttonOne.buttonOneName || okButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default PopUp;
