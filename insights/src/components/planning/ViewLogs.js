import "./css/tasks.css";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Box,
  IconButton,
  Chip,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomSearch from "../common/CustomSearch/CustomSearch";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  getOpenSearchIndex,
  getOpenSearchIndexByRunId,
} from "../../services/configurations/configService";
import CustomPagination from "../common/CustomPagination/CustomPagination";
import CustomFilter from "../common/CustomFilters/CustomFilter";
import { getHostDetail, getLogFilters } from "../../services/jobs/JobsService";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ComputerIcon from "@mui/icons-material/Computer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { v4 as uuidv4 } from "uuid";
import { DataGrid } from "@mui/x-data-grid";
import {
  JobSummary,
  StatusCard,
} from "../common/CommonComponents/ReusableFields";
import { Filter } from "iconsax-react";
import { UI_TEXTS } from "../common/Constants/label-contants";
import { formatTimeStamp } from "../../utils/CommonUtils";
import LogsRowModal from "./LogsRowModal";
import {
  hasInsightsPermission,
  PERMISSION_LIST,
} from "../../utils/permissionUtil";
import { Refresh } from "@mui/icons-material";

const ViewLogs = ({
  open,
  onClose,
  jobId,
  jobDescription,
  originalJobData,
}) => {
  const dispatch = useDispatch();
  const permissionState = useSelector((state) => state.jobs?.permissions);
  const { logFilters } = useSelector((state) => state.jobs);
  const [data, setData] = useState([]);
  const [allRunIds, setAllRunIds] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentFilter, setRecentFilter] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  // const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedHostName, setSelectedHostName] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCommand, setSelectedCommand] = useState([]);
  const [selectedRunas, setSelectedRunas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedRunID, setSelectedRunId] = useState([]);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [runId, setRunId] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [pageLoader, setPageLoader] = useState(false);
  const [serverCurrentPage, setServerCurrentPage] = useState(1);
  const [severNodeData, setserverNodeData] = useState([]);
  const [serverTotalPage, setServerTotalPages] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const getAllJobsData = useSelector((state) => state?.jobs?.jobs);
  const specificJob = getAllJobsData.find((job) => job?.scheduleId === jobId);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortModel, setSortModel] = useState([
    { field: "hostname", sort: "asc" },
  ]);
  const [missingHostsData, setMissingHostsData] = useState([]);
  const [openSearchIndexData, setOpenSearchIndexData] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const apiRef = useRef(null);

  const handleSortModelChange = (newSortModel) => {
    setSortModel(newSortModel);
  };
  const [expandedHosts, setExpandedHosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [expanded, setExpanded] = React.useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState("");
  const [countBaseData, setCountBaseData] = useState({
    totalCount: 0,
    failedCount: 0,
    successCount: 0,
  });

  const handleAccordionChange = () => {
    setExpanded((prev) => !prev);
  };

  const toggleFilters = () => {
    setFiltersVisible((prev) => !prev);
  };

  // Calculate counts based on the original filteredData (not affected by status filter)
  const successCount = filteredData.filter(
    (item) => item.exitStatus === 0
  ).length;
  const failedCount = filteredData.filter(
    (item) => item.exitStatus !== 0
  ).length;
  const totalCount = filteredData.length;

  const extractRunHistory = (logs) => {
    if (!logs || logs.length === 0) return [];

    const runMap = new Map();
    logs.forEach((log) => {
      if (!runMap.has(log._source.runId)) {
        runMap.set(log._source.runId, {
          runId: log._source.runId,
          timestamp: log._source.timestamp
            ? new Date(log._source.timestamp).toLocaleString()
            : "-",
        });
      }
    });

    // Sort by timestamp descending
    return Array.from(runMap.values()).sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  };

  const findLatestRunId = (logs) => {
    if (!logs || logs.length === 0) return null;

    let latestLog = logs[0];
    for (const log of logs) {
      if (
        new Date(log._source.timestamp) > new Date(latestLog._source.timestamp)
      ) {
        latestLog = log;
      }
    }
    return latestLog._source.runId;
  };

  const fetchData = async (params) => {
    if (!jobId) {
      console.warn("No jobId provided, skipping API call");
      return;
    }

    try {
      setLoading(true);
      const response = await getOpenSearchIndex({ ...params, jobId });
      if (!response || response.length === 0) {
        setData([]);
        setAllRunIds([]);
        setFilteredData([]);
        return;
      }

      const logs = response?.map((item, index) => ({
        id: index + 1,
        jobDescription: item._source.jobDescription || "-",
        hostname: item._source.hostname || "-",
        category: item._source.categoryName || "-",
        description: item._source.description || "-",
        command: item._source.command || "-",
        output: item._source.output || "-",
        runAs: item._source.runAs || "-",
        tags: item._source.tags || "-",
        runId: item._source.runId || "-",
        timestamp: item._source.timestamp
          ? new Date(item._source.timestamp).toLocaleString()
          : "-",
        exitStatus: item._source.exitStatus,
        actionDescription: item._source.actionDescription || "-",
        variableMapping: item._source.variableMapping || [],
      }));
      console.log("logs", logs);

      // setData(logs);

      // Extract run history
      const history = extractRunHistory(response);
      setAllRunIds(history);

      // Find and set the latest RunID
      const latestRunId = findLatestRunId(response);
      if (latestRunId) {
        setSelectedRunId([latestRunId]);
        setSelectedHistoryItem(latestRunId);
        setRunId(latestRunId);

        // Filter data based on latest run-id (Time stamp)
        const filteredByRunId = logs.filter(
          (item) => item.runId === latestRunId
        );
        setFilteredData(filteredByRunId);
      } else {
        setFilteredData(logs);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    if (open) {
      setInitialLoad(true);
      fetchData({
        categoryName: selectedCategory?.join(","),
        command: selectedCommand?.join(","),
        hostname: selectedHostName?.join(","),
        runAs: selectedRunas?.join(","),
        tags: selectedTags?.join(","),
        runId: selectedRunID.join(","),
      });

      if (jobId) {
        dispatch(getLogFilters(jobId));
      }

      if (allRunIds.length > 0 && !runId) {
        const latestRunId = allRunIds[0].runId;
        setRunId(latestRunId);
        setSelectedRunId([latestRunId]);
        setSelectedHistoryItem(latestRunId);
      }
    }
  }, [open, jobId]);

  useEffect(() => {
    if (open) {
      setCurrentPage(1);
    }
  }, [
    selectedCategory,
    selectedCommand,
    selectedHostName,
    selectedRunas,
    selectedTags,
    selectedRunID,
    searchTerm,
    open,
  ]);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase().trim();
    setSearchTerm(value);
  };

  const handleRefreshButton = () => {
    // fetchHostsDetails();
    getViewLogsByRunId({
      runId: runId,
      jobId: jobId,
      pageNo: currentPage,
      pageSize: itemsPerPage,
    });
  };

  const handleHistoryItemClick = (runId) => {
    setCurrentPage(1);
    setSelectedHistoryItem(runId);
    setSelectedRunId([runId]);
    setRunId(runId);

    setFilteredData([]);
    setMissingHostsData([]);
    setData([]);

    getViewLogsByRunId({
      runId: runId,
      jobId: jobId,
      pageNo: 1,
      pageSize: itemsPerPage,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // debounce delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (runId) {
      // fetchHostsDetails();
      getViewLogsByRunId({
        categoryName: selectedCategory?.join(","),
        command: selectedCommand?.join(","),
        hostname: selectedHostName?.join(","),
        runAs: selectedRunas?.join(","),
        tags: selectedTags?.join(","),
        runId: runId,
        jobId: jobId,
        searchTerm: debouncedSearchTerm,
        pageNo: currentPage,
        pageSize: itemsPerPage,
      });
    }
  }, [
    runId,
    currentPage,
    itemsPerPage,
    selectedCategory,
    selectedCommand,
    selectedHostName,
    selectedRunas,
    selectedTags,
    selectedRunID,
    debouncedSearchTerm,
  ]);

  const getViewLogsByRunId = async (params) => {
    if (!params.jobId || !params.runId) {
      return;
    }
    try {
      setPageLoader(true);
      const response = await getOpenSearchIndexByRunId(params);
      setOpenSearchIndexData(response?.data?.data[0]?._source || []);
      if (!response || !response?.data?.data?.length) {
        setFilteredData([]);
        return;
      }
      const logs = response.data.data?.map((item, index) => ({
        id: index + 1,
        jobDescription: item._source.jobDescription || "-",
        hostname: item._source.hostname || "-",
        category: item._source.categoryName || "-",
        description: item._source.description || "-",
        command: item._source.command || "-",
        output: item._source.output || "-",
        runAs: item._source.runAs || "-",
        tags: item._source.tags || "-",
        runId: item._source.runId || "-",
        timestamp: item._source.timestamp
          ? new Date(item._source.timestamp).toLocaleString()
          : "-",
        exitStatus: item._source.exitStatus,
        actionDescription: item._source.actionDescription || "-",
        variableMapping: item._source.variableMapping || [],
      }));
      setCountBaseData({
        totalCount: response.data.total,
        successCount: response.data.successCount,
        failedCount: response.data.failedCount,
      });
      setData(logs);
      setFilteredData(logs);
      const totalPages = response.data?.total
        ? Math.ceil(response.data.total / itemsPerPage)
        : 1;
      setTotalPages(totalPages);
      setFilteredData((prev) => {
        // Create a Set of existing entries (case-insensitive comparison)
        const existingEntries = new Set(
          prev.map(
            (item) =>
              `${item.hostname?.toLowerCase()}_${item.command?.toLowerCase()}_${
                item.timestamp
              }`
          )
        );

        // Filter new logs to only include those not already in filteredData
        const uniqueLogs = logs.filter(
          (log) =>
            !existingEntries.has(
              `${log.hostname?.toLowerCase()}_${log.command?.toLowerCase()}_${
                log.timestamp
              }`
            )
        );

        // Filter missingHosts to only include those not already in filteredData
        const uniqueMissingHosts = missingHostsData.filter(
          (host) =>
            !existingEntries.has(
              `${host.hostname?.toLowerCase()}_${host.command?.toLowerCase()}_${
                host.timestamp
              }`
            )
        );

        // Included unique  missing hosts
        //   return uniqueLogs.length > 0 || uniqueMissingHosts.length > 0
        //     ? [...prev, ...uniqueLogs, ...uniqueMissingHosts]
        //     : prev

        return uniqueLogs.length > 0 ? [...prev, ...uniqueLogs] : prev;
      });
    } catch (error) {
      console.error("Error fetching logs by runId:", error);
    } finally {
      setPageLoader(false);
    }
  };

  // Get the most recent log (first item in allRunIds)
  const mostRecentLog = allRunIds.length > 0 ? allRunIds[0] : null;

  // Get history logs (excluding the most recent one)
  const historyLogs = allRunIds.length > 1 ? allRunIds.slice(1) : [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData?.slice(startIndex, endIndex);

  //permissions to show logs columns
  const shouldShowLogsMapping = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.LOGS_MAPPING
  );

  const shouldShowLogsActionDescription = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.LOGS_ACTION_DESCRIPTION
  );

  const shouldShowLogsCommand = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.LOGS_COMMAND
  );

  const shouldShowLogsVariableMapping = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.LOGS_VARIABLE_MAPPING
  );

  const shouldShowLogsOutput = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.LOGS_OUTPUT
  );

  const shouldShowLogsStatus = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.LOGS_STATUS
  );

  const shouldShowLogsTags = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.LOGS_TAGS
  );

  const shouldShowLogsRunAs = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.LOGS_RUN_AS
  );

  const columns = [
    {
      field: "hostname",
      headerName: UI_TEXTS.TABLE_TEXTS.SERVER,
      flex: 2,
      minWidth: 270,
      sortable: true,
      headerClassName: "custom-header",
      cellClassName: "custom-column",
      renderCell: (params) => {
        const isGroup = params.row.isGroup;
        const isChild = params.row.isChild;
        const hostname = params.value;
        const groupItems = getGroupedData()[hostname] || [];

        if (isGroup) {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleHostExpansion(hostname);
                }}
                sx={{ marginRight: "8px" }}
              >
                {expandedHosts.includes(hostname) ? (
                  <ExpandMoreIcon fontSize="small" />
                ) : (
                  <ChevronRightIcon fontSize="small" />
                )}
              </IconButton>
              <span>{hostname}</span>
              <span
                style={{ marginLeft: 8, color: "#666", fontSize: "0.8rem" }}
              >
                ({groupItems.length} entries)
              </span>
            </div>
          );
        } else if (isChild) {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "40px",
              }}
            >
              {""}
            </div>
          );
        }
        return params.value;
      },
    },
    {
      field: "actionDescription",
      headerName: UI_TEXTS.TABLE_TEXTS.ACTION_DESCRIPTION,
      flex: 2.5,
      minWidth: 300,
      sortable: false,
      headerClassName: "custom-header",
      cellClassName: "custom-column",
    },
    {
      field: "description",
      headerName: UI_TEXTS.TABLE_TEXTS.MAPPING,
      flex: 2.5,
      minWidth: 300,
      sortable: false,
      headerClassName: "custom-header",
      cellClassName: "custom-column",
    },
    {
      field: "variableMapping",
      headerName: UI_TEXTS.TABLE_TEXTS.OUTPUT_FIELD_MAPPING,
      flex: 2,
      minWidth: 250,
      sortable: false,
      headerClassName: "custom-header",
      cellClassName: "custom-column-command-output",
      renderCell: (params) => {
        // Don't render status for parent/group rows
        if (params.row.variableMapping && params.row.variableMapping.length) {
          return (
            <Button variant="outlined" sx={{ borderRadius: "10px" }}>
              {"Show Mapping"}
            </Button>
          );
        } else {
          return "-";
        }
      },
    },
    {
      field: "command",
      headerName: UI_TEXTS.TABLE_TEXTS.COMMAND,
      flex: 2,
      minWidth: 250,
      sortable: false,
      headerClassName: "custom-header",
      cellClassName: "custom-column-command-output",
    },
    {
      field: "output",
      headerName: UI_TEXTS.TABLE_TEXTS.OUTPUT,
      flex: 2,
      minWidth: 250,
      sortable: false,
      headerClassName: "custom-header",
      cellClassName: "custom-column-command-output",
    },
    {
      field: "exitStatus",
      headerName: UI_TEXTS.TABLE_TEXTS.STATUS,
      flex: 1,
      minWidth: 250,
      sortable: false,
      headerClassName: "custom-header",
      cellClassName: "custom-column",

      renderCell: (params) => {
        // Don't render status for parent/group rows
        if (params.row.isGroup || params.row.isTree) {
          return null; // or return an empty fragment: <></>
        }

        return (
          <Chip
            label={params.value === 0 ? "Success" : "Fail"}
            color={params.value === 0 ? "success" : "error"}
            variant="outlined"
            sx={{
              fontFamily: "Manrope",
              fontWeight: 600,
              borderRadius: "10px",
            }}
          />
        );
      },
    },
    {
      field: "runAs",
      headerName: UI_TEXTS.TABLE_TEXTS.RUN_AS,
      flex: 3,
      minWidth: 200,
      sortable: false,
      headerClassName: "custom-header",
      cellClassName: "custom-column",
    },
    {
      field: "tags",
      headerName: UI_TEXTS.TABLE_TEXTS.TAGS,
      flex: 3,
      minWidth: 200,
      sortable: false,
      headerClassName: "custom-header",
      cellClassName: "custom-column",
    },
  ];

  // helper function to remove a field from column array
  const removeColumn = (field) => {
    const index = columns.findIndex((el) => el.field === field);
    if (index !== -1) columns.splice(index, 1); // mutate in place
  };

  // remove fields based on conditions
  if (!shouldShowLogsMapping) removeColumn("description");
  if (!shouldShowLogsActionDescription) removeColumn("actionDescription");
  if (!shouldShowLogsCommand) removeColumn("command");
  if (!shouldShowLogsVariableMapping) removeColumn("variableMapping");
  if (!shouldShowLogsOutput) removeColumn("output");
  if (!shouldShowLogsStatus) removeColumn("exitStatus");
  if (!shouldShowLogsTags) removeColumn("tags");
  if (!shouldShowLogsRunAs) removeColumn("runAs");

  const getRowClassName = (params) => {
    return params.row.exitStatus === 0 ? "row-success" : "row-fail";
  };

  const transformOptions = (options) => {
    return options.map((option, index) => ({
      id: option,
      label: option,
      value: option,
    }));
  };

  const [filters, setFilters] = useState({
    hostname: [],
    tags: [],
    command: [],
    runas: [],
    category: [],
    runId: [],
    recentFilter,
  });

  const filtersConfig = [
    {
      id: "hostname",
      name: "hostname",
      placeholder: "Server",
      options: transformOptions(logFilters?.hostnames || []),
      value: selectedHostName,
      onChange: (value) => handleFilterChange("hostname", value),
    },
    {
      id: "tags",
      name: "tags",
      placeholder: "Tags",
      options: transformOptions(logFilters?.tags || []),
      value: selectedTags,
      onChange: (value) => handleFilterChange("tags", value),
    },
    {
      id: "command",
      name: "command",
      placeholder: "Command",
      options: transformOptions(logFilters?.command || []),
      value: selectedCommand,
      onChange: (value) => handleFilterChange("command", value),
    },
    {
      id: "runas",
      name: "runas",
      placeholder: "Run as",
      options: transformOptions(logFilters?.runAs || []),
      value: selectedRunas,
      onChange: (value) => handleFilterChange("runas", value),
    },
    {
      id: "category",
      name: "category",
      placeholder: "Category",
      options: transformOptions(logFilters?.categoryName || []),
      value: selectedCategory,
      onChange: (value) => handleFilterChange("category", value),
    },
  ];

  const handleFilterChange = (key, value) => {
    const selectedValues = value?.target
      ? value.target.value
      : Array.isArray(value)
      ? value
      : [value];

    setFilters((prev) => ({
      ...prev,
      [key]: selectedValues,
    }));

    switch (key) {
      case "hostname":
        setSelectedHostName(selectedValues);
        break;
      case "tags":
        setSelectedTags(selectedValues);
        break;
      case "command":
        setSelectedCommand(selectedValues);
        break;
      case "runas":
        setSelectedRunas(selectedValues);
        break;
      case "category":
        setSelectedCategory(selectedValues);
        break;
      case "runId":
        setSelectedRunId(selectedValues);
        setSelectedHistoryItem(selectedValues[0] || null);
        break;
      default:
        break;
    }
  };

  const handleRemoveFilter = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: [],
    }));

    switch (key) {
      case "hostname":
        setSelectedHostName([]);
        break;
      case "tags":
        setSelectedTags([]);
        break;
      case "command":
        setSelectedCommand([]);
        break;
      case "runas":
        setSelectedRunas([]);
        break;
      case "category":
        setSelectedCategory([]);
        break;
      case "runId":
        setSelectedRunId([]);
        setSelectedHistoryItem(null);
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    // Keep the latest RunID filter when clearing others
    const latestRunId = allRunIds.length > 0 ? allRunIds[0].runId : null;

    setSelectedHostName([]);
    setSelectedTags([]);
    setSelectedCommand([]);
    setSelectedRunas([]);
    setSelectedCategory([]);
    setFilteredData([]);

    if (latestRunId) {
      setSelectedHistoryItem(latestRunId);
    }

    setFilters({
      hostname: [],
      tags: [],
      command: [],
      runas: [],
      category: [],
      recentFilter,
    });
  };

  // Add this function to your component
  const findMismatchedHosts = (viewLogsData, hostDetailsData) => {
    if (!viewLogsData || !hostDetailsData)
      return { missingHosts: [], failedHosts: [] };
    // Normalize hostnames to lowercase for comparison
    const viewLogsHostnames = new Set(
      viewLogsData.map((log) => log?.hostname?.toLowerCase())
    );

    const hostDetailsMap = new Map();
    hostDetailsData.forEach((host) => {
      const normalizedHostname = host.hostname?.toLowerCase();
      if (normalizedHostname) {
        hostDetailsMap.set(normalizedHostname, {
          status: host.status,
          originalHostname: host.hostname,
        });
      }
    });

    const missingHosts = [];
    const failedHosts = [];
    hostDetailsMap.forEach((hostInfo, hostname) => {
      if (!viewLogsHostnames.has(hostname) && hostInfo.status !== "fail") {
        missingHosts.push({
          id: uuidv4(),
          category: "---",
          command: "---",
          description: "---",
          exitStatus: "---",
          hostname: hostInfo.originalHostname?.toUpperCase(),
          jobDescription: "---",
          output: null,
          runAs: "---",
          runId: "---",
          tags: [],
          timestamp: new Date().toLocaleString(),
        });
      } else {
        console.log("HostName", hostname);
      }
    });

    // Check view logs against host details
    viewLogsData.forEach((log) => {
      const logHostname = log?.hostname?.toLowerCase();
      if (!logHostname) return;

      const hostInfo = hostDetailsMap.get(logHostname);

      // Hosts in logs but not in host details (unexpected)
      if (!hostInfo) {
        failedHosts.push({
          hostname: log.hostname,
          status: "unknown",
          reason: "Not found in host details",
          exitStatus: log.exitStatus,
        });
      }
      // Hosts with successful status but failed execution
      else if (hostInfo.status !== "fail" && log.exitStatus !== 0) {
        failedHosts.push({
          hostname: hostInfo.originalHostname,
          status: hostInfo.status,
          exitStatus: log.exitStatus,
          reason: "Execution failed despite successful status",
        });
      }
    });

    return { missingHosts, failedHosts };
  };

  useEffect(() => {
    if (filteredData.length > 0 && severNodeData.length > 0) {
      const { missingHosts, failedHosts } = findMismatchedHosts(
        filteredData,
        severNodeData
      );
      // Included missing hosts
      setMissingHostsData((prev) => [...prev]);
      setFilteredData((prev) => [...prev]);
    }
  }, [severNodeData]);

  // clear FilteredData when page changes
  useEffect(() => {
    setFilteredData([]);
  }, [currentPage, itemsPerPage]);

  // Function to transform data into grouped structure
  const getGroupedData = () => {
    const groups = {};

    // Group by hostname
    filteredData.forEach((item) => {
      if (!groups[item.hostname]) {
        groups[item.hostname] = [];
      }
      groups[item.hostname].push(item);
    });

    return groups;
  };

  // Function to toggle host expansion
  const toggleHostExpansion = (hostname) => {
    setExpandedHosts((prev) =>
      prev.includes(hostname)
        ? prev.filter((h) => h !== hostname)
        : [...prev, hostname]
    );
  };

  const toggleSidebar = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const prepareRows = () => {
    // First filter by status if a status filter is applied
    let dataToDisplay = [...filteredData];

    if (statusFilter === "success") {
      dataToDisplay = dataToDisplay.filter((item) => item.exitStatus === 0);
    } else if (statusFilter === "fail") {
      dataToDisplay = dataToDisplay.filter((item) => item.exitStatus !== 0);
    }

    const groups = {};
    // Group by hostname
    dataToDisplay.forEach((item) => {
      if (!groups[item.hostname]) {
        groups[item.hostname] = [];
      }
      groups[item.hostname].push(item);
    });

    const rows = [];
    Object.entries(groups).forEach(([hostname, items]) => {
      if (items.length === 1) {
        // Single item - add as normal row
        rows.push(items[0]);
      } else {
        // Add group header row
        const allSuccessful = items.every((item) => item.exitStatus === 0);
        rows.push({
          id: `group-${hostname}`,
          hostname,
          isGroup: true,
          cssClass: allSuccessful ? "row-success" : "row-fail",
          count: items.length,
          timestamp: items[0].timestamp, // Use first item's timestamp for sorting
        });

        // Add child rows if expanded
        if (expandedHosts.includes(hostname)) {
          items.forEach((item, index) => {
            rows.push({
              ...item,
              id: `${hostname}-${index}`,
              isChild: true,
            });
          });
        }
      }
    });

    return rows;
  };

  const filteredRows = prepareRows();

  const handleTileFilterChange = (filter) => {
    setStatusFilter(filter);
    setPageLoader(true);
    // setCurrentPage(1);
    setTimeout(() => {
      setPageLoader(false);
    }, 800);
  };

  const fetchJObSummaryDetails = async () => {
    const response = await getOpenSearchIndex({
      categoryName: "",
      command: "",
      hostname: "",
      runAs: "",
      runId: "",
      tags: "",
      jobId,
    });
    setOpenSearchIndexData(response[0]?._source || []);
  };

  useEffect(() => {
    if (specificJob?.scheduleType === "AD_HOC") {
      fetchJObSummaryDetails();
    }
  }, [specificJob?.scheduleType]);

  return (
    <>
      <Modal open={open} onClose={onClose} className="modal-overlay">
        <Box
          className="modal-container"
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "96vh",
            width: "96vw",
            // maxWidth: "1200px",
            margin: "auto",
          }}
        >
          <Box
            className="modal-header"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2 className="modal-title">{UI_TEXTS.LABELS.VIEW_LOGS}</h2>
              <span className="logs-sub-title">{jobDescription}</span>
            </div>
            <IconButton onClick={onClose} className="modal-close">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              gap: 2,
              p: 2,
            }}
          >
            {/* Left Panel */}
            <Box
              className="viewLogs_sidebar_container"
              sx={{
                width: isExpanded ? "20%" : "10%",
                borderRight: "1px solid #e0e0e0",
                pr: 2,
                position: "relative",
              }}
            >
              <div className="viewLogs_sidebar_toggle" onClick={toggleSidebar}>
                {isExpanded ? (
                  <ChevronLeftIcon sx={{ fontSize: "16px" }} />
                ) : (
                  <ChevronRightIcon sx={{ fontSize: "16px" }} />
                )}
              </div>
              {/* Recent Logs Section */}
              <Box sx={{ mb: 2, marginTop: "12px" }}>
                <h2 className="left-panel-title">
                  {UI_TEXTS.LABELS.RECENT_LOGS}
                </h2>
                {mostRecentLog ? (
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                      },
                    }}
                    onClick={() => {
                      handleHistoryItemClick(mostRecentLog.runId);
                      // setRunId(mostRecentLog.runId);
                    }}
                  >
                    <Typography
                      className="recent-logs-list-item"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {UI_TEXTS.TYPOGRAPHY.DATE_AND_TIME}:{" "}
                      {formatTimeStamp(mostRecentLog.timestamp)}
                    </Typography>
                    <Tooltip title={mostRecentLog.runId} placement="top" arrow>
                      <Typography
                        sx={{
                          fontFamily: "Manrope",
                          fontSize: "12px",
                          color: "#334155",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {UI_TEXTS.TYPOGRAPHY.ID}: {mostRecentLog.runId}
                      </Typography>
                    </Tooltip>
                  </Box>
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography>
                      {UI_TEXTS.NOT_FOUND.NO_RECENT_LOGS_FOUND}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2, borderBottomWidth: "medium" }} />

              {/* History Section */}
              <Box>
                <Typography className="left-panel-title">
                  {UI_TEXTS.TYPOGRAPHY.HISTORY}
                </Typography>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : historyLogs.length > 0 ? (
                  <List sx={{ maxHeight: "400px", overflow: "auto" }}>
                    {historyLogs.map((run) => (
                      <ListItem
                        key={run.runId}
                        button
                        onClick={() => {
                          handleHistoryItemClick(run.runId);
                        }}
                        selected={selectedHistoryItem === run.runId}
                        sx={{
                          "&.Mui-selected": {
                            backgroundColor: "#e3f2fd",
                            "&:hover": {
                              backgroundColor: "#e3f2fd",
                            },
                          },
                          backgroundColor: "inherit",
                          "&:hover": {
                            backgroundColor: "#f5f5f5",
                          },
                          mb: 1,
                          borderRadius: 1,
                        }}
                      >
                        <ListItemText
                          className="recent-logs-list-item"
                          primary={`Date & Time: ${formatTimeStamp(
                            run.timestamp
                          )}`}
                          secondary={
                            <Tooltip title={run.runId} placement="top" arrow>
                              <span
                                style={{
                                  fontFamily: "Manrope",
                                  fontSize: "12px",
                                  color: "#334155",
                                  fontWeight: 500,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  width: "200px",
                                  display: "inline-block",
                                }}
                              >
                                {UI_TEXTS.TYPOGRAPHY.ID}: {run.runId}
                              </span>
                            </Tooltip>
                          }
                          primaryTypographyProps={{
                            sx: {
                              fontFamily: "Manrope",
                              fontSize: "13.5px",
                              color: "#334155",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography>
                      {UI_TEXTS.NOT_FOUND.NO_HISTORY_AVAILABLE}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Right Panel */}
            <Box sx={{ width: isExpanded ? "78%" : "88%", pl: 2 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontFamily: "Manrope",
                  color: "#101828",
                  fontSize: "14px",
                  margin: "7px",
                }}
              >
                {UI_TEXTS.TYPOGRAPHY.SCHEDULE_SUMMARY}
              </Typography>
              <JobSummary
                jobData={specificJob}
                openSearchJobData={openSearchIndexData}
                allRunIds={allRunIds}
              />

              <Box
                className="full-width"
                style={{
                  display: filtersVisible ? "flex" : "none",
                  width: "100%",
                  margin: "0px !important",
                }}
              >
                <CustomFilter
                  filterTitle={"Logs Filter"}
                  filtersConfig={filtersConfig}
                  appliedFilters={filters}
                  onFilterChange={handleFilterChange}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAllFilters={clearAllFilters}
                  recentFilter={recentFilter}
                  filterLoading={filterLoading}
                  ref={React.createRef()}
                />
              </Box>

              <Box className="search-container">
                <Box className="status_cards_container">
                  <StatusCard
                    icon={<ComputerIcon fontSize="small" />}
                    title="All"
                    count={countBaseData.totalCount}
                    color="#2196F3"
                    active={statusFilter === "All"}
                    onClick={() => handleTileFilterChange("All")}
                    tooltip={"All Command Logs"}
                  />
                  <StatusCard
                    icon={<CheckCircleIcon fontSize="small" />}
                    title="Success"
                    count={countBaseData.successCount}
                    color="#4CAF50"
                    active={statusFilter === "success"}
                    onClick={() => handleTileFilterChange("success")}
                    tooltip={"Success Command Logs"}
                  />
                  <StatusCard
                    icon={<ErrorIcon fontSize="small" />}
                    title="Failed"
                    count={countBaseData.failedCount}
                    color="#F44336"
                    active={statusFilter === "fail"}
                    onClick={() => handleTileFilterChange("fail")}
                    tooltip={"Failed Command Logs"}
                  />
                </Box>

                <Box className="search_filter_container">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <IconButton
                      style={{
                        border: "1px solid #e4e4e4",
                        width: "40px",
                        height: "40px",
                      }}
                      onClick={handleRefreshButton}
                      size="medium"
                      color="#344054"
                      title="Refresh"
                    >
                      <Refresh />
                    </IconButton>
                  </div>
                  <div
                    className="filter_container"
                    onClick={toggleFilters}
                    style={{ cursor: "pointer" }}
                  >
                    <Tooltip title="filter" placement="top" arrow>
                      <Filter size="25" color="#2961F4" variant="Bold" />
                    </Tooltip>
                  </div>

                  <CustomSearch
                    data={[]}
                    handleChange={handleSearchChange}
                    searchTerm={searchTerm}
                    clearSearch={() => setSearchTerm("")}
                    placeholder="Search by Server, Tag, Run As"
                  />
                </Box>
              </Box>
              <div
                className="modal-content"
                style={{
                  maxWidth: "100%",
                  boxShadow: "none",
                  padding: "0",
                }}
              >
                {loading && initialLoad ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "45vh",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={{ height: "48vh" }}>
                    <DataGrid
                      className="data-grid-wrapper"
                      rows={filteredRows || []}
                      columns={columns}
                      getRowId={(row) => row.id}
                      hideFooter={true}
                      tableHeight="50vh"
                      loading={pageLoader}
                      sortingMode="client"
                      sortModel={sortModel}
                      onSortModelChange={handleSortModelChange}
                      disableSorting={false}
                      disableColumnFilter // disables filtering for all columns
                      disableColumnMenu
                      apiRef={apiRef}
                      treeData
                      getTreeDataPath={(row) =>
                        row.isTree ? row.hierarchyPath : null
                      }
                      isRowExpandable={(params) => params.row.isTree}
                      getRowClassName={(params) => {
                        if (params.row.exitStatus !== 0 && !params.row.isGroup)
                          return "row-fail";
                        if (params.row.exitStatus === 0) return "row-success";
                        if (params.row.isGroup) return `${params.row.cssClass}`;
                        if (params.row.isChild) return "child-row";
                        return "";
                      }}
                      onCellClick={(params, event) => {
                        console.log("params params => ", params);
                        if (
                          (params.field === "command" ||
                            params.field === "output") &&
                          params.value
                        ) {
                          event.stopPropagation();
                          setModalData(params);
                          setShowModal(true);
                        } else if (
                          params.field === "variableMapping" &&
                          Array.isArray(params.value) &&
                          params.value.length
                        ) {
                          event.stopPropagation();
                          setModalData(params);
                          setShowModal(true);
                        }
                      }}
                      sx={{
                        "& .MuiDataGrid-columnHeaders": {
                          backgroundColor: "#f5f5f5",
                          color: "#667085",
                          textTransform: "capitalize !important",
                          fontSize: "14px",
                          fontFamily: "Manrope",
                          fontWeight: "600",
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                          fontWeight: "600",
                          textTransform: "full-width",
                          fontSize: "14px",
                          fontFamily: "Manrope",
                        },
                      }}
                    />
                  </Box>
                )}
              </div>

              {filteredData.length > 0 && (
                <div style={{ borderTop: "1px solid #ddd", zIndex: 99 }}>
                  <CustomPagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                    totalPages={totalPages}
                  />
                </div>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
      <LogsRowModal
        showModal={showModal}
        setShowModal={setShowModal}
        modalData={modalData}
        setModalData={setModalData}
      />
    </>
  );
};

export default ViewLogs;
