import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  IconButton,
  OutlinedInput,
  Button,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from "@mui/icons-material/Close";
import "../configuration/css/common.css";
import CustomMultiSelect from "../planning/CustomMultiSelect.component";
import { useDispatch, useSelector } from "react-redux";
import {
  getIAMGroups,
  handleApprovalFlowConfig,
} from "../../services/jobs/JobsService";
import {
  DummyiamGroups,
  MODULE_OPTIONS,
} from "../common/Constants/constantObjects";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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

const ApprovalFlowModal = ({
  isModalOpen,
  setIsModelOpen,
  isEditClicked,
  approvalFlowId,
  onSaveSuccess,
  approvalFlowsData,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(isModalOpen);
  const [selectedModule, setSelectedModule] = useState("");
  const [approvers, setApprovers] = useState("");
  const [loading, setLoading] = useState(false);
  const [disableStateText, setDisableStateText] = useState(false);

  const iamGroups = useSelector((state) => state?.jobs?.IAMGroups || []);
  const approvalConfig = useSelector(
    (state) => state.jobs.approvalConfig || []
  );
  console.log("approvalConfig", approvalConfig);

  useEffect(() => {
    setOpen(isModalOpen);
  }, [isModalOpen]);

  useEffect(() => {
    if (open) {
      dispatch(getIAMGroups()).catch((error) => {
        console.error("Failed to fetch IAM Groups:", error);
        toast.error(TOAST_MESSAGES.ERROR.FAILED_TO_LOAD_IAM_GROUP, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
        });
      });
    }
  }, [open, dispatch]);

  useEffect(() => {
    const loadFlowData = async () => {
      if (isEditClicked && approvalFlowId) {
        setLoading(true);
        try {
          // Find the approval flow configuration by ID
          const flowData = approvalConfig.find(
            (config) => config._id === approvalFlowId
          );

          if (flowData) {
            setSelectedModule(flowData.moduleType || "");
            setApprovers(flowData.approverGroup || "");
          } else {
            toast.error(TOAST_MESSAGES.ERROR.FAILED_TO_LOAD_APPROVAL_FLOW, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 3000,
            });
          }
          setLoading(false);
        } catch (error) {
          console.error("Error loading approval flow details:", error);
          toast.error(TOAST_MESSAGES.ERROR.FAILED_TO_LOAD_APPROVAL_FLOW, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
          });
          setLoading(false);
        }
      } else {
        // Reset form for creating new flow
        setSelectedModule("");
        setApprovers("");
      }
    };

    if (open) {
      loadFlowData();
    }
  }, [open, isEditClicked, approvalFlowId, approvalConfig]);

  useEffect(() => {
    if (approvers && selectedModule) {
      setDisableStateText(true);
    } else {
      setDisableStateText(false);
    }
  }, [approvers, selectedModule]);

  const handleClose = () => {
    setIsModelOpen(false);
    setOpen(false);
  };

  const handleSubmit = async () => {
    if (!selectedModule) {
      toast.error(TOAST_MESSAGES.ERROR.MODULE_IS_REQUIRED, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }
    if (!approvers) {
      toast.error(TOAST_MESSAGES.ERROR.APPROVER_GROUP_IS_REQUIRED, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    const flowData = {
      moduleType: selectedModule,
      approverGroup: approvers,
    };

    // If editing, include the _id
    if (isEditClicked && approvalFlowId) {
      flowData._id = approvalFlowId;
    }

    setLoading(true);
    try {
      // Dispatch the action to handle approval flow configuration
      await dispatch(handleApprovalFlowConfig(flowData));

      toast.success(
        isEditClicked
          ? TOAST_MESSAGES.ERROR.APPROVAL_FLOW_UPDATED_SUCCESSFULLY
          : TOAST_MESSAGES.ERROR.APPROVAL_FLOW_ADDED_SUCCESSFULLY,
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }
      );

      handleClose();
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error("Error saving approval flow:", error);
      toast.error(
        error.message || TOAST_MESSAGES.ERROR.FAILED_TO_SAVE_APPROVAL_FLOW,
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }
      );
    } finally {
      setLoading(false);
    }
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
              ? UI_TEXTS.TYPOGRAPHY.UPDATE_APPROVAL_FLOW
              : UI_TEXTS.BUTTONS.ADD_APPROVAL_FLOW}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" className="title">
              {UI_TEXTS.TYPOGRAPHY.MODULE}
              <span className="iabot_required">*</span>
            </Typography>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <Autocomplete
                options={(MODULE_OPTIONS ?? []).filter(
                  (option) =>
                    !(approvalFlowsData ?? []).some(
                      (flow) => flow.moduleType === option.value
                    )
                )}
                value={
                  (MODULE_OPTIONS ?? []).find(
                    (opt) => opt.value === selectedModule
                  ) ?? null
                }
                onChange={(_, newOption) =>
                  setSelectedModule(newOption?.value ?? "")
                }
                getOptionLabel={(option) => option?.label ?? ""}
                isOptionEqualToValue={(option, value) =>
                  option.value === value.value
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search or Select"
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                      "aria-label": "Without label",
                    }}
                  />
                )}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "30px" } }}
                ListboxProps={{
                  style: {
                    maxHeight:
                      MenuProps?.PaperProps?.style?.maxHeight !== undefined
                        ? MenuProps.PaperProps.style.maxHeight
                        : 360,
                    overflow: "auto",
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" className="title">
              {UI_TEXTS.LABELS.APPROVER_GROUP}
              <span className="iabot_required">*</span>
            </Typography>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <Autocomplete
                options={(iamGroups ?? []).map((g) => g.name)}
                value={
                  (iamGroups ?? [])
                    .map((g) => g.name)
                    .find((name) => name === (approvers ?? "")) ?? null
                }
                onChange={(_, newValue) => setApprovers(newValue ?? "")}
                getOptionLabel={(option) => option ?? ""}
                isOptionEqualToValue={(option, value) => option === value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search or Select"
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                      "aria-label": "Without label",
                    }}
                  />
                )}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "30px" } }}
                ListboxProps={{
                  style: {
                    maxHeight:
                      MenuProps?.PaperProps?.style?.maxHeight !== undefined
                        ? MenuProps.PaperProps.style.maxHeight
                        : 360,
                    overflow: "auto",
                  },
                }}
              />
            </FormControl>
          </Grid>
        </Grid>

        <div style={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            color="primary"
            sx={{ mt: 3, width: "100px" }}
            disabled={!disableStateText || loading}
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
      </Box>
    </Modal>
  );
};

export default ApprovalFlowModal;
