import React from "react";
import {
  Box,
  Typography,
  Modal,
  IconButton,
  OutlinedInput,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UI_TEXTS } from "../../common/Constants/label-contants";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
};

const GlobalModal = ({
  isOpen,
  onClose,
  title,
  fields = [],
  onSubmit,
  submitText = "Submit",
  children,
  loading,
  submitDisabled,
  "data-testid": dataTestId,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={modalStyle} data-testid={dataTestId}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" className="dialogue_title">
            {title}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        {fields.map((field) => (
          <div key={field.name}>
            <Typography variant="subtitle1" sx={{ mt: 2 }} className="title">
              {field.label}
              <span className="iabot_required">*</span>
            </Typography>
            {field.type === "textarea" ? (
              <OutlinedInput
                multiline
                fullWidth
                rows={3}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={field.placeholder}
                sx={{ mt: 1 }}
                className="model_input_field"
                error={field.error}
                inputProps={{
                  maxLength: field.maxLength,
                }}
              />
            ) : (
              <OutlinedInput
                fullWidth
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={field.placeholder}
                sx={{ mt: 1, mb: 2 }}
                className="model_input_field"
                error={field.error}
                inputProps={{
                  maxLength: field.maxLength,
                }}
              />
            )}
            {/* Error message display */}
            {field.error && (
              <Typography
                variant="caption"
                sx={{
                  color: "error.main",
                  display: "block",
                }}
              >
                {field.errorText || field.helperText || field.errorMessage}
              </Typography>
            )}
            {/* Helper text display (non-error) */}
            {!field.error && field.helperText && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  display: "block",
                }}
              >
                {field.helperText}
              </Typography>
            )}
          </div>
        ))}

        {children}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={onSubmit}
            color="primary"
            disabled={submitDisabled || loading}
            style={{ marginTop: "12px", marginBottom: "12px", width: "100px" }}
          >
            {submitText}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default GlobalModal;
