import React, { useEffect, useState, useMemo, useRef } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./css/subheader.module.css";
import "./css/jobs.css";
import { Chip, CircularProgress, Switch } from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { TbArrowBigLeftFilled } from "react-icons/tb";
import TextField from "@mui/material/TextField";
import { SchedulerModal } from "./SchedulerModal";
import { ErrorBoundary } from "react-error-boundary";
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import { Autocomplete } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import {
  addJob,
  getHosts,
  getCategories,
  getTargets,
  getCommandCategory,
  getJobs,
  getDistinctOsTypes,
  getUserConfigurations,
  getSystemPublishOptions,
  getPublishAsSystemConfiguration,
  getSapFactHosts,
  getSapFactsFilterOptions,
  getScheduleDescriptions,
} from "../../services/jobs/JobsService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import WebIde from "./WebIDE";
import CustomMultiSelect from "./CustomMultiSelect.component";
import CronMultiSelect from "./CronMultiSelect.component";
import { showDropdownOption, showDropdownOptionEOT } from "./cronOptionsData";
import { TickCircle, CloseCircle } from "iconsax-react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "../../images/deleteIcon.png";
import Editconfigimg from "../../images/agent-management/editconfigimg.png";
import CloneTemplateIcon from "../../images/cloneTemplate.png";
import MultiSelectWithCreateOption from "./MultiSelectWithCreate";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  InfoOutlined,
} from "@mui/icons-material";
import TemplateModal from "./CodeTemplateModel";
import { InputAdornment } from "@mui/material";
import { TemplateTooltip } from "../CustomTooltip/CustomTooltip";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomFilter from "../../components/common/CustomFilters/CustomFilter";
import CustomFilterField from "../../components/common/CustomFilters/CustomFilterField";
import { getJobFilterValues } from "../../services/jobs/JobsService";
import DashboardIcon from "../../assets/images/changeaccess.svg";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ModalCustomLoader from "../../components/common/loader/ModalCustomLoader";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import {
  SCHEDULE_TYPE_OPTIONS,
  SCHEDULE_TYPE_OPTIONS_AD_HOC,
  SERVER_ATTRIBUTE_OPTIONS,
} from "../common/Constants/constantObjects";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  SYSTEM_PUBLISH_OPTIONS,
  TOAST_MESSAGES,
  UI_TEXTS,
} from "../common/Constants/label-contants";
import {
  hasInsightsPermission,
  PERMISSION_LIST,
} from "../../utils/permissionUtil";
import { isLoadingInHost } from "../../utils/DetectHost";
import SapFactFilters from "../configuration/SapFactFilter/SapFactFilterComponent";
import { WorkflowTriggerModal } from "./WorkflowTriggerModal";

const steps = ["Schedule", "Commands"];
const getUsernameFromCookie = () => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("username="))
    ?.split("=")[1];

  return cookieValue ? decodeURIComponent(cookieValue) : "user";
};

export const AddJobComponent = ({
  modalIsOpen,
  setModalIsOpenToFalse,
  singleJob,
  isEditClicked,
  setIsEditClicked,
  codeTemplates = [],
}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get("mode");
  const isEditMode = mode === "edit";
  const isCloneMode = mode === "copy";
  const toastMsg = isEditMode
    ? TOAST_MESSAGES.OTHERS.JOB_UPDATED_SUCCESSFULLY
    : isCloneMode
    ? TOAST_MESSAGES.OTHERS.SCHEDULE_CLONED_SUCCESSFULLY
    : TOAST_MESSAGES.OTHERS.JOB_ADDED_SUCCESSFULLY;
  const history = useHistory();
  const dispatch = useDispatch();
  const hostData = useSelector((state) => state.jobs.hosts);
  const categoriesData = useSelector(
    (state) =>
      state.jobs.categories?.filter(
        (category) =>
          category.status !== "REJECTED" &&
          category.status !== "PENDING_APPROVAL"
      ) || []
  );
  const serverTypeData = useSelector((state) => state.jobs.osTypes);
  const targetListForDropdown = useSelector(
    (state) =>
      state.jobs.targets?.filter(
        (target) => target.status !== "PENDING_APPROVAL"
      ) || []
  );
  const commandCategoryData = useSelector(
    (state) =>
      state.jobs.commandCategories?.filter(
        (category) =>
          category.status !== "PENDING_APPROVAL" &&
          category.status !== "REJECTED"
      ) || []
  );
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleReset = () => setActiveStep(0);

  const initialJobEndDate = new Date();
  initialJobEndDate.setHours(23, 59, 0, 0);
  initialJobEndDate.setDate(initialJobEndDate.getDate() + 1);
  const [category, setCategory] = useState("");
  const [scheduleType, setScheduleType] = useState("AD_HOC");
  const [serverAttribute, setServerAttribute] = useState("");
  const [description, setDescription] = useState("");
  const [command, setCommand] = useState("");
  const [, setArgument] = useState("");
  const [, setRun] = useState("");
  const [frequency, setFrequency] = useState("Execute one time");
  const [count, setCount] = useState(0);
  const [jobTimeout, setJobTimeout] = useState();
  const [targetList, setTargetList] = useState([]);
  const [host, setHost] = useState([]);

  const [jobTimezone, setJobTimezone] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(initialJobEndDate);
  const [selectedType, setSelectedType] = useState("Local");
  const [isOneTime, setIsOneTime] = useState(true);
  const [, setTagValue] = useState("");
  const [tagList, setTagList] = useState([]);
  const [viewOnly, setViewOnly] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [cronValue, setCronValue] = useState("");
  const [showDropdown, setShowDropdown] = useState("Execute one time");
  const [isSchedulerModelOpen, setIsSchedulerModelOpen] = useState(false);
  const [, setCommandCategory] = useState("");
  const [, setServerTypesData] = useState([]);
  const [runAsCurrentUser, setRunAsCurrentUser] = useState(
    isEditMode ? false : true
  );
  const [inputType, setInputType] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTemplatesData, setSelectedTemplatesData] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [rowTemplates, setRowTemplates] = useState({}); // { rowId: template }
  const [descriptionCmdValidate, setDescriptionCmdValidate] = useState(false);
  const [isStep1Valid, setIsStep1Valid] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState([]);
  const [selectedSID, setSelectedSID] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState([]);
  const [selectedCI, setSelectedCI] = useState([]);
  const [serverAttributeValue, setServerAttributeValue] = useState([]);
  const [filterLoading, setFilterLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({});
  const [SchedulejobRunning, setjobRunning] = useState(true);
  const username = getUsernameFromCookie();
  const [selectedSystemPublish, setSelectedSystemPublish] = useState(null);
  const [actionTypeFromJob, setActionTypeFromJob] = useState(null);
  const [recentFilter, setRecentFilter] = useState("");
  const userConfigurations = useSelector(
    (state) => state.jobs.userConfigurations.data || []
  );
  const [newCommandObject] = useState({
    command: "",
    args: "",
    description: "",
    timeout: undefined,
    outputVar: "",
    runAs: runAsCurrentUser ? username : "",
    actionType: "",
    osInstanceType: "",
    tags: [],
    editMode: true,
    subShell: "",
    actionDescription: "",
    variableParameters: {},
    templateName: "",
    template_mongo_id: "",
    templateVersion: "",
    template_instance_id: "",
  });
  const [commands, setCommands] = React.useState([
    {
      // id: 0,
      id: Date.now(),
      command: "",
      args: "",
      description: "",
      timeout: undefined,
      outputVar: "",
      runAs: runAsCurrentUser ? username : "",
      actionType: "",
      tags: [],
      osInstanceType: "",
      editMode: true,
      subShell: "",
      actionDescription: "",
      variableParameters: {},
      templateName: "",
      template_mongo_id: "",
      templateVersion: "",
      template_instance_id: "",
    },
  ]);
  const [openRow, setOpenRow] = React.useState({});
  const [focusedInput, setFocusedInput] = React.useState(null);
  const [originalCommands, setOriginalCommands] = useState([]);
  const [isSystemPublish, setIsSystemPublish] = useState(false);
  const [systemPublishFor, setSystemPublishFor] = useState("");
  const [systemPublishOptionExists, setSystemPublishOptionExists] =
    useState(false);
  const [usedSystemPublishOptions, setUsedSystemPublishOptions] = useState([]);
  const [systemPublishOptions, setSystemPublishOptions] = useState([]);
  const [isDuplicateDescriptionInput, setIsDuplicateDescriptionInput] =
    useState(false);

  const [isEventBasedTrigger, setIsEventBasedTrigger] = useState(false);
  const [workflowTriggers, setWorkflowTriggers] = useState({});
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [selectedCommandId, setSelectedCommandId] = useState(null);

  const inputRefs = useRef(new Map());

  const caretPosRef = useRef(new Map());

  const setCaretForRow = (rowId, start, end) => {
    caretPosRef.current.set(rowId, { start, end });
  };

  const inputRefs_mapping = useRef(new Map());

  const caretPosRef_mapping = useRef(new Map());

  const setCaretForRow_mapping = (rowId, start, end) => {
    caretPosRef_mapping.current.set(rowId, { start, end });
  };

  const restoreCaretForRow_mapping = (rowId) => {
    const pos = caretPosRef_mapping.current.get(rowId);
    const input = inputRefs_mapping.current.get(rowId);
    if (input && pos && typeof input.setSelectionRange === "function") {
      input.setSelectionRange(pos.start, pos.end);
    }
  };

  const inputRefs_command = useRef(new Map());

  const caretPosRef_command = useRef(new Map());

  const setCaretForRow_command = (rowId, start, end) => {
    caretPosRef_command.current.set(rowId, { start, end });
  };

  const restoreCaretForRow_command = (rowId) => {
    const pos = caretPosRef_command.current.get(rowId);
    const input = inputRefs_command.current.get(rowId);
    if (input && pos && typeof input.setSelectionRange === "function") {
      input.setSelectionRange(pos.start, pos.end);
    }
  };

  const [scheduleDescriptionData, setScheduleDescriptionData] = useState([]);
  const [nameError, setNameError] = useState("");

  const restoreCaretForRow = (rowId) => {
    const pos = caretPosRef.current.get(rowId);
    const input = inputRefs.current.get(rowId);
    if (input && pos && typeof input.setSelectionRange === "function") {
      input.setSelectionRange(pos.start, pos.end);
    }
  };

  console.log("systemPublishOptions", systemPublishOptions);

  // get schedule options
  useEffect(() => {
    fetchSystemPublishOptions();
    fetchScheduleDescriptions();
  }, []);

  const fetchSystemPublishOptions = async () => {
    try {
      setLoading(true);
      const response = await getSystemPublishOptions();
      // const response = await dispatch(getSystemPublishOptions());
      let data = response.data || [];
      setSystemPublishOptions(data);
      if ((singleJob?.systemPublishFor || data.length) && !isCloneMode) {
        if (singleJob?.systemPublishFor && singleJob.selectedPublishOption) {
          data = [...data, singleJob.selectedPublishOption];
        }
        const match =
          data.find((o) => o.value === singleJob.systemPublishFor) || null;
        setSelectedSystemPublish(match);
        setSystemPublishOptions(data);
      } else {
        setSystemPublishOptions(data);
      }
    } catch (error) {
      console.error("Failed to fetch system publish options:", error);
      setSystemPublishOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSystemPublish) {
      setSelectedType("Global");
    }
  }, [isSystemPublish]);

  // const validateSystemPublish = async () => {
  //   if (!isSystemPublish || !systemPublishFor) return true;

  //   try {
  //     const response = await dispatch(getJobs());
  //     const existingJobs = response?.data?.data || [];

  //     const existingSystemJob = existingJobs.find(
  //       (job) =>
  //         job.isSystemPublish &&
  //         job.systemPublishFor === systemPublishFor &&
  //         (!isEditMode || job._id !== singleJob?._id)
  //     );

  //     return !existingSystemJob;
  //   } catch (error) {
  //     console.error("Error validating system publish:", error);
  //     return false;
  //   }
  // };

  // Validate if system publish option already exists
  // const validateSystemPublishOption = async (selectedOption) => {
  //   if (!selectedOption || !isSystemPublish) return;

  //   try {
  //     const response = await dispatch(getJobs());
  //     const existingJobs = response?.data?.data || [];

  //     const existingSystemJob = existingJobs.find(job =>
  //       job.isSystemPublish &&
  //       job.systemPublishFor === selectedOption &&
  //       (!isEditMode || job._id !== singleJob?._id) // Exclude current job in edit mode
  //     );

  //     setSystemPublishOptionExists(!!existingSystemJob);

  //     if (existingSystemJob) {
  //       toast.error(`A system schedule for "${selectedOption}" already exists. Please choose another option.`, {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 3000,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error validating system publish option:", error);
  //   }
  // };

  // // Validate if system publish option already exists
  // const validateSystemPublishOption = async (selectedOption) => {
  //   if (!selectedOption || !isSystemPublish) return;

  //   try {
  //     const response = await dispatch(getJobs());
  //     const existingJobs = response?.data?.data || [];

  //     // Find all used system publish options
  //     const usedOptions = existingJobs
  //       .filter(
  //         (job) =>
  //           job.isSystemPublish &&
  //           job.systemPublishFor &&
  //           (!isEditMode || job._id !== singleJob?._id)
  //       )
  //       .map((job) => job.systemPublishFor);

  //     setUsedSystemPublishOptions(usedOptions);

  //     const existingSystemJob = existingJobs.find(
  //       (job) =>
  //         job.isSystemPublish &&
  //         job.systemPublishFor === selectedOption &&
  //         (!isEditMode || job._id !== singleJob?._id)
  //     );

  //     setSystemPublishOptionExists(!!existingSystemJob);

  //     if (existingSystemJob) {
  //       toast.error(
  //         `A system schedule for "${selectedOption}" already exists. Please choose another option.`,
  //         {
  //           position: toast.POSITION.TOP_RIGHT,
  //           autoClose: 3000,
  //         }
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error validating system publish option:", error);
  //   }
  // };

  // Load used system publish options when component mounts
  // useEffect(() => {
  //   const loadUsedSystemOptions = async () => {
  //     try {
  //       const response = await dispatch(getJobs());
  //       const existingJobs = response?.data?.data || [];

  //       const usedOptions = existingJobs
  //         .filter((job) => job.isSystemPublish && job.systemPublishFor)
  //         .map((job) => job.systemPublishFor);

  //       setUsedSystemPublishOptions(usedOptions);
  //     } catch (error) {
  //       console.error("Error loading used system options:", error);
  //     }
  //   };

  //   loadUsedSystemOptions();
  // }, [dispatch]);

  // Add this useEffect to validate on component load for edit mode
  // useEffect(() => {
  //   if (
  //     isEditMode &&
  //     singleJob?.isSystemPublish &&
  //     singleJob?.systemPublishFor
  //   ) {
  //     validateSystemPublishOption(singleJob.systemPublishFor);
  //   }
  // }, [isEditMode, singleJob]);

  // Also validate when systemPublish changes
  // useEffect(() => {
  //   if (isSystemPublish && systemPublishFor) {
  //     validateSystemPublishOption(systemPublishFor);
  //   }
  // }, [isSystemPublish]);

  const Loader = (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ModalCustomLoader isLoading={true} />
    </div>
  );

  const handleFilterChange = (filterKey, value) => {
    const selectedValues = value?.target
      ? value.target.value
      : Array.isArray(value)
      ? value
      : [value];

    switch (filterKey) {
      case "region":
        setSelectedRegion(selectedValues);
        break;
      case "environment":
        setSelectedEnv(selectedValues);
        break;
      case "sid":
        setSelectedSID(selectedValues);
        break;
      case "platform":
        setSelectedPlatform(selectedValues);
        break;
      case "ci":
        setSelectedCI(selectedValues);
        break;
      case "serverAttributeValue":
        setServerAttributeValue(selectedValues);
        break;
      default:
        break;
    }
  };
  const filtersFieldConfig = [
    {
      id: "region",
      type: "multi-select-with-search",
      name: "region",
      placeholder: UI_TEXTS.PLACEHOLDERS_FILTERS.SELECT_REGION,
      options: filterOptions?.region || [],
      value: serverAttributeValue,
      onChange: (value) => handleFilterChange("serverAttributeValue", value),
    },
    {
      id: "environment",
      type: "multi-select-with-search",
      name: "environment",
      placeholder: UI_TEXTS.PLACEHOLDERS_FILTERS.SELECT_ENVIRONMENT,
      options: filterOptions?.environment || [],
      value: serverAttributeValue,
      onChange: (value) => handleFilterChange("serverAttributeValue", value),
    },
    {
      id: "sid",
      type: "multi-select-with-search",
      name: "sid",
      placeholder: UI_TEXTS.PLACEHOLDERS_FILTERS.SELECT_SID,
      options: filterOptions?.sid || [],
      value: serverAttributeValue,
      onChange: (value) => handleFilterChange("serverAttributeValue", value),
    },
    {
      id: "platform",
      type: "multi-select-with-search",
      name: "platform",
      placeholder: UI_TEXTS.PLACEHOLDERS_FILTERS.SELECT_PLATFORM,
      options: filterOptions?.platform || [],
      value: serverAttributeValue,
      onChange: (value) => handleFilterChange("serverAttributeValue", value),
    },
    {
      id: "ci",
      type: "multi-select-with-search",
      name: "ci",
      placeholder: UI_TEXTS.PLACEHOLDERS_FILTERS.SELECT_CI,
      options: filterOptions?.ci || [],
      value: serverAttributeValue,
      onChange: (value) => handleFilterChange("serverAttributeValue", value),
    },
  ];
  const filtersConfig = [
    {
      id: "region",
      type: "multi-select-with-search",
      name: "region",
      placeholder: UI_TEXTS.PLACEHOLDERS_FILTERS.SELECT_REGION,
      options: filterOptions?.region || [],
      value: selectedRegion,
      onChange: (value) => handleFilterChange("region", value),
    },
    {
      id: "environment",
      type: "multi-select-with-search",
      name: "environment",
      placeholder: UI_TEXTS.PLACEHOLDERS_FILTERS.SELECT_ENVIRONMENT,
      options: filterOptions?.environment || [],
      value: selectedEnv,
      onChange: (value) => handleFilterChange("environment", value),
    },
    {
      id: "sid",
      type: "multi-select-with-search",
      name: "sid",
      placeholder: UI_TEXTS.PLACEHOLDERS_FILTERS.SELECT_SID,
      options: filterOptions?.sid || [],
      value: selectedSID,
      onChange: (value) => handleFilterChange("sid", value),
    },
    {
      id: "platform",
      type: "multi-select-with-search",
      name: "platform",
      placeholder: UI_TEXTS.PLACEHOLDERS_FILTERS.SELECT_PLATFORM,
      options: filterOptions?.platform || [],
      value: selectedPlatform,
      onChange: (value) => handleFilterChange("platform", value),
    },
    {
      id: "ci",
      type: "multi-select-with-search",
      name: "ci",
      placeholder: UI_TEXTS.PLACEHOLDERS_FILTERS.SELECT_CI,
      options: filterOptions?.ci || [],
      value: selectedCI,
      onChange: (value) => handleFilterChange("ci", value),
    },
  ];
  const formattedAppliedFilters = useMemo(() => {
    const result = {};

    if (selectedRegion.length > 0) {
      result.region = selectedRegion;
    }

    if (selectedEnv.length > 0) {
      result.env = selectedEnv;
    }
    if (selectedSID.length > 0) {
      result.SID = selectedSID;
    }
    if (selectedPlatform.length > 0) {
      result.platform = selectedPlatform;
    }
    if (selectedCI.length > 0) {
      result.CI = selectedCI;
    }

    return result;
  }, [selectedEnv, selectedRegion, selectedSID, selectedPlatform, selectedCI]);

  const handleRemoveFilter = (filterKey) => {
    setFilterLoading(true);

    switch (filterKey) {
      case "region":
        setSelectedRegion([]);
        break;
      case "CI":
        setSelectedCI([]);
        break;
      case "env":
        setSelectedEnv([]);
        break;
      case "platform":
        setSelectedPlatform([]);
        break;
      case "SID":
        setSelectedSID([]);
        break;
      default:
        break;
    }

    setFilterLoading(false);
  };

  const handleClearAllFilters = () => {
    setFilterLoading(true);
    setSelectedRegion([]);
    setSelectedCI([]);
    setSelectedEnv([]);
    setSelectedPlatform([]);
    setSelectedSID([]);
    setFilterLoading(false);
  };

  useEffect(() => {
    const regex = /^(?=.*\S).+$/;
    const baseValid =
      regex.test(description) &&
      description.length > 0 &&
      category &&
      scheduleType;

    let systemPublishValid = true;
    if (isSystemPublish) {
      systemPublishValid = !!systemPublishFor;
    }

    let isValid =
      baseValid && systemPublishValid && !isDuplicateDescriptionInput;
    // let isValid = baseValid;

    if (selectedType === "Smart") {
      isValid =
        baseValid &&
        serverAttribute &&
        serverAttributeValue &&
        serverAttributeValue.length > 0;
    }
    if (selectedType === "Local") {
      isValid = host && host.length;
    }

    setIsStep1Valid(isValid);
  }, [
    description,
    category,
    scheduleType,
    selectedType,
    serverAttribute,
    serverAttributeValue,
    isSystemPublish,
    systemPublishFor,
    host,
    isDuplicateDescriptionInput,
  ]);

  const handleFocus = (rowId, fieldName) => {
    setFocusedInput(`${rowId}-${fieldName}`);
  };

  const handleRowClick = (id) => {
    setOpenRow((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  //to set input focus to null
  React.useEffect(() => {
    if (!modalIsOpen) {
      setFocusedInput(null);
    }
  }, [modalIsOpen]);

  useEffect(() => {
    dispatch(getUserConfigurations());
  }, [dispatch]);

  const fetchScheduleDescriptions = async () => {
    try {
      setIsAdding(true);
      const response = await dispatch(getScheduleDescriptions());
      setScheduleDescriptionData(response?.payload);
    } catch (error) {
      return toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } finally {
      setIsAdding(false);
    }
  };

  const isDuplicateDescriptionData = (newDescription, currentJobId = null) => {
    if (!newDescription || typeof newDescription !== "string") return false;
    const trimmedLower = newDescription.trim().toLowerCase();

    return scheduleDescriptionData.some((existingDesc) => {
      // Skip if this description belongs to the job we're currently editing
      if (currentJobId && existingDesc.id === currentJobId) {
        return false;
      }

      // Compare the actual description text
      return existingDesc.description?.trim().toLowerCase() === trimmedLower;
    });
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    setNameError("");

    const currentJobId = isEditMode && singleJob?._id ? singleJob._id : null;
    const hasDuplicate = isDuplicateDescriptionData(value, currentJobId);

    setIsDuplicateDescriptionInput(hasDuplicate);

    if (hasDuplicate) {
      setNameError(`The description "${value.trim()}" already exists`);
    }
  };

  //VIEW JOB
  useEffect(() => {
    if (singleJob && singleJob !== undefined) {
      if (mode === "copy") {
        setViewOnly(false);
      } else if (!viewOnly) {
        setViewOnly(true);
      }

      const endDate = singleJob?.jobEndDate;
      const startDate = singleJob?.jobStartDate;
      if (startDate) {
        const formatestartDate = new Date(parseInt(startDate));
        const start_date = formatestartDate?.toString();
        setStartDate(start_date);
      }
      if (endDate) {
        const formateEndDate = new Date(parseInt(endDate));
        const end_date = formateEndDate?.toString();
        setEndDate(end_date);
      }
      if (singleJob?.categoryType === "Smart") {
        setServerAttribute(singleJob?.serverAttribute || "");

        // Ensure serverAttributeValue is always an array
        const attributeValue = singleJob?.serverAttributeValue;
        if (Array.isArray(attributeValue)) {
          setServerAttributeValue(attributeValue);
        } else if (attributeValue) {
          // If it's a string, convert to array
          setServerAttributeValue([attributeValue]);
        } else {
          setServerAttributeValue([]);
        }
      }
      setCommandCategory(singleJob?.commandCategory);
      setRunAsCurrentUser(singleJob?.runAsCurrentUser);
      setCategory(singleJob?.categoryName);
      setDescription(singleJob?.jobDescription);
      setPrivacy(singleJob?.privateJob);
      setCommand(singleJob?.command);
      setArgument(singleJob?.commandArguments);
      setRun(singleJob?.runAs);
      setShowDropdown(singleJob?.frequency);
      setCount(singleJob?.recurringTime);
      setJobTimeout(singleJob?.timeout);
      setTargetList(singleJob?.target);
      setCronValue(singleJob?.cronExpression);
      setScheduleType(singleJob?.scheduleType);
      setjobRunning(singleJob?.jobRunning);
      setServerTypesData(singleJob?.serverTypesData);
      if (!isCloneMode) {
        setIsSystemPublish(singleJob?.isSystemPublish || false);
        setSystemPublishFor(singleJob?.systemPublishFor || "");
      }
      if (singleJob?.commands?.length) {
        const updatedCommandsWithoutScripts = singleJob.commands.map((c) => {
          const foundCategory = commandCategoryData?.find(
            (category) => category.commandCategory === c.actionType
          );
          // let updatedCommand = { ...c };
          let updatedCommand = { ...c, command: c.command || "" };

          // If a matching category is found and if the command string includes the concatenated scripts
          if (
            foundCategory &&
            updatedCommand.command.includes(
              foundCategory.commandCategoryScripts
            )
          ) {
            // Remove the commandCategoryScripts from the command string
            updatedCommand.command = updatedCommand.command
              .replace(`${foundCategory.commandCategoryScripts}`, "")
              .trim();
          }

          return updatedCommand;
        });

        setCommands(updatedCommandsWithoutScripts);
      }
      // Initialize workflowTriggers
      if (singleJob.eventBased && singleJob.commands) {
        const initialWorkflowTriggers = {};
        singleJob.commands.forEach((command) => {
          if (command.workflowEvents && command.workflowEvents.length > 0) {
            const workflows = command.workflowEvents.map((event) => {
              return {
                id: event.workflowId,
                name: event.workflowId,
              };
            });

            const filters = [];
            command.workflowEvents.forEach((event) => {
              if (event.eventConditions && event.eventConditions.length > 0) {
                event.eventConditions.forEach((condition) => {
                  filters.push({
                    id: uuidv4(),
                    workflowId: event.workflowId,
                    condition: condition.operator,
                    value: condition.value,
                    valueType: typeof condition.value,
                    jsonKey: condition.jsonField || "",
                  });
                });
              }
            });

            initialWorkflowTriggers[command.id] = {
              enabled: true,
              workflows: workflows,
              filters: filters,
              commandId: command.id,
            };
          }
        });
        setWorkflowTriggers(initialWorkflowTriggers);
      }

      // Set eventBased
      setIsEventBasedTrigger(singleJob.eventBased || false);

      if (singleJob?.categoryType === "Global") {
        setHost([]);
      } else {
        setHost(singleJob?.hostname);
        if (host && host) {
          const hostnames = singleJob?.hostname || [];
          setHost(hostnames);
        }
      }
      setSelectedType(singleJob?.categoryType);
      setIsOneTime(singleJob?.isOneTime);
      setTagList(singleJob?.tags);
      setFrequency(singleJob?.frequency);
    } else {
      if (viewOnly) setViewOnly(false);
    }
  }, [singleJob, isEditMode]);

  useEffect(() => {
    dispatch(getHosts());
    dispatch(getCategories());
    dispatch(getTargets());
    dispatch(getCommandCategory());
    dispatch(getDistinctOsTypes());
  }, [dispatch]);

  const setDropdown = (selected) => {
    if (selected) {
      if (selected !== "Execute one time") {
        setIsSchedulerModelOpen(true);
        setIsOneTime(false);
      } else {
        setIsOneTime(true);
      }
      setFrequency(selected);
      setShowDropdown(selected);
    }
  };

  useEffect(() => {
    setFrequency(showDropdown);
  }, [showDropdown]);

  useEffect(() => {
    if (showModal === false && !selectedTemplate) {
      setInputType(null);
      setSelectedTemplate(null);
    }
  }, [showModal, selectedTemplate]);

  const handleAddData = async () => {
    if (isAdding) return;
    console.log(
      "Processing commands with workflow triggers:",
      workflowTriggers
    ); // Add debug log

    // const isSystemPublishValid = await validateSystemPublish();
    // if (!isSystemPublishValid) {
    //   toast.error(
    //     `A system schedule for "${systemPublishFor}" already exists. Please choose a different option.`,
    //     {
    //       position: toast.POSITION.TOP_RIGHT,
    //       autoClose: 2000,
    //     }
    //   );
    //   return;
    // }

    if (jobTimeout && jobTimeout.length > 10) {
      toast.error("Timeout cannot exceed 10 digits", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    // Also check if it's a valid number
    if (jobTimeout && !/^\d+$/.test(jobTimeout)) {
      toast.error("Timeout must contain only numbers", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    // Validate system publish uniqueness
    // if (isSystemPublish && systemPublishFor && systemPublishOptionExists) {
    //   toast.error(
    //     `A system schedule for "${systemPublishFor}" already exists. Please choose another option.`,
    //     {
    //       position: toast.POSITION.TOP_RIGHT,
    //       autoClose: 2000,
    //     }
    //   );
    //   return;
    // }

    setIsAdding(true);

    if (commands?.length) {
      let hasPowerShell = false;
      let hasBash = false;
      commands.map((c) => {
        if (!c.actionType && commandCategoryData?.length) {
          c.actionType = commandCategoryData[0]?.commandCategory;
        }
        const foundCategory = commandCategoryData?.find(
          (category) => category.commandCategory === c.actionType
        );

        if (foundCategory) {
          if (foundCategory?.commandCategorySubShell) {
            c.subShell = foundCategory?.commandCategorySubShell;
          }
        }
        if (runAsCurrentUser) {
          c.runAs = username;
        }
        const subShell = c?.subShell?.toLowerCase();
        if (subShell === "powershell") {
          hasPowerShell = true;
        } else if (subShell === "bash" || subShell === "sh") {
          hasBash = true;
        }
        // If this command has a template_mongo_id, replace the command with the actual script
        // if (c.template_mongo_id) {
        //   const matchingTemplate = Object.values(rowTemplates).find(
        //     (template) =>
        //       template.templateId === c.template_mongo_id ||
        //       template._id === c.template_mongo_id
        //   );

        //   if (matchingTemplate && matchingTemplate.commandScripts) {
        //     c.command = matchingTemplate.commandScripts;

        //     // Add variable parameters to the command object
        //     if (matchingTemplate.variableParameters) {
        //       c.variableParameters = matchingTemplate.variableParameters;
        //     }
        //   }
        // }
        if (c.template_mongo_id) {
          const matchingTemplate = Object.values(rowTemplates).find(
            (template) =>
              template.templateId === c.template_mongo_id ||
              template._id === c.template_mongo_id
          );
          if (matchingTemplate && matchingTemplate.commandScripts) {
            c.command = matchingTemplate.commandScripts;
          }
        }

        if (isEventBasedTrigger && workflowTriggers[c.id]) {
          const triggerConfig = workflowTriggers[c.id];
          if (
            triggerConfig.enabled &&
            triggerConfig.workflows &&
            triggerConfig.workflows.length > 0
          ) {
            c.workflowEvents = triggerConfig.workflows.map((workflow) => {
              const workflowFilters = triggerConfig.filters
                .filter(
                  (filter) =>
                    filter.workflowId === workflow.id &&
                    filter.condition &&
                    filter.value !== undefined
                )
                .map((filter) => ({
                  operator: filter.condition,
                  value: filter.value,
                  jsonField: filter.jsonField || null,
                }));

              return {
                workflowId: workflow.id,
                eventConditions:
                  workflowFilters.length > 0 ? workflowFilters : [],
              };
            });
          }
        }

        return c;
      });
      // Check for mixed PowerShell and Bash
      if (hasPowerShell && hasBash) {
        toast.error("Both PowerShell and Bash Command/Script is not allowed!", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        setIsAdding(false); // Reset adding state
        return;
      }
    }

    const formattedTags = tagList?.join(", ");
    const formattedHosts = host?.join(", ");

    let mappededCommands = [];

    // if (commands && commands.length) {
    //   mappededCommands = commands.map((cmd) => {
    //     if (scheduleType === "AD_HOC") {
    //       // Handle AD_HOC specific logic if needed
    //     }

    //     return {
    //       ...cmd,
    //       // Ensure variableParameters is included in each command
    //       variableParameters: cmd.variableParameters || {},

    //     };
    //   });
    // }
    if (commands && commands.length) {
      mappededCommands = commands.map((cmd) => {
        // Check if this command has a template with arguments
        const templateInstance = rowTemplates[cmd.id];
        const baseCommand = {
          ...cmd,
          variableParameters: cmd.variableParameters || {},
          ...(cmd.workflowEvents && { workflowEvents: cmd.workflowEvents }),
        };
        // workflow event
        if (isEventBasedTrigger && workflowTriggers[cmd.id]) {
          const triggerConfig = workflowTriggers[cmd.id];
          console.log("Trigger config for command", cmd.id, ":", triggerConfig);

          // Use the workflowEvents
          if (triggerConfig.enabled && triggerConfig.workflowEvents) {
            baseCommand.workflowEvents = triggerConfig.workflowEvents.map(
              (event) => ({
                workflowId: event.workflowId,
                eventConditions: (event.eventConditions || []).map(
                  (condition) => ({
                    operator: condition.operator,
                    value: condition.value,
                    jsonField: condition.jsonField || null,
                  })
                ),
              })
            );
          }
        }

        if (templateInstance && templateInstance.args) {
          baseCommand.args = templateInstance.args;
        }

        return baseCommand;
      });
    }

    const AddDataPayload = {
      categoryName: category,
      commands: mappededCommands.map((cmd, index) => ({
        ...cmd,
        sequenceId: index + 1,
      })),
      jobDescription: description?.toString()?.trim(),
      runAsCurrentUser,
      scheduleType,
      runAs: commands[0]?.runAs,
      tags: formattedTags,
      target: targetListForDropdown[0]?.indexName
        ? [targetListForDropdown[0]?.indexName]
        : "",
      categoryType: selectedType,
      frequency: frequency,
      recurringTime: count?.toString(),
      timeout: jobTimeout,
      jobStartDate: Date?.parse(startDate),
      jobEndDate: Date?.parse(endDate),
      jobTimeZone: jobTimezone,
      hostname: formattedHosts,
      isOneTime: isOneTime,
      cronExpression: cronValue,
      jobRunning: SchedulejobRunning,
      codeTemplates: Object.values(rowTemplates)
        .filter((template) => template?.templateType !== "CMDB_API")
        .map((template) => ({
          // templateId: template.templateId,
          templateId: template.originalTemplateId,
          instanceId: template.instanceId,
          templateName: template.templateName,
          templateType: template.templateType,
          commandScripts: template.commandScripts,
          accessType: template.accessType,
          approvalRequired: template.approvalRequired,
          rowId: template.rowId,
          createdAt: template.createdAt,
          updatedAt: template.updatedAt,
          templateVersion: template.templateVersion,
          approvalRequired: template.approvalRequired,
          tags: template.tags,
          variableMapping: template?.variableMapping?.map((el) => el),
          variableParameters: template.variableParameters || {},
          enableArguemts: template.args,
          // args: template.args || "",
        })),
      serverAttribute,
      serverAttributeValue,
      privateJob: privacy,
      isSystemPublish,
      systemPublishFor: selectedSystemPublish
        ? selectedSystemPublish.value
        : "",
      eventBased: isEventBasedTrigger,
    };

    if (scheduleType === "AD_HOC") {
      delete AddDataPayload.jobEndDate;
    }

    const EditDataPayload = {
      jobID: singleJob?._id,
      scheduleId: singleJob?.scheduleId,
      updatedBy: username,
      ...AddDataPayload,
    };

    const data = isEditMode && singleJob._id ? EditDataPayload : AddDataPayload;

    try {
      const response = await dispatch(addJob(data));

      if (response?.data?.statusCode === 200) {
        toast.success(
          response?.data?.message === "API executed successfully"
            ? toastMsg
            : response?.data?.message,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }
        );
        history.push(!isLoadingInHost ? "/dashboard" : "");
      } else {
        toast.error(response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      }
    } finally {
      setIsAdding(false);
    }

    dispatch(getJobs());
  };

  const cancelJob = () => {
    history.push(!isLoadingInHost ? "/dashboard" : "");
  };

  const handleDrawerClose = () => {
    if (setIsEditClicked) {
      setIsEditClicked(false);
    }
    setModalIsOpenToFalse();
    setInputType(null);
    setSelectedTemplate(null);
    setCommands((prev) =>
      prev.map((item) => ({
        ...item,
        command: "",
      }))
    );
    history.push(!isLoadingInHost ? "/dashboard" : "");
  };

  const getHeaderText = () => {
    const url = window.location.href;
    if (viewOnly) {
      return UI_TEXTS.HEADER_TEXT.VIEW_SCHEDULE;
    } else if (url.includes("copy")) {
      return UI_TEXTS.HEADER_TEXT.CLONE_SCHEDULE;
    } else if (!viewOnly && singleJob) {
      return UI_TEXTS.HEADER_TEXT.UPDATE_SCHEDULE;
    } else {
      return UI_TEXTS.HEADER_TEXT.ADD_SCHEDULE;
    }
  };

  const [allScheduleData, setallSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const permissionState = useSelector((state) => state.jobs?.permissions);
  const readPermForSchedule = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.SCHEDULE_READ
  );
  const writePermForSchedule = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.SCHEDULE_WRITE
  );

  const hasSystemPublishPermission = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.SCHEDULE_PUBLISH_AS_SYSTEM
  );

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const response = await dispatch(getJobs());

        if (response?.data?.success) {
          setallSchedule(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleDescriptionBlur = (e, row) => {
    const value = e.target.value;
    if (row?.actionType?.toLowerCase() === "script") {
      return;
    }
    setDescriptionCmdValidate(false);

    if (isDuplicateDescription(value, row.id, commands, allScheduleData)) {
      toast.error(
        `The description "${value}" already exists. Please enter a unique one.`,
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        }
      );
    } else {
      setDescriptionCmdValidate(true);
    }
  };

  // const isDuplicateDescription = (newDescription, currentRowId, commands, allScheduleData) => {
  //   const inCurrentCommands = commands.some(
  //     (cmd) =>
  //       cmd?.description?.trim().toLowerCase() === newDescription.trim().toLowerCase() &&
  //       cmd.id !== currentRowId
  //   );

  //   // 2. Check inside all schedules fetched from API
  //   const inAllSchedules = allScheduleData.some((schedule) =>
  //     schedule.commands.some(
  //       (cmd) =>
  //         cmd?.description?.trim().toLowerCase() === newDescription.trim().toLowerCase()
  //     )
  //   );

  //   return inCurrentCommands || inAllSchedules;
  // };

  const isDuplicateDescription = (
    newDescription,
    currentRowId,
    commands,
    allScheduleData
  ) => {
    const inCurrentCommands = commands.some(
      (cmd) =>
        typeof cmd?.description === "string" &&
        cmd.description.trim()?.toLowerCase() ===
          newDescription.trim()?.toLowerCase() &&
        cmd.id !== currentRowId
    );

    // 2. Check inside all schedules fetched from API
    // const inAllSchedules = allScheduleData.some((schedule) =>
    //   schedule.commands.some(
    //     (cmd) =>
    //       cmd.description?.trim().toLowerCase() === newDescription.trim().toLowerCase()
    //   )
    // );

    // return inCurrentCommands || inAllSchedules;
    return inCurrentCommands;
  };

  const handleCommandObjectChange = (e, name, row, validate = false) => {
    const { value } = e.target;
    // When entering edit mode, store the original values
    if (name === "editMode" && e.target.value === true) {
      setOriginalCommands(
        commands.map((cmd) => (cmd.id === row.id ? { ...cmd } : cmd))
      );
    }
    if (
      typeof value === "string" &&
      value?.toLowerCase() === "command" &&
      name?.toLowerCase() === "actiontype"
    ) {
      const updatedCommands = commands.map((cmd) => {
        if (cmd.id === row.id) {
          return {
            ...cmd,
            description: "",
            command: "",
            template_instance_id: "",
            templateName: "",
            template_mongo_id: "",
            templateVersion: "",
            variableMapping: [],
          };
        } else {
          return { ...cmd };
        }
      });
      setCommands(updatedCommands);
      setInputType("manual");
    }
    if (
      typeof value === "string" &&
      typeof name === "string" &&
      name?.toLowerCase() === "actiontype" &&
      value?.toLowerCase() !== "command" &&
      value?.toLowerCase() !== ""
    ) {
      const updatedCommands = commands.map((cmd) => {
        if (cmd.id === row.id) {
          return {
            ...cmd,
            description: "",
          };
        } else {
          return { ...cmd };
        }
      });
      setCommands(updatedCommands);
      setInputType("marketplace");
      setSelectedRow(row);
      setShowModal(true);
    }
    setCommands((prevCommands) => {
      // Step 1: Update the changed command
      const updatedCommands = prevCommands.map((cmd) => {
        if (cmd.id === row.id) {
          return {
            ...cmd,
            [name]: value,
          };
        }
        return cmd;
      });

      // Step 2: Enrich with variableMapping from rowTemplates
      const enrichedCommands = updatedCommands.map((cmd) => {
        const template = rowTemplates[cmd.id];
        if (template && template.variableMapping) {
          return {
            ...cmd,
            variableMapping: template.variableMapping,
          };
        }
        return cmd;
      });
      return enrichedCommands;
    });
  };

  // const handleCancelBtn = (row, e) => {
  //   e.stopPropagation();
  //   handleCommandObjectChange({ target: { value: false } }, "editMode", row);
  // };

  const handleCancelBtn = (row, e) => {
    e.stopPropagation();
    const originalRow = originalCommands.find((cmd) => cmd.id === row.id);

    if (originalRow) {
      setCommands((prevCommands) =>
        prevCommands.map((cmd) =>
          cmd.id === row.id ? { ...originalRow, editMode: false } : cmd
        )
      );
    } else {
      setCommands((prevCommands) =>
        prevCommands.filter((cmd) => cmd.id !== row.id)
      );

      setCommands((prev) => {
        if (prev.length === 0) {
          return [
            {
              ...newCommandObject,
              id: Date.now(),
              editMode: true,
              actionType: "",
            },
          ];
        }
        return prev;
      });
    }
    setInputType(null);
    setSelectedRow(null);
  };

  // const handleTick = (row, descriptionCmdValidate) => {
  //   if (!row.actionType) {
  //     return false;
  //   }
  //   if (row.actionType?.toLowerCase() !== "command" && row?.command) {
  //     if ((row?.runAs && row?.runAs !== username) || runAsCurrentUser) {
  //       return true;
  //     }
  //   } else if (
  //     row.actionType?.toLowerCase() === "command" &&
  //     row.description.length &&
  //     descriptionCmdValidate &&
  //     row?.command
  //   ) {
  //     if ((row?.runAs && row?.runAs !== username) || runAsCurrentUser) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  const handleTick = (row) => {
    // Must have actionType
    if (!row.actionType) return false;

    const isCommandType = row.actionType?.toLowerCase() === "command";

    // Validate description: required for "command" type, optional otherwise
    const hasValidDescription = isCommandType
      ? row.description.toString()?.trim().length > 0
      : true; // or make it required for all if needed

    // Validate command/script is present
    const hasCommand = row.command?.trim().length > 0;

    // Validate runAs
    let hasValidRunAs = false;
    if (runAsCurrentUser) {
      // When runAsCurrentUser is true, runAs must be username (or auto-filled)
      hasValidRunAs = row.runAs === username;
    } else {
      // When false, runAs must be a non-empty string (any valid user)
      hasValidRunAs = row.runAs?.trim().length > 0;
    }

    return hasValidDescription && hasCommand && hasValidRunAs;
  };

  const [privacy, setPrivacy] = useState(false);

  const handlePrivacyChange = (event) => {
    setPrivacy(event.target.value);
  };

  const handleDeleteCommand = (row) => {
    setCommands((prevCommands) => {
      const updatedCommands = prevCommands.filter((cmd) => cmd.id !== row.id);

      if (updatedCommands.length === 0) {
        return [
          {
            id: Date.now(),
            command: "",
            args: "",
            description: "",
            timeout: undefined,
            outputVar: "",
            runAs: "",
            actionType: "",
            tags: [],
            osInstanceType: "",
            editMode: true,
            subShell: "",
          },
        ];
      }

      return updatedCommands;
    });
  };
  const handleCloneCommand = (row) => {
    setCommands((prevCommands) => {
      const updatedCommands = [...prevCommands];
      const rowIndex = updatedCommands.findIndex((cmd) => cmd.id === row.id);

      if (rowIndex !== -1) {
        const clonedRow = {
          ...updatedCommands[rowIndex],
          id: Date.now(),
          editMode: true,
        };

        updatedCommands.splice(rowIndex + 1, 0, clonedRow);
      }

      return updatedCommands;
    });
  };

  useEffect(() => {
    if (privacy) {
      if (!["AD_HOC", "NORMAL"].includes(scheduleType)) {
        setScheduleType("AD_HOC");
      }

      if (scheduleType === "NORMAL") {
        setShowDropdown("Execute one time");
        setFrequency("Execute one time");
      }
    }
  }, [privacy, scheduleType]);

  // const handleTemplateSelect = (template) => {
  //   if (selectedRow) {
  //     setRowTemplates((prev) => ({
  //       ...prev,
  //       [selectedRow.id]: template,
  //     }));

  //     handleCommandObjectChange(
  //       { target: { value: template.templateName } },
  //       "command",
  //       selectedRow
  //     );

  //     handleCommandObjectChange(
  //       { target: { value: template.templateId } },
  //       "template_mongo_id",
  //       selectedRow
  //     );

  //     setSelectedTemplates((prev) => {
  //       const exists = prev.some((t) => t._id === template.templateId);
  //       return exists ? prev : [...prev, template];
  //     });
  //   }

  //   setSelectedTemplate(template);
  //   setShowModal(false);
  // };

  // const handleTemplateSelect = (template) => {
  //   if (selectedRow) {
  //     const instanceId = uuidv4(); // or Date.now() if you don't want to import uuid again

  //     // Store full template + instance-specific data
  //     const templateInstance = {
  //       ...template,
  //       instanceId, // ← unique per selection
  //       originalTemplateId: template.templateId || template._id,
  //     };

  //     setRowTemplates((prev) => ({
  //       ...prev,
  //       [selectedRow.id]: templateInstance,
  //     }));

  //     // Update the command field with the template name
  //     const updatedCommands = commands.map((cmd) => {
  //       if (cmd.id === selectedRow.id) {
  //         return {
  //           ...cmd,
  //           command: template.templateName,
  //           // variableParameters: template.variableParameters,
  //           variableParameters: { ...template.variableParameters },
  //           template_mongo_id: template.templateId || template._id,
  //           template_instance_id: instanceId,
  //         };
  //       }
  //       return cmd;
  //     });

  //     setCommands(updatedCommands);

  //     // Update selected templates
  //     setSelectedTemplates((prev) => {
  //       const exists = prev.some(
  //         (t) => t.templateId === template.templateId || t._id === template._id
  //       );
  //       return exists ? prev : [...prev, template];
  //     });
  //   }

  //   setSelectedTemplate(template);
  //   setShowModal(false);
  //   setInputType("marketplace"); // Ensure input type is set to marketplace
  // };

  //   const handleTemplateSelect = (template) => {
  //   if (selectedRow) {
  //     // ✅ Generate a unique instance ID for this usage
  //     const instanceId = uuidv4(); // or Date.now() if you don't want to import uuid again

  //     // Store full template + instance-specific data
  //     const templateInstance = {
  //       ...template,
  //       instanceId, // ← unique per selection
  //       originalTemplateId: template.templateId || template._id,
  //     };

  //     setRowTemplates((prev) => ({
  //       ...prev,
  //       [selectedRow.id]: templateInstance, // keyed by row ID
  //     }));

  //     // Update the command row with:
  //     // - template name for display
  //     // - instanceId as template_mongo_id (now unique!)
  //     // - initial variableParameters (can be edited later if needed)
  //     setCommands((prevCommands) =>
  //       prevCommands.map((cmd) =>
  //         cmd.id === selectedRow.id
  //           ? {
  //               ...cmd,
  //               command: template.templateName,
  //               template_mongo_id: instanceId, // ✅ unique per use
  //               variableParameters: { ...template.variableParameters }, // clone
  //             }
  //           : cmd
  //       )
  //     );

  //     // Optional: track selected templates (not strictly needed anymore)
  //     setSelectedTemplates((prev) => [...prev, templateInstance]);
  //   }

  //   setShowModal(false);
  //   setInputType("marketplace");
  // };

  const handleTemplateSelect = (template) => {
    if (selectedRow) {
      const instanceId = uuidv4();

      // Store full template + instance-specific data
      const templateInstance = {
        ...template,
        instanceId,
        originalTemplateId: template.templateId || template._id,
      };

      setRowTemplates((prev) => ({
        ...prev,
        [selectedRow.id]: templateInstance,
      }));

      // Update the command field with the template name
      const updatedCommands = commands.map((cmd) => {
        if (cmd.id === selectedRow.id) {
          return {
            ...cmd,
            command: template.templateName,
            variableParameters: { ...template.variableParameters },
            templateName: template.templateName,
            template_mongo_id: template.templateId || template._id,
            templateVersion: template.templateVersion,
            template_instance_id: instanceId,
            // Initialize args if the template has enableArguments
            args: template.enableArguemts ? "" : cmd.args,
          };
        }
        return cmd;
      });

      setCommands(updatedCommands);

      setSelectedTemplates((prev) => {
        const exists = prev.some(
          (t) => t.templateId === template.templateId || t._id === template._id
        );
        return exists ? prev : [...prev, template];
      });
    }

    setSelectedTemplate(template);
    setShowModal(false);
    setInputType("marketplace");
  };

  const handleNewCommandAdd = (row) => {
    setCommands((prevCommands) => {
      const updatedCommands = [...prevCommands];
      const rowIndex = updatedCommands.findIndex((cmd) => cmd.id === row.id);

      if (rowIndex !== -1) {
        const clonedRow = {
          ...newCommandObject,
          id: Date.now(),
          editMode: true,
          actionType: "",
        };

        updatedCommands.splice(rowIndex + 1, 0, clonedRow);
      }
      setInputType(null);

      return updatedCommands;
    });
  };

  const commandCategories = commandCategoryData?.map((cat) => ({
    label: cat.commandCategory,
    value: cat.commandCategory,
  }));

  const RUN_AS_OPTIONS = React.useMemo(() => {
    if (userConfigurations && userConfigurations.length) {
      const options = [];

      userConfigurations.forEach((config) => {
        // skip configs with PENDING_APPROVAL status
        if (config.status === "PENDING_APPROVAL") return;

        if (config.value) {
          options.push({
            value: config.value,
            label: config.value,
          });
        }

        if (config.userList && Array.isArray(config.userList)) {
          config.userList.forEach((user) => {
            options.push({
              value: user.value,
              label: user.value,
            });
          });
        }
      });

      return options;
    }
    return [];
  }, [userConfigurations]);
  const alwaysVisibleColumns = [
    {
      field: "actionType",
      headerName: "Action Type",
      minwidth: 250,
      headerAlign: "center",
      renderHeader: () => (
        <div
          style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600 }}
        >
          Action Type{" "}
          <span style={{ color: "red", marginLeft: "4px", fontSize: "20px" }}>
            *
          </span>
        </div>
      ),
      renderCell: (params) => {
        return params.row.editMode ? (
          <div className="labelled-input-container">
            <Autocomplete
              disablePortal
              options={commandCategories}
              getOptionLabel={(option) => option.label}
              value={
                commandCategories.find(
                  (cat) => cat.value === params.row.actionType
                ) ||
                // commandCategories[0] ||
                null
              }
              onChange={(event, newValue) => {
                const actionTypeValue = newValue ? newValue.value : "";
                setActionTypeFromJob(actionTypeValue);
                handleCommandObjectChange(
                  { target: { value: newValue ? newValue.value : "" } },
                  "actionType",
                  params.row
                );
                if (!actionTypeValue) {
                  handleCommandObjectChange(
                    { target: { value: "" } },
                    "command",
                    params.row
                  );
                  setInputType(null);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={UI_TEXTS.PLACEHOLDERS.SELECT}
                  variant="outlined"
                  size="small"
                />
              )}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                },
                width: "100%",
              }}
              disabled={viewOnly}
            />
          </div>
        ) : (
          params.value
        );
      },
    },

    {
      field: "description",
      headerName: "Job Description",
      minwidth: 300,
      headerAlign: "center",
      renderHeader: () => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600 }}
          >
            Mapping{" "}
            <span style={{ color: "red", marginLeft: "4px", fontSize: "20px" }}>
              *
            </span>
          </div>
          <Tooltip title="Mapping is required for Command Action type." arrow>
            <IconButton size="small" sx={{ marginLeft: "5px", padding: 0 }}>
              <InfoOutlinedIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        </div>
      ),
      renderCell: (params) => {
        return params.row.editMode ? (
          <Tooltip
            title={
              inputType !== "manual" ? "Not required for this action type" : ""
            }
            arrow
            placement="bottom"
          >
            <div className="labelled-input-container">
              <OutlinedInput
                inputRef={(el) => {
                  if (el) inputRefs_mapping.current.set(params.row.id, el);
                }}
                onFocus={() => handleFocus(params.row.id, "description")}
                autoFocus={focusedInput === `${params.row.id}-description`}
                disabled={inputType !== "manual"}
                variant="filled"
                size="small"
                id="description"
                aria-describedby="outlined-weight-helper-text"
                placeholder="Enter Mapping"
                inputProps={{
                  "aria-label": "weight",
                  "data-testid": "sidedrawer-desc-field",
                }}
                value={params.row?.description}
                onChange={(e) => {
                  const { selectionStart, selectionEnd } = e.target;
                  setCaretForRow_mapping(
                    params.row.id,
                    selectionStart,
                    selectionEnd
                  );
                  handleCommandObjectChange(e, "description", params.row);
                  // handleDescriptionBlur(e, params.row);
                  requestAnimationFrame(() =>
                    restoreCaretForRow_mapping(params.row.id)
                  );
                }}
                onBlur={(e) => {
                  // Move blur handling here (don’t call it inside onChange)
                  handleDescriptionBlur?.(e, params.row);
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === " ") {
                    handleCommandObjectChange(
                      { target: { value: params.row?.description + " " } },
                      "description",
                      params.row,
                      true
                    );
                  }
                }}
                sx={{
                  borderRadius: "30px",
                  "&.Mui-disabled": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    cursor: "not-allowed",
                  },
                }}
              />
            </div>
          </Tooltip>
        ) : (
          params.value || "—"
        );
      },
    },
    {
      field: "actionDescription",
      headerName: "Action Description",
      minwidth: 300,
      headerAlign: "center",
      renderHeader: () => (
        <div
          style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600 }}
        >
          Action Description
        </div>
      ),
      renderCell: (params) => {
        return params.row.editMode ? (
          <div className="labelled-input-container">
            <OutlinedInput
              inputRef={(el) => {
                if (el) inputRefs.current.set(params.row.id, el);
              }}
              onFocus={() => handleFocus(params.row.id, "actionDescription")}
              autoFocus={focusedInput === `${params.row.id}-actionDescription`}
              // disabled={inputType !== "manual"}
              variant="filled"
              size="small"
              id="actionDescription"
              aria-describedby="outlined-weight-helper-text"
              placeholder="Enter Action Description"
              inputProps={{
                "aria-label": "weight",
                "data-testid": "action-description-field",
              }}
              value={params.row?.actionDescription || ""}
              onChange={(e) => {
                const { selectionStart, selectionEnd } = e.target;
                setCaretForRow(params.row.id, selectionStart, selectionEnd);
                handleCommandObjectChange(e, "actionDescription", params.row);
                requestAnimationFrame(() => restoreCaretForRow(params.row.id));
              }}
              sx={{ borderRadius: "30px" }}
            />
          </div>
        ) : (
          params.value || "—"
        );
      },
    },
    {
      field: "command",
      headerName: "Command",
      minwidth: 300,
      headerAlign: "center",
      renderHeader: () => (
        <div
          style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600 }}
        >
          {inputType === "marketplace"
            ? UI_TEXTS.HEADER_TEXT.SCRIPT
            : UI_TEXTS.HEADER_TEXT.COMMAND}
          <span style={{ color: "red", marginLeft: "4px", fontSize: "20px" }}>
            *
          </span>
        </div>
      ),

      renderCell: (params) => {
        if (params.row.editMode) {
          if (!inputType) {
            return (
              <Select
                value=""
                onChange={(e) => setInputType(e.target.value)}
                displayEmpty
                fullWidth
                size="small"
                sx={{ borderRadius: "30px" }}
              >
                <MenuItem value="" disabled>
                  {UI_TEXTS.SELECT_TEXT.SELECT_INPUT_METHOD}
                </MenuItem>
                {/* <MenuItem value="manual" disabled={params?.row?.actionType?.toLowerCase() !== "command"}>
                  {UI_TEXTS.SELECT_TEXT.MANUAL_INPUT}
                </MenuItem> */}
                {params?.row?.actionType?.toLowerCase() === "command" && (
                  <MenuItem value="manual">
                    {UI_TEXTS.SELECT_TEXT.MANUAL_INPUT}
                  </MenuItem>
                )}
                {params?.row?.actionType?.toLowerCase() !== "command" && (
                  <MenuItem
                    value="marketplace"
                    onClick={() => {
                      setSelectedRow(params.row);
                      setShowModal(true);
                    }}
                  >
                    {UI_TEXTS.SELECT_TEXT.CHOOSE_FROM_MARKET_PLACE}
                  </MenuItem>
                )}
              </Select>
            );
          }

          if (inputType === "manual") {
            return (
              <div className="labelled-input-container">
                <OutlinedInput
                  inputRef={(el) => {
                    if (el) inputRefs_command.current.set(params.row.id, el);
                  }}
                  onFocus={() => handleFocus(params.row.id, "command")}
                  autoFocus={focusedInput === `${params.row.id}-command`}
                  disabled={
                    viewOnly ||
                    params.row?.actionType?.toLowerCase() === "script"
                  }
                  id="manual-input"
                  variant="filled"
                  size="small"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_COMMAND}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === " ") {
                      handleCommandObjectChange(
                        { target: { value: params.row?.command + " " } },
                        "command",
                        params.row
                      );
                    }
                  }}
                  sx={{ borderRadius: "30px" }}
                  inputProps={{
                    "aria-label": "weight",
                  }}
                  value={params.row?.command}
                  onChange={(e) => {
                    const { selectionStart, selectionEnd } = e.target;
                    setCaretForRow_command(
                      params.row.id,
                      selectionStart,
                      selectionEnd
                    );
                    handleCommandObjectChange(e, "command", params.row);
                    requestAnimationFrame(() =>
                      restoreCaretForRow_command(params.row.id)
                    );
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        // disabled={
                        //   inputType === "manual" || inputType === "marketplace"
                        // }
                        onClick={() => {
                          handleCommandObjectChange(
                            { target: { value: "" } },
                            "command",
                            params.row
                          );
                          setInputType(null);
                        }}
                        edge="end"
                        sx={{
                          padding: "4px",
                          color: "rgba(0, 0, 0, 0.54)",
                          marginRight: "-8px", // Adjust positioning
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </div>
            );
          }
          // Replace the marketplace inputType section with:
          if (inputType === "marketplace") {
            return (
              <>
                {/* {selectedTemplates.length > 0 && ( */}
                <div className="labelled-input-container">
                  <TemplateTooltip
                    // template={selectedTemplates.find(
                    //   (t) => t.templateId === params.row.template_mongo_id
                    // )}
                    template={rowTemplates[params.row.id]}
                  >
                    <OutlinedInput
                      // value={
                      //   selectedTemplates.find(
                      //     (t) => t._id === params.row.template_mongo_id
                      //   )?.templateName || ""
                      // }
                      value={
                        selectedTemplates.find(
                          (t) => t.templateId === params.row.template_mongo_id
                        )?.templateName || ""
                      }
                      fullWidth
                      size="small"
                      sx={{ borderRadius: "30px" }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            // disabled={inputType === "marketplace"}
                            onClick={() => {
                              handleCommandObjectChange(
                                { target: { value: "" } },
                                "command",
                                params.row
                              );
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
                  </TemplateTooltip>
                </div>
                {/* )} */}
              </>
            );
          }
        }

        if (!params.row.editMode) {
          const matchedTemplate = codeTemplates.find(
            (t) => t.templateId === params.row.template_mongo_id
          );
          if (matchedTemplate) {
            return (
              <TemplateTooltip template={matchedTemplate}>
                <div style={{ width: "120px" }}>
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      color: "#2961F4",
                      border: "1px solid #2961F4",
                      fontSize: "12px",
                      backgroundColor: "transparent !important",
                      fontFamily: "Manrope",
                      minWidth: "100px",
                      height: "25px",
                      padding: "3px",
                      fontWeight: "600",
                      borderRadius: "16px",
                    }}
                  >
                    {matchedTemplate.templateName}
                  </span>
                </div>
              </TemplateTooltip>
            );
          }

          return (
            <Tooltip title={params.value}>
              <span style={{ width: "120px" }} placement="bottom">
                {params.value?.length > 100
                  ? params.value.slice(0, 80) + "..."
                  : params.value || ""}
              </span>
            </Tooltip>
          );
        }
      },
    },
    {
      field: "runAs",
      headerName: "Run As",
      minwidth: 250,
      headerAlign: "center",
      renderHeader: () => (
        <div
          style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600 }}
        >
          Run As
          <span style={{ color: "red", marginLeft: "4px", fontSize: "20px" }}>
            *
          </span>
        </div>
      ),
      renderCell: (params) => {
        if (params.row.editMode && !params.row.runAs && runAsCurrentUser) {
          params.row.runAs = username;
        }

        return params.row.editMode ? (
          <div className="labelled-input-container">
            <Autocomplete
              disablePortal
              options={RUN_AS_OPTIONS || []}
              getOptionLabel={(option) => option.label}
              value={
                runAsCurrentUser
                  ? { label: "logged-in user", value: username }
                  : RUN_AS_OPTIONS?.find(
                      (opt) => opt.value === params.row.runAs
                    ) || { label: "", value: "" }
              }
              onChange={(event, newValue) => {
                handleCommandObjectChange(
                  { target: { value: newValue ? newValue.value : "" } },
                  "runAs",
                  params.row
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={UI_TEXTS.PLACEHOLDERS.SEARCH_OR_SELECT_USER}
                  variant="outlined"
                  size="small"
                />
              )}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                },
                width: "100%",
              }}
              disabled={viewOnly || runAsCurrentUser}
            />
          </div>
        ) : runAsCurrentUser ? (
          "logged-in user"
        ) : RUN_AS_OPTIONS?.find((opt) => opt.value === params.row.runAs) ? (
          params.row.runAs
        ) : (
          ""
        );
      },
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 200,
      headerAlign: "center",
      renderHeader: () => (
        <div
          style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600 }}
        >
          {UI_TEXTS.HEADER_TEXT.TAGS}
        </div>
      ),
      renderCell: (params) => {
        return params.row.editMode ? (
          <div className="labelled-input-container">
            <MultiSelectWithCreateOption
              sx={{ width: "100%", height: "2.5rem", borderRadius: "30px" }}
              label="Create Tags"
              selectedValues={params.row?.tags} // Pass selectedValues as a prop
              onSelectionChange={(value) =>
                handleCommandObjectChange(
                  { target: { value } },
                  "tags",
                  params.row
                )
              } // Pass the handler
            />
          </div>
        ) : (
          <div
            className="tags-display-container"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {Array.isArray(params.value)
              ? params.value.join(", ")
              : params.value}
          </div>
        );
      },
    },
    {
      field: "osInstanceType",
      headerName: UI_TEXTS.HEADER_TEXT.SERVER_TYPE,
      width: 200,
      headerAlign: "center",
      renderHeader: () => (
        <div
          style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600 }}
        >
          {UI_TEXTS.HEADER_TEXT.SERVER_TYPE}
        </div>
      ),
      renderCell: (params) => {
        return params.row.editMode ? (
          <div className="labelled-input-container">
            <Autocomplete
              disablePortal
              options={serverTypeData?.map((type) => ({
                label: type,
                value: type,
              }))}
              getOptionLabel={(option) => option.label}
              value={
                serverTypeData.find(
                  (type) => type === params.row.osInstanceType
                )
                  ? {
                      label: params.row.osInstanceType,
                      value: params.row.osInstanceType,
                    }
                  : null
              }
              onChange={(event, newValue) => {
                handleCommandObjectChange(
                  { target: { value: newValue ? newValue.value : "" } },
                  "osInstanceType",
                  params.row
                );
                setServerTypesData(newValue ? newValue.value : "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={UI_TEXTS.PLACEHOLDERS.SEARCH_OR_SELECT}
                  variant="outlined"
                  size="small"
                />
              )}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                },
                width: "100%",
              }}
              disabled={viewOnly}
            />
          </div>
        ) : (
          params.value
        );
      },
    },
    {
      field: "workflowTrigger",
      headerName: "Workflow Trigger",
      minWidth: 200,
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderHeader: () => (
        <div
          style={{
            fontFamily: "Manrope",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Workflow Trigger
          {isEventBasedTrigger && (
            <Tooltip
              title="Configure workflow triggers based on command results"
              arrow
            >
              <IconButton size="small" sx={{ marginLeft: "5px", padding: 0 }}>
                <InfoOutlinedIcon fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
          )}
        </div>
      ),
      renderCell: (params) => {
        if (!isEventBasedTrigger) {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <span
                style={{
                  color: "#999",
                  fontStyle: "italic",
                  fontFamily: "Manrope",
                }}
              >
                Not enabled
              </span>
            </div>
          );
        }

        const hasWorkflowEvents =
          params.row.workflowEvents && params.row.workflowEvents.length > 0;
        const triggerConfig = workflowTriggers[params.row.id];
        const hasTrigger = triggerConfig && triggerConfig.enabled;

        if (params.row.editMode) {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Select
                value={hasTrigger ? "yes" : "no"}
                onChange={(e) => {
                  if (e.target.value === "yes") {
                    setSelectedCommandId(params.row.id);
                    setShowWorkflowModal(true);
                  } else {
                    // Remove trigger configuration
                    setWorkflowTriggers((prev) => {
                      const updated = { ...prev };
                      delete updated[params.row.id];
                      return updated;
                    });
                  }
                }}
                displayEmpty
                size="small"
                sx={{
                  borderRadius: "30px",
                  minWidth: "150px",
                  // backgroundColor: 'white',
                  "& .MuiSelect-select": {
                    padding: "6px 32px 6px 12px",
                    fontSize: "14px",
                  },
                }}
                disabled={viewOnly}
              >
                <MenuItem value="no">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ color: "#999" }}>No</span>
                  </div>
                </MenuItem>
                <MenuItem value="yes">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {/* <CheckCircleOutlineOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'green' }} /> */}
                    <span>Yes</span>
                  </div>
                </MenuItem>
              </Select>

              {hasTrigger && (
                <Tooltip
                  title={`Configured for ${
                    triggerConfig.workflows?.length || 0
                  } workflows`}
                  arrow
                >
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedCommandId(params.row.id);
                      setShowWorkflowModal(true);
                    }}
                    sx={{ ml: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          );
        }

        // View mode (not editMode)
        if (hasWorkflowEvents || (triggerConfig && triggerConfig.enabled)) {
          const workflowCount = hasWorkflowEvents
            ? params.row.workflowEvents.length
            : triggerConfig?.workflows?.length || 0;

          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <Chip
                label={`${workflowCount} workflows`}
                size="small"
                color="primary"
                variant="outlined"
                onClick={
                  viewOnly
                    ? undefined
                    : () => {
                        setSelectedCommandId(params.row.id);
                        setShowWorkflowModal(true);
                      }
                }
                sx={{
                  cursor: viewOnly ? "default" : "pointer",
                  fontFamily: "Manrope",
                  "&:hover": viewOnly
                    ? {}
                    : {
                        backgroundColor: "primary.light",
                      },
                }}
              />
            </div>
          );
        }

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              fontFamily: "Manrope",
            }}
          >
            <span style={{ color: "#999" }}>—</span>
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      minwidth: 250,
      headerAlign: "center",
      renderCell: (params) => {
        if (params.row?.editMode) {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Tooltip title="Save Command" arrow>
                <IconButton
                  size="small"
                  // disabled={
                  //   !handleTick(
                  //     params.row,
                  //     descriptionCmdValidate,
                  //     runAsCurrentUser
                  //   )
                  // }
                  disabled={!handleTick(params.row)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!params.row.actionType && commandCategories?.length) {
                      handleCommandObjectChange(
                        { target: { value: commandCategories[0]?.value } },
                        "actionType",
                        params.row
                      );
                    }
                    handleCommandObjectChange(
                      { target: { value: false } },
                      "editMode",
                      params.row
                    );
                  }}
                  color="primary"
                  data-testid="add-versions"
                  aria-label="add"
                >
                  <TickCircle
                    size="20"
                    color={
                      handleTick(
                        params.row
                        // descriptionCmdValidate,
                        // runAsCurrentUser
                      )
                        ? "#75C02B"
                        : "#B0B0B0"
                    }
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Cancel" arrow>
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => handleCancelBtn(params.row, e)}
                  aria-label="cancel-command"
                >
                  <CloseCircle size="20" color={"#B02222"} />
                </IconButton>
              </Tooltip>
            </div>
          );
        } else {
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <Tooltip title={"Add New Command"} arrow>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleNewCommandAdd(params.row)}
                  aria-label={"Add New Command"}
                  disabled={viewOnly}
                >
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={"Clone"} arrow>
                <IconButton
                  size="small"
                  onClick={() => handleCloneCommand(params.row)}
                  aria-label={"Clone"}
                  disabled={viewOnly}
                >
                  <img
                    src={CloneTemplateIcon}
                    alt="Clone"
                    style={{
                      filter: viewOnly ? "grayscale(100%)" : "none",
                      opacity: viewOnly ? 0.38 : 1,
                      cursor: viewOnly ? "not-allowed" : "pointer",
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title={"Edit"} arrow>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) =>
                    handleCommandObjectChange(
                      { target: { value: true } },
                      "editMode",
                      params.row
                    )
                  }
                  disabled={viewOnly}
                  aria-label="Edit"
                >
                  <img
                    src={Editconfigimg}
                    alt="Edit"
                    style={{
                      filter: viewOnly ? "grayscale(100%)" : "none",
                      opacity: viewOnly ? 0.38 : 1,
                      cursor: viewOnly ? "not-allowed" : "pointer",
                    }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title={"Delete"} arrow>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteCommand(params.row)}
                  aria-label={"Delete"}
                  disabled={viewOnly}
                >
                  <img
                    src={DeleteIcon}
                    alt="Delete"
                    style={{
                      filter: viewOnly ? "grayscale(100%)" : "none",
                      opacity: viewOnly ? 0.38 : 1,
                      cursor: viewOnly ? "not-allowed" : "pointer",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          );
        }
      },
    },
  ];

  const CustomRow = ({
    row,
    openRow,
    handleRowClick,
    alwaysVisibleColumns,
    expandableColumns,
  }) => {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            marginTop: "2.5px",
            borderBottom: "0.5px solid #E0E0E0",
          }}
        >
          {/* Always visible columns */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {alwaysVisibleColumns.map((column) => (
              <div
                key={`${row.id}-${column.field}`}
                style={{
                  textAlign: "center",
                  width: column.width,
                  padding: "4px",
                  minWidth: column.minWidth,
                  flex: column?.flex ? column.flex : 1,
                }}
              >
                {column.renderCell
                  ? column.renderCell({
                      row,
                      value: row[column.field],
                      field: column.field,
                    })
                  : row[column.field]}
              </div>
            ))}
          </div>

          {/* Expanded content */}
          {false && openRow[row.id] && (
            <div
              style={{
                padding: "8px",
                backgroundColor: "#f9f9f9",
                display: "flex",
                flexDirection: "column",
                background: "center",
              }}
            >
              {/* Header row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                  padding: "0 16px",
                  marginBottom: "8px",
                }}
              >
                {expandableColumns.map((column) => (
                  <div
                    key={`header-${column.field}`}
                    style={{
                      // fontWeight: '600',
                      color: "#272727",
                      fontSize: "15px",
                    }}
                  >
                    {column.headerName}
                  </div>
                ))}
              </div>

              {/* Content row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                  padding: "0 16px",
                }}
              >
                {expandableColumns.map((column) => (
                  <div key={`${row.id}-exp-${column.field}`}>
                    {column.renderCell
                      ? column.renderCell({
                          row,
                          value: row[column.field],
                          field: column.field,
                        })
                      : row[column.field]}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  };
  //Filter changes
  const fetchInitialData = async () => {
    setFilterLoading(true);
    try {
      const response = await getJobFilterValues();

      if (response?.data) {
        const data = response.data;
        setFilterOptions(data);
      }

      setFilterLoading(false);
    } catch (error) {
      setFilterLoading(false);
    } finally {
      setFilterLoading(false);
    }
  };
  useEffect(() => {
    fetchInitialData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(
          getHosts({
            selectedCI: selectedCI.length > 0 ? selectedCI.join(",") : "",
            selectedEnv: selectedEnv.length > 0 ? selectedEnv.join(",") : "",
            selectedRegion:
              selectedRegion.length > 0 ? selectedRegion.join(",") : "",
            selectedPlatform:
              selectedPlatform.length > 0 ? selectedPlatform.join(",") : "",
            selectedSID: selectedSID.length > 0 ? selectedSID.join(",") : "",
          })
        );
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_LOAD_REQUESTS);
      } finally {
        setFilterLoading(false);
      }
    };

    fetchData();
  }, [selectedCI, selectedEnv, selectedRegion, selectedPlatform, selectedSID]);
  useEffect(() => {}, [commandCategoryData]);

  const [hostNames, setHostNames] = useState([]);
  const [sapFactsFilterSelectedOptions, setSapFactsFilterSelectedOptions] =
    useState([]);
  const [sapFactsFilterOptions, setSapFactsFilterOptions] = useState([]);
  const handleSapFactsFiltersSelectionChange = (
    filterKey,
    newSelectedValues
  ) => {
    setSapFactsFilterSelectedOptions((prev) => {
      if (!newSelectedValues || newSelectedValues.length === 0) {
        // remove that key entirely
        const { [filterKey]: _, ...rest } = prev;
        return rest;
      } else {
        // update with new values
        return {
          ...prev,
          [filterKey]: newSelectedValues,
        };
      }
    });
    setRecentFilter(filterKey);
  };
  const getHostData = async () => {
    let query = "?";

    Object.keys(sapFactsFilterSelectedOptions).forEach((el) => {
      // 1. Process the array elements
      const encodedValues = sapFactsFilterSelectedOptions[el].map((item) =>
        // Replace newline character '\n' with its URL-encoded form '%0A'
        item.replace(/\n/g, "%0A")
      );

      // 2. Join the processed elements with a comma
      const joinedValues = encodedValues.join(",");

      // 3. Append to the query string
      // Note: The key 'el' must also be URI-encoded, but since it contains no
      // special characters here, we can skip it for simplicity.
      query += `&${el}=${joinedValues}`;
    });

    try {
      const response = await dispatch(getSapFactHosts(query));
      let fetchedData = response?.data?.data || [];
      if (fetchedData.length) {
        const fetchedHostNames = fetchedData.map((el) => el?.hostname);
        setHostNames(fetchedHostNames);
      }
    } catch (error) {
      console.error("Error fetching host data:", error);
      toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_FETCH_HOST_DATA);
    } finally {
      setLoading(false);
    }
  };

  function createOptions(inputObj) {
    const output = {};

    Object.keys(inputObj).forEach((key) => {
      const originalArray = inputObj[key];
      const transformedArray = originalArray.map((item) => ({
        value: item,
        checked: false,
      }));
      output[key] = transformedArray;
    });
    return output;
  }

  useEffect(() => {
    getHostData();
  }, [sapFactsFilterSelectedOptions]);

  const getFilterOptions = async () => {
    let query = "?";
    if (recentFilter) {
      query = query + `recentFilter=${recentFilter}`;
    }
    Object.keys(sapFactsFilterSelectedOptions).forEach((el) => {
      // 1. Process the array elements
      const encodedValues = sapFactsFilterSelectedOptions[el].map((item) =>
        // Replace newline character '\n' with its URL-encoded form '%0A'
        item.replace(/\n/g, "%0A")
      );

      // 2. Join the processed elements with a comma
      const joinedValues = encodedValues.join(",");

      // 3. Append to the query string
      // Note: The key 'el' must also be URI-encoded, but since it contains no
      // special characters here, we can skip it for simplicity.
      query += `&${el}=${joinedValues}`;
    });
    const response = await dispatch(getSapFactsFilterOptions(query));
    if (response.status === 200) {
      const { accountToSudo, osInstance, osInstanceType, osSystemId } =
        response.data.data;
      const filterOptions = {
        accountToSudo,
        osInstance,
        osInstanceType,
        osSystemId,
      };
      setSapFactsFilterOptions(createOptions(filterOptions));
    }
  };

  useEffect(() => {
    getFilterOptions();
  }, [sapFactsFilterSelectedOptions]);

  return (
    <>
      <div
        className={classes.iabot_drawer_main_container}
        style={{ minWidth: !isLoadingInHost ? "100vw" : "95vw" }}
      >
        {isAdding && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <ModalCustomLoader isLoading={true} />
          </div>
        )}
        <div
          className="add-job-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 .5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{ color: "#d51900", fontSize: "22px", cursor: "pointer" }}
              onClick={() => {
                history.push(!isLoadingInHost ? "/dashboard" : "");
              }}
            >
              <TbArrowBigLeftFilled />
            </span>
            <div
              style={{ height: "24px", width: "1px", backgroundColor: "#ccc" }}
            ></div>
            <h2
              data-testid="sidedrawer-heading"
              style={{
                margin: 0,
                fontSize: "1.125rem",
                fontWeight: 300,
                color: "#212121",
              }}
            >
              {getHeaderText()}
            </h2>
          </div>

          {/* Center: Tabs */}
          <Tabs
            value={activeStep}
            onChange={(e, val) => setActiveStep(val)}
            centered
            sx={{ flex: 1, borderBottom: "none", ml: 4, mr: 4 }}
          >
            {steps.map((label, index) => (
              <Tab key={label} label={<span>{label}</span>} value={index} />
            ))}
          </Tabs>

          {/* Right Side: Edit/View toggle and Run As Switch */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {singleJob && (
              <Tooltip
                title={
                  viewOnly
                    ? UI_TEXTS.TOOLTIP_TEXT.SWITCH_TO_EDIT_MODE
                    : UI_TEXTS.TOOLTIP_TEXT.SWITCH_TO_VIEW_MODE
                }
              >
                {writePermForSchedule &&
                  singleJob?.status !== "PENDING_APPROVAL" && (
                    <IconButton
                      onClick={() => setViewOnly(!viewOnly)}
                      color="primary"
                      size="small"
                      sx={{ borderRadius: "4px", padding: "6px" }}
                    >
                      {viewOnly ? (
                        <EditIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </IconButton>
                  )}
              </Tooltip>
            )}

            <div
              className="custom-input-wrapper"
              style={{ display: "flex", gap: "8px", alignItems: "center" }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Tooltip
                  title="Note: Only Adhoc and Execute one time is allowed when 'Run as Self' is true"
                  arrow
                  placement="top"
                >
                  <IconButton
                    size="small"
                    sx={{ padding: "4px", ml: "4px", mb: "6px" }}
                  >
                    <InfoOutlined fontSize="small" color="info" />
                  </IconButton>
                </Tooltip>
                <span className="custom-label">{UI_TEXTS.LABELS.RUN_AS}</span>
              </div>
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={runAsCurrentUser}
                      onChange={
                        singleJob
                          ? undefined
                          : (e) => setRunAsCurrentUser(e.target.checked)
                      }
                      disabled={singleJob}
                      readOnly={singleJob}
                      inputProps={{ readOnly: singleJob }}
                    />
                  }
                  label={`(${username})`}
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontWeight: 500,
                      color: "text.primary",
                    },
                  }}
                />
                {/** Don't remove needed for future development */}
                {/* {!runAsCurrentUser && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ lineHeight: 1, mt: "-4px" }}
                  >
                    {UI_TEXTS.MESSAGES.THIS_REQUIRES_FURTHER_APPROVAL}
                  </Typography>
                )} */}
              </span>
            </div>
          </div>
        </div>

        {/* Form Fields */}

        {activeStep === 0 && (
          <Box>
            {" "}
            <div
              className="main-wrapper"
              style={{
                padding: ".5rem 3rem",
                height: "calc(100vh - 170px)",
                overflow: "auto",
              }}
            >
              <div className="job-section">
                {" "}
                <div className="section-header" style={{ marginBottom: "8px" }}>
                  <span className="section-icon">1</span>
                  <h3 style={{ margin: "0" }}>
                    {/* {UI_TEXTS.HEADINGS.SCHEDULE_INFORMATION} */}
                  </h3>
                </div>
                <div className="upper-fields-wrapper-3">
                  {/* Job Description */}
                  <div className="custom-input-wrapper">
                    <span className="custom-label">
                      {UI_TEXTS.LABELS.SCHEDULE_DESCRIPTION}
                      <span className={classes.iabot_required}>*</span>
                    </span>
                    <OutlinedInput
                      disabled={viewOnly}
                      readOnly={viewOnly}
                      id="job-description"
                      variant="filled"
                      aria-describedby="outlined-weight-helper-text"
                      placeholder={UI_TEXTS.PLACEHOLDERS.DESCRIPTION}
                      inputProps={{
                        "aria-label": "weight",
                        readOnly: viewOnly,
                      }}
                      value={description}
                      onChange={viewOnly ? undefined : handleDescriptionChange}
                      onFocus={
                        viewOnly
                          ? undefined
                          : (e) => {
                              e.stopPropagation();
                              setFocusedInput(null);
                            }
                      }
                      sx={{ borderRadius: "30px" }}
                    />
                    {nameError && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {nameError}
                      </Typography>
                    )}
                  </div>
                  {/* Schedule Type */}
                  <div className="custom-input-wrapper">
                    <span className="custom-label">
                      {UI_TEXTS.LABELS.SCHEDULE_TYPE}
                      <span className="iabot_required">*</span>
                    </span>
                    <Autocomplete
                      disablePortal
                      options={
                        privacy
                          ? SCHEDULE_TYPE_OPTIONS.filter(
                              (option) =>
                                option.value === "AD_HOC" ||
                                option.value === "NORMAL"
                            )
                          : runAsCurrentUser
                          ? SCHEDULE_TYPE_OPTIONS_AD_HOC
                          : SCHEDULE_TYPE_OPTIONS
                      }
                      getOptionLabel={(option) => option.label}
                      value={
                        SCHEDULE_TYPE_OPTIONS.find(
                          (opt) => opt.value === scheduleType
                        ) || null
                      }
                      onChange={
                        viewOnly
                          ? undefined
                          : (event, newValue) => {
                              setScheduleType(newValue ? newValue.value : "");
                            }
                      }
                      readOnly={viewOnly}
                      disabled={viewOnly}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={
                            UI_TEXTS.PLACEHOLDERS.SEARCH_OR_SELECT_SCHEDULE_TYPE
                          }
                          variant="outlined"
                          size="small"
                          inputProps={{
                            ...params.inputProps,
                            readOnly: viewOnly,
                          }}
                        />
                      )}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "30px",
                          height: "2.8em",
                        },
                      }}
                    />
                  </div>

                  <div className="custom-input-wrapper">
                    <span className="custom-label">
                      {UI_TEXTS.PLACEHOLDERS.SELECT_FREQUENCY}
                      {scheduleType === "AD_HOC" && (
                        <Tooltip
                          title="Frequency selection is disabled for Ad-hoc schedules"
                          arrow
                        >
                          <IconButton
                            size="small"
                            sx={{ marginLeft: "5px", padding: 0 }}
                          >
                            <InfoOutlinedIcon
                              fontSize="small"
                              color="primary"
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                    </span>

                    <CronMultiSelect
                      isDisabled={
                        viewOnly ||
                        !scheduleType ||
                        scheduleType === "STARTUP" ||
                        scheduleType === "AD_HOC" ||
                        (privacy && scheduleType === "NORMAL")
                      }
                      options={
                        runAsCurrentUser
                          ? showDropdownOptionEOT
                          : scheduleType === "STARTUP_WITH_SCHEDULE"
                          ? showDropdownOption.filter(
                              (option) => option.value !== "Execute one time"
                            )
                          : showDropdownOption
                      }
                      onChange={
                        viewOnly
                          ? undefined
                          : (value) => {
                              if (
                                scheduleType === "STARTUP_WITH_SCHEDULE" &&
                                value.includes("Execute one time")
                              ) {
                                setDropdown([]);
                              } else {
                                setDropdown(value);
                              }
                            }
                      }
                      placeHolderText={UI_TEXTS.PLACEHOLDERS.SELECT_FREQUENCY}
                      value={
                        scheduleType === "STARTUP_WITH_SCHEDULE" &&
                        showDropdown.includes("Execute one time")
                          ? []
                          : [showDropdown]
                      }
                      readOnly={viewOnly}
                      scheduleType={scheduleType}
                    />
                  </div>
                  {/*Category */}
                  <div className="custom-input-wrapper">
                    <span className="custom-label">
                      {UI_TEXTS.HEADINGS.CATEGORY}
                      <span className="iabot_required">*</span>
                    </span>
                    <Autocomplete
                      disablePortal
                      options={categoriesData || []}
                      getOptionLabel={(option) => option?.categoryName || ""}
                      value={
                        categoriesData.find(
                          (cat) => cat?.categoryName === category
                        ) || null
                      }
                      onChange={
                        viewOnly
                          ? undefined
                          : (event, newValue) => {
                              setCategory(
                                newValue ? newValue.categoryName : ""
                              );
                            }
                      }
                      readOnly={viewOnly}
                      disabled={viewOnly}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={
                            UI_TEXTS.PLACEHOLDERS.SEARCH_OR_SELECT_CATEGORY
                          }
                          variant="outlined"
                          size="small"
                          inputProps={{
                            ...params.inputProps,
                            readOnly: viewOnly,
                          }}
                        />
                      )}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "30px",
                          height: "2.8em",
                        },
                      }}
                    />
                  </div>

                  {/* Privacy Type */}
                  <div className="custom-input-wrapper">
                    <span className="custom-label">
                      {"Visibility"}
                      <span className="iabot_required">*</span>
                      <Tooltip
                        title="Note: Only Adhoc and Execute one time is allowed when 'Visibility' is Private"
                        arrow
                        placement="top"
                      >
                        <IconButton size="small" sx={{ padding: "4px" }}>
                          <InfoOutlined fontSize="small" color="info" />
                        </IconButton>
                      </Tooltip>
                    </span>
                    <FormControl sx={{ width: "100%" }}>
                      <Select
                        disabled={viewOnly}
                        value={privacy}
                        onChange={handlePrivacyChange}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            padding: "7px 14px",
                          },
                          borderRadius: "16px",
                        }}
                      >
                        <MenuItem value={false} className="sort-label">
                          Public
                        </MenuItem>
                        <MenuItem value={true} className="sort-label">
                          Private
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  {/* Job Tags */}
                  <div className="custom-input-wrapper">
                    <span className="custom-label">
                      {UI_TEXTS.LABELS.SCHEDULE_TAGS}
                    </span>
                    <MultiSelectWithCreateOption
                      label="Create Tags"
                      sx={{
                        width: "100%",
                        minHeight: "2.8rem",
                        maxHeight: "8rem",
                        overflowY: "auto",
                        display: "flex",
                        flexWrap: "wrap",
                        alignContent: "flex-start",
                        gap: "0.4rem",
                        padding: "0.4rem",
                      }}
                      selectedValues={tagList}
                      onSelectionChange={
                        viewOnly ? undefined : (value) => setTagList(value)
                      }
                      readOnly={viewOnly}
                      disabled={viewOnly}
                      limitTags={-1}
                    />
                  </div>
                  <div className="custom-input-wrapper">
                    <span className="custom-label">
                      {UI_TEXTS.LABELS.TIMEOUT}
                      <Tooltip
                        title={
                          UI_TEXTS.TOOLTIP_TEXT
                            .SPECIFY_TIMEOUT_IN_MILLISECONDS_WITH_LIMIT
                        }
                        arrow
                      >
                        <IconButton
                          size="small"
                          sx={{ marginLeft: "5px", padding: 0 }}
                        >
                          <InfoOutlinedIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                    </span>
                    <OutlinedInput
                      disabled={viewOnly}
                      readOnly={viewOnly}
                      variant="filled"
                      type="number"
                      id="timeout"
                      placeholder={
                        UI_TEXTS.TOOLTIP_TEXT.SPECIFY_TIMEOUT_IN_MILLISECONDS
                      }
                      aria-describedby="outlined-weight-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                        readOnly: viewOnly,
                        min: 0,
                        max: 9999999999,
                        onKeyDown: (e) => {
                          if (
                            e.key === "e" ||
                            e.key === "E" ||
                            e.key === "-" ||
                            e.key === "+" ||
                            e.key === "."
                          ) {
                            e.preventDefault(); // block exponential, sign, and decimal input
                          }
                        },
                      }}
                      value={jobTimeout}
                      onChange={
                        viewOnly
                          ? undefined
                          : (e) => {
                              const value = e.target.value;
                              if (
                                value === "" ||
                                (/^\d+$/.test(value) && value.length <= 10)
                              ) {
                                setJobTimeout(value);
                              }
                            }
                      }
                    />
                  </div>
                  {/* System Publish Toggle */}
                  {hasSystemPublishPermission && (
                    <>
                      {/* System Publish Toggle */}
                      <div className="publish_btn_wrapper">
                        <span
                          className="custom-label"
                          style={{ marginTop: "35px" }}
                        >
                          {UI_TEXTS.LABELS.IS_SYSTEM_SCHEDULE}
                          <Tooltip
                            title="When enabled, execution target will be automatically set to Global and only one schedule per system option can be created"
                            arrow
                          >
                            <IconButton
                              size="small"
                              sx={{ marginLeft: "5px", padding: 0 }}
                            >
                              <InfoOutlinedIcon
                                fontSize="small"
                                color="primary"
                              />
                            </IconButton>
                          </Tooltip>
                        </span>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={isSystemPublish}
                              onChange={(e) => {
                                setIsSystemPublish(e.target.checked);
                                if (!e.target.checked) {
                                  setSystemPublishFor("");
                                }
                              }}
                              disabled={viewOnly}
                              color="primary"
                            />
                          }
                          label={isSystemPublish ? "Enabled" : "Disabled"}
                          sx={{
                            marginTop: "15px",
                            "& .MuiFormControlLabel-label": {
                              fontWeight: 500,
                              color: "text.primary",
                              fontFamily: "Manrope",
                            },
                          }}
                        />
                      </div>

                      {/* System Publish For Dropdown */}
                      {isSystemPublish && (
                        <div className="custom-input-wrapper">
                          <span className="custom-label">
                            {UI_TEXTS.LABELS.SYSTEM_PUBLISH_FOR}
                            <span className="iabot_required">*</span>
                            <Tooltip
                              title="Only one active system schedule allowed per option"
                              arrow
                            >
                              <IconButton
                                size="small"
                                sx={{ marginLeft: "5px", padding: 0 }}
                              >
                                <InfoOutlinedIcon
                                  fontSize="small"
                                  color="primary"
                                />
                              </IconButton>
                            </Tooltip>
                          </span>

                          <Autocomplete
                            disablePortal
                            options={systemPublishOptions}
                            getOptionLabel={(option) => option.value}
                            value={selectedSystemPublish} // use full object
                            onChange={(event, newValue) => {
                              setSelectedSystemPublish(newValue); // store object
                              setSystemPublishFor(newValue);

                              // if (newValue) {
                              //   validateSystemPublishOption(newValue.value);
                              // }
                            }}
                            readOnly={viewOnly}
                            disabled={viewOnly}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder={
                                  UI_TEXTS.PLACEHOLDERS
                                    .SELECT_SYSTEM_PUBLISH_FOR
                                }
                                variant="outlined"
                                size="small"
                                inputProps={{
                                  ...params.inputProps,
                                  readOnly: viewOnly,
                                }}
                              />
                            )}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "30px",
                                height: "2.8em",
                              },
                            }}
                          />

                          {/* Validation Message - Only show error */}
                          {isSystemPublish &&
                            systemPublishFor &&
                            systemPublishOptionExists && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 0.5, display: "block" }}
                              >
                                A system schedule for "{systemPublishFor}"
                                already exists. Please choose another option.
                              </Typography>
                            )}
                        </div>
                      )}
                    </>
                  )}

                  <div className="publish_btn_wrapper">
                    <span
                      className="custom-label"
                      style={{ marginTop: "35px" }}
                    >
                      {UI_TEXTS.LABELS.EVENT_BASED_TRIGGER ||
                        "Event-Based Trigger"}
                      <Tooltip
                        title="Enable to trigger workflows based on command results"
                        arrow
                      >
                        <IconButton
                          size="small"
                          sx={{ marginLeft: "5px", padding: 0 }}
                        >
                          <InfoOutlinedIcon fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                    </span>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isEventBasedTrigger}
                          onChange={(e) =>
                            setIsEventBasedTrigger(e.target.checked)
                          }
                          disabled={viewOnly}
                          color="primary"
                        />
                      }
                      label={isEventBasedTrigger ? "Enabled" : "Disabled"}
                      sx={{
                        marginTop: "15px",
                        "& .MuiFormControlLabel-label": {
                          fontWeight: 500,
                          color: "text.primary",
                          fontFamily: "Manrope",
                        },
                      }}
                    />
                  </div>

                  {/* Type */}
                </div>
              </div>
              {selectedType === "Local___" && (
                <div className="host-filters-section no-background">
                  <div
                    className="section-subheader"
                    style={{ marginTop: "10px" }}
                  >
                    <span
                      style={{
                        display: "flex",

                        alignItems: "center",
                        gap: 4,
                        color: "#0d6efd",
                      }}
                    >
                      <FilterAltOutlinedIcon
                        fontSize="small"
                        sx={{ color: "#0d6efd" }}
                      />
                      {/* <ExpandMoreIcon fontSize="small" /> */}
                      {UI_TEXTS.FILTERS_TEXT.SERVER_FILTERS}
                    </span>
                  </div>
                  <CustomFilter
                    filtersConfig={filtersConfig}
                    filterLoading={filterLoading}
                    appliedFilters={formattedAppliedFilters}
                    onFilterChange={handleFilterChange}
                    onRemoveFilter={handleRemoveFilter}
                    onClearAllFilters={handleClearAllFilters}
                  />
                </div>
              )}
              {/* ❷ Execution Target Section */}
              <div className="execution-section">
                <div className="section-header">
                  <span className="section-icon">2</span>
                  <h3 style={{ margin: "0" }}>
                    {UI_TEXTS.HEADER_TEXT.EXECUTION_TARGET}
                  </h3>
                </div>

                <div
                  className={`${
                    selectedType === "Local"
                      ? "upper-fields-wrapper-1"
                      : "upper-fields-wrapper-3"
                  }`}
                >
                  <div
                    className="custom-input-wrapper"
                    style={{ minWidth: "280px" }}
                  >
                    <span
                      className="custom-label"
                      style={{ marginTop: "10px" }}
                    >
                      {UI_TEXTS.LABELS.TYPE}{" "}
                      <span className={classes.iabot_required}>*</span>
                    </span>
                    <FormControl>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        value={selectedType}
                        onChange={
                          viewOnly
                            ? undefined
                            : (e) => setSelectedType(e.target.value)
                        }
                        data-testid="radio-btn-test"
                      >
                        {/* Local Option */}
                        <FormControlLabel
                          value="Local"
                          control={<Radio />}
                          label={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                color: "#102459",
                              }}
                            >
                              {`Local (Select specific host) ${
                                host && host.length && selectedType === "Local"
                                  ? `(${host.length})`
                                  : ""
                              }`}
                              <Tooltip
                                title={
                                  UI_TEXTS.TOOLTIP_TEXT
                                    .MANUALLY_SELECT_TARGET_SERVERS
                                }
                                placement="top"
                                arrow
                              >
                                <IconButton
                                  size="small"
                                  sx={{
                                    ml: 0.5,
                                    color: "#0d6efd", // Sky blue color
                                    "&:hover": {
                                      color: "#0d6efd", // Slightly darker on hover
                                    },
                                  }}
                                >
                                  <HelpOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          }
                          disabled={viewOnly}
                        />

                        {/* Smart Option */}
                        {/**!Important Don't Remove the code will be enabled in future development */}
                        {/* <FormControlLabel
                          value="Smart"
                          control={<Radio />}
                          label={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                color: "#102459",
                              }}
                            >
                              {UI_TEXTS.LABELS.SMART}
                              <Tooltip
                                title={
                                  UI_TEXTS.TOOLTIP_TEXT
                                    .AUTO_SELECT_SERVERS_BASED_ON_REGION
                                }
                                placement="top"
                                arrow
                              >
                                <IconButton
                                  size="small"
                                  sx={{
                                    ml: 0.5,
                                    color: "#0d6efd",
                                    "&:hover": {
                                      color: "#0d6efd",
                                    },
                                  }}
                                >
                                  <HelpOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          }
                          disabled={viewOnly}
                        /> */}
                        {/* Global Option */}
                        <FormControlLabel
                          value="Global"
                          control={<Radio />}
                          label={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                color: "#102459",
                              }}
                            >
                              {UI_TEXTS.LABELS.GLOBAL}
                              <Tooltip
                                title={
                                  UI_TEXTS.TOOLTIP_TEXT.SCHEDULE_ON_ALL_SERVERS
                                }
                                placement="top"
                                arrow
                              >
                                <IconButton
                                  size="small"
                                  sx={{
                                    ml: 0.5,
                                    color: "#0d6efd", // Sky blue color
                                    "&:hover": {
                                      color: "#0d6efd", // Slightly darker on hover
                                    },
                                  }}
                                >
                                  <HelpOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </div>
                          }
                          disabled={viewOnly}
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>

                  {selectedType === "Local" && !viewOnly && (
                    <div className=" no-background">
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          color: "#102459",
                          marginBottom: "-1.5rem",
                        }}
                      >
                        {UI_TEXTS.FILTERS_TEXT.SERVER_FILTERS}
                      </span>

                      {/* </div> */}
                      <div style={{ marginTop: "30px" }}>
                        {/* <CustomFilter
                          filtersConfig={filtersConfig}
                          filterLoading={filterLoading}
                          appliedFilters={formattedAppliedFilters}
                          onFilterChange={handleFilterChange}
                          onRemoveFilter={handleRemoveFilter}
                          onClearAllFilters={handleClearAllFilters}
                        /> */}

                        <div>
                          <SapFactFilters
                            parentComponent={"addJobComponent"}
                            getHostData={getHostData}
                            sapFactsFilterOptions={sapFactsFilterOptions}
                            setSapFactsFilterSelectedOptions={
                              setSapFactsFilterSelectedOptions
                            }
                            sapFactsFilterSelectedOptions={
                              sapFactsFilterSelectedOptions
                            }
                            handleSapFactsFiltersSelectionChange={
                              handleSapFactsFiltersSelectionChange
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Host */}

                  {selectedType === "Local" && (
                    <div
                      className={`hosts-input-container ${
                        selectedType !== "Local" ? "hidden" : ""
                      }`}
                    >
                      <div style={{ maxWidth: "30rem", marginTop: "10px" }}>
                        <CustomMultiSelect
                          value={host}
                          setValue={viewOnly ? undefined : setHost}
                          options={hostNames}
                          disabled={viewOnly}
                          readOnly={viewOnly}
                          isRequired={true}
                        />
                      </div>
                    </div>
                  )}
                  {selectedType === "Smart" && (
                    <>
                      {" "}
                      <div className="custom-input-wrapper">
                        <span className="custom-label">
                          {UI_TEXTS.LABELS.SERVER_ATTRIBUTE}
                          <span className="iabot_required">*</span>
                        </span>
                        <Autocomplete
                          disablePortal
                          options={SERVER_ATTRIBUTE_OPTIONS}
                          getOptionLabel={(option) => option.label}
                          value={
                            SERVER_ATTRIBUTE_OPTIONS.find(
                              (opt) => opt.value === serverAttribute
                            ) || null
                          }
                          onChange={
                            viewOnly
                              ? undefined
                              : (event, newValue) => {
                                  setServerAttribute(
                                    newValue ? newValue.value : ""
                                  );
                                  setServerAttributeValue([]);
                                }
                          }
                          readOnly={viewOnly}
                          disabled={viewOnly}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={
                                UI_TEXTS.PLACEHOLDERS
                                  .SEARCH_OR_SELECT_SERVER_ATTRIBUTE
                              }
                              variant="outlined"
                              size="small"
                              inputProps={{
                                ...params.inputProps,
                                readOnly: viewOnly,
                              }}
                            />
                          )}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "30px",
                              height: "2.8em",
                            },
                          }}
                        />
                      </div>
                      {serverAttribute && (
                        <div className="custom-input-wrapper no-background">
                          <CustomFilterField
                            filtersConfig={filtersFieldConfig?.filter(
                              (val) => val.id === serverAttribute
                            )}
                            filterLoading={filterLoading}
                            appliedFilters={formattedAppliedFilters}
                            onFilterChange={handleFilterChange}
                            onRemoveFilter={handleRemoveFilter}
                            onClearAllFilters={handleClearAllFilters}
                            label={
                              <>
                                {SERVER_ATTRIBUTE_OPTIONS.find(
                                  (opt) => opt.value === serverAttribute
                                )?.label || ""}
                                <span
                                  className={classes.iabot_required}
                                  style={{ marginLeft: "2px" }}
                                >
                                  *
                                </span>
                              </>
                            }
                            disabledField={viewOnly}
                            readOnlyField={viewOnly}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <Box
              display="flex"
              justifyContent="end"
              gap=".5rem"
              sx={{
                padding: ".25rem 3rem 0 3rem",
                borderTop: "1px solid rgb(226, 232, 240)",
              }}
            >
              <Button
                variant="outlined"
                onClick={cancelJob}
                className="config_btn"
              >
                {UI_TEXTS.BUTTONS.CANCEL}
              </Button>
              <Button
                onClick={handleNext}
                variant="contained"
                className="config_btn"
                disabled={!isStep1Valid || viewOnly}
              >
                Next: Configure Commands →
              </Button>
            </Box>
          </Box>
        )}
        {activeStep === 1 && (
          <div className="main-wrapper">
            <Box
              sx={{
                height: "calc(100vh - 175px)",
                overflow: "auto",
                width: "100%",
              }}
            >
              <DataGrid
                disableColumnMenu
                disableColumnSelector
                disableColumnReorder
                disableColumnResize
                sx={{
                  "& .MuiDataGrid-cell": {
                    borderBottom: "none !important",
                  },
                  "& .MuiDataGrid-virtualScrollerRenderZone": {
                    width: "100% !important",
                    borderBottom: "none !important",
                  },

                  //  '--DataGrid-rowBorderColor': 'transparent',
                  "& .MuiDataGrid-filler": {
                    border: "none",
                    borderTop: "none",
                    borderBottom: "none",
                    "--DataGrid-rowBorderColor": "transparent",
                  },
                }}
                columns={alwaysVisibleColumns.map((col) => ({
                  ...col,
                  sortable: false,
                  disableColumnMenu: true,
                  flex: col?.flex ? col.flex : 1,
                }))}
                rows={commands}
                slots={{
                  row: (props) => (
                    <CustomRow
                      {...props}
                      openRow={openRow}
                      handleRowClick={viewOnly ? undefined : handleRowClick}
                      alwaysVisibleColumns={alwaysVisibleColumns}
                      disabled={viewOnly}
                    />
                  ),
                }}
              />
            </Box>

            <Box
              display="flex"
              justifyContent="end"
              gap=".5rem"
              sx={{
                padding: ".25rem 3rem 0 3rem",
                borderTop: "1px solid rgb(226, 232, 240)",
              }}
            >
              <Button
                className="iabot_cancel_button"
                variant="contained"
                onClick={handleBack}
              >
                {UI_TEXTS.BUTTONS.BACK}
              </Button>
              <Button
                className="config_btn"
                variant="contained"
                onClick={handleAddData}
                disabled={
                  viewOnly ||
                  isAdding ||
                  !(
                    commands &&
                    commands.length &&
                    !commands.some((cmd) => cmd.editMode)
                  ) ||
                  (!runAsCurrentUser &&
                    commands.some(
                      (cmd) => !cmd.runAs || cmd.runAs === username
                    )) ||
                  //We need to disbale the btn if duplicate exists
                  (isSystemPublish && systemPublishOptionExists)
                }
              >
                {isAdding
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update"
                  : "Create"}
              </Button>
            </Box>
          </div>
        )}
      </div>

      <Dialog
        fullScreen
        onClose={() => {
          setShowEditor(false);
        }}
        aria-labelledby="customized-dialog-title"
        open={showEditor}
      >
        <DialogTitle sx={{ m: 0, p: "2rem" }} id="customized-dialog-title">
          {/* Modal title */}
          <div data-testid="tasklist" className={classes.iabot_filter_row}>
            <div data-testid="plannerTest1">
              <div
                style={{
                  fontStyle: "normal",
                  fontSize: "24px",
                  marginBottom: "20px",
                }}
              >
                IABOT
              </div>
              <section
                style={{
                  color: "#82807c",
                  fontSize: "16px",
                }}
              >
                {UI_TEXTS.SECTIONS.COMMAND_EDITOR}
              </section>
            </div>
          </div>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            setShowEditor(false);
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <WebIde
            style={{ height: "100%", width: "100%" }}
            language={"javascript"}
            onChange={(value) => {
              setCommand(value);
            }}
            value={command}
            defaultValue={command}
            selectedMode={!viewOnly}
          />
        </DialogContent>
      </Dialog>
      <TemplateModal
        open={showModal}
        onSelectTemplate={handleTemplateSelect}
        onClose={() => {
          setShowModal(false);
          setSelectedRow(null); // Optional cleanup
        }}
        handleReset={() => {
          handleCommandObjectChange(
            { target: { value: "" } },
            "command",
            selectedRow
          );
          setInputType(null);
          setSelectedTemplate(null);
        }}
        selectedActionType={actionTypeFromJob || ""}
      />

      <WorkflowTriggerModal
        open={showWorkflowModal}
        onClose={() => {
          setShowWorkflowModal(false);
          setSelectedCommandId(null);
        }}
        commandId={selectedCommandId}
        initialConfig={
          selectedCommandId ? workflowTriggers[selectedCommandId] : null
        }
        onSave={(config) => {
          setWorkflowTriggers((prev) => ({
            ...prev,
            [config.commandId]: config,
          }));

          // Also update the command object with trigger info
          // setCommands(prev => prev.map(cmd =>
          //   cmd.id === config.commandId
          //     ? { ...cmd, workflowTrigger: config }
          //     : cmd
          // ));
          setCommands((prev) =>
            prev.map((cmd) => (cmd.id === config.commandId ? { ...cmd } : cmd))
          );
        }}
      />

      <ErrorBoundary
        fallback={<div>{UI_TEXTS.ERROR_BOUNDARY.SOMETHING_WENT_WRONG}</div>}
      >
        <SchedulerModal
          isModalOpen={isSchedulerModelOpen}
          setIsModelOpen={setIsSchedulerModelOpen}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          jobStartDate={startDate}
          setJobStartDate={setStartDate}
          jobEndDate={endDate}
          setJobEndDate={setEndDate}
          cronExp={cronValue}
          setCronExp={setCronValue}
        />
      </ErrorBoundary>
    </>
  );
};
