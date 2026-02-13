import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { Refresh } from "@mui/icons-material";
import { CustomDataGrid } from "../../components/common/CustomDatagrid/CustomDatagrid";
import CustomPagination from "../../components/common/CustomPagination/CustomPagination";
import SubHeader from "../../components/planning/SubHeader.component";
import {
  exportReportData,
  fetchGlobalReportData,
  fetchReportData,
  getReportDetailsById,
  publishGlobalReports,
  publishGlobalReportsAsSystem,
} from "../../services/configurations/configService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import Setting from "../../assets/images/SettingIcon.png";
import {
  Stack,
  CircularProgress,
  Box,
  IconButton,
  FormControlLabel,
  Switch,
  Menu,
  MenuItem,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { format, parseISO } from "date-fns";
import { toast } from "react-toastify";
import { TbArrowBigLeftFilled } from "react-icons/tb";
import "../../components/planning/css/tasks.css";
import "../report/css/report.css";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ExcelUtils from "./ReportCard/ExcelUtils";
import { Tooltip } from "@mui/material";
import { RecordDetailTooltip } from "../../components/CustomTooltip/CustomTooltip";
import {
  TOAST_MESSAGES,
  UI_TEXTS,
} from "../../components/common/Constants/label-contants";
import RefreshModal from "./RefreshModal/RefreshModal";
import { getTargets } from "../../services/jobs/JobsService";
import moment from "moment";
import {
  getAppConfig,
  getConfig,
  updateConfig,
} from "../../services/jobs/JobsService";
import {
  hasInsightsPermission,
  PERMISSION_LIST,
} from "../../utils/permissionUtil";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { formattedDate } from "../../utils/CommonUtils";
import { isLoadingInHost } from "../../utils/DetectHost";

function ReportDetails() {
  const { id, reportType } = useParams();
  const dispatch = useDispatch();
  const config = useSelector((state) => state?.jobs?.configSetting);
  const [reportData, setReportData] = useState([]);
  const [dynamicColumns, setDynamicColumns] = useState([]);
  const [reportName, setReportName] = useState("");
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPagesCount = Math.ceil(reportData?.length / itemsPerPage);
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Publish");
  const [isGlobalReport, setIsGlobalReport] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportJobs, setReportJobs] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const modalDataRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [viewColumnHeaderCopy, setViewColumnHeaderCopy] = useState(false);
  const [copiedJob, setCopiedJob] = useState(false);
  const [viewHighlightedColumn, setViewHighlightedColumn] = useState(false);
  const [columnData, setColumnData] = useState([]);
  const [threshold, setThreshold] = useState(1);
  const permissionState = useSelector((state) => state.jobs?.permissions);
  const [publishEl, setPublishEl] = useState(null);
  const open = Boolean(publishEl);
  const [visibleColumnFields, setVisibleColumnFields] = useState([]);

  const exportPermForReports = hasInsightsPermission(
    permissionState,
    "Reports",
    PERMISSION_LIST.REPORTS_EXPORT
  );

  useEffect(() => {
    fetchReportDetails();
    dispatch(getTargets());
  }, [id, currentPage, itemsPerPage]);
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        await dispatch(getConfig());
      } catch (error) {
        toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_LOAD_CONFIGURATION);
      }
    };

    fetchConfig();
  }, [dispatch]);
  useEffect(() => {
    // console.log("threshold::::", config?.threshold);
    if (config?.threshold) {
      setThreshold(config?.threshold);
    }
  }, [config]);

  // Initialize visible columns when dynamicColumns change
  useEffect(() => {
    if (dynamicColumns.length > 0) {
      const initialVisibleFields = dynamicColumns.map((col) => col.field);
      setVisibleColumnFields(initialVisibleFields);
    }
  }, [dynamicColumns]);

  const formatCellValue = (value, legacyData, timestamp, record) => {
    if (typeof value === "string") {
      // Handle both escaped \n and actual newlines
      let textWithLineBreaks = value.replace(/\\n/g, "\n");
      const lines = textWithLineBreaks.split("\n");
      return (
        <Tooltip title={lines} arrow placement="bottom">
          <Box
            sx={{
              whiteSpace: "pre-line",
              lineHeight: "1.5",
              maxHeight: "120px",
              padding: "4px 0",
              width: "100%",
              fontSize: "13.5px",
              fontWeight: "600",
              fontFamily: "Manrope",
              color:
                legacyData &&
                viewHighlightedColumn &&
                record?.categoryName?.toLowerCase() !== "cmdb"
                  ? "#d51900"
                  : "#334155",
            }}
          >
            {textWithLineBreaks}
            {legacyData &&
              timestamp &&
              viewHighlightedColumn &&
              record?.categoryName?.toLowerCase() !== "cmdb" && (
                // <div style={{ color: "#344054" }}>
                //   Date: {moment(timestamp).format("M/D/YYYY, h:mm:ss A")}
                // </div>
                <div className="date-container">
                  <span className="date-label">Date:</span>
                  <span className="date-value">
                    {/* {moment(timestamp).format("M/D/YYYY, h:mm:ss A")} */}
                    {formattedDate(timestamp)}
                  </span>
                </div>
              )}
          </Box>
        </Tooltip>
      );
    }
    return value || "--";
  };

  //   const formatCellValue = (value) => {
  //   if (typeof value === 'string') {
  //     // Handle both escaped \n and actual newlines
  //     const textWithLineBreaks = value.replace(/\\n/g, '\n');

  //     // If text has multiple lines, show it with line breaks
  //     if (textWithLineBreaks.includes('\n')) {
  //       return (
  //         <Tooltip title={textWithLineBreaks} arrow placement="top-start">
  //           <Box
  //             sx={{
  //               whiteSpace: 'pre-line',
  //               lineHeight: '1.4',
  //               padding: '4px 0',
  //               width: '100%',
  //               maxHeight: '120px',
  //               overflow: 'hidden',
  //               display: '-webkit-box',
  //               WebkitLineClamp: 3,
  //               WebkitBoxOrient: 'vertical',
  //             }}
  //           >
  //             {textWithLineBreaks}
  //           </Box>
  //         </Tooltip>
  //       );
  //     }

  //     // For single line text, just return it normally
  //     return textWithLineBreaks || "--";
  //   }
  //   return value || "--";
  // };
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    try {
      return format(parseISO(dateString), "do MMM yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleCopy = (e, jobName) => {
    e.stopPropagation();
    const COPY_TOAST_ID = "copy-toast";
    toast.dismiss(COPY_TOAST_ID);
    toast.success("Text copied successfully.", {
      toastId: COPY_TOAST_ID,
    });

    if (!jobName || !reportData?.length) return;

    // const columnValues = reportData
    //   .map(row => row[columnName])
    //   .join("\n");

    navigator.clipboard
      .writeText(jobName)
      .then(() => {
        // Only one column copied at a time
        setCopiedJob(jobName);

        setTimeout(() => {
          setCopiedJob(null);
          toast.dismiss(COPY_TOAST_ID);
        }, 2000); // reset after 2s
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };
  function markLegacy(data, threshold = 1) {
    if (!Array.isArray(data)) return data;

    // Step 1: collect all leg names dynamically (like leg1, leg2, etc.)
    const legNames = new Set();
    data.forEach((t) => {
      Object.keys(t).forEach((k) => {
        if (k.startsWith("leg")) legNames.add(k);
      });
    });

    // Step 2: for each leg, find the runId with the most recent timestamp (global reference)
    const latestRunIdByLeg = {};

    legNames.forEach((leg) => {
      let latest = null;
      let latestRunId = null;

      data.forEach((t) => {
        const legData = t[leg];
        if (legData && legData.timestamp) {
          const ts = new Date(legData.timestamp).getTime();
          if (!latest || ts > latest) {
            latest = ts;
            latestRunId = legData.runId;
          }
        }
      });

      latestRunIdByLeg[leg] = latestRunId;
    });

    // Step 3: loop again and mark legacy based on threshold rules
    const updatedData = data.map((t) => {
      const updatedT = { ...t };

      Object.keys(t).forEach((k) => {
        if (!k.startsWith("leg")) return;
        const legData = { ...t[k] };
        const recentRecords = Array.isArray(legData.recentRecords)
          ? legData.recentRecords
          : [];

        const mostRecentRunId = latestRunIdByLeg[k];
        let compareRunIds = [];

        // Include the leg's own runId
        compareRunIds.push(legData.runId);

        // Include up to (threshold - 1) recentRecords runIds
        for (let i = 0; i < threshold - 1 && i < recentRecords.length; i++) {
          compareRunIds.push(recentRecords[i].runId);
        }

        // Now compare all those runIds to the most recent one
        legData.legacy = !compareRunIds.includes(mostRecentRunId);

        updatedT[k] = legData;
      });

      return updatedT;
    });

    return updatedData;
  }

  const fetchReportDetails = async () => {
    setLoading(true);
    try {
      const response = await getReportDetailsById({
        reportId: id,
        pageNo: currentPage,
        pageSize: itemsPerPage,
      });

      if (response?.data) {
        // Transform the data before setting state
        const formattedRecords = response.data.records.map((record) => {
          const formattedRecord = {
            args: record.args || "--",
            categoryName: record.categoryName || "--",
            command: record.command || "--",
            description: record.description || "--",
            exitStatus:
              record.exitStatus !== undefined ? record.exitStatus : "--",
            hostname: record.hostname || "--",
            id: record.id || "--",
            jobDescription: record.jobDescription || "--",
            jobTags: record.jobTags?.length ? record.jobTags.join(", ") : "--",
            output: record.output || "--",
            pid: record.pid !== undefined ? record.pid : "--",
            runAs: record.runAs || "--",
            sequenceId:
              record.sequenceId !== undefined ? record.sequenceId : "--",
            stderr: record.stderr || "--",
            stdout: record.stdout || "--",
            recentRecords: [],
            tags:
              record.tags &&
              Array.isArray(record.tags) &&
              record.tags.length > 0
                ? record.tags.join(", ")
                : "--",
            timestamp: record.timestamp
              ? format(parseISO(record.timestamp), "dd MMM yyyy | HH:mm:ss")
              : "--",
          };

          // Add dynamic columns from API response
          if (response.data.columns) {
            response.data.columns.forEach((col) => {
              if (col.column && record[col.column]?.latest !== undefined) {
                formattedRecord[col.column] = record[col.column]?.latest;
                formattedRecord.starttime =
                  record[col.column]?.latest?.startTime ?? "";
              }
              if (
                col.column &&
                record[col.column]?.recentRecords !== undefined
              ) {
                formattedRecord[col.column].recentRecords =
                  record[col.column]?.recentRecords;
              }
            });
          }

          // Add hostname field for display
          formattedRecord.__hostname = record.__hostname || "--";

          return formattedRecord;
        });

        setColumnData(response?.data?.columns);

        setReportName(
          response.data.reportDetails?.reportName || "Unknown Report"
        );
        // const formattedRecordsWithLegacy = markLegacy(
        //   formattedRecords,
        //   threshold
        // );
        setReportData(formattedRecords);
        setSelectedFilters(response.data.displayColumns);
        setIsGlobalReport(response.data.reportDetails?.type === "GLOBAL");
        setTotalRecords(response.data.pagination?.totalRecords || 0);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setFromDate(response.data.reportDetails?.fromDate || "");
        setToDate(response.data.reportDetails?.toDate || "");
        setReportJobs(response?.data?.reportDetails?.jobs);
        const data = {
          columnData: response?.data?.columns?.map((el, idx) => {
            return {
              ...el,
              id: idx + 1,
              value: el?.column,
              tooltip: el?.job,
              checked: true,
            };
          }),
          serverData: response?.data?.records?.map((el, idx) => {
            return { id: idx + 1, value: el?.__hostname, checked: true };
          }),
          records: response?.data?.records,
          reportDetails: response?.data?.reportDetails,
          selectedOption: "allData_refresh",
        };
        setModalData(data);
      }
    } catch (error) {
      console.error("Error fetching report details:", error);
    } finally {
      setLoading(false);
    }
  };

  const isBeforeLast15Days = (dateString) => {
    if (!dateString) return false;

    const date = moment(dateString);
    const fifteenDaysAgo = moment().subtract(15, "days");

    return date.isBefore(fifteenDaysAgo);
  };

  const mappedColumns = columnData?.map((item) => {
    return {
      field: item?.column,
      headerName: item?.column,
      flex: 2,
      minWidth: 200,
      // disable default MUI DataGrid tooltip
      disableColumnMenu: true,
      sortable: true,
      description: undefined,

      renderCell: (params) => {
        const record = params.value; // full object from backend
        if (!record) return "-";
        const tooltipFields = [
          "jobDescription",
          "categoryName",
          "runAs",
          "timestamp",
          "frequency",
          "exitStatus",
          "scheduleType",
          "runId",
        ];

        return (
          <RecordDetailTooltip
            record={record}
            fields={tooltipFields}
            title={record.jobDescription || record.description}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                height: "100%",
                cursor: "pointer",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {formatCellValue(
                record.output,
                record.legacy,
                record?.timestamp,
                record
              )}
            </Box>
          </RecordDetailTooltip>
        );
      },

      cellClassName: "multiline-cell",
      renderHeader: () => (
        <div>
          <Tooltip title={item?.job} arrow>
            <div
              style={{ cursor: "pointer" }}
              // onClick={() => handleColumnRefresh(item?.column)}
            >
              {item?.column}
            </div>
          </Tooltip>
          {viewColumnHeaderCopy && (
            // <section>
            //   (<span style={{ textTransform: "none" }}>{item?.job}</span>)
            //   <Tooltip title={copiedJob === item?.column ? "Copied!" : "Copy"}>
            //     <IconButton
            //       size="small"
            //       onClick={(e) => handleCopy(e, item?.job)}
            //     >
            //       <ContentCopyIcon fontSize="small" />
            //     </IconButton>
            //   </Tooltip>
            // </section>
            <section className="job-display-section">
              <span className="job-text">({item?.job})</span>
              <Tooltip title={copiedJob === item?.column ? "Copied!" : "Copy"}>
                <IconButton
                  size="small"
                  onClick={(e) => handleCopy(e, item?.job)}
                  className="copy-icon-btn"
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </section>
          )}
        </div>
      ),
    };
  });

  // Add server column with formatting
  const serverColumn = {
    field: "__hostname",
    headerName: "Server",
    flex: 2,
    minWidth: 200,
    sortable: true,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {formatCellValue(params.value)}
      </Box>
    ),

    cellClassName: "multiline-cell",
  };

  const timestampColumn = {
    field: "starttime",
    headerName: "Timestamp (UTC)",
    flex: 2,
    minWidth: 200,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {formattedDateUTC(params.value)}
      </Box>
    ),

    cellClassName: "multiline-cell",
  };

  const handleColumnRefresh = (colName) => {
    const updatedColumnData = modalDataRef.current?.columnData?.map((col) => {
      if (col.column === colName) {
        col.checked = true;
        return { ...col, checked: true };
      } else {
        return { ...col, checked: false };
      }
    });
    const updatedServerData = modalDataRef.current?.serverData?.map(
      (server) => {
        return { ...server, checked: true };
      }
    );
    setModalData({
      ...modalDataRef.current,
      columnData: updatedColumnData,
      serverData: updatedServerData,
      selectedOption: "column_level_refresh",
    });
    setShowModal(true);
  };

  const publishReports = async () => {
    setButtonText("Publishing...");
    handlePublishClose();
    try {
      const response = await dispatch(publishGlobalReports(id));
      if (response?.payload?.statusCode === 200 && response?.payload?.message) {
        toast.success(response?.payload?.message);
      } else {
        toast.error(
          `Error: ${
            response?.payload?.message || "Failed to submit approval request"
          }`
        );
      }
      setButtonText("Published To Global");
      return response;
    } catch (error) {
      toast.error(
        `Error: ${error.error || TOAST_MESSAGES.OTHERS.SOMETHING_WRONG}`
      );
    } finally {
      setButtonText("Publish");
    }
  };

  const publishReportsAsSystem = async () => {
    setButtonText("Publishing...");
    handlePublishClose();
    try {
      setLoading(true);
      const response = await dispatch(publishGlobalReportsAsSystem(id));
      if (response?.payload?.statusCode === 200) {
        toast.success(response?.payload.message);
        localStorage.setItem("report_id", id.toString());
      }
      setButtonText("Published As System");
      await dispatch(fetchGlobalReportData({ type: "GLOBAL" }));
      await dispatch(fetchReportData());
      return response;
    } catch (error) {
      toast.error(`Error: ${error.error || "Something went wrong!"}`);
    } finally {
      setLoading(false);
      setButtonText("Publish");
    }
  };

  const handlePublishClose = () => {
    setPublishEl(null);
  };

  const handleClick = (event) => {
    setPublishEl(event.currentTarget);
  };

  const columns = [
    { field: "hostname", headerName: "Server", flex: 2, minWidth: 200 },
    { field: "output", headerName: "Output", flex: 2, minWidth: 200 },
    { field: "description", headerName: "Field", flex: 2, minWidth: 200 },
    { field: "categoryName", headerName: "Category", flex: 2, minWidth: 200 },
    { field: "tags", headerName: "Tags", flex: 2, minWidth: 250 },
    {
      field: "jobDescription",
      headerName: "Job Description",
      flex: 2,
      minWidth: 300,
    },
    { field: "runAs", headerName: "Run As", flex: 2, minWidth: 200 },
    { field: "timestamp", headerName: "Created Date", flex: 2, minWidth: 200 },
    { field: "stdout", headerName: "Output", flex: 2, minWidth: 200 },
    { field: "command", headerName: "Command", flex: 2, minWidth: 200 },
    { field: "pid", headerName: "PID", flex: 2, minWidth: 200 },
    { field: "exitStatus", headerName: "Exit Status", flex: 2, minWidth: 200 },

    { field: "args", headerName: "Args", flex: 2, minWidth: 200 },
    { field: "sequenceId", headerName: "Sequence ID", flex: 2, minWidth: 200 },
    { field: "stderr", headerName: "StdErr", flex: 2, minWidth: 200 },
  ];

  // Don't remove this commented code
  // const formatExportData = (data) => {
  //   return data.map((row) => {
  //     const formattedRow = {};

  //     selectedFilters.forEach((col) => {
  //       let key = typeof col === "string" ? col : col.column;
  //       if (key === "Server") {
  //         formattedRow["Server"] = row.__hostname || "--";
  //       } else {
  //         formattedRow[key] = (row[key] && row[key].output) || "--";
  //       }
  //     });

  //     return formattedRow;
  //   });
  // };

  // const formatExportHeaders = (columns) => {
  //   return columns.map((col) => {
  //     if (typeof col === "string") {
  //       return { label: col, key: col };
  //     }
  //     return { label: col.column, key: col.column };
  //   });
  // };

  const formatExportData = (data) => {
    return data.map((row) => {
      const formattedRow = {};

      visibleColumnFields.forEach((field) => {
        if (field === "__hostname") {
          formattedRow["Server"] = row.__hostname || "--";
        } else if (field === "hostname") {
          formattedRow["Hostname"] = row.hostname || "--";
        } else {
          const cellValue = row[field];
          if (cellValue?.latest?.output) {
            formattedRow[field] =
              (cellValue && cellValue.latest.output) || "--";
          } else {
            formattedRow[field] = (cellValue && cellValue.output) || "--";
          }
        }
        if (field !== "__hostname" && field !== "hostname") {
          const cellValue = row[field];
          if (
            cellValue?.legacy &&
            viewHighlightedColumn &&
            cellValue?.categoryName?.toLowerCase() !== "cmdb"
          ) {
            formattedRow[field] += `\n${formattedDate(cellValue?.timestamp)}`;
          }
        }
      });
      formattedRow["Timestamp (UTC)"] = formattedDateUTC(row.starttime);
      return formattedRow;
    });
  };

  // const formatExportHeaders = () => {
  //   return visibleColumnFields.map((field) => {
  //     if (field === "__hostname") {
  //       return { label: "Server", key: "Server" };
  //     } else if (field === "hostname") {
  //       return { label: "Hostname", key: "hostname" }; // Different header for the other hostname column
  //     }
  //     const colConfig = columnData.find((col) => col.column === field);
  //     console.log('ddebug 3',colConfig)
  //     return {
  //       label: colConfig?.column || field,
  //       key: colConfig?.column || field,
  //     };
  //   });
  // };

  const formatExportHeaders = () => {
    const labelCount = {};

    return visibleColumnFields.map((field) => {
      if (field === "__hostname") {
        return { label: "Server", key: "Server" };
      } else if (field === "hostname") {
        return { label: "Hostname", key: "hostname" };
      } else if (field === "starttime") {
        return { label: "Timestamp (UTC)", key: "Timestamp (UTC)" };
      }

      // Find column config
      const colConfig = columnData.find((col) => col.column === field);

      const baseLabel = colConfig?.column || field;

      labelCount[baseLabel] = (labelCount[baseLabel] || 0) + 1;

      const uniqueLabel =
        labelCount[baseLabel] > 1
          ? `${baseLabel} (${labelCount[baseLabel]})`
          : baseLabel;

      return {
        label: uniqueLabel,
        key: field,
      };
    });
  };
  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleExportAllRecords = async () => {
    try {
      setIsDownloading(true);
      if (!id || typeof id !== "string") {
        toast.error("Invalid report ID");
        return;
      }
      const result = await dispatch(exportReportData(id)).unwrap();
      if (!result?.data?.records || result.data.records.length === 0) {
        toast.error(TOAST_MESSAGES.OTHERS.DATA_EXPORTED_ERROR);
        return;
      }

      if (visibleColumnFields.length === 0) {
        toast.error("No columns selected for export");
        return;
      }
      const exportableData = formatExportData(result.data.records);
      const exportableHeaders = formatExportHeaders();

      ExcelUtils.exportToExcel(
        exportableHeaders,
        exportableData,
        reportName || "Report"
      );
      toast.success(TOAST_MESSAGES.OTHERS.DATA_EXPORTED_SUCCESSFULLY);
    } catch (error) {
      console.error(" Export failed:", error);
      if (error?.response?.message) {
        toast.error(`Export failed: ${error.response.message}`);
      } else {
        toast.error(`Export failed: ${error.message || "Unknown error"}`);
      }
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    modalDataRef.current = modalData;
  }, [modalData]);

  useEffect(() => {
    setDynamicColumns([serverColumn, ...mappedColumns, timestampColumn]);
  }, [columnData, viewColumnHeaderCopy, viewHighlightedColumn]);

  const formattedDateUTC = (dateString) => {
    if (!dateString) {
      return "—";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "-";
    }

    const dateOptions = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      timeZone: "UTC",
    };

    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    };

    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

    return `${formattedDate} | ${formattedTime}`;
  };

  return (
    <Box style={{ overflow: "hidden" }}>
      <SubHeader />

      <Box className={isLoadingInHost ? 'platform-report-details-wrapper' : ''} sx={{ height: "calc(100vh - 120px)", overflow: "auto" }}>
        <div className="iabot_addJob_action">
          <div className="report_header">
            <div className="report_title">
              {" "}
              {/* <Link to="/report">
                <span
                  style={{
                    color: "#d51900",
                    fontSize: "22px",
                    cursor: "pointer",
                  }}
                >
                  <TbArrowBigLeftFilled />
                </span>
              </Link> */}
              {/* <Link to="/report?tab=globalReports"> */}
              <Link
                to={
                  reportType === "my-reports"
                    ? "/report"
                    : "/report?tab=globalReports"
                }
              >
                <span
                  style={{
                    color: "#d51900",
                    fontSize: "22px",
                    cursor: "pointer",
                  }}
                >
                  <TbArrowBigLeftFilled />
                </span>
              </Link>
              <p style={{ margin: "0", paddingLeft: "4px" }}>
                <span className="report_highlight">Report</span> {">"}{" "}
                {reportName}
                <span className="reports_count" style={{ display: "inline" }}>
                  {totalRecords}
                </span>
              </p>
            </div>
          </div>

          <div className="report_controls" style={{ padding: "0 16px" }}>
            {/* <section className="report_name">{"Schedules"}</section> */}
            <section className="report_name">Report Details:</section>
            <div className="report_actions">
              {/** Don't remove the code will be enabled in future  */}
              {/* <div className="iabot_addTemplate" size="sm">
                <Link to="/settings">
                  <img style={{ width: "40px", height: "40px" }} src={Setting} alt="Settings" />
                </Link>
              </div> */}
              {/* <div
                style={{
                  border: "1px solid #EEEEEE",
                  color: "#2961F4",
                  width: "103px",
                  height: "40px",
                  borderRadius: "8px",
                  padding: "6px 16px",
                }}
              >
                Edit Report
              </div> */}

              <Tooltip title={"Legacy Data"}>
                <FormControlLabel
                  className="reports_data_toggle"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "14px !important",
                      fontWeight: 500,
                      color: "#64748b",
                      fontFamily: "Manrope",
                    },
                  }}
                  label={
                    viewHighlightedColumn
                      ? "Show Legacy Data"
                      : "Show Legacy Data"
                  }
                  control={
                    <Switch
                      checked={viewHighlightedColumn}
                      onChange={(e) =>
                        setViewHighlightedColumn(e.target.checked)
                      }
                      color="primary"
                    />
                  }
                />
              </Tooltip>

              <Tooltip title={"Display schedule name (click to copy)"}>
                <FormControlLabel
                  className="reports_data_toggle"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: "14px !important",
                      fontWeight: 500,
                      color: "#64748b",
                      fontFamily: "Manrope",
                    },
                  }}
                  label={
                    viewColumnHeaderCopy
                      ? "Show Schedule Info"
                      : "Show Schedule Info"
                  }
                  control={
                    <Switch
                      checked={viewColumnHeaderCopy}
                      onChange={(e) =>
                        setViewColumnHeaderCopy(e.target.checked)
                      }
                      color="primary"
                    />
                  }
                />
              </Tooltip>

              {/* <Tooltip title="Refresh Data">
                <IconButton
                  style={{
                    border: "1px solid #e4e4e4",
                    width: "40px",
                    height: "40px",
                    marginRight: "10px",
                  }}
                  // onClick={handleRefreshButton}
                  onClick={handleModalOpen}
                  size="medium"
                  color="#344054"
                >
                  <Refresh />
                </IconButton>
              </Tooltip> */}

              {exportPermForReports && (
                <Tooltip title="Export Data">
                  <button
                    onClick={handleExportAllRecords}
                    disabled={isDownloading}
                    // className="export_button"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      backgroundColor: "#2961F4",
                      color: "white",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    {isDownloading ? "Exporting..." : "Export Data"}
                    <CloudDownloadIcon />
                  </button>
                </Tooltip>
              )}

              {!isGlobalReport && (
                <>
                  <button className="publish_global" onClick={handleClick}>
                    {buttonText}
                  </button>
                  <Menu
                    anchorEl={publishEl}
                    open={open}
                    onClose={handlePublishClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  >
                    <MenuItem onClick={() => publishReports()}>
                      Publish
                    </MenuItem>
                    {/* {hasPublishAsSystem && ( */}
                    <MenuItem
                      onClick={() => {
                        publishReportsAsSystem();
                      }}
                    >
                      Publish as System
                    </MenuItem>
                    {/* )} */}
                  </Menu>
                </>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loader-container">
            <CircularProgress />
          </div>
        ) : (
          <>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <span className="selected-label">Selected Schedules:</span>
              <section style={{ marginLeft: "auto", marginRight: "16px" }}>
                <span className="reports_details">
                  {fromDate && (
                    <>
                      From:{" "}
                      <span className="reports_date">
                        {formattedDate(fromDate)}
                      </span>
                    </>
                  )}
                  {toDate && (
                    <>
                      {fromDate && "   "}
                      To:{" "}
                      <span className="reports_date">
                        {formattedDate(toDate)}
                      </span>
                    </>
                  )}
                </span>
              </section>
            </div>

            <div className="iabot_filter_row">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* <section className="iabot_jobsCount">
                <span> Selected Schedules:-</span>
                <section
                  style={{
                    maxWidth: "500px",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    backgroundColor: "#F4F6FF",
                    color: "#2961f4",
                    padding: "7px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: 600,
                    fontFamily: "Manrope",
                  }}
                >
                  {reportJobs?.join(",    ")}
                </section>
              </section> */}
                <section className="selected-schedules-section">
                  <div className="schedules-tiles-container">
                    {reportJobs && reportJobs.length > 0 ? (
                      reportJobs.map((job, index) => (
                        <div key={index} className="schedule-tile">
                          <span className="tile-text">{job}</span>
                        </div>
                      ))
                    ) : (
                      <div className="no-selection-message">
                        No schedules selected
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
            <div className="modal-content grid_container">
              <CustomDataGrid
                rows={reportData}
                columns={dynamicColumns}
                hideFooter={true}
                getRowId={(row) => row.pid || row.id}
                disableColumnSorting={true}
                tableHeight="60vh"
                // tableHeight="45vh"
                getRowHeight={() => "auto"}
                onVisibleColumnsChange={setVisibleColumnFields} // ADD THIS PROP
                sx={{
                  "& .multiline-cell": {
                    alignItems: "center",
                    padding: "8px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    overflow: "hidden !important",
                  },
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #e0e0e0",
                  },
                }}
                disableVirtualization={true}
              />
            </div>
          </>
        )}
      </Box>
      <Box
        sx={{
          padding: "0 16px",
          borderTop: "1px solid #e0e0e0",
          bottom: 0,
          zIndex: 100,
          backgroundColor: "#FFFFFF",
        }}
      >
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalPages={totalPages}
        />
      </Box>
      <RefreshModal
        reportName={reportName}
        handleClose={handleModalClose}
        showModal={showModal}
        setShowModal={setShowModal}
        modalData={modalData}
        setModalData={setModalData}
      />
    </Box>
  );
}

export default ReportDetails;
