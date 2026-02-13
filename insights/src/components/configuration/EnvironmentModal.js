import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  FormControl,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { UI_TEXTS } from "../common/Constants/label-contants";

const EnvironmentModal = ({ open, onClose, onUpdate, selectedCount = 0 }) => {
  const [environment, setEnvironment] = useState("dev");

  const handleEnvironmentChange = (event) => {
    setEnvironment(event.target.value);
  };

  const handleUpdate = () => {
    onUpdate({ type: "ENV_CHANGE", env: environment });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="environment-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography id="environment-modal-title" variant="h6" component="h2">
            {UI_TEXTS.TYPOGRAPHY.CHANGE_ENVIRONMENT}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="body1" sx={{ mb: 3 }}>
          {selectedCount > 0
            ? `Change environment for ${selectedCount} selected servers`
            : UI_TEXTS.TYPOGRAPHY.NO_SERVERS_SELECTED}
        </Typography>

        <FormControl fullWidth sx={{ mb: 4 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {UI_TEXTS.TYPOGRAPHY.SELECT_ENVIRONMENT}
          </Typography>
          <Select
            value={environment}
            onChange={handleEnvironmentChange}
            displayEmpty
            sx={{ height: "40px" }}
          >
            <MenuItem value="predev">{UI_TEXTS.MENU_ITEMS.PREDEV}</MenuItem>
            <MenuItem value="dev">{UI_TEXTS.MENU_ITEMS.DEV}</MenuItem>
            <MenuItem value="preqa">{UI_TEXTS.MENU_ITEMS.PREQA}</MenuItem>
            <MenuItem value="qa">{UI_TEXTS.MENU_ITEMS.QA}</MenuItem>
            <MenuItem value="prod">{UI_TEXTS.MENU_ITEMS.PROD}</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ minWidth: "100px" }}
          >
            {UI_TEXTS.BUTTONS.CANCEL}
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={selectedCount === 0}
            sx={{ minWidth: "100px" }}
          >
            {UI_TEXTS.BUTTONS.UPDATE}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EnvironmentModal;
