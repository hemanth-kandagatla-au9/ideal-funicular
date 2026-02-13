import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./css/subheader.module.css";
import "./css/jobs.css";
import { Switch } from "@mui/material";
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
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { SchedulerModal } from "./SchedulerModal";
import { ErrorBoundary } from "react-error-boundary";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
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
import {
  SCHEDULE_TYPE_OPTIONS,
  SCHEDULE_TYPE_OPTIONS_AD_HOC,
} from "../common/Constants/constantObjects";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";
const getUsernameFromCookie = () => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("username="))
    ?.split("=")[1];

  return cookieValue ? decodeURIComponent(cookieValue) : "user";
};

export const SideDrawerAddJob = ({
  modalIsOpen,
  setModalIsOpenToFalse,
  singleJob,
  isEditClicked,
  setIsEditClicked,
}) => {
  const toastMsg = isEditClicked
    ? TOAST_MESSAGES.OTHERS.JOB_UPDATED_SUCCESSFULLY
    : TOAST_MESSAGES.OTHERS.JOB_ADDED_SUCCESSFULLY;
  const dispatch = useDispatch();
  const hostData = useSelector((state) => state.jobs.hosts);
  const categoriesData = useSelector(
    (state) =>
      state.jobs.categories?.filter(
        (category) => category.status !== "PENDING_APPROVAL"
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
        (category) => category.status !== "PENDING_APPROVAL"
      ) || []
  );
  const initialJobEndDate = new Date();
  initialJobEndDate.setHours(23, 59, 0, 0);
  initialJobEndDate.setDate(initialJobEndDate.getDate() + 1);
  const [category, setCategory] = useState("");
  const [scheduleType, setScheduleType] = useState("AD_HOC");
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
  const [selectedType, setSelectedType] = useState("Global");
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
  const [runAsCurrentUser, setRunAsCurrentUser] = useState(true);
  const [inputType, setInputType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [jobRunning, setjobRunning] = useState(false);

  const username = getUsernameFromCookie();
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
  });
  const [commands, setCommands] = React.useState([
    {
      id: 0,
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
    },
  ]);
  const [openRow, setOpenRow] = React.useState({});
  const [focusedInput, setFocusedInput] = React.useState(null);

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

  //VIEW JOB
  useEffect(() => {
    if (singleJob && singleJob !== undefined) {
      if (!viewOnly) {
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
      setCommandCategory(singleJob?.commandCategory);
      setRunAsCurrentUser(singleJob?.runAsCurrentUser);
      setCategory(singleJob?.categoryName);
      setDescription(singleJob?.jobDescription);
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
      if (singleJob?.commands?.length) {
        const updatedCommandsWithoutScripts = singleJob.commands.map((c) => {
          const foundCategory = commandCategoryData?.find(
            (category) => category.commandCategory === c.actionType
          );
          let updatedCommand = { ...c };

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
  }, [singleJob, isEditClicked]);

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
    setIsAdding(true);
    if (commands?.length) {
      commands.map((c) => {
        if (!c.actionType && commandCategoryData?.length) {
          c.actionType = commandCategoryData[0]?.commandCategory;
        }
        const foundCategory = commandCategoryData?.find(
          (category) => category.commandCategory === c.actionType
        );

        if (runAsCurrentUser) {
          c.runAs = username;
        }

        // If found, concatenate the scripts field; otherwise, return the command as is

        if (foundCategory) {
          if (foundCategory.commandCategoryScripts)
            c.command = `${foundCategory.commandCategoryScripts}${c.command}`;

          if (foundCategory?.commandCategorySubShell) {
            c.subShell = foundCategory?.commandCategorySubShell;
          }
        }

        return c;
      });
    }

    const formattedTags = tagList?.join(", ");

    const formattedHosts = host?.join(", ");

    let mappededCommands = [];

    if (commands && commands.length) {
      mappededCommands = commands.map((cmd) => {
        if (scheduleType === "AD_HOC") {
        }

        return { ...cmd };
      });
    }

    const AddDataPayload = {
      categoryName: category,
      commands: mappededCommands,
      jobDescription: description,
      runAsCurrentUser,
      scheduleType,
      runAs: commands[0]?.runAs,
      tags: formattedTags,
      target: targetList,
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
      jobRunning: jobRunning,
      codeTemplate: selectedTemplate
        ? {
            templateId: selectedTemplate._id,
            templateName: selectedTemplate.templateName,
            templateType: selectedTemplate.templateType,
            commandScripts: selectedTemplate.commandScripts,
            accessType: selectedTemplate.accessType,
            approvalRequired: selectedTemplate.approvalRequired,
          }
        : null,
    };

    const EditDataPayload = {
      jobID: singleJob?._id,

      ...AddDataPayload,
    };

    const data =
      isEditClicked && singleJob._id ? EditDataPayload : AddDataPayload;
    try {
      const response = await dispatch(addJob(data));

      if (response?.data?.statusCode === 200) {
        setModalIsOpenToFalse();
        setCategory("");
        setServerTypesData("");
        setDescription("");
        setRun("");
        setFrequency("");
        setJobTimeout();
        setCount(0);
        setTargetList([]);
        setHost([]);
        setJobTimezone("");
        setStartDate(new Date());
        setEndDate(initialJobEndDate);
        setSelectedType("Global");
        setIsOneTime(true);
        setTagValue("");
        setTagList([]);
        setCronValue("");
        setCommands([{ ...newCommandObject, id: 0 }]);
        setSelectedTemplate(null);
        setInputType(null);

        toast.success(toastMsg, {
          position: toast.POSITION.TOP_RIGHT,

          autoClose: 2000,
        });
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
    setModalIsOpenToFalse();
    setCategory("");
    setRun("");
    setFrequency("");
    setJobTimeout();
    setCount(0);
    setTargetList([]);
    setHost([]);
    setJobTimezone("");
    setStartDate(new Date());
    setEndDate();
    setSelectedType("Global");
    setIsOneTime(true);
    setTagValue("");
    setTagList([]);
    setCronValue("");
    setCommands([{ ...newCommandObject, id: 0 }]);
    setServerTypesData("");
    setInputType(null);
    setSelectedTemplate(null);
    setCommands((prev) =>
      prev.map((item) => ({
        ...item,
        command: "",
      }))
    );
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
  };

  const getHeaderText = () => {
    if (viewOnly) {
      return "View Job";
    } else if (!viewOnly && singleJob) {
      return "Update Job";
    } else {
      return "Add Job";
    }
  };

  const handleCommandObjectChange = (e, name, row) => {
    const { value } = e.target;
    setCommands((prevCommands) => {
      const updatedCommands = [...prevCommands];
      const rowIndex = updatedCommands.findIndex((cmd) => cmd.id === row.id);

      if (rowIndex !== -1) {
        updatedCommands[rowIndex] = {
          ...updatedCommands[rowIndex],
          [name]: value,
        };
      }
      return updatedCommands;
    });
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

      return updatedCommands;
    });
  };

  const commandCategories = commandCategoryData?.map((cat) => ({
    label: cat.commandCategory,
    value: cat.commandCategory,
  }));

  const RUN_AS_OPTIONS = React.useMemo(() => {
    if (userConfigurations && userConfigurations.length) {
      return userConfigurations.map((config) => ({
        value: config.value,
        label: config.value,
      }));
    }
  }, [userConfigurations]);

  const alwaysVisibleColumns = [
    {
      field: "expand",
      headerName: "",
      minwidth: 60,
      flex: 0.1,
      renderCell: (params) => {
        return (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(params.row.id);
            }}
            sx={{ backgroundColor: "#F4F6FF" }}
          >
            {openRow[params.row.id] ? (
              <KeyboardArrowUp />
            ) : (
              <KeyboardArrowDown />
            )}
          </IconButton>
        );
      },
    },
    {
      field: "actionType",
      headerName: UI_TEXTS.HEADER_TEXT.ACTION_TYPE,
      minwidth: 250,
      headerAlign: "center",
      renderHeader: () => (
        <div
          style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600 }}
        >
          {UI_TEXTS.LABELS.ACTION_TYPE}
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
                commandCategories[0] ||
                null
              }
              onChange={(event, newValue) => {
                handleCommandObjectChange(
                  { target: { value: newValue ? newValue.value : "" } },
                  "actionType",
                  params.row
                );
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
      field: "description",
      headerName: UI_TEXTS.HEADER_TEXT.JOB_DESCRIPTION,
      minwidth: 300,
      headerAlign: "center",
      renderHeader: () => (
        <div
          style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600 }}
        >
          {UI_TEXTS.LABELS.DESCRIPTION}
        </div>
      ),
      renderCell: (params) => {
        return params.row.editMode ? (
          <div className="labelled-input-container">
            <OutlinedInput
              onFocus={() => handleFocus(params.row.id, "description")}
              autoFocus={focusedInput === `${params.row.id}-description`}
              disabled={viewOnly}
              variant="filled"
              size="small"
              id="description"
              aria-describedby="outlined-weight-helper-text"
              onKeyDown={(e) => {
                if (e.key === " ") {
                  handleCommandObjectChange(
                    { target: { value: params.row?.description + " " } },
                    "description",
                    params.row
                  );
                }
              }}
              placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_THE_DESCRIPTION}
              inputProps={{
                "aria-label": "weight",
                "data-testid": "sidedrawer-desc-field",
              }}
              value={params.row?.description}
              onChange={(e) =>
                handleCommandObjectChange(e, "description", params.row)
              }
              sx={{ borderRadius: "30px" }}
            />
          </div>
        ) : (
          params.value
        );
      },
    },
    {
      field: "command",
      headerName: UI_TEXTS.HEADER_TEXT.COMMAND,
      minwidth: 300,
      headerAlign: "center",
      renderHeader: () => (
        <div
          style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600 }}
        >
          {UI_TEXTS.HEADER_TEXT.COMMAND}
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
                <MenuItem value="manual">
                  {UI_TEXTS.SELECT_TEXT.MANUAL_INPUT}
                </MenuItem>
                <MenuItem
                  value="marketplace"
                  onClick={() => setShowModal(true)}
                >
                  {UI_TEXTS.SELECT_TEXT.CHOOSE_FROM_MARKET_PLACE}
                </MenuItem>
              </Select>
            );
          }

          if (inputType === "manual") {
            return (
              <div className="labelled-input-container">
                <OutlinedInput
                  onFocus={() => handleFocus(params.row.id, "command")}
                  autoFocus={focusedInput === `${params.row.id}-command`}
                  disabled={viewOnly || params.row?.actionType === "Script"}
                  id="manual-input"
                  variant="filled"
                  size="small"
                  aria-describedby="outlined-weight-helper-text"
                  placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_COMMAND}
                  onKeyDown={(e) => {
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
                  onChange={(e) =>
                    handleCommandObjectChange(e, "command", params.row)
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          handleCommandObjectChange(
                            { target: { value: "" } },
                            "command",
                            params.row
                          );
                          setInputType(null); // Reset input type to show dropdown again
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

          if (inputType === "marketplace") {
            return (
              <>
                {selectedTemplate?.commandScripts && (
                  <div className="labelled-input-container">
                    <TemplateTooltip template={selectedTemplate}>
                      <OutlinedInput
                        id="commandScripts"
                        variant="filled"
                        size="small"
                        aria-describedby="outlined-weight-helper-text"
                        sx={{ borderRadius: "30px" }}
                        inputProps={{
                          "aria-label": "weight",
                        }}
                        placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_COMMAND}
                        value={selectedTemplate?.templateName}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => {
                                handleCommandObjectChange(
                                  { target: { value: "" } },
                                  "command",
                                  params.row
                                );
                                setInputType(null);
                                setSelectedTemplate(null);
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
                )}
                <TemplateModal
                  open={showModal}
                  onClose={() => {
                    setShowModal(false);
                  }}
                  handleReset={() => {
                    handleCommandObjectChange(
                      { target: { value: "" } },
                      "command",
                      params.row
                    );
                    setInputType(null);
                    setSelectedTemplate(null);
                  }}
                  onSelect={(selectedTemplate) => {
                    setSelectedTemplate(selectedTemplate);
                    handleCommandObjectChange(
                      { target: { value: selectedTemplate.commandScripts } },
                      "command",
                      params.row
                    );

                    setShowModal(false);
                  }}
                />
              </>
            );
          }
        }
        return params.value;
      },
    },

    {
      field: "runAs",
      headerName: UI_TEXTS.HEADER_TEXT.RUN_AS,
      minwidth: 250,
      headerAlign: "center",
      renderHeader: () => (
        <div
          style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600 }}
        >
          {UI_TEXTS.HEADER_TEXT.RUN_AS}
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
                  : RUN_AS_OPTIONS.find(
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
        ) : RUN_AS_OPTIONS.find((opt) => opt.value === params.row.runAs) ? (
          params.row.runAs
        ) : (
          ""
        );
      },
    },
    {
      field: "action",
      headerName: UI_TEXTS.HEADER_TEXT.ACTION,
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
              <Tooltip title={UI_TEXTS.TOOLTIP_TEXT.SAVE_COMMAND} arrow>
                <IconButton
                  size="small"
                  // disabled={
                  //   !(
                  //     params.row?.command &&
                  //     (RUN_AS_OPTIONS.find(
                  //       (opt) => opt.value === params.row.runAs
                  //     ) ||
                  //       runAsCurrentUser)
                  //   )
                  // }
                  disabled={
                    !(
                      params.row?.actionType &&
                      params.row?.command &&
                      (RUN_AS_OPTIONS.find(
                        (opt) => opt.value === params.row.runAs
                      ) ||
                        runAsCurrentUser)
                    )
                  }
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
                    // color={
                    //   !(
                    //     params.row?.command &&
                    //     ((params.row?.runAs &&
                    //       params.row?.runAs !== username) ||
                    //       runAsCurrentUser)
                    //   )
                    //     ? "#B0B0B0"
                    //     : "#75C02B"
                    // }
                    color={
                      !(
                        params.row?.actionType &&
                        params.row?.command &&
                        ((params.row?.runAs &&
                          params.row?.runAs !== username) ||
                          runAsCurrentUser)
                      )
                        ? "#B0B0B0"
                        : "#75C02B"
                    }
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Cancel" arrow>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeleteCommand(params.row)}
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
              <Tooltip title={UI_TEXTS.TOOLTIP_TEXT.NEW_COMMAND} arrow>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => handleNewCommandAdd(params.row)}
                  aria-label={UI_TEXTS.TOOLTIP_TEXT.NEW_COMMAND}
                  disabled={viewOnly}
                >
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={UI_TEXTS.LABELS.CLONE} arrow>
                <IconButton
                  size="small"
                  onClick={() => handleCloneCommand(params.row)}
                  aria-label={UI_TEXTS.LABELS.CLONE}
                  disabled={viewOnly}
                >
                  <img src={CloneTemplateIcon} alt="Clone" />
                </IconButton>
              </Tooltip>

              <Tooltip title={UI_TEXTS.BUTTONS.EDIT} arrow>
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
                  <img src={Editconfigimg} alt="Edit" />
                </IconButton>
              </Tooltip>

              <Tooltip title={UI_TEXTS.BUTTONS.DELETE} arrow>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteCommand(params.row)}
                  aria-label={"Delete"}
                  disabled={viewOnly}
                >
                  <img src={DeleteIcon} alt="Delete" />
                </IconButton>
              </Tooltip>
            </div>
          );
        }
      },
    },
  ];

  const expandableColumns = [
    {
      field: "tags",
      headerName: UI_TEXTS.HEADER_TEXT.TAGS,
      width: 200,
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
              label={UI_TEXTS.LABELS.CREATE_TAGS}
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
      field: "file",
      headerName: UI_TEXTS.HEADER_TEXT.SELECT_FILE,
      width: 225,
      renderHeader: () => (
        <div
          style={{ fontFamily: "Manrope", fontSize: "14px", fontWeight: 600 }}
        >
          {UI_TEXTS.HEADER_TEXT.SELECT_FILE}
        </div>
      ),
      renderCell: (params) => {
        return params.row.editMode ? (
          <div className="labelled-input-container">
            <OutlinedInput
              type="file"
              disabled={viewOnly || params.row?.actionType !== "Script"}
              variant="filled"
              id="file-select"
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
              sx={{
                "& .MuiInputBase-input": {
                  padding: ".65rem", // Adjust the padding values
                  cursor: "pointer",
                  "&:hover": {
                    cursor: "pointer",
                  },
                },
                borderRadius: "30px",
              }}
              placeHolderText="FileInputType"
              placeholder="FileInputType"
              data-testid="FileInputType"
              onChange={(e) => {
                const selectedFile = e.target?.files?.[0];
                const allowedExtension = ["sh", "sql"];
                const reader = new FileReader();
                if (selectedFile) {
                  const extension = selectedFile.name.split(".").pop();
                  if (allowedExtension.includes(extension)) {
                    reader.readAsText(selectedFile);
                  } else {
                    toast.error("Please select .sh or .sql file", {
                      position: toast.POSITION.TOP_RIGHT,
                      autoClose: 2000,
                    });
                    e.target.value = "";
                  }
                }
                reader.onload = () => {
                  const textContent = reader.result;
                  handleCommandObjectChange(
                    { target: { value: textContent } },
                    "command",
                    params.row
                  );
                  // setCommand(textContent);
                };
              }}
            />
          </div>
        ) : (
          params.value
        );
      },
    },
    {
      field: "server_type",
      headerName: UI_TEXTS.HEADER_TEXT.SERVER_TYPE,
      width: 200,
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
          {openRow[row.id] && (
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

  return (
    <>
      <Dialog
        maxWidth={false} // You can adjust this as needed
        sx={{
          "& .MuiDialog-paper": {
            height: "95vh", // Set the height of the dialog
            margin: "auto", // Centering the dialog vertically
            width: "95vw",
          },
        }}
        open={modalIsOpen}
        onClose={handleDrawerClose}
      >
        <div className={classes.iabot_drawer_main_container}>
          <div className="add-job-header">
            <h1 data-testid="sidedrawer-heading">{getHeaderText()}</h1>

            <div style={{ display: "flex", justifyContent: "end" }}>
              {singleJob ? (
                <Tooltip
                  title={
                    viewOnly
                      ? UI_TEXTS.TOOLTIP_TEXT.SWITCH_TO_EDIT_MODE
                      : UI_TEXTS.TOOLTIP_TEXT.SWITCH_TO_VIEW_MODE
                  }
                >
                  <IconButton
                    onClick={() => setViewOnly(!viewOnly)}
                    color="primary"
                    size="small"
                    sx={{
                      borderRadius: "4px",
                      padding: "6px",
                    }}
                  >
                    {viewOnly ? (
                      <EditIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              )}
              <div
                className="custom-input-wrapper"
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  justifyContent: "end",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Tooltip
                    title={UI_TEXTS.TOOLTIP_TEXT.NOTE_ONLY_ADHOC_ANDEXECUTE}
                    arrow
                    placement="top"
                  >
                    <IconButton size="small" sx={{ padding: "4px", ml: "4px" }}>
                      <InfoOutlined fontSize="small" color="info" />
                    </IconButton>
                  </Tooltip>
                  <span className="custom-label">{UI_TEXTS.LABELS.RUN_AS}</span>
                </div>
                <span>
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
                  {!runAsCurrentUser && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ display: "block" }}
                    >
                      {UI_TEXTS.MESSAGES.THIS_REQUIRES_FURTHER_APPROVAL}
                    </Typography>
                  )}
                </span>
              </div>

              <CloseIcon
                sx={{
                  color: "brown",
                  cursor: viewOnly ? "default" : "pointer",
                }}
                onClick={handleDrawerClose}
                data-testid="sidedrawer-close-icon"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="main-wrapper">
            <div className="upper-fields-wrapper">
              {/*Category */}
              <div className="custom-input-wrapper">
                <span className="custom-label">
                  {UI_TEXTS.LABELS.CATEGORY}
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
                    singleJob
                      ? undefined
                      : (event, newValue) => {
                          setCategory(newValue ? newValue.categoryName : "");
                        }
                  }
                  readOnly={singleJob}
                  disabled={singleJob}
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
                        readOnly: singleJob,
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
                  onChange={
                    viewOnly ? undefined : (e) => setDescription(e.target.value)
                  }
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
                    runAsCurrentUser
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
                    singleJob
                      ? undefined
                      : (event, newValue) => {
                          setScheduleType(newValue ? newValue.value : "");
                        }
                  }
                  readOnly={singleJob}
                  disabled={singleJob}
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
                        readOnly: singleJob,
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
                <span className="custom-label">Select Frequency</span>
                <CronMultiSelect
                  isDisabled={
                    singleJob ||
                    !scheduleType ||
                    scheduleType === "STARTUP" ||
                    scheduleType === "AD_HOC"
                  }
                  options={
                    runAsCurrentUser
                      ? showDropdownOptionEOT
                      : showDropdownOption
                  }
                  onChange={singleJob ? undefined : setDropdown}
                  placeHolderText={UI_TEXTS.PLACEHOLDERS.SELECT_FREQUENCY}
                  value={[showDropdown]}
                  readOnly={singleJob}
                  scheduleType={scheduleType}
                />
              </div>

              <CustomMultiSelect
                label="Target"
                value={targetList}
                isRequired
                setValue={viewOnly ? undefined : setTargetList}
                options={
                  targetListForDropdown && targetListForDropdown.length
                    ? targetListForDropdown.map((item) => item.indexName)
                    : []
                }
                disable={viewOnly}
                readOnly={viewOnly}
              />

              {/* Job Tags */}
              <div className="custom-input-wrapper">
                <span className="custom-label">
                  {UI_TEXTS.LABELS.SCHEDULE_TAGS}
                </span>
                <MultiSelectWithCreateOption
                  label={UI_TEXTS.LABELS.CREATE_TAGS}
                  sx={{ width: "100%", height: "2.8rem" }}
                  selectedValues={tagList}
                  onSelectionChange={
                    viewOnly ? undefined : (value) => setTagList(value)
                  }
                  readOnly={viewOnly}
                  disabled={viewOnly}
                />
              </div>

              <div
                className="custom-input-wrapper custom-input-small "
                style={{ display: "flex", gap: "16px" }}
              >
                <div>
                  <span className="custom-label">Timeout</span>
                  <OutlinedInput
                    disabled={viewOnly}
                    readOnly={viewOnly}
                    variant="filled"
                    type="number"
                    id="timeout"
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      "aria-label": "weight",
                      readOnly: viewOnly,
                    }}
                    value={jobTimeout}
                    onChange={
                      viewOnly
                        ? undefined
                        : (e) => setJobTimeout(e.target.value)
                    }
                  />
                </div>
                {/* Type */}
                <div>
                  <span className="custom-label">
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
                        singleJob
                          ? undefined
                          : (e) => setSelectedType(e.target.value)
                      }
                      data-testid="radio-btn-test"
                    >
                      <FormControlLabel
                        value="Global"
                        control={<Radio />}
                        label="Global"
                        disabled={singleJob}
                      />
                      <FormControlLabel
                        value="Local"
                        control={<Radio />}
                        label={`Local ${
                          host && host.length && selectedType === "Local"
                            ? `(${host.length})`
                            : ""
                        }`}
                        disabled={singleJob}
                      />
                    </RadioGroup>
                  </FormControl>
                </div>

                {/* Timeout */}
              </div>

              {/* Host */}

              <div
                className={`hosts-input-container ${
                  selectedType !== "Local" ? "hidden" : ""
                }`}
              >
                {selectedType === "Local" && (
                  <div style={{ width: "400px" }}>
                    <CustomMultiSelect
                      value={host}
                      setValue={viewOnly ? undefined : setHost}
                      options={
                        hostData && hostData
                          ? hostData.map((option) => option?.hostname)
                          : []
                      }
                      disabled={viewOnly}
                      readOnly={viewOnly}
                    />
                  </div>
                )}
              </div>
            </div>

            <Box
              sx={{ height: "calc(100vh - 360px)", mt: 1, overflow: "auto" }}
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
                      expandableColumns={expandableColumns}
                      disabled={viewOnly}
                    />
                  ),
                }}
              />
            </Box>

            <div
              style={{
                backgroundColor: "white",
                display: "flex",
                gap: "8px",
                padding: ".5rem",
                justifyContent: "end",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                className="iabot_cancel_button"
                onClick={cancelJob}
                disabled={isAdding}
              >
                {UI_TEXTS.BUTTONS.CANCEL}
              </Button>
              <Button
                variant="contained"
                className="iabot_add_button"
                onClick={handleAddData}
                disabled={
                  viewOnly ||
                  isAdding ||
                  !(
                    commands &&
                    commands?.length &&
                    !commands.some((cmd) => cmd.editMode)
                  ) ||
                  (!runAsCurrentUser &&
                    commands.some((cmd) => !cmd.runAs || cmd.runAs == username))
                }
              >
                {isAdding
                  ? "Adding..."
                  : isEditClicked
                  ? UI_TEXTS.BUTTONS.UPDATE
                  : UI_TEXTS.BUTTONS.ADD}
              </Button>
            </div>
          </div>
        </div>
      </Dialog>

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
                {UI_TEXTS.LABELS.IABOT}
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
