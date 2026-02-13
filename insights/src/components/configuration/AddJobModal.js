import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Grid,
  Typography,
  OutlinedInput,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: "16px",
  boxShadow: 24,
  p: 3,
};

const AddJobModal = ({
  open,
  onClose,
  jobForm,
  setJobForm,
  onSave,
  cmdbConfiguredOptions,
}) => {
  const handleChange = (field) => (e) => {
    setJobForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };
  const [jobNameError, setJobNameError] = useState("");
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const MAX_JOB_NAME_LENGTH = 50;

  useEffect(() => {
    const isInvalid =
      !jobForm.jobName?.trim() || Boolean(jobNameError) || !jobForm.sourceTable;

    setIsSaveDisabled(isInvalid);
  }, [jobForm.jobName, jobForm.sourceTable, jobNameError]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={2}>
          Add Job
        </Typography>

        <Grid container spacing={2}>
          {/* Job Name */}
          <Grid item xs={12}>
            <label className="market_place_title_ele">
              Job Name <span className="iabot_required">*</span>
            </label>
            <OutlinedInput
              fullWidth
              placeholder="Enter job name"
              value={jobForm.jobName}
              onChange={(e) => {
                if (e.target.value.length > MAX_JOB_NAME_LENGTH) {
                  setJobNameError("Maximum 50 characters allowed.");
                  return;
                }

                setJobNameError("");
                handleChange("jobName")(e);
              }}
              sx={{ borderRadius: "16px", mt: 1 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  textAlign: "right",
                  mt: 0.5,
                  color:
                    jobForm.jobName.length === MAX_JOB_NAME_LENGTH
                      ? "error.main"
                      : "text.secondary",
                }}
              >
                {jobForm.jobName.length} / {MAX_JOB_NAME_LENGTH}
              </Typography>

              {jobNameError && (
                <Typography variant="caption" sx={{ color: "error.main" }}>
                  {jobNameError}
                </Typography>
              )}
            </div>
          </Grid>

          {/* Source Table */}
          <Grid item xs={12}>
            <label className="market_place_title_ele">
              Source Table <span className="iabot_required">*</span>
            </label>
            <Select
              fullWidth
              value={jobForm.sourceTable}
              onChange={handleChange("sourceTable")}
              displayEmpty
              sx={{ borderRadius: "16px", mt: 1 }}
            >
              <MenuItem value="" disabled>
                Select source table
              </MenuItem>
              {cmdbConfiguredOptions.map((item) => (
                <MenuItem key={item.id} value={item.value}>
                  {item.value}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          {/* Template Name */}
          {/* <Grid item xs={12}>
            <label className="market_place_title_ele">
              Template Name <span className="iabot_required">*</span>
            </label>
            <Select
              fullWidth
              value={jobForm.templateName}
              onChange={handleChange("templateName")}
              displayEmpty
              sx={{ borderRadius: "16px", mt: 1 }}
            >
              <MenuItem value="" disabled>
                Select template
              </MenuItem>
              <MenuItem value="templateA">Template A</MenuItem>
              <MenuItem value="templateB">Template B</MenuItem>
              <MenuItem value="templateC">Template C</MenuItem>
            </Select>
          </Grid> */}

          {/* Actions */}
          <Grid item xs={12} textAlign="right" mt={2}>
            <Button
              variant="outlined"
              onClick={() => {
                setJobForm({
                  jobName: "",
                  sourceTable: "",
                  templateName: "",
                });
                onClose();
              }}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onSave}
              disabled={isSaveDisabled}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddJobModal;
