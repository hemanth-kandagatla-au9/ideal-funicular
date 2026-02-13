/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import {
  Button,
  Tooltip,
  Modal,
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import ReactJson from "react-json-view";
import Search from "../ui/search/Search.component";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { CustomDataGrid } from "../common/CustomDatagrid/CustomDatagrid";
import { Play, More } from "iconsax-react";
import CustomPagination from "../common/CustomPagination/CustomPagination";
import SubHeader from "../planning/SubHeader.component";
import Sidebar from "../planning/Sidebar.component";
import "./css/common.css";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";
import {
  getCMDBSchedules,
  triggerCMDBSchedule,
  getCMDBSchedulesLogs,
  createCMDBSchedule,
  getCmdbConfiguration,
} from "../../services/jobs/JobsService";
import {
  hasInsightsPermission,
  PERMISSION_LIST,
} from "../../utils/permissionUtil";
import { TemplateTooltip } from "../CustomTooltip/CustomTooltip";
import { convertCronToHumanReadable } from "../../utils/utils";
import { Refresh } from "@mui/icons-material";
import { HiOutlineDocumentReport } from "react-icons/hi";
import CmbdViewLogs from "./CmbdViewLogs";
import { isLoadingInHost } from "../../utils/DetectHost";
import { useRef } from "react";
import classes from "../../components/planning/css/subheader.module.css";
import IconStart from "../../assets/images/Icon start.png";
import AddJobModal from "./AddJobModal";
import { DeleteIcon } from "../ui/icons/Icons";
import ConfirmationDialog from "../../layouts/report/DeleteConfirmation";
import { deleteCmdbJob } from "../../services/configurations/configService";

function CMDBJobsList() {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("");
  const [jobData, setJobData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageInput, setPageInput] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sidebarActiveTab, setSidebarActiveTab] = useState("cmdb_schedules");
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [table, setTable] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [scheduleLogs, setSchedulelogs] = useState(false);
  const [logsPageno, setLogsPageno] = useState(1);
  const [logsItemsPerPage, setLogsItemsPerPage] = useState(10);
  const [logsItemTotalPages, setLogsItemTotalPages] = useState(1);
  const [logsItemsTotalCount, setLogsItemsTotalCount] = useState(0);
  const [modelOpen, setModelOpen] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [jobForm, setJobForm] = useState({
    jobName: "",
    sourceTable: "",
  });
  const [cmdbConfiguredOptions, setCmdbConfiguredOptions] = useState([]);
  const [editData, setEditData] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchCmdbConfig = async () => {
      try {
        const data = await dispatch(getCmdbConfiguration());
        const normalized = Array.isArray(data.data)
          ? data.data.map((item) => ({
              id: item._id,
              value: item.value,
            }))
          : [];

        setCmdbConfiguredOptions(normalized);
      } catch (error) {
        toast.error(error);
        setCmdbConfiguredOptions([]);
      }
    };

    fetchCmdbConfig();
  }, [dispatch]);

  const handleSave = async () => {
    if (!jobForm.jobName || !jobForm.sourceTable) {
      toast.error("Job Name and Source Table are required");
      return;
    }

    try {
      setLoadingData(true);

      await dispatch(
        createCMDBSchedule({
          jobName: jobForm.jobName,
          tableName: jobForm.sourceTable,
        })
      );
      setJobForm({
        jobName: "",
        sourceTable: "",
      });
      setModelOpen(false);
      handleRefreshButton();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create CMDB job";

      toast.error(message);
    } finally {
      setLoadingData(false);
    }
  };

  const permissionState = useSelector((state) => state.jobs?.permissions);
  const hasFiredInitialApi = useRef(false);

  // Permission checks
  const readPermForCMDB = hasInsightsPermission(
    permissionState,
    "CMDB",
    PERMISSION_LIST.CMDB_READ
  );

  const writePermForCMDB = hasInsightsPermission(
    permissionState,
    "CMDB",
    PERMISSION_LIST.CMDB_WRITE
  );

  // Debug permissions
  useEffect(() => {
    // console.log("=== CMDB PERMISSIONS ===");
    // console.log("Read Permission:", readPermForCMDB);
    // console.log("Write Permission:", writePermForCMDB);
    // console.log("Permission State:", permissionState);
  }, [permissionState, readPermForCMDB, writePermForCMDB]);

  useEffect(() => {
    getScheduleLogsData({
      table: table,
      pageSize: logsItemsPerPage,
      pageNo: logsPageno,
    });
  }, [logsPageno, logsItemsPerPage]);

  const getScheduleData = async (
    { searchValue, pageSize, pageNo },
    showFilter = true
  ) => {
    let query = "?";
    if (showFilter) setLoading(true);

    if (searchValue) {
      query += `searchValue=${encodeURIComponent(searchValue)}&`;
    }
    if (pageSize) {
      query += `pageSize=${pageSize}&`;
    }
    if (pageNo) {
      query += `pageNo=${pageNo}`;
    }

    try {
      const response = await dispatch(getCMDBSchedules(query));
      let fetchedData = response?.data?.data || [];

      setJobData(fetchedData);

      const totalCount = response?.data?.pagination?.totalCount || 0;
      const totalPage = response?.data?.pagination?.totalPage || 1;

      setTotalCount(totalCount);
      setTotalPages(totalPage);
    } catch (error) {
      console.error("Error fetching CMDB schedule data:", error);
      toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_FETCH_DATA);
    } finally {
      setLoading(false);
    }
  };

  const getScheduleLogsData = async (
    {
      searchValue,
      pageNo,
      pageSize,
      hostname,
      table,
      status,
      executionId,
      batch,
    },
    showFilter = true
  ) => {
    // setLogsItemsTotalCount(0);
    // setLogsItemTotalPages(1);
    setSchedulelogs([]);

    let query = "?";
    if (showFilter) setLoading(true);

    if (table) {
      query += `table=${encodeURIComponent(table)}&`;
    }

    if (hostname) {
      query += `hostname=${encodeURIComponent(hostname)}&`;
    }

    if (status) {
      query += `status=${encodeURIComponent(status)}&`;
    }

    if (executionId) {
      query += `executionId=${encodeURIComponent(executionId)}&`;
    }

    if (batch) {
      query += `batch=${encodeURIComponent(batch)}&`;
    }

    if (searchValue) {
      query += `searchValue=${encodeURIComponent(searchValue)}&`;
    }

    if (pageSize) {
      query += `pageSize=${pageSize}&`;
    }
    if (pageNo) {
      query += `pageNo=${pageNo}`;
    }
    setTable(table);
    try {
      const response = await dispatch(getCMDBSchedulesLogs(query));
      let fetchedData1 = response?.data?.data || [];

      const data = fetchedData1.map((item) => ({
        ...item,
        id: item._id, // DataGrid requires unique 'id'
        status: item.statusText, // Combine status and statusText
        hostname: item.hostname,
        table: item.table,
        executionId: item.executionId,
        batch: item.batch,
        triggeredBy: item.triggeredBy,
        timeStamp: new Date(item.formattedTimestamp).getTime(),
      }));

      setSchedulelogs(data);
      setLoading(false);

      const totalCount = response?.data?.pagination?.totalCount || 0;
      const totalPage = response?.data?.pagination?.totalPage || 1;

      setLogsItemsTotalCount(totalCount);
      setLogsItemTotalPages(totalPage);
    } catch (error) {
      console.error("Error fetching CMDB schedule data:", error);
      toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_FETCH_DATA);
    } finally {
      setLoading(false);
    }
  };

  // Apply status filter to the data
  const applyStatusFilter = (data, status) => {
    if (status === "All") return data;

    return data.filter((job) => {
      const jobStatus = getJobStatus(job);
      return jobStatus === status;
    });
  };

  //commneted out for future use if incase required
  // useEffect(() => {
  //   if (readPermForCMDB) {
  //     getScheduleData({
  //       searchValue: filter,
  //       pageSize: itemsPerPage,
  //       pageNo: currentPage,
  //     });
  //   }
  // }, [filter, itemsPerPage, currentPage, readPermForCMDB]);

  useEffect(() => {
    if (readPermForCMDB) {
      getScheduleData({
        searchValue: filter,
        pageSize: itemsPerPage,
        pageNo: currentPage,
      });
    }
  }, [filter]);

  useEffect(() => {
    if (!isLoadingInHost) {
      if (!hasFiredInitialApi.current && readPermForCMDB) {
        getScheduleData({
          searchValue: filter,
          pageSize: itemsPerPage,
          pageNo: currentPage,
        });
        hasFiredInitialApi.current = true;
      }
      return;
    }

    // HOST PLATFORM MODE: fire once, do not wait for permissions
    const timer = setTimeout(() => {
      if (!hasFiredInitialApi.current) {
        console.log("[CMDB][HOST] Initial API fired without permission gate");

        getScheduleData({
          searchValue: filter,
          pageSize: itemsPerPage,
          pageNo: currentPage,
        });

        hasFiredInitialApi.current = true;
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [isLoadingInHost]);

  // Apply status filter when jobData or statusFilter changes
  useEffect(() => {
    const filtered = applyStatusFilter(jobData, statusFilter);
    setFilteredData(filtered);
  }, [jobData, statusFilter]);

  const handleAdhocRun = async (tableName) => {
    if (!writePermForCMDB) {
      toast.error("You don't have permission to run CMDB jobs");
      return;
    }

    try {
      const response = await dispatch(triggerCMDBSchedule(tableName));
      if (response?.data?.flag === "success") {
        toast.success("Adhoc run started successfully");
        getScheduleData(
          {
            searchValue: filter,
            pageSize: itemsPerPage,
            pageNo: currentPage,
          },
          false
        );
      } else {
        toast.error(response?.data?.message || "Failed to start adhoc run");
      }
    } catch (error) {
      toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_RUN_JOB);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      Success: { color: "success", label: "Success" },
      Failed: { color: "error", label: "Failed" },
      Running: { color: "warning", label: "Running" },
      Disabled: { color: "default", label: "Disabled" },
      Active: { color: "primary", label: "Active" },
      "Server Error": { color: "error", label: "Server Error" },
    };

    const config = statusConfig[status] || { color: "default", label: status };
    return (
      <Chip
        label={config.label}
        color={config.color}
        style={{ borderRadius: "10px", fontFamily: "Manrope" }}
        size="small"
      />
    );
  };

  const getStatusChip2 = (status) => {
    const statusConfig = {
      Success: { color: "success", label: "Success" },
      Failed: { color: "error", label: "Failed" },
      Running: { color: "warning", label: "Running" },
      Disabled: { color: "default", label: "Disabled" },
      Active: { color: "primary", label: "Active" },
      Error: { color: "error", label: "Error" },
    };

    const config = statusConfig[status] || { color: "default", label: status };
    return (
      <Chip
        label={config.label}
        color={config.color}
        style={{ borderRadius: "10px", fontFamily: "Manrope" }}
        size="small"
      />
    );
  };

  const getJobStatus = (job) => {
    // Use the status field directly from backend
    if (job.status) {
      return job.status;
    }

    // Fallback logic if status field is not available
    if (job.active === false) {
      return "Disabled";
    }

    // Default status if none is provided
    return "Active";
  };

  const formatLastRun = (lastRunDate) => {
    if (!lastRunDate) return null;

    const date = new Date(lastRunDate);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      field: "jobName",
      headerName: "Job Name",
      flex: 2,
      minWidth: 200,
      sortable: true,
      renderCell: (params) => (
        <div>
          <div
            style={{ fontFamily: "Manrope", fontWeight: 600, fontSize: "14px" }}
          >
            {params.row.jobName}
          </div>
          <div
            style={{
              fontFamily: "Manrope",
              fontSize: "12px",
              color: "#666",
              marginTop: "4px",
            }}
          >
            {params.row.description || "No description available"}
          </div>
        </div>
      ),
    },
    {
      field: "templateName",
      headerName: "Template Name",
      flex: 1.5,
      minWidth: 150,
      sortable: true,
      renderCell: (params) => (
        <TemplateTooltip template={params?.row?.currentTemplate}>
          <div
            style={{ fontFamily: "Manrope", fontWeight: 600, fontSize: "14px" }}
          >
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: "#2961F4",
                border: "1px solid #2961F4",
                fontSize: "12px",
                backgroundColor: "transparent !important",
                fontFamily: "Manrope",
                minWidth: "100px",
                height: "25px",
                padding: "5px",
                fontWeight: "600",
                borderRadius: "16px",
              }}
            >
              {params.row.defaultTemplate?.templateName || "No template"}
            </span>
          </div>
        </TemplateTooltip>
      ),
    },
    {
      field: "sourceTable",
      headerName: "Source Table",
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => (
        <div style={{ fontFamily: "Manrope", fontSize: "12px" }}>
          {params.row.tableName || "-"}
        </div>
      ),
    },
    {
      field: "schedule",
      headerName: "Schedule",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <div style={{ fontFamily: "Manrope", fontWeight: 500 }}>
          <Tooltip
            title={
              params.row.schedule
                ? convertCronToHumanReadable(params.row.schedule)
                : "-"
            }
          >
            <span>
              {params.row.schedule
                ? convertCronToHumanReadable(params.row.schedule)
                : "-"}
            </span>
          </Tooltip>
        </div>
      ),
    },
    {
      field: "lastRun",
      headerName: "Last Run",
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <div>
          <div style={{ fontFamily: "Manrope", fontSize: "14px" }}>
            {formatDateTime(params.row.lastRun)}
          </div>
          <div
            style={{ fontFamily: "Manrope", fontSize: "12px", color: "#666" }}
          >
            {formatLastRun(params.row.lastRun)}
          </div>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => {
        const status = getJobStatus(params.row);
        return getStatusChip(status);
      },
    },
    {
      field: "logs",
      headerName: "Logs",
      cellClassName: "vertical-align-center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      minWidth: 60,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <div style={{ margin: "auto" }}>
              <Tooltip title="Schedule Logs">
                <button
                  onClick={(e) => handleOpenExecutionLogs(params.row, e)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <HiOutlineDocumentReport color="#2961F4" size={18} />
                </button>
              </Tooltip>
            </div>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => {
        const status = getJobStatus(params.row);
        const isDisabled =
          status === "Disabled" || !params.row.active || !writePermForCMDB;

        // Platform-specific layout with fixed-width container
        if (isLoadingInHost) {
          return (
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Tooltip
                title={writePermForCMDB ? "Run Now" : "No permission to run jobs"}
              >
                <span>
                  <Button
                    size="small"
                    className="cmdb-adhoc_delete_btn"
                    startIcon={<Play size="16" />}
                    onClick={() => handleAdhocRun(params.row.tableName)}
                    disabled={isDisabled}
                  >
                    Run Adhoc
                  </Button>
                </span>
              </Tooltip>
              <div style={{ width: "24px", display: "flex", justifyContent: "center" }}>
                {params.row.tableName !== "cmdb_rel_ci" &&
                  params.row.tableName !== "cmdb_ci_server" && (
                    <span title="Delete Job">
                      <DeleteIcon
                        height={"15px"}
                        testid="dropdown-item-delete"
                        className="adhoc_delete_btn"
                        eventKey="2"
                        id="groupButtonDelete"
                        onClickHandle={() => {
                          setEditData(params.row.tableName);
                          setModalShow(true);
                        }}
                      />
                    </span>
                  )}
              </div>
            </div>
          );
        }

        // Original insights layout
        return (
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Tooltip
              title={writePermForCMDB ? "Run Now" : "No permission to run jobs"}
            >
              <span>
                <Button
                  size="small"
                  className="cmdb-adhoc_delete_btn"
                  startIcon={<Play size="16" />}
                  onClick={() => handleAdhocRun(params.row.tableName)}
                  disabled={isDisabled}
                >
                  Run Adhoc
                </Button>
              </span>
            </Tooltip>
            &nbsp;&nbsp;
            {params.row.tableName !== "cmdb_rel_ci" &&
              params.row.tableName !== "cmdb_ci_server" && (
                <span title="Delete Job">
                  <DeleteIcon
                    height={"15px"}
                    testid="dropdown-item-delete"
                    className="adhoc_delete_btn"
                    eventKey="2"
                    id="groupButtonDelete"
                    onClickHandle={() => {
                      setEditData(params.row.tableName);
                      setModalShow(true);
                    }}
                  />
                </span>
              )}
          </div>
        );
      },
    },
  ];

  const logs_columns = [
    {
      field: "status",
      headerName: UI_TEXTS.TABLE_TEXTS.STATUS,
      flex: 2,
      minWidth: 270,
      sortable: true,
      headerClassName: "custom-header",
      cellClassName: "custom-column",
      renderCell: (params) => {
        const status = getJobStatus(params.row);
        return getStatusChip2(status);
      },
    },
    {
      field: "hostname",
      headerName: UI_TEXTS.TABLE_TEXTS.HOSTNAME,
      flex: 2.5,
      minWidth: 300,
      sortable: true,
      headerClassName: "custom-header",
      cellClassName: "custom-column",
    },
    {
      field: "inputOutput",
      headerName: "I/O",
      flex: 2.5,
      minWidth: 350,
      sortable: false,
      headerClassName: "custom-header",
      cellClassName: "custom-column",
      renderCell: (params) => {
        const [open, setOpen] = useState(false);

        if (
          !params.row.inputOutput ||
          (Object.keys(params.row.inputOutput.input || {}).length === 0 &&
            Object.keys(params.row.inputOutput.output || {}).length === 0)
        ) {
          return (
            <span style={{ color: "#999", fontStyle: "italic" }}>
              No I/O data
            </span>
          );
        }

        return (
          <>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setOpen(true)}
              style={{ fontFamily: "monospace", fontSize: "12px" }}
            >
              View I/O
            </Button>

            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>I/O Data - {params.row.hostname}</DialogTitle>
              <DialogContent>
                <ReactJson
                  src={params.row.inputOutput}
                  name="inputOutput"
                  theme="monokai"
                  collapsed={1}
                  displayDataTypes={false}
                  displayObjectSize={true}
                  enableClipboard={true}
                  // style={{
                  //   backgroundColor: '#1e1e1e',
                  //   padding: '16px',
                  //   borderRadius: '4px',
                  //   fontSize: '14px'
                  // }}
                  // Add these props to handle URL overflow:
                  style={{
                    // backgroundColor: 'transparent',
                    wordBreak: "break-all", // This breaks long URLs
                    overflowWrap: "break-word",
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>
          </>
        );
      },
    },
    {
      field: "triggeredBy",
      headerName: UI_TEXTS.TABLE_TEXTS.TRIGGEREDBY,
      flex: 2.5,
      minWidth: 300,
      sortable: true,
      headerClassName: "custom-header",
      cellClassName: "custom-column",
    },
    {
      field: "timeStamp",
      headerName: UI_TEXTS.TABLE_TEXTS.TIME_STAMP,
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <div>
          <div style={{ fontFamily: "Manrope", fontSize: "14px" }}>
            {formatDateTime(params.row.timeStamp)}
          </div>
        </div>
      ),
    },
    {
      field: "table",
      headerName: UI_TEXTS.TABLE_TEXTS.TABLE,
      flex: 2.5,
      minWidth: 300,
      sortable: true,
      headerClassName: "custom-header",
      cellClassName: "custom-column",
    },
    {
      field: "executionId",
      headerName: UI_TEXTS.TABLE_TEXTS.EXECUTION_ID,
      flex: 2,
      minWidth: 250,
      sortable: true,
      headerClassName: "custom-header",
      cellClassName: "custom-column-command-output",
    },
    {
      field: "batch",
      headerName: UI_TEXTS.TABLE_TEXTS.BATCH,
      flex: 2,
      minWidth: 250,
      sortable: true,
      headerClassName: "custom-header",
      cellClassName: "custom-column-command-output",
    },
  ];

  const handleRefreshButton = () => {
    getScheduleData({
      searchValue: filter,
      pageSize: itemsPerPage,
      pageNo: currentPage,
    });
  };

  const handleOpenExecutionLogs = (job, event) => {
    setLoading(true);

    event.stopPropagation();
    getScheduleLogsData({
      table: job.tableName,
      pageSize: logsItemsPerPage,
      pageNo: logsPageno,
    });
    // event.stopPropagation();
    // setSelectedJobId(job?.scheduleId || job?._id);
    setOpenModal(true);
  };

  const handleDelete = async (table) => {
    setDeleteLoading(true);
    try {
      const response = await deleteCmdbJob(table);
      if (response?.data?.statusCode === 200) {
        toast.success(
          response?.data?.message === "API executed successfully"
            ? TOAST_MESSAGES.OTHERS.JOB_DELETED_SUCCESSFULLY
            : response?.data?.message,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }
        );
        setModalShow(false);
        getScheduleData({
          searchValue: filter,
          pageSize: itemsPerPage,
          pageNo: currentPage,
        });
      } else {
        toast.error(response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_DELETE_JOB, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Fixed status filters like before
  const statusFilters = ["All", "Success", "Failed", "Running", "Disabled"];

  // If no read permission, show access denied
  if (permissionState && !readPermForCMDB) {
    return (
      <div>
        <SubHeader />
        <div style={{ display: "flex", height: "88vh" }}>
          <Sidebar
            activeTab={sidebarActiveTab}
            setActiveTab={setSidebarActiveTab}
          />
          <div
            style={{
              width: "100%",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontFamily: "Manrope", color: "#dc3545" }}>
                Access Denied
              </h2>
              <p style={{ fontFamily: "Manrope", color: "#666" }}>
                You don't have permission to access CMDB schedules.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <SubHeader />
      </div>
      <div style={{ display: "flex", height: "88vh" }}>
        <Sidebar
          activeTab={sidebarActiveTab}
          setActiveTab={setSidebarActiveTab}
        />
        <div
          className={isLoadingInHost ? 'platform-cmdb-wrapper' : ''}
          style={{
            width: "100%",
            padding: "10px 20px",
            overflow: "hidden",
            maxWidth: "100vw",
            boxSizing: "border-box",
          }}
        >
          {/* Header Section */}
          <div className="menu-title" style={{ marginBottom: "-4px" }}>
            {!isLoadingInHost ? "CMDB" : "All"}
            <Tooltip title={totalCount ?? 0}>
              <div
                className="count_forModule_container"
                style={{ marginLeft: "4px" }}
              >
                <span className="count_forModule_ellipsis">
                  {totalCount ?? 0}
                </span>
              </div>
            </Tooltip>
          </div>
          {!isLoadingInHost ? (
            <span
              style={{
                color: "#94a3b8",
                fontSize: "12px",
                fontFamily: "Manrope",
                fontWeight: 500,
              }}
            >
              Monitor and manage data processing jobs
            </span>
          ) : (
            ""
          )}

          {/* CMDB Card Section */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "12px 0px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex" }}>
                {/* Search */}
                <div>
                  <Search
                    placeholder="Search jobs or source tables..."
                    searchIconTowardsRight
                    onEnterClear
                    customeCss={{ right: "5px", position: "relative" }}
                    selection="single"
                    handleSearchText={(value) => {
                      const trimmed = (value ?? "").trim();
                      setFilter(trimmed);
                      setCurrentPage(1);
                    }}
                    setSearchTextProp={(value) => {
                      const trimmed = (value ?? "").trim();
                      setFilter(trimmed);
                      // If cleared, reset search results
                      if (trimmed === "") {
                        setCurrentPage(1);
                      }
                    }}
                  />
                </div>
                <div
                  data-testid="addplannerTaskBtn"
                  id="AddTask"
                  className={[
                    classes.iabot_addTemplate,
                    classes.iabot_addjob_btn,
                  ].join(" ")}
                  style={{ width: "100px" }}
                  onClick={() => setModelOpen(true)}
                >
                  <img
                    style={{
                      width: "16px",
                      height: "16px",
                    }}
                    src={IconStart}
                    alt="Add icon"
                  />
                  {UI_TEXTS.ADD_TEXT.ADD_JOB}
                </div>
              </div>

              {/* Controls */}
              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                <div>
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
                {/* Status Filters - Fixed like before */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {statusFilters.map((status) => (
                    <Chip
                      className="cmdb-filter-chip"
                      key={status}
                      label={status}
                      variant={statusFilter === status ? "filled" : "outlined"}
                      color={statusFilter === status ? "primary" : "default"}
                      onClick={() => setStatusFilter(status)}
                      clickable
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Jobs Table - Always show datagrid, even if empty */}
            <div style={{ flex: 1, overflow: "auto" }}>
              {loading ? (
                <div>
                  {/* Skeleton Loading */}
                  <div
                    style={{
                      padding: "16px",
                      background: "#f5f5f5",
                      borderRadius: "8px",
                    }}
                  >
                    {/* Skeleton Rows */}
                    {[...Array(4)].map((_, rowIndex) => (
                      <div
                        key={rowIndex}
                        style={{
                          display: "flex",
                          gap: "16px",
                          marginBottom: "16px",
                        }}
                      >
                        {[...Array(7)].map((_, colIndex) => (
                          <div
                            key={colIndex}
                            style={{
                              height: "60px",
                              background: "#e0e0e0",
                              borderRadius: "4px",
                              flex: 1,
                              animation: "pulse 1.5s ease-in-out infinite",
                              animationDelay: `${rowIndex * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                  <style>
                    {`
                      @keyframes pulse {
                        0% { opacity: 1; }
                        50% { opacity: 0.5; }
                        100% { opacity: 1; }
                      }
                    `}
                  </style>
                </div>
              ) : (
                <CustomDataGrid
                  // rows={filteredData.map((item) => ({
                  //   ...item,
                  //   id: item._id || item.id,
                  // }))}
                  rows={filteredData.map((item) => {
                    // Pre-compute values used in renderCell for sorting
                    const jobNameValue =
                      item.jobName || item.tableName || "Unnamed Job";
                    const templateNameValue =
                      item.defaultTemplate?.templateName || "No template";
                    const sourceTableValue = item.tableName || "-";
                    // const scheduleValue = item.schedule
                    //   ? convertCronToHumanReadable(item.schedule)
                    //   : "-";
                    const lastRunValue = item.lastRun
                      ? new Date(item.lastRun).getTime()
                      : null; // Use timestamp for accurate sort
                    const statusValue = getJobStatus(item); // Use actual status string

                    return {
                      ...item,
                      id: item._id || item.id,
                      jobName: jobNameValue,
                      templateName: templateNameValue,
                      sourceTable: sourceTableValue,
                      // schedule: scheduleValue,
                      lastRun: lastRunValue,
                      status: statusValue,
                    };
                  })}
                  columns={columns}
                  rowCount={filteredData.length}
                  paginationMode="client"
                  sortingMode="client"
                  rowCursorPointer={false}
                  hideFooter={true}
                  tableHeight="58vh"
                  pageLoader={loading}
                  pageType="jobs"
                  emptyMessage={`No ${
                    statusFilter !== "All" ? statusFilter.toLowerCase() : ""
                  } jobs found`}
                />
              )}
            </div>

            {/* Pagination and Results Count */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "20px",
                paddingTop: "16px",
                borderTop: "1px solid #e1e5e9",
              }}
            >
              <CustomPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalPages={totalPages}
                setTotalPages={setTotalPages}
                pageInput={pageInput}
                setPageInput={setPageInput}
              />
            </div>
          </div>
        </div>
      </div>
      {openModal && (
        <CmbdViewLogs
          open={openModal}
          onClose={() => setOpenModal(false)}
          columns={logs_columns}
          row={scheduleLogs}
          loading={loading}
          totalPages={logsItemTotalPages}
          table={table}
          getScheduleLogsData={getScheduleLogsData}
        />
      )}
      <AddJobModal
        open={modelOpen}
        onClose={() => {
          setModelOpen(false);
        }}
        jobForm={jobForm}
        setJobForm={setJobForm}
        onSave={handleSave}
        cmdbConfiguredOptions={cmdbConfiguredOptions}
      />
      <ConfirmationDialog
        open={modalShow}
        onClose={() => setModalShow(false)}
        onConfirm={() => handleDelete(editData)}
        title={UI_TEXTS.HEADER_TEXT.DELETE_JOB}
        message={UI_TEXTS.MESSAGES.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_JOB}
        loading={deleteLoading}
      />
    </div>
  );
}

export default CMDBJobsList;
