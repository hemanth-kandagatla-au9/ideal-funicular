/* eslint-disable */
import { cancelButtonText, deleteButtonText, deleteConfirmationMessage, deleteJobsTitle, deleteBinaryTitle, healthCheckTitle } from "@/constants/strings";
import React from "react";
import { Modal } from "react-bootstrap";
import "../css/common-style.css";

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  onCancelButtonClick: () => void;
  onDeleteButtonClick: () => void;
  version?: string;
}
const DeleteModal: React.FC<DeleteModalProps> = ({ open, onClose, onCancelButtonClick, onDeleteButtonClick, version }) => {
  return (
    <Modal show={open} backdrop="static" onHide={onClose} className="risebothealthCheckModal">
      <Modal.Header closeButton>
        <Modal.Title className="upgradeHeader">{version ? deleteBinaryTitle : deleteJobsTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body-content">
          {version ? (
            `Are you sure you want to delete version ${version}?`
          ) : (
            <>
              {deleteConfirmationMessage} <span style={{ fontWeight: 600 }}>{healthCheckTitle}</span>?
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer style={{ border: "16px 0px 0px 0px" }}>
        <button type="button" className="deleteSchedulerCancelBtn" onClick={onCancelButtonClick}>
          {cancelButtonText}
        </button>
        <button type="button" className="deleteSchedulerBtn" onClick={onDeleteButtonClick}>
          {deleteButtonText}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
