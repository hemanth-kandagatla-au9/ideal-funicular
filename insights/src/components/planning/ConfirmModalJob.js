import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Divider,
} from "@mui/material";
import { InfoCircle } from "iconsax-react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UI_TEXTS } from "../common/Constants/label-contants";

const getUsernameFromCookie = () => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("username="))
    ?.split("=")[1];

  return cookieValue ? decodeURIComponent(cookieValue) : "user";
};

const ConfirmationModal = ({
  open,
  message = UI_TEXTS.MESSAGES.ARE_YOU_SURE_YOU_WANT_TO_RUN_THIS_JOB,
  note = `Note : Job will be executed with your username '${getUsernameFromCookie()}'`,
  onClose,
  onConfirm,
  isLoading,
  selectedJob,
  confirmText = UI_TEXTS.CONFIRM_TEXT.CONFIRM,
  cancelText = UI_TEXTS.BUTTONS.CANCEL,
}) => {

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",

        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 0,
            pt: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <InfoCircle size={24} color="#1976d2" variant="Bold" />
            <Typography variant="h6" component="span" fontWeight={600} sx={{ fontFamily: "Manrope" }}>
              {message}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ mb: 2 }} />

        <DialogContent sx={{ p: 0.5 }} >

          {note && selectedJob?.runAsCurrentUser &&(
            <Box sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              mb: 2,
              padding: "10px 0px 15px 0px"
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ padding: "5px" }}>
                {note}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 0, pb: 0 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={isLoading}
            sx={{
              minWidth: 100,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            color="primary"
            variant="contained"
            disabled={isLoading}
            sx={{
              minWidth: 100,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              }
            }}
          >
            {isLoading ? UI_TEXTS.LOADING.PROCESSING : confirmText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ConfirmationModal;