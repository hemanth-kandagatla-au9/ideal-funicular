import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import "./css/report.css";
import CloseIcon from "@mui/icons-material/Close";
import { UI_TEXTS } from "../../components/common/Constants/label-contants";

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  message = "Are you sure you want to delete this item?",
  confirmText = "Yes, Delete",
  loadingText,
  cancelText = "No, Cancel",
  color = "error",
  restoreNote = "",
  showRestoreNote = false,
  note = "This action cannot be undone",
}) => {
  const clickLock = React.useRef(false);
  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : null}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: "16px !important",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid #ddd !important",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4
          style={{
            margin: "0",
            color: "black",
            fontFamily: "Manrope",
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          {UI_TEXTS.CONFIRM_TEXT.CONFIRM_DELETION}
        </h4>
        <IconButton onClick={onClose} className="modal-close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "12px 60px 20px !important",
          fontFamily: "Manrope",
        }}
      >
        <Typography sx={{ fontFamily: "Manrope", fontSize: "16px" }}>
          {message}
        </Typography>

        {showRestoreNote && restoreNote && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              mt: 1,
              color: "#6b6b6bff",
              fontFamily: "Manrope",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            Note: {restoreNote}
          </Typography>
        )}

        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mt: 1, color: "red", fontFamily: "Manrope", fontSize: "12px" }}
        >
          {note}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "center", padding: "20px !important" }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: "18px",
            color: "grey",
            fontFamily: "Manrope",
            backgroundColor: "#f0f0f0",
            padding: "8px",
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={() => {
            if (clickLock.current) return;
            clickLock.current = true;
            onConfirm();

            setTimeout(() => {
              clickLock.current = false;
            }, 2000);
          }}
          color={color}
          variant="contained"
          autoFocus
          sx={{ borderRadius: "18px", fontFamily: "Manrope" }}
          disabled={loading}
        >
          {loading ? (loadingText ? loadingText : "Deleting...") : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
