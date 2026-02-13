import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  IconButton,
  OutlinedInput,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Select,
  InputAdornment,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import CodeIcon from "../../assets/images/webide.png";
import "../configuration/css/common.css";
import CommandEditorDialog from "../common/commonEditorDialogue";
import { useDispatch, useSelector } from "react-redux";
import { handleInternalJob } from "../../services/jobs/JobsService";
import TemplateModal from "../planning/CodeTemplateModel";
import { TemplateTooltip } from "../CustomTooltip/CustomTooltip";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  maxHeight: "81vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 3,
};

const decodeBase64 = (data) => {
  try {
    return atob(data);
  } catch (e) {
    console.error("Error decoding base64:", e);
    return data;
  }
};

const encodeBase64 = (text) => {
  try {
    return btoa(text);
  } catch (e) {
    console.error("Error encoding to base64:", e);
    return text;
  }
};

const InternalJobsModal = ({
  isModalOpen,
  setIsModelOpen,
  isEditClicked,
  internalJobId,
  onSaveSuccess,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(isModalOpen);
  const [jobName, setJobName] = useState("");
  const [jobNameError, setJobNameError] = useState("");
  const [searchIndex, setSearchIndex] = useState("");
  const [frequency, setFrequency] = useState(0);
  const [onStartup, setOnStartup] = useState(false);
  const [scriptData, setScriptData] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [searchIndexError, setSearchIndexError] = useState("");
  console.log("selectedTemplate", selectedTemplate);
  const internalData = useSelector((state) => state?.jobs?.internalJobs);
  console.log("internalData!!!", internalData);

  const handleScriptChange = (e) => {
    setScriptData(e.target.value);
  };

  useEffect(() => {
    setOpen(isModalOpen);
  }, [isModalOpen]);

  useEffect(() => {
    const loadJobData = async () => {
      if (isEditClicked && internalJobId) {
        setLoading(true);
        try {
          const jobData = internalData.find((job) => job._id === internalJobId);

          if (jobData) {
            setJobName(jobData.jobName || "");
            setSearchIndex(String(jobData.outputOpenSearchIndex || ""));
            setFrequency(jobData.frequency || 0);
            setOnStartup(!!jobData.onStartup);
            setScriptData(decodeBase64(jobData.scriptData) || "");
            if (jobData.codeTemplate) {
              setSelectedTemplate(jobData.codeTemplate);
              setScriptData(decodeBase64(jobData.scriptData) || "");
              setInputType("marketplace");
            } else {
              setScriptData(decodeBase64(jobData.scriptData) || "");
              setInputType("manual");
            }

            setIsActive(jobData.isActive !== false);
          } else {
            toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_LOAD_JOB, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 3000,
            });
          }
        } catch (error) {
          console.error("Error loading job details:", error);
          toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_LOAD_JOB_DETAILS, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
        } finally {
          setLoading(false);
        }
      } else {
        setJobName("");
        setJobNameError("");
        setSearchIndex("");
        setSearchIndexError("");
        setFrequency(0);
        setOnStartup(false);
        setScriptData("");
        setInputType(null);
        setSelectedTemplate(null);
      }
    };

    if (open) {
      loadJobData();
    }
  }, [open, isEditClicked, internalData, internalJobId, dispatch]);

  const checkDuplicateJobName = (name) => {
    return internalData?.some(
      (job) =>
        job.jobName?.toString().trim().toLowerCase() ===
          name.trim().toLowerCase() &&
        (!isEditClicked || job._id !== internalJobId)
    );
  };

  const handleJobNameChange = (value) => {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      setJobNameError("");
    } else if (/[^a-zA-Z0-9\s-]/.test(normalizedValue)) {
      setJobNameError("Special characters are not allowed except hyphen (-)");
    } else {
      setJobNameError("");
    }

    setJobName(value);
  };

  const handleJobNameBlur = (value) => {
    const normalizedValue = value.trim();
    if (
      normalizedValue &&
      (normalizedValue.length < 5 || normalizedValue.length > 100)
    ) {
      setJobNameError("Job name must be between 5 and 100 characters");
    } else if (normalizedValue && checkDuplicateJobName(normalizedValue)) {
      setJobNameError("A job with this name already exists");
    } else if (!normalizedValue) {
      setJobNameError("Job name is required");
    }
  };

  // ADDED: Search index validation functions
  const handleSearchIndexChange = (value) => {
    const stringValue = String(value);
    setSearchIndex(stringValue);
    setSearchIndexError("");
  };

  const handleSearchIndexBlur = (value) => {
    const trimmedValue = String(value).trim();

    if (!trimmedValue) {
      setSearchIndexError("Search index is required");
      return;
    }

    // Check length (5-100 characters)
    if (trimmedValue.length < 5 || trimmedValue.length > 100) {
      setSearchIndexError("Search index must be between 5 and 100 characters");
      return;
    }

    // Check alphanumeric with hyphens and underscores
    const alphanumericRegex = /^[a-z0-9_-]+$/;
    if (!alphanumericRegex.test(trimmedValue)) {
      setSearchIndexError(
        "Only lowercase alphanumeric characters, -, and _ are allowed"
      );
      return;
    }

    // Check start/end characters
    if (
      trimmedValue.startsWith("_") ||
      trimmedValue.startsWith("-") ||
      trimmedValue.endsWith("_") ||
      trimmedValue.endsWith("-")
    ) {
      setSearchIndexError("Cannot start or end with underscore or hyphen");
      return;
    }
  };

  const isSearchIndexValid = () => {
    const trimmedSearchIndex = String(searchIndex).trim();

    // Check if empty
    if (!trimmedSearchIndex) return false;

    // Check length (5-100 characters)
    if (trimmedSearchIndex.length < 5 || trimmedSearchIndex.length > 100)
      return false;

    // Alphanumeric validation
    const alphanumericRegex = /^[a-z0-9_-]+$/;
    if (!alphanumericRegex.test(trimmedSearchIndex)) return false;

    // Additional constraints
    if (
      trimmedSearchIndex.startsWith("_") ||
      trimmedSearchIndex.startsWith("-") ||
      trimmedSearchIndex.endsWith("_") ||
      trimmedSearchIndex.endsWith("-")
    ) {
      return false;
    }

    return true;
  };

  const handleClose = () => {
    setIsModelOpen(false);
    setOpen(false);
    setInputType(null);
    setSelectedTemplate(null);
    setJobNameError("");
    setSearchIndexError("");
  };

  const handleEditorOpen = () => {
    setShowEditor(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setScriptData(template.commandScripts || template.scriptContent || "");
    setShowTemplateModal(false);
  };

  const handleTemplateReset = () => {
    setSelectedTemplate(null);
    setScriptData("");
    setInputType(null);
  };

  const handleSubmit = async () => {
    const trimmedJobName = jobName.trim();
    const trimmedSearchIndex = String(searchIndex).trim();
    handleJobNameBlur(trimmedJobName);

    if (trimmedJobName && /[^a-zA-Z0-9\s-]/.test(trimmedJobName)) {
      setJobNameError("Special characters are not allowed except hyphen (-)");
    }

    if (trimmedJobName && checkDuplicateJobName(trimmedJobName)) {
      setJobNameError("A job with this name already exists");
    }

    if (jobNameError) {
      toast.error(jobNameError, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    if (!trimmedJobName) {
      toast.error(TOAST_MESSAGES.OTHERS.JOB_NAME_IS_REQUIRED, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    if (!trimmedSearchIndex) {
      toast.error(TOAST_MESSAGES.OTHERS.SEARCH_INDEX_IS_REQUIRED, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    // Check search index length
    if (trimmedSearchIndex.length < 5 || trimmedSearchIndex.length > 100) {
      toast.error("Search index must be between 5 and 100 characters", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    // Check alphanumeric validation
    const alphanumericRegex = /^[a-z0-9_-]+$/;
    if (!alphanumericRegex.test(trimmedSearchIndex)) {
      toast.error(
        "Search index must contain only lowercase letters, numbers, hyphens, and underscores",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }
      );
      return;
    }

    // Check start/end characters
    if (
      trimmedSearchIndex.startsWith("_") ||
      trimmedSearchIndex.startsWith("-") ||
      trimmedSearchIndex.endsWith("_") ||
      trimmedSearchIndex.endsWith("-")
    ) {
      toast.error(
        "Search index cannot start or end with underscore or hyphen",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }
      );
      return;
    }

    if (!scriptData.trim()) {
      toast.error(TOAST_MESSAGES.OTHERS.SCRIPT_DATA_IS_REQUIRED, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    const jobData = {
      jobName: trimmedJobName,
      outputOpenSearchIndex: trimmedSearchIndex,
      frequency: Number(frequency),
      onStartup,
      isActive,
      scriptData: encodeBase64(scriptData.trim()),
      codeTemplate: selectedTemplate,
    };

    if (isEditClicked) {
      jobData.internalJobId = internalJobId;
    }

    setLoading(true);
    try {
      const response = await dispatch(handleInternalJob(jobData));

      if (response && response.success) {
        toast.success(
          isEditClicked
            ? TOAST_MESSAGES.OTHERS.INTERNAL_JOB_UPDATED_SUCCESSFULLY
            : TOAST_MESSAGES.OTHERS.INTERNAL_JOB_ADDED_SUCCESSFULLY,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }
        );
        handleClose();
        if (onSaveSuccess) {
          onSaveSuccess();
        }
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error(
        error.message || TOAST_MESSAGES.OTHERS.FAILED_TO_SAVE_INTERNAL_JOB,
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTemplate) {
      console.log("Template updated:", selectedTemplate);
    }
  }, [selectedTemplate]);

  const isJobNameValid = () => {
    const trimmedJobName = jobName.trim();
    const hasValidLength =
      trimmedJobName.length >= 5 && trimmedJobName.length <= 100;
    const hasValidCharacters = !/[^a-zA-Z0-9\s-]/.test(trimmedJobName);
    const isNotEmpty = trimmedJobName.length > 0;
    const isNotDuplicate = !checkDuplicateJobName(trimmedJobName);
    const noError = !jobNameError;

    return (
      hasValidLength &&
      hasValidCharacters &&
      isNotEmpty &&
      isNotDuplicate &&
      noError
    );
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
              ? UI_TEXTS.TYPOGRAPHY.UPDATE_INTERNAL_JOB
              : UI_TEXTS.BUTTONS.ADD_INTERNAL_JOB}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <>
          <Typography variant="subtitle1" sx={{ mt: 1 }} className="title">
            {UI_TEXTS.LABELS.JOB_NAME}
            <span className="iabot_required">*</span>
          </Typography>
          <OutlinedInput
            fullWidth
            value={jobName}
            onChange={(e) => handleJobNameChange(e.target.value)}
            onBlur={(e) => handleJobNameBlur(e.target.value)}
            placeholder="Enter Job Name"
            sx={{ mt: 1, mb: 0.5 }}
            className="model_input_field"
            disabled={isEditClicked}
            error={!!jobNameError}
          />
          {jobNameError && (
            <Typography
              variant="caption"
              sx={{
                color: "error.main",
                display: "block",
                mb: 2,
                mt: 0.5,
              }}
            >
              {jobNameError}
            </Typography>
          )}

          <Typography variant="subtitle1" sx={{ mt: 1 }} className="title">
            {UI_TEXTS.LABELS.LOG_INDEX}
            <span className="iabot_required">*</span>
          </Typography>
          <OutlinedInput
            fullWidth
            value={searchIndex}
            onChange={(e) => handleSearchIndexChange(e.target.value)} // FIXED: Use validation function
            onBlur={(e) => handleSearchIndexBlur(e.target.value)} // ADDED: Blur validation
            placeholder="Enter Search Index (5-100 characters, alphanumeric)"
            sx={{ mt: 1, mb: 0.5 }}
            className="model_input_field"
            disabled={isEditClicked}
            error={!!searchIndexError}
            inputProps={{
              maxLength: 100,
              onInput: (e) => {
                e.target.value = e.target.value.toLowerCase();
              },
            }}
          />
          {searchIndexError && (
            <Typography
              variant="caption"
              sx={{
                color: "error.main",
                display: "block",
                mb: 2,
                mt: 0.5,
              }}
            >
              {searchIndexError}
            </Typography>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" className="title">
                {UI_TEXTS.LABELS.FREQUENCY_SECOUNDS}
                <span className="iabot_required">*</span>
              </Typography>
              <OutlinedInput
                fullWidth
                type="number"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_FREQUENCY_IN_SECONDS}
                inputProps={{
                  min: 0,
                  onKeyDown: (e) => {
                    if (
                      e.key === "e" ||
                      e.key === "E" ||
                      e.key === "-" ||
                      e.key === "+"
                    ) {
                      e.preventDefault(); // block exponential and sign input
                    }
                  },
                }}
                sx={{ mt: 1 }}
                className="model_input_field"
              />
            </Grid>
            <Grid item xs={6} sx={{ display: "flex", alignItems: "center" }}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={onStartup}
                      onChange={(e) => setOnStartup(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Run at Startup"
                  sx={{ mt: 2 }}
                />
              </FormGroup>
            </Grid>
          </Grid>

          <Typography variant="subtitle1" sx={{ mt: 1 }} className="title">
            {UI_TEXTS.LABELS.SCRIPT_DATA}
            <span className="iabot_required">*</span>
          </Typography>

          {!inputType ? (
            <Select
              value=""
              onChange={(e) => {
                const value = e.target.value;
                setInputType(value);
                if (value === "marketplace") {
                  setShowTemplateModal(true);
                }
              }}
              displayEmpty
              fullWidth
              // size="small"
              sx={{ mt: 1, borderRadius: "30px" }}
            >
              <MenuItem value="" disabled>
                {UI_TEXTS.SELECT_TEXT.SELECT_INPUT_METHOD}
              </MenuItem>
              {/***DON'T REMOVE  */}
              {/* <MenuItem value="manual">{UI_TEXTS.SELECT_TEXT.MANUAL_INPUT}</MenuItem> */}
              <MenuItem value="marketplace">
                {UI_TEXTS.SELECT_TEXT.CHOOSE_FROM_MARKET_PLACE}
              </MenuItem>
            </Select>
          ) : inputType === "manual" ? (
            <div style={{ position: "relative", width: "100%" }}>
              <OutlinedInput
                multiline
                fullWidth
                rows={2}
                value={scriptData}
                onChange={handleScriptChange}
                placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_YOUR_SCRIPT_HERE}
                sx={{ mt: 1, pr: 5, maxHeight: "120px" }}
                className="model_input_field"
                endAdornment={
                  <InputAdornment position="end">
                    <img
                      src={CodeIcon}
                      alt="Open Code Editor"
                      style={{
                        cursor: "pointer",
                        width: 24,
                        marginRight: "8px",
                      }}
                      onClick={handleEditorOpen}
                      title={UI_TEXTS.LABELS.OPEN_CODE_EDITOR}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        setScriptData("");
                        setInputType(null);
                      }}
                      edge="end"
                      sx={{
                        padding: "4px",
                        color: "rgba(0, 0, 0, 0.54)",
                        marginRight: "-8px",
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </div>
          ) : inputType === "marketplace" ? (
            <div style={{ position: "relative", width: "100%" }}>
              {selectedTemplate ? (
                <TemplateTooltip template={selectedTemplate}>
                  <OutlinedInput
                    multiline
                    fullWidth
                    rows={1}
                    value={selectedTemplate.templateName || ""}
                    placeholder={UI_TEXTS.PLACEHOLDERS.SCRIPT_FROM_TEMPLATE}
                    sx={{ mt: 1, pr: 5, maxHeight: "120px" }}
                    className="model_input_field"
                    readOnly
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={handleTemplateReset}
                          edge="end"
                          sx={{
                            padding: "4px",
                            color: "rgba(0, 0, 0, 0.54)",
                            marginRight: "-8px",
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </TemplateTooltip>
              ) : (
                <Button
                  variant="outlined"
                  onClick={() => setShowTemplateModal(true)}
                  fullWidth
                  sx={{ mt: 1, borderRadius: "30px" }}
                >
                  {UI_TEXTS.SELECT_TEXT.SELECT_FROM_MARKETPLACE}
                </Button>
              )}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            <Button
              variant="contained"
              onClick={handleSubmit}
              color="primary"
              sx={{ width: "100px" }}
              disabled={
                loading ||
                !isJobNameValid() ||
                !isSearchIndexValid() ||
                !frequency ||
                !scriptData.trim()
              }
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
        </>

        {showEditor && (
          <CommandEditorDialog
            open={showEditor}
            onClose={handleEditorClose}
            command={scriptData}
            setCommand={setScriptData}
            viewOnly={false}
            title="Script Editor"
          />
        )}

        <TemplateModal
          open={showTemplateModal}
          onClose={() => {
            setShowTemplateModal(false);
          }}
          handleReset={handleTemplateReset}
          onSelect={handleTemplateSelect}
          onSelectTemplate={handleTemplateSelect}
          filterWithoutArguments={true}
        />
      </Box>
    </Modal>
  );
};

export default InternalJobsModal;
