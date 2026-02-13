import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  OutlinedInput,
  Tooltip,
} from "@mui/material";
import { Edit, Key } from "iconsax-react";
import InfoIcon from "@mui/icons-material/Info";
import { useState, useEffect } from "react";
import "../../layouts/Marketplace/marketplace.css";

const VariableInputModal = ({
  open,
  onClose,
  variableParameters,
  onSave,
  templateName,
  enableArguments,
}) => {
  const [inputValues, setInputValues] = useState({});
  const [argumentsValue, setArgumentsValue] = useState("");
  console.log("inputValues", inputValues);
  console.log("enableArguments", enableArguments);
  useEffect(() => {
    if (open && variableParameters) {
      // Initialize input values with empty strings or existing values
      const initialValues = {};
      Object.keys(variableParameters).forEach((key) => {
        initialValues[key] = variableParameters[key] || "";
      });
      setInputValues(initialValues);
      setArgumentsValue(""); // Reset arguments when modal opens
    }
  }, [open, variableParameters]);

  const handleInputChange = (key, value) => {
    setInputValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleArgumentsChange = (value) => {
    setArgumentsValue(value);
  };
  const isSaveDisabled = () => {
    const hasParameters =
      variableParameters && Object.keys(variableParameters).length > 0;
    if (hasParameters && !enableArguments) {
      const allInputsFilled = Object.keys(inputValues).every(
        (key) => inputValues[key] && inputValues[key].toString().trim() !== ""
      );
      return !allInputsFilled;
    }
    if (!hasParameters && enableArguments) {
      return !argumentsValue || argumentsValue.trim() === "";
    }
    if (hasParameters && enableArguments) {
      const allInputsFilled = Object.keys(inputValues).every(
        (key) => inputValues[key] && inputValues[key].toString().trim() !== ""
      );
      const argumentsFilled = argumentsValue && argumentsValue.trim() !== "";
      return !allInputsFilled || !argumentsFilled;
    }
    if (!hasParameters && !enableArguments) {
      return false;
    }
    return true;
  };

  const handleSave = () => {
    // Combine input values with arguments if enableArguments is true
    const saveData = enableArguments
      ? { ...inputValues, arguments: argumentsValue }
      : inputValues;

    onSave(saveData);
    onClose();
  };

  const handleClose = () => {
    setInputValues({});
    setArgumentsValue("");
    onClose();
  };

  const hasParameters =
    variableParameters && Object.keys(variableParameters).length > 0;

  console.log("variableParameters", variableParameters);
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      {hasParameters && (
        <DialogTitle>
          <Typography
            variant="h6"
            component="div"
            className="input_modal_title"
          >
            Input Variable Mapping:{" "}
            <span className="input-temp_title"> {templateName}</span>
          </Typography>
          <Typography variant="body2" className="input_info">
            Please provide values for the following Input Variable:
          </Typography>
        </DialogTitle>
      )}
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {hasParameters &&
            Object.keys(variableParameters).map((key, index) => (
              <Grid
                container
                spacing={2}
                key={key}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Grid item xs={4}>
                  <OutlinedInput
                    fullWidth
                    value={key.replace("$", "")}
                    disabled
                    placeholder="Field Name"
                    sx={{
                      borderRadius: "16px",
                      background: "none",
                      height: "40px",
                      "& .MuiOutlinedInput-input": {
                        padding: "8px 14px",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                      },
                      "& .MuiOutlinedInput-input.Mui-disabled": {
                        WebkitTextFillColor: "text.primary",
                        backgroundColor: "grey.50",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "divider",
                      },
                    }}
                  />
                  {variableParameters[key]?.defaultField && (
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ mt: 0.5, ml: 1 }}
                    >
                      Default: {variableParameters[key].defaultField}
                    </Typography>
                  )}
                </Grid>

                {/* Value - Editable OutlinedInput */}
                <Grid item xs={8}>
                  <OutlinedInput
                    fullWidth
                    placeholder={`Enter value for ${key.replace("$", "")}`}
                    value={inputValues[key] || ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    sx={{
                      borderRadius: "16px",
                      background: "none",
                      height: "40px",
                      "& .MuiOutlinedInput-input": {
                        padding: "8px 14px",
                        fontSize: "0.875rem",
                      },
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            ))}

          {enableArguments && (
            <>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Typography className="input_modal_title">
                    Command Script Arguments
                  </Typography>
                  <Tooltip
                    title="Enter the arguments that will be passed to your command script during execution. Separate multiple arguments with spaces."
                    arrow
                    placement="top"
                  >
                    <InfoIcon
                      sx={{
                        fontSize: "1.1rem",
                        color: "#2961f4",
                        cursor: "pointer",
                        "&:hover": { color: "primary.main" },
                      }}
                    />
                  </Tooltip>
                </Box>

                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item xs={8}>
                    <OutlinedInput
                      fullWidth
                      placeholder="Command Script Arguments"
                      value={argumentsValue}
                      onChange={(e) => handleArgumentsChange(e.target.value)}
                      sx={{
                        borderRadius: "16px",
                        background: "none",
                        height: "40px",
                        marginTop: "7px",
                        "& .MuiOutlinedInput-input": {
                          padding: "8px 14px",
                          fontSize: "0.875rem",
                        },
                        "& .MuiOutlinedInput-root": {
                          "&:hover fieldset": {
                            borderColor: "primary.main",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "primary.main",
                            borderWidth: 2,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined" className="config_btn">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          className="config_btn"
          disabled={isSaveDisabled()}
        >
          Save Values
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VariableInputModal;
