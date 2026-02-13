import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  OutlinedInput,
  Select,
  MenuItem,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  FormControlLabel,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import MultiSelectWithCreateOption from "../../components/planning/MultiSelectWithCreate";
import CodeIcon from "../../assets/images/webide.png";
import CommandEditorDialog from "../../components/common/commonEditorDialogue";
import {
  AddTemplateDetails,
  EditTemplate,
  getTemplateDetails,
} from "../../store/TemplateSlice/templateSlice";
import {
  getCommandCategory,
  getCmdbConfiguration,
} from "../../services/jobs/JobsService";
import { toast } from "react-toastify";
import {
  UI_TEXTS,
  TOAST_MESSAGES,
} from "../../components/common/Constants/label-contants";
import { LanguageToggleButtons } from "../../components/common/CommonComponents/ReusableFields";
import { AddCircle, Edit, TickSquare, Trash } from "iconsax-react";
import InfoIcon from "@mui/icons-material/Info";
import "./marketplace.css";
import {
  hasInsightsPermission,
  PERMISSION_LIST,
} from "../../utils/permissionUtil";
import ConfirmationDialog from "../report/DeleteConfirmation";

const AddTemplateModal = ({
  currentItem,
  isOpen,
  onClose,
  isViewModeForTemplates,
  setIsViewModeForTemplate,
}) => {
  const dispatch = useDispatch();
  const permissionState = useSelector((state) => state.jobs?.permissions);
  const initialFormState = {
    templateName: "",
    description: "",
    templateType: "",
    tags: [],
    commandScripts: "",
    templateIcon: "",
    accessType: "",
    isVersionRestored: false,
    enableArguemts: false,
    cmdbQuery: "",
  };

  const [form, setForm] = useState(initialFormState);

  // Initial state for variableMappings
  const [variableMappings, setVariableMappings] = useState([
    { description: "", fieldName: "" },
  ]);
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");
  const [variableParameters, setVariableParameters] = useState([
    { key: "" }, // Only key field, no value field
  ]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [outputMappingError, setOutputMappingError] = useState("");
  const [enableOutputMapping, setEnableOutputMapping] = useState(true);
  const [enableCodeInjection, setEnableCodeInjection] = useState(false);
  const [editingFields, setEditingFields] = useState({});
  const [editingParameterFields, setEditingParameterFields] = useState({});
  const [enableVariableParameters, setEnableVariableParameters] =
    useState(false);
  const [steps, setSteps] = useState([
    "Template Details",
    "Input Variables",
    "Output Variables",
  ]);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [currentItemIndex, setcurrentItemIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentItemIndexVariable, setCurrentItemIndexVariable] =
    useState(null);
  const [deleteDialogOpenVariable, setDeleteDialogOpenVariable] =
    useState(false);
  const cmdbConfigurations = useSelector(
    (state) => state.jobs.cmdbConfigurations.data || []
  );

  const allTemplates = useSelector(
    (state) => state.templates?.templateData?.data
  );
  const commandCategoryData = useSelector(
    (state) => state.jobs.commandCategories
  );

  const commandCategories = commandCategoryData?.map((cat) => ({
    label: cat.commandCategory,
    value: cat.commandCategory,
  }));
  const cmdbApiOptions = [
    { label: "cmdb_rel_ci", value: "cmdb_rel_ci" },
    { label: "cmdb_ci_server", value: "cmdb_ci_server" },
  ];

  // let steps = ["Template Details", "Input Variables", "Output Variables"];
  const cmdbSteps = ["Template Details", "Output Variables"];

  // Helper function to create a deep copy of variable mappings
  const createEditableMappings = (mappings) => {
    if (!mappings || !Array.isArray(mappings)) {
      return [{ fieldName: "", description: "" }];
    }

    return mappings.map((mapping) => ({
      fieldName: mapping.fieldName || "",
      description: mapping.description || "",
      defaultField: mapping.defaultField || "",
    }));
  };

  // Helper function to create a deep copy of variable parameters
  const createEditableParameters = (parameters) => {
    if (!parameters || typeof parameters !== "object") {
      return [{ key: "" }]; // Only key field
    }

    // Convert object to array of key-only objects
    return Object.keys(parameters).map((key) => ({
      key: key || "",
    }));
  };

  // Helper function to convert parameters array back to object format with empty values
  // const convertParametersToObject = (parametersArray) => {
  //   const result = {};
  //   parametersArray.forEach((param) => {
  //     if (param.key) {
  //       result[param.key] = ""; // Always send empty value
  //     }
  //   });
  //   return result;
  // };

  const convertParametersToObject = (parametersArray) => {
    const result = {};
    parametersArray.forEach((param) => {
      if (param.key) {
        const formattedKey = param.key.startsWith("$")
          ? param.key
          : `$${param.key}`;
        result[formattedKey] = "";
      }
    });
    return result;
  };

  const resetForm = () => {
    if (currentItem) {
      setForm({
        templateName: currentItem.templateName || "",
        cmdbQuery: currentItem?.cmdbQuery || "",
        description: currentItem.description || "",
        templateType: currentItem.templateType || "",
        cmdb_table: currentItem.cmdb_table || "",
        tags: currentItem.tags || [],
        commandScripts: currentItem.commandScripts || "",
        templateIcon: currentItem.templateIcon || "",
        accessType: currentItem.accessType || "",
        approvalRequired: currentItem.approvalRequired || false,
        enableArguemts:
          currentItem.enableArguemts !== undefined
            ? currentItem.enableArguemts
            : false,
        isVersionRestored: false,
      });
      setEnableCodeInjection(currentItem.enableCodeInjection || false);

      const hasInputVariables =
        currentItem.variableParameters &&
        Object.keys(currentItem.variableParameters).length > 0;

      setEnableVariableParameters(hasInputVariables);

      // === OUTPUT MAPPING TOGGLE: ON if any variableMapping exists (or always ON in CMDB_API) ===
      const hasOutputMapping =
        currentItem.variableMapping &&
        Array.isArray(currentItem.variableMapping) &&
        currentItem.variableMapping.length > 0;

      const isCmdbApi = currentItem.templateType === "CMDB_API";
      setEnableOutputMapping(hasOutputMapping || isCmdbApi);

      // Set variable mappings
      if (hasOutputMapping) {
        setVariableMappings(
          createEditableMappings(currentItem.variableMapping)
        );
      } else {
        setVariableMappings([{ fieldName: "", description: "" }]);
      }

      // Set variable parameters
      if (hasInputVariables) {
        setVariableParameters(
          createEditableParameters(currentItem.variableParameters)
        );
      } else {
        setVariableParameters([{ key: "" }]);
      }

      // Editing state
      setEditingFields({ 0: !isViewModeForTemplates });
      setEditingParameterFields({ 0: !isViewModeForTemplates });
    } else {
      // Add mode - default behavior
      setForm(initialFormState);
      setVariableMappings([{ fieldName: "", description: "" }]);
      setVariableParameters([{ key: "" }]);
      setEnableOutputMapping(true);
      setEnableVariableParameters(false);
      setEnableCodeInjection(false);
      setEditingFields({ 0: true });
      setEditingParameterFields({ 0: true });
    }
    setNameError("");
    setOutputMappingError("");
    setEditingIndex(null);
  };
  useEffect(() => {
    dispatch(getCmdbConfiguration());
  }, [dispatch]);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      setIsSubmitting(false);
      setActiveStep(0);
    }
    if (currentItem?.templateType == "SQL") {
      setSteps(["Template Details"]);
    }
  }, [isOpen, currentItem]);

  const fetchCommandData = async () => {
    const data = await dispatch(getCommandCategory());
  };

  useEffect(() => {
    fetchCommandData();
  }, []);

  // const handleInputChange = (field, value) => {
  //   if (field === "templateName") {
  //     if (!value.trim()) {
  //       setNameError("");
  //     } else if (
  //       allTemplates?.some(
  //         (template) =>
  //           template.templateName.toLowerCase() === value.toLowerCase() &&
  //           (!currentItem || template.templateId !== currentItem.templateId)
  //       )
  //     ) {
  //       setNameError(UI_TEXTS.ERROR.TEMPLATE_NAME_EXISTS);
  //     } else {
  //       setNameError("");
  //     }
  //   }
  //   setForm((prev) => ({ ...prev, [field]: value }));
  // };

  const handleInputChange = (field, value) => {
    if (field === "templateType" && value === "SQL") {
      setSteps(["Template Details"]);
      setEnableOutputMapping(true);
    } else if (field === "templateType" && value !== "SQL") {
      setSteps(["Template Details", "Input Variables", "Output Variables"]);
    }
    if (field === "templateName") {
      const normalizedValue = value.trim();

      if (!normalizedValue) {
        setNameError("");
      } else if (/[^a-zA-Z0-9\s-]/.test(normalizedValue)) {
        setNameError("Special characters are not allowed except hyphen (-)");
      } else {
        setNameError("");
      }
      setForm((prev) => ({ ...prev, [field]: value }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleInputBlur = (field, value) => {
    if (field === "templateName") {
      const normalizedValue = value.trim();

      if (
        normalizedValue &&
        (normalizedValue.length < 5 || normalizedValue.length > 100)
      ) {
        setNameError("Template name must be between 5 and 100 characters");
      } else if (
        normalizedValue &&
        allTemplates?.some(
          (template) =>
            template.templateName?.toString().trim().toLowerCase() ===
              normalizedValue.toLowerCase() &&
            (!currentItem || template.templateId !== currentItem.templateId)
        )
      ) {
        setNameError(UI_TEXTS.ERROR.TEMPLATE_NAME_EXISTS);
      }
    }
  };

  const handleVariableChange = (index, field, value) => {
    const updatedMappings = variableMappings.map((mapping, i) => {
      if (i === index) {
        return {
          ...mapping,
          [field]: value,
        };
      }
      return mapping;
    });

    setVariableMappings(updatedMappings);

    if (outputMappingError && value.trim()) {
      setOutputMappingError("");
    }
  };

  const handleParameterChange = (index, field, value) => {
    const updatedParameters = variableParameters.map((param, i) => {
      if (i === index) {
        return {
          ...param,
          [field]: value,
        };
      }
      return param;
    });

    setVariableParameters(updatedParameters);
  };

  const addVariableField = (index) => {
    const updatedMappings = [...variableMappings];
    updatedMappings.splice(index + 1, 0, { fieldName: "", description: "" });
    setVariableMappings(updatedMappings);

    setEditingFields((prev) => ({
      ...prev,
      [index + 1]: true,
    }));
  };

  const addParameterField = (index) => {
    const updatedParameters = [...variableParameters];
    updatedParameters.splice(index + 1, 0, { key: "" }); // Only key field
    setVariableParameters(updatedParameters);

    setEditingParameterFields((prev) => ({
      ...prev,
      [index + 1]: true,
    }));
  };

  const removeVariableField = (item, e) => {
    e.stopPropagation();
    setCurrentItemIndexVariable(item);
    setDeleteDialogOpenVariable(true);
  };
  const handleRemoveVariableField = () => {
    let index = currentItemIndexVariable;
    try {
      if (variableMappings.length === 1) return;
      const updatedMappings = [...variableMappings];
      updatedMappings.splice(index, 1);
      setVariableMappings(updatedMappings);

      const newEditingFields = { ...editingFields };
      delete newEditingFields[index];

      const adjustedEditingFields = {};
      Object.keys(newEditingFields).forEach((key) => {
        const numKey = parseInt(key);
        if (numKey > index) {
          adjustedEditingFields[numKey - 1] = newEditingFields[numKey];
        } else {
          adjustedEditingFields[numKey] = newEditingFields[numKey];
        }
      });
      setEditingFields(adjustedEditingFields);

      if (editingIndex === index) {
        setEditingIndex(null);
      } else if (editingIndex > index) {
        setEditingIndex(editingIndex - 1);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setCurrentItemIndexVariable(null);
      setIsDeleting(false);
      setDeleteDialogOpenVariable(false);
    }
  };

  const removeParameterField = (item, e) => {
    e.stopPropagation();
    setcurrentItemIndex(item);
    setDeleteDialogOpen(true);
  };

  const handleRemoveParameterField = () => {
    let index = currentItemIndex;
    try {
      setIsDeleting(true);
      if (variableParameters.length === 1) return;
      const updatedParameters = [...variableParameters];
      updatedParameters.splice(index, 1);
      setVariableParameters(updatedParameters);

      const newEditingFields = { ...editingParameterFields };
      delete newEditingFields[index];

      const adjustedEditingFields = {};
      Object.keys(newEditingFields).forEach((key) => {
        const numKey = parseInt(key);
        if (numKey > index) {
          adjustedEditingFields[numKey - 1] = newEditingFields[numKey];
        } else {
          adjustedEditingFields[numKey] = newEditingFields[numKey];
        }
      });

      setEditingParameterFields(adjustedEditingFields);
    } catch (error) {
      console.log(error);
    } finally {
      setcurrentItemIndex(null);
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!form?.templateName || !form?.templateType) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    if (form?.templateType === "CMDB_API") {
      setActiveStep((prevStep) => prevStep + 2);
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    if (form?.templateType === "CMDB_API") {
      setActiveStep((prevStep) => prevStep - 2);
      return;
    }
    setActiveStep((prevStep) => prevStep - 1);
  };

  function LoadingToast({ loadingMsg }) {
    return (
      <Box display="flex" alignItems="center">
        <CircularProgress size={20} style={{ marginRight: 10 }} />
        <Typography variant="body2">{loadingMsg}...</Typography>
      </Box>
    );
  }

  const handleSubmit = async () => {
    const trimmedTemplateName = form.templateName?.trim();
    if (
      !currentItem &&
      allTemplates?.some(
        (template) =>
          template?.templateName?.toString().toLowerCase() ===
          trimmedTemplateName.toLowerCase()
      )
    ) {
      setNameError(UI_TEXTS.ERROR.TEMPLATE_NAME_EXISTS);
      return;
    }

    setIsSubmitting(true);

    // Convert parameters array to object format with $ prefixes
    const parametersObject = convertParametersToObject(variableParameters);

    const trimmedVariableMappings = enableOutputMapping
      ? variableMappings
          .map((mapping) => ({
            description: mapping.description?.toString().trim() || "",
            fieldName: mapping.fieldName?.toString().trim() || "",
          }))
          .filter((mapping) => mapping.description && mapping.fieldName)
      : [];
    const payload = {
      ...form,
      templateName: trimmedTemplateName, // ✅ Ensure trimmed name is saved
      templateType: form.templateType || "SQL",
      variableMapping: trimmedVariableMappings,
      enableCodeInjection,
      variableParameters: parametersObject,
    };

    console.log("Submitting payload:", JSON.stringify(payload, null, 2));
    let toastId = null;
    try {
      let response;
      if (currentItem) {
        toastId = toast(
          <LoadingToast loadingMsg={"Template loading for update ..."} />,
          {
            autoClose: false,
            closeButton: false,
            draggable: false,
          }
        );
        response = await dispatch(
          EditTemplate({
            ...payload,
            templateId: currentItem.templateId,
            templateVersion: currentItem.templateVersion,
          })
        );
      } else {
        toastId = toast(
          <LoadingToast loadingMsg={"Template loading for create ..."} />,
          {
            autoClose: false,
            closeButton: false,
            draggable: false,
          }
        );
        response = await dispatch(AddTemplateDetails(payload));
      }

      if (response.payload?.success) {
        toast.update(toastId, {
          render:
            response.payload.message || TOAST_MESSAGES.OTHERS.TEMPLATE_SAVED,
          type: "success",
          autoClose: 3000,
          closeButton: true,
          isLoading: false,
        });
        handleClose();
        dispatch(getTemplateDetails());
      } else {
        if (response.payload?.message) {
          toast.update(toastId, {
            render: response.payload.message,
            type: "error",
            autoClose: 3000,
            closeButton: true,
            isLoading: false,
          });
        } else if (response.error) {
          toast.update(toastId, {
            render:
              response.error.message || TOAST_MESSAGES.OTHERS.REQUEST_FAILED,
            type: "error",
            autoClose: 3000,
            closeButton: true,
            isLoading: false,
          });
        }
      }
    } catch (error) {
      console.error("Error submitting template:", error);
      toast.update(toastId, {
        render:
          error.response?.data?.message ||
          error.message ||
          TOAST_MESSAGES.OTHERS.UNEXPECTED_ERROR,
        type: "error",
        autoClose: 3000,
        closeButton: true,
        isLoading: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(initialFormState);
    setVariableMappings([{ fieldName: "", description: "" }]);
    setVariableParameters([{ key: "" }]); // Only key field
    setActiveStep(0);
    setEditingIndex(null);
    setOutputMappingError("");
    setEnableOutputMapping(true);
    setEnableCodeInjection(false);
    setEditingFields({});
    setEditingParameterFields({});
    onClose();
    setSteps(["Template Details", "Input Variables", "Output Variables"]);
    setIsViewModeForTemplate(false);
  };

  if (!isOpen) return null;

  const isStep1Valid = () => {
    // Define base required fields
    const baseRequiredFields = {
      templateName: form?.templateName?.trim(),
      templateType: form.templateType,
      // templateIcon: form.templateIcon,
    };

    // Add conditional fields based on template type
    let conditionalFields = {};

    if (form.templateType === "CMDB_API") {
      conditionalFields = {
        cmdb_table: form.cmdb_table,
      };
    } else {
      conditionalFields = {
        commandScripts: form.commandScripts?.trim(),
        accessType: form.accessType,
      };
    }

    // Combine all required fields
    const requiredFields = {
      ...baseRequiredFields,
      ...conditionalFields,
    };

    return Object.values(requiredFields).every((field) => field) && !nameError;
  };

  const checkReportsValidation = () => {
    if (!enableOutputMapping) {
      return false;
    }

    return variableMappings.some(
      (mapping) =>
        mapping.description?.trim() === "" || mapping.fieldName?.trim() === ""
    );
  };

  const handleEditClick = (index) => {
    setEditingFields((prev) => ({
      ...prev,
      [index]: true,
    }));
    setEditingIndex(index);
  };

  const handleParameterEditClick = (index) => {
    setEditingParameterFields((prev) => ({
      ...prev,
      [index]: true,
    }));
  };
  const currentSteps = form?.templateType === "CMDB_API" ? cmdbSteps : steps;
  return (
    <div className="modal-overlay">
      <div
        className="modal-content report-modal"
        style={{
          maxWidth: "800px",
          width: "100%",
          height: "670px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "42px",
          }}
        >
          <h2>
            {isViewModeForTemplates
              ? UI_TEXTS.ADD_TEXT.VIEW_TEMPLATE
              : currentItem
              ? UI_TEXTS.ADD_TEXT.EDIT_TEMPLATE
              : UI_TEXTS.ADD_TEXT.ADD_TEMPLATE}
          </h2>
          <IconButton onClick={handleClose} className="modal-close">
            <CloseIcon />
          </IconButton>
        </div>

        <Stepper activeStep={activeStep} sx={{ mt: 2, mb: 1.5 }}>
          {currentSteps.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  fontFamily: "Manrope",
                  "& .MuiStepLabel-label": {
                    fontWeight: "500",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (activeStep === steps.length - 1) {
              handleSubmit();
            } else {
              handleNext();
            }
          }}
        >
          {activeStep === 0 && (
            <div className="form-group">
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <label className="market_place_title_ele">
                    {UI_TEXTS.LABELS.TEMPLATE_NAME}
                    <span className="iabot_required">*</span>
                  </label>
                  <OutlinedInput
                    fullWidth
                    required
                    placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_TEMPLATE_NAME}
                    value={form.templateName}
                    type="text"
                    onChange={(e) =>
                      handleInputChange("templateName", e.target.value)
                    }
                    onBlur={(e) =>
                      handleInputBlur("templateName", e.target.value)
                    }
                    disabled={isViewModeForTemplates}
                    sx={{
                      marginTop: 0.5,
                      borderRadius: "16px",
                      background: "none",
                      height: "40px",
                      "& .MuiOutlinedInput-input": {
                        padding: "8px 14px",
                        fontSize: "0.875rem",
                      },
                    }}
                    error={!!nameError}
                  />
                  {nameError && (
                    <Typography color="error" variant="caption">
                      {nameError}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <label className="market_place_title_ele">
                    {UI_TEXTS.LABELS.TEMPLATE_DESCRIPTION}
                  </label>
                  <OutlinedInput
                    fullWidth
                    placeholder={
                      UI_TEXTS.PLACEHOLDERS.ENTER_TEMPLATE_DESCRIPTION
                    }
                    value={form.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    disabled={isViewModeForTemplates}
                    // sx={{ mt: 0.5, borderRadius: "16px", padding: "4px" }}
                    sx={{
                      marginTop: 0.5,
                      borderRadius: "16px",
                      background: "none",
                      height: "40px",
                      "& .MuiOutlinedInput-input": {
                        padding: "8px 14px",
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 0.1 }}>
                <Grid item xs={6}>
                  <label className="market_place_title_ele">
                    {UI_TEXTS.LABELS.ACTION_TYPE}
                    <span className="iabot_required">*</span>
                  </label>
                  <Select
                    displayEmpty
                    size="small"
                    value={form.templateType}
                    onChange={(e) =>
                      handleInputChange("templateType", e.target.value)
                    }
                    input={<OutlinedInput />}
                    disabled={isViewModeForTemplates}
                    renderValue={(selected) => selected || <>Select</>}
                    sx={{
                      borderRadius: "16px",
                      width: "100%",
                      mt: 0.5,
                      height: "40px",
                      "& .MuiOutlinedInput-input": {
                        padding: "0px 14px",
                        fontSize: "0.875rem",
                      },
                      "& .MuiSelect-icon": {
                        top: "calc(50% - 12px)",
                        right: "10px",
                      },
                    }}
                  >
                    {hasInsightsPermission(
                      permissionState,
                      "Code Marketplace",
                      PERMISSION_LIST.CODE_MARKETPLACE_CMDB_WRITE
                    ) && (
                      <MenuItem key={"CMDB_API"} value={"CMDB_API"}>
                        {"CMDB API"}
                      </MenuItem>
                    )}
                    {/* {commandCategories?.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </MenuItem>
                              ))} */}
                    {commandCategories
                      ?.filter((opt) => opt.value.toLowerCase() !== "command")
                      .map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  <div
                    className="custom-input-wrapper"
                    style={{ marginTop: "4px" }}
                  >
                    <span className="market_place_title_ele">
                      {UI_TEXTS.HEADER_TEXT.TAGS}
                    </span>
                    <MultiSelectWithCreateOption
                      label="Create Tags"
                      sx={{
                        borderRadius: "16px",
                        width: "100%",
                        mt: 0.5,
                        height: "40px",
                        "& .MuiOutlinedInput-input": {
                          padding: "8px 14px",
                          fontSize: "0.875rem",
                        },
                        "& .MuiSelect-icon": {
                          top: "calc(50% - 12px)",
                          right: "10px",
                        },
                      }}
                      disabled={isViewModeForTemplates}
                      selectedValues={form.tags}
                      onSelectionChange={(value) =>
                        handleInputChange("tags", value)
                      }
                      moduleName="codeMarketPlace"
                    />
                  </div>
                </Grid>
              </Grid>

              {form?.templateType !== "CMDB_API" ? (
                <>
                  {" "}
                  <Grid container spacing={2} sx={{ mt: 0.1 }}>
                    <Grid item xs={6}>
                      <label className="market_place_title_ele">
                        {UI_TEXTS.LABELS.TEMPLATE_ACCESS_TYPE}
                        <span className="iabot_required">*</span>
                      </label>
                      <Select
                        displayEmpty
                        size="small"
                        value={form.accessType}
                        onChange={(e) =>
                          handleInputChange("accessType", e.target.value)
                        }
                        input={<OutlinedInput />}
                        disabled={isViewModeForTemplates}
                        renderValue={(selected) => selected || <>Select</>}
                        sx={{
                          borderRadius: "16px",
                          width: "100%",
                          mt: 0.5,
                          height: "40px",
                          "& .MuiOutlinedInput-input": {
                            padding: "8px 14px",
                            fontSize: "0.875rem",
                          },
                          "& .MuiSelect-icon": {
                            top: "calc(50% - 12px)",
                            right: "10px",
                          },
                        }}
                      >
                        <MenuItem value="Read">
                          {UI_TEXTS.MENU_ITEMS.READ}
                        </MenuItem>
                        <MenuItem value="Write">
                          {UI_TEXTS.MENU_ITEMS.WRITE}
                        </MenuItem>
                      </Select>
                    </Grid>
                    {form?.templateType !== "SQL" && (
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={form.enableArguemts || false}
                              onChange={(e) =>
                                handleInputChange(
                                  "enableArguemts",
                                  e.target.checked
                                )
                              }
                              disabled={isViewModeForTemplates}
                              color="primary"
                            />
                          }
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <Typography className="market_place_title_ele">
                                Enable Script Arguments (Optional)
                              </Typography>
                              <Tooltip
                                title="Enable to provide custom arguments when scheduling this template."
                                arrow
                                placement="top"
                              >
                                <InfoIcon
                                  sx={{
                                    fontSize: "0.875rem",
                                    color: "#2961f4",
                                    cursor: "pointer",
                                  }}
                                />
                              </Tooltip>
                            </Box>
                          }
                          labelPlacement="start"
                          sx={{
                            mt: 3.8,
                            marginLeft: 0,
                            marginRight: 0,
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                  <Typography
                    variant="subtitle1"
                    className="market_place_title_ele"
                    sx={{ mt: 1 }}
                  >
                    {UI_TEXTS.TEXTS.COMMAND_SCRIPTS}{" "}
                    <span
                      className="iabot_required"
                      //  style={{ marginTop: "15px" }}
                    >
                      *
                    </span>
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
                      fullWidth
                      multiline
                      rows={2}
                      value={form.commandScripts}
                      onChange={(e) =>
                        handleInputChange("commandScripts", e.target.value)
                      }
                      disabled={isViewModeForTemplates}
                      placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_COMMAND_SCRIPT}
                      sx={{ mt: 1, pr: 5, borderRadius: "16px" }}
                      // className="model_input_field"
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
                      onClick={() => setShowEditor(true)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Grid container spacing={2} sx={{ mt: 0.1 }}>
                    <Grid item xs={6}>
                      <label className="market_place_title_ele">
                        {UI_TEXTS.LABELS.CMDB_API}
                        <span className="iabot_required">*</span>
                      </label>
                      <Select
                        displayEmpty
                        size="small"
                        value={form.cmdb_table}
                        disabled={
                          currentItem && form?.templateType === "CMDB_API"
                        }
                        onChange={(e) =>
                          handleInputChange("cmdb_table", e.target.value)
                        }
                        input={<OutlinedInput />}
                        renderValue={(selected) => selected || <>Select</>}
                        sx={{
                          borderRadius: "16px",
                          width: "100%",
                          mt: 0.5,
                          height: "40px",
                          "& .MuiOutlinedInput-input": {
                            padding: "0px 14px",
                            fontSize: "0.875rem",
                          },
                          "& .MuiSelect-icon": {
                            top: "calc(50% - 12px)",
                            right: "10px",
                          },
                        }}
                      >
                        {cmdbApiOptions?.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                        {cmdbConfigurations?.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.value}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                  {/* <Typography
                    variant="subtitle1"
                    className="market_place_title_ele"
                    sx={{ mt: 1 }}
                  >
                    {"Query "}
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
                      fullWidth
                      multiline
                      rows={2}
                      value={form.cmdbQuery}
                      onChange={(e) =>
                        handleInputChange("cmdbQuery", e.target.value)
                      }
                      disabled={isViewModeForTemplates}
                      placeholder={"Enter Query"}
                      sx={{ mt: 1, pr: 5, borderRadius: "16px" }}
                      // className="model_input_field"
                    />
                  </div> */}
                </>
              )}

              <Typography
                variant="subtitle1"
                className="market_place_title_ele"
                sx={{ mt: 1 }}
              >
                {UI_TEXTS.LABELS.CHOOSE_ICON}{" "}
              </Typography>
              <Box className="icon-selector-wrapper">
                <ToggleButtonGroup
                  value={form.templateIcon}
                  exclusive
                  onChange={(e, newIcon) => {
                    if (newIcon !== null)
                      handleInputChange("templateIcon", newIcon);
                  }}
                  disabled={isViewModeForTemplates}
                  className="lang-toggle-group"
                >
                  <LanguageToggleButtons />
                </ToggleButtonGroup>
              </Box>

              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                  gap: "10px",

                  padding: "12px 16px",
                  backgroundColor: "#fff",
                  zIndex: 1000,
                  borderTop: "1px solid rgba(0,0,0,0.12)",
                  width: "100%",
                  left: 0,
                }}
              >
                <Button onClick={handleClose}>Cancel</Button>
                <Tooltip
                  title={
                    !isStep1Valid() ? "Please fill all required fields" : ""
                  }
                >
                  <span>
                    {form.templateType !== "SQL" ? (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={!isStep1Valid()}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={
                          !isStep1Valid() ||
                          (activeStep === 0 && isViewModeForTemplates)
                        }
                      >
                        {!isStep1Valid()
                          ? UI_TEXTS.BUTTONS.ADDING_THREE_DOTS
                          : currentItem
                          ? UI_TEXTS.BUTTONS.UPDATE
                          : UI_TEXTS.BUTTONS.ADD}
                      </Button>
                    )}
                  </span>
                </Tooltip>
              </div>

              {/* {showEditor && (
                <CommandEditorDialog
                  open={showEditor}
                  onClose={() => setShowEditor(false)}
                  command={form.commandScripts}
                  setCommand={(cmd) => handleInputChange("commandScripts", cmd)}
                  viewOnly={false}
                />
              )} */}

              {showEditor && (
                <CommandEditorDialog
                  open={showEditor}
                  command={form.commandScripts}
                  setCommand={(updatedValue) =>
                    handleInputChange("commandScripts", updatedValue)
                  }
                  onClose={() => {
                    setShowEditor(false);
                  }}
                  // viewOnly={false}
                  viewOnly={isViewModeForTemplates}
                  handleSaveChanges={false}
                  // showSaveButton={true}
                  showSaveButton={!isViewModeForTemplates}
                />
              )}
            </div>
          )}

          {activeStep === 1 && (
            <div
              className="form-group"
              style={{
                height: "540px",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h2>Variable Parameters (Optional):</h2>
                <FormControlLabel
                  style={{ fontFamily: "Manrope !important", fontSize: "16px" }}
                  control={
                    <Switch
                      checked={enableVariableParameters}
                      onChange={(e) =>
                        setEnableVariableParameters(e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label="Enable Variable Parameters"
                  labelPlacement="start"
                  disabled={isViewModeForTemplates}
                />
              </div>

              {enableVariableParameters ? (
                <>
                  <div
                    style={{
                      marginTop: "10px",
                      borderRadius: "4px",
                      padding: "10px",
                      minHeight: "200px",
                      height: "420px",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    {variableParameters.map((param, index) => (
                      <Grid
                        container
                        spacing={2}
                        key={index}
                        alignItems="center"
                        sx={{ mt: 1, mb: 2 }}
                      >
                        <Grid item xs={10}>
                          <label className="market_place_title_ele">
                            Variable Name
                          </label>
                          <OutlinedInput
                            fullWidth
                            placeholder="Enter variable name"
                            value={param.key}
                            onChange={(e) =>
                              handleParameterChange(
                                index,
                                "key",
                                e.target.value
                              )
                            }
                            sx={{ borderRadius: "16px" }}
                            disabled={
                              !editingParameterFields[index] ||
                              isViewModeForTemplates
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 2,
                          }}
                        >
                          <Tooltip title="Add new variable" arrow>
                            <IconButton
                              onClick={() => addParameterField(index)}
                              sx={{ color: "success.main" }}
                            >
                              <AddCircle size="20" color="#4a4d4d" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip
                            title={
                              editingParameterFields[index]
                                ? "Save changes"
                                : "Edit parameter"
                            }
                            arrow
                          >
                            <IconButton
                              onClick={() =>
                                editingParameterFields[index]
                                  ? setEditingParameterFields((prev) => ({
                                      ...prev,
                                      [index]: false,
                                    }))
                                  : handleParameterEditClick(index)
                              }
                              sx={{
                                color: editingParameterFields[index]
                                  ? "primary.main"
                                  : "inherit",
                              }}
                            >
                              <Edit size="20" color="#4a4d4d" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete parameter" arrow>
                            <IconButton
                              // onClick={() => removeParameterField(index)}
                              onClick={(e) => {
                                e.stopPropagation();
                                removeParameterField(index, e);
                              }}
                              disabled={variableParameters.length === 1}
                              sx={{ color: "error.main" }}
                            >
                              <Trash size="20" color="#4a4d4d" />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    ))}
                  </div>
                </>
              ) : (
                <Box className="output-mapping-disabled-container">
                  <Box className="output-mapping-content">
                    <TickSquare className="output-mapping-icon" />
                  </Box>
                  <Box className="content-container">
                    <Typography
                      variant="body1"
                      className="output-mapping-title"
                    >
                      Variable Parameters are turned off.
                    </Typography>
                    <Typography
                      variant="body2"
                      className="output-mapping-description"
                    >
                      You can still use this template in schedules, Enable this
                      to add customizable variable Input parameters to your
                      schedule.
                    </Typography>
                  </Box>
                </Box>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "10px 0",
                  borderTop: "1px solid #e0e0e0",
                  marginTop: "auto",
                }}
              >
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div
              className="form-group"
              style={{
                height: "540px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {console.log("test:::::", form)}

              {/* // Other Templates - Original Output Mapping with toggle */}
              <>
                {form?.templateType !== "CMDB_API" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <h2>Output Field Mappings (Optional):</h2>
                    <FormControlLabel
                      style={{
                        fontFamily: "Manrope !important",
                        fontSize: "16px",
                      }}
                      control={
                        <Switch
                          checked={enableCodeInjection}
                          onChange={(e) =>
                            setEnableCodeInjection(e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label="Enable Code Injection"
                      labelPlacement="start"
                      disabled={isViewModeForTemplates}
                    />
                    <FormControlLabel
                      style={{
                        fontFamily: "Manrope !important",
                        fontSize: "16px",
                      }}
                      control={
                        <Switch
                          checked={enableOutputMapping}
                          onChange={(e) =>
                            setEnableOutputMapping(e.target.checked)
                          }
                          color="primary"
                        />
                      }
                      label="Enable Reporting"
                      labelPlacement="start"
                      disabled={isViewModeForTemplates}
                    />
                  </div>
                )}

                {enableOutputMapping || form?.templateType === "CMDB_API" ? (
                  <div
                    style={{
                      marginTop: "10px",
                      borderRadius: "4px",
                      padding: "10px",
                      minHeight: "200px",
                      height: "420px",
                      overflowY: "auto",
                    }}
                  >
                    {variableMappings.map((mapping, index) => (
                      <Grid
                        container
                        spacing={2}
                        key={index}
                        alignItems="center"
                        sx={{ mt: 1, mb: 2 }}
                      >
                        <Grid item xs={5}>
                          <label className="market_place_title_ele">
                            Description
                            <span className="iabot_required">*</span>
                          </label>
                          <OutlinedInput
                            fullWidth
                            placeholder="Enter description"
                            value={mapping.description || ""}
                            onChange={(e) =>
                              handleVariableChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            sx={{ borderRadius: "16px" }}
                            disabled={
                              !editingFields[index] || isViewModeForTemplates
                            }
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <label className="market_place_title_ele">
                            Field Name
                            <span className="iabot_required">*</span>
                          </label>
                          <OutlinedInput
                            fullWidth
                            placeholder="Enter field name"
                            value={mapping.fieldName || ""}
                            onChange={(e) =>
                              handleVariableChange(
                                index,
                                "fieldName",
                                e.target.value
                              )
                            }
                            sx={{ borderRadius: "16px" }}
                            disabled={
                              !editingFields[index] || isViewModeForTemplates
                            }
                          />
                        </Grid>
                        {!isViewModeForTemplates && (
                          <Grid
                            item
                            xs={2}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              mt: 2,
                            }}
                          >
                            <Tooltip title="Add new field" arrow>
                              <IconButton
                                onClick={() => addVariableField(index)}
                                sx={{ color: "success.main" }}
                              >
                                <AddCircle size="20" color="#4a4d4d" />
                              </IconButton>
                            </Tooltip>

                            {/* Show edit button UNLESS templateType is "CMDB_API" AND mapping?.defaultField is true */}
                            {!(
                              currentItem?.templateType === "CMDB_API" &&
                              mapping?.defaultField
                            ) && (
                              <Tooltip
                                title={
                                  editingFields[index]
                                    ? "Save changes"
                                    : "Edit field"
                                }
                                arrow
                              >
                                <IconButton
                                  onClick={() =>
                                    editingFields[index]
                                      ? setEditingFields((prev) => ({
                                          ...prev,
                                          [index]: false,
                                        }))
                                      : setEditingFields((prev) => ({
                                          ...prev,
                                          [index]: true,
                                        }))
                                  }
                                  sx={{
                                    color: editingFields[index]
                                      ? "primary.main"
                                      : "inherit",
                                  }}
                                >
                                  <Edit size="20" color="#4a4d4d" />
                                </IconButton>
                              </Tooltip>
                            )}

                            {/* Show delete button UNLESS templateType is "CMDB_API" AND mapping?.defaultField is true */}
                            {!(
                              currentItem?.templateType === "CMDB_API" &&
                              mapping?.defaultField
                            ) && (
                              <Tooltip title="Delete field" arrow>
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeVariableField(index, e);
                                  }}
                                  disabled={variableMappings.length === 1}
                                  sx={{ color: "error.main" }}
                                >
                                  <Trash size="20" color="#4a4d4d" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Grid>
                        )}
                      </Grid>
                    ))}
                  </div>
                ) : (
                  <Box className="output-mapping-disabled-container">
                    <Box className="output-mapping-content">
                      <TickSquare className="output-mapping-icon" />
                    </Box>
                    <Box className="content-container">
                      <Typography
                        variant="body1"
                        className="output-mapping-title"
                      >
                        Reporting is turned off.
                      </Typography>
                      <Typography
                        variant="body2"
                        className="output-mapping-description"
                      >
                        You can still use this template in schedules, but no
                        reports will be available unless reporting is enabled
                        and fields are mapped.
                      </Typography>
                    </Box>
                  </Box>
                )}
              </>

              {/* Common buttons for both template types */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "10px 0",
                  borderTop: "1px solid #e0e0e0",
                  marginTop: "auto",
                }}
              >
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    isViewModeForTemplates ||
                    checkReportsValidation()
                  }
                >
                  {isSubmitting
                    ? UI_TEXTS.BUTTONS.ADDING_THREE_DOTS
                    : currentItem
                    ? UI_TEXTS.BUTTONS.UPDATE
                    : UI_TEXTS.BUTTONS.ADD}
                </Button>
              </div>
            </div>
          )}
        </form>
        <ConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleRemoveParameterField}
          title={`Delete`}
          message={`Are you sure you want to delete?`}
          confirmText={"Yes,Delete"}
          loading={isDeleting}
        />
        <ConfirmationDialog
          open={deleteDialogOpenVariable}
          onClose={() => setDeleteDialogOpenVariable(false)}
          onConfirm={handleRemoveVariableField}
          title={`Delete`}
          message={`Are you sure you want to delete?`}
          confirmText={"Yes,Delete"}
          loading={isDeleting}
        />
      </div>
    </div>
  );
};

export default AddTemplateModal;
