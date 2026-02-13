import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  OutlinedInput,
} from "@mui/material";
import { TickCircle, CloseCircle } from "iconsax-react";
import CloseIcon from "@mui/icons-material/Close";
import { UI_TEXTS } from "../../../components/common/Constants/label-contants";

const actionConfig = {
  approve: {
    icon: <TickCircle size={24} color="#1976d2" />,
    confirmText: "Approve",
    color: "primary",
    note: "",
  },
  reject: {
    icon: <CloseCircle size={24} color="#d32f2f" />,
    confirmText: "Reject",
    color: "error",
    note: "Please provide a rejection reason",
  },
};

export const ConfirmationModal = ({
  open,
  onClose,
  actionType,
  isBulkAction,
  count = 1,
  onConfirm,
  isLoading,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const config = actionConfig[actionType] || actionConfig.approve;

  const handleConfirm = () => {
    if (actionType === "reject" && !rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    onConfirm(actionType === "reject" ? rejectionReason : "");
  };

  const message = isBulkAction
    ? `Are you sure you want to ${config.confirmText.toLowerCase()} ${count} selected requests?`
    : `Are you sure you want to ${config.confirmText.toLowerCase()} this request?`;

  return (
    <Dialog
      open={open}
      onClose={!isLoading ? onClose : null}
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
          gap: 1,
        }}
      >
        <Typography
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontFamily: "Manrope",
            fontSize: "16px",
            fontWeight: 500,
            color: "black",
          }}
        >
          {config.icon}
          {UI_TEXTS.CONFIRM_TEXT.CONFIRM_ACTION || "Confirm Action"}
        </Typography>
        <IconButton onClick={onClose}>
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
          gap: 1.5,
        }}
      >
        <Typography sx={{ fontSize: "16px", textAlign: "center" }}>
          {message}
        </Typography>

        {config.note && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              color: actionType === "reject" ? "red" : "text.secondary",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            {config.note}
          </Typography>
        )}

        {actionType === "reject" && (
          <OutlinedInput
            autoFocus
            fullWidth
            placeholder="Rejection Reason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
            sx={{ mt: 2 }}
          />
        )}
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          padding: "20px !important",
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          disabled={isLoading}
          sx={{
            borderRadius: "18px",
            color: "grey",
            fontFamily: "Manrope",
            textTransform: "none",
          }}
        >
          {UI_TEXTS.BUTTONS.CANCEL}
        </Button>
        <Button
          onClick={handleConfirm}
          color={config.color}
          variant="contained"
          autoFocus
          sx={{
            borderRadius: "18px",
            fontFamily: "Manrope",
            textTransform: "none",
          }}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : config.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
