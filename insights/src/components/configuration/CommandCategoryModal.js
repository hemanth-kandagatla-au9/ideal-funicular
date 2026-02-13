import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  IconButton,
  OutlinedInput,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import CodeIcon from "../../assets/images/webide.png";
import "../configuration/css/common.css";
import CommandEditorDialog from "../common/commonEditorDialogue";
import {
  addCommandCategory,
  getCommandCategoryById,
} from "../../services/configurations/configService";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

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

const CommandCategoryModal = ({
  isModalOpen,
  setIsModelOpen,
  isEditClicked,
  commandCategoryId,
}) => {
  const [open, setOpen] = useState(isModalOpen);
  const [category, setCategory] = useState("");
  const [command, setCommand] = useState("");
  const [subShell, setSubShell] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const handleCommandChange = (e) => {
    setCommand(e.target.value); // Store as an object
  };

  useEffect(() => {
    setOpen(isModalOpen);
  }, [isModalOpen]);

  useEffect(() => {
    const trimmedCategory = category.trim();
    const hasValidCategory = trimmedCategory.length > 0 && trimmedCategory.length <= 100;

    if (hasValidCategory && subShell) {
      setBtnDisable(true);
    } else {
      setBtnDisable(false);
    }
  }, [subShell, category]);

  useEffect(() => {
    if (isModalOpen) {
      setCategory("");
      setCommand("");
      setSubShell("");
      setCategoryError("");

      if (isEditClicked && commandCategoryId) {
        getCommandCategoryById(commandCategoryId).then((response) => {
          setCategory(response?.data?.data?.commandCategory || "");
          setCommand(response?.data?.data?.commandCategoryScripts || "");
          setSubShell(response?.data?.data?.commandCategorySubShell || "");
        });
      }
    }
  }, [isModalOpen, commandCategoryId, isEditClicked]);

  const handleCategoryChange = (value) => {
    const normalizedValue = value.trim();
    if (!normalizedValue) {
      setCategoryError("");
    } else if (normalizedValue.length > 100) {
      setCategoryError("Category name must be 100 characters or less");
    } else {
      setCategoryError("");
    }

    setCategory(value);
  };

  const handleCategoryBlur = (value) => {
    const normalizedValue = value.trim();
    if (normalizedValue.length > 100) {
      setCategoryError("Category name must be 100 characters or less");
    } else if (!normalizedValue) {
      setCategoryError("Category name is required");
    }
  };

  const toastMsg = isEditClicked
    ? TOAST_MESSAGES.OTHERS.COMMAND_CATEGORY_UPDATED_SUCCESSFULLY
    : TOAST_MESSAGES.OTHERS.COMMAND_CATEGORY_ADDED_SUCCESSFULLY;

  const handleClose = () => {
    setIsModelOpen(false);
    setOpen(false);
    setCategoryError("");
  };

  const handleEditorOpen = () => {
    setShowEditor(true);
  };

  const handleCommandCategory = () => {
    const trimmedCategory = category.trim();
    handleCategoryBlur(trimmedCategory);
    
    if (trimmedCategory.length > 100) {
      setCategoryError("Category name must be 100 characters or less");
    }

    if (categoryError) {
      toast.error(categoryError, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    if (!trimmedCategory) {
      toast.error("Category name is required", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }
    setLoading(true);
    const commandCategoryPayload = {
      commandCategory: trimmedCategory,
      commandCategoryScripts: command,
      commandCategorySubShell: subShell,
    };

    const editCommandCategory = {
      commandCategoryId,
      ...commandCategoryPayload,
    };

    const data = isEditClicked ? editCommandCategory : commandCategoryPayload;

    addCommandCategory(data)
      .then((response) => {
        console.log("API Response:", response);
        if (response?.status === 200 && response?.data?.success === true) {
          toast.success(
            response?.data?.message === "Command Category Added Successfully"
              ? isEditClicked
                ? TOAST_MESSAGES.OTHERS.COMMAND_CATEGORY_UPDATED_SUCCESSFULLY
                : TOAST_MESSAGES.OTHERS.COMMAND_CATEGORY_ADDED_SUCCESSFULLY
              : response?.data?.message,
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            }
          );
          setIsModelOpen(false);
          setCategory("");
          setCommand("");
          setSubShell("");
          setCategoryError("");
        } else {
          toast.error(
            response?.data?.message ||
              TOAST_MESSAGES.OTHERS.FAILED_TO_ADD_COMMAND_CATEGORY,
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            }
          );
        }
      })

      .catch((error) => {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          TOAST_MESSAGES.OTHERS.FAILED_TO_ADD_COMMAND_CATEGORY;

        toast.error(errorMessage, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" className="dialogue_title">
            {isEditClicked
              ? UI_TEXTS.TYPOGRAPHY.UPDATE_COMMAND_CATEGORY
              : UI_TEXTS.BUTTONS.ADD_COMMAND_CATEGORY}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <Typography variant="subtitle1" sx={{ mt: 2 }} className="title">
          {UI_TEXTS.BUTTONS.COMMAND_CATEGORY}
          <span className="iabot_required">*</span>
        </Typography>
        <OutlinedInput
          fullWidth
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          onBlur={(e) => handleCategoryBlur(e.target.value)}
          placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_CATEGORY_NAME}
          sx={{ mt: 1, mb: 0.5 }}
          className="model_input_field"
          error={!!categoryError}
        />
        {categoryError && (
          <Typography
            variant="caption"
            sx={{
              color: "error.main",
              display: "block",
              mb: 2,
              mt: 0.5,
            }}
          >
            {categoryError}
          </Typography>
        )}

        <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mt: 1 }} className="title">
            {UI_TEXTS.TYPOGRAPHY.SUB_SHELL}
            <span className="iabot_required">*</span>
          </Typography>
          <Select
            labelId="subshell-label"
            id="subshell-select"
            value={subShell}
            onChange={(e) => setSubShell(e.target.value)}
            displayEmpty
            className="model_input_field"
            sx={{
              "& .MuiSelect-select": {
                color: subShell === "" ? "#999" : "inherit",
              },
            }}
            renderValue={(selected) => {
              if (selected === "") {
                return (
                  <span style={{ color: "#999" }}>
                    {UI_TEXTS.PLACEHOLDERS.SELECT_SUB_SHELL}
                  </span>
                );
              }
              return selected;
            }}
          >
            <MenuItem value="">
              <span style={{ color: "#999" }}>
                {UI_TEXTS.PLACEHOLDERS.SELECT_SUB_SHELL}
              </span>
            </MenuItem>
            <MenuItem value="bash">bash</MenuItem>
            <MenuItem value="python">python</MenuItem>
            <MenuItem value="sqlplus">sqlplus</MenuItem>
            <MenuItem value="powershell">powershell</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="subtitle1" className="title">
          {UI_TEXTS.TEXTS.COMMAND_SCRIPTS}
          <span className="iabot_required"></span>
        </Typography>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <OutlinedInput
            disabled={viewOnly}
            multiline
            fullWidth
            rows={3}
            value={command || ""}
            onChange={handleCommandChange}
            placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_COMMAND}
            sx={{ mt: 1, pr: 5 }}
            className="model_input_field"
          />
          <img
            src={CodeIcon}
            alt="code editor"
            style={{
              position: "absolute",
              right: 10,
              top: "30%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              width: 24,
            }}
            onClick={handleEditorOpen}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleCommandCategory}
            // disabled={viewOnly}
            color="primary"
            style={{ marginTop: "12px", marginBottom: "12px", width: "100px" }}
            disabled={!btnDisable || loading}
          >
            {loading
              ? isEditClicked
                ? UI_TEXTS.BUTTONS.UPDATING_THREE_DOTS
                : UI_TEXTS.BUTTONS.ADDING_THREE_DOTS
              : isEditClicked
              ? UI_TEXTS.BUTTONS.UPDATE
              : UI_TEXTS.BUTTONS.ADD}
          </Button>
        </div>
        {showEditor && (
          <CommandEditorDialog
            open={showEditor}
            onClose={() => setShowEditor(false)}
            command={command}
            setCommand={setCommand}
            viewOnly={false}
          />
        )}
      </Box>
    </Modal>
  );
};

export default CommandCategoryModal;
