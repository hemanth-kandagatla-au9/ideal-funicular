import "./css/tasks.css";
import { useState } from "react";
import { toast } from "react-toastify";
import { FaPlay } from "react-icons/fa";
import NoDataFound from "../ui/no-data-found/noDataFound.Component";
import Tooltip from "@mui/material/Tooltip";
import LoadingData from "../ui/loading-data/loadingData.Component";
import { SideDrawerAddJob } from "./SideDrawerAddJob.component";
import { HostsModal } from "./HostsModal";
import { CustomDataGrid } from "../common/CustomDatagrid/CustomDatagrid";
import { TOAST_MESSAGES } from "../common/Constants/label-contants";
import ViewLogs from "./ViewLogs";
import HistoryIcon from "@mui/icons-material/History";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAgentJob,
  executeAdhocJob,
  getJobs,
  handleJobAction,
} from "../../services/jobs/JobsService";
import { CiViewList } from "react-icons/ci";
import ConfirmModal from "./ConfirmModalJob";
import { IconButton, Box, CircularProgress, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Eye } from "iconsax-react";
import { FaRegCopy } from "react-icons/fa";
import { minWidth, width } from "@mui/system";
import { AddJobComponent } from "./AddJob.component";
import { CiPause1 } from "react-icons/ci";
import { GrResume } from "react-icons/gr";
import { useParams, useHistory } from "react-router-dom";
import ConfirmationModal from "./ConfirmModalJob";
import ConfirmationDialog from "../../layouts/report/DeleteConfirmation";
import { formattedDate, getFormattedDate } from "../../utils/CommonUtils";
import {
  hasInsightsPermission,
  PERMISSION_LIST,
} from "../../utils/permissionUtil";

const CellWrapper = ({ children }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      height: "100%",
      width: "100%",
      minWidth: 0,
      padding: "8px 0",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
  >
    {children}
  </Box>
);

const TaskListCardsTable = ({
  elementRef,
  isLoading,
  jobs,
  onDeleteAction,
  totalJobs,
  isSidebarExpanded,
  showPlatformFilters,
  isAnyFilterSelected,
  onRefresh,
}) => {
  const permissionState = useSelector((state) => state.jobs?.permissions);
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [openRow, setOpenRow] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingRowId, setLoadingRowId] = useState([]);
  const dispatch = useDispatch();

  const handleRowClick = (id) => {
    setOpenRow((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenExecutionLogs = (job, event) => {
    event.stopPropagation();
    setSelectedJobId(job?.scheduleId || job?._id);
    setOpenModal(true);
  };
  const handleConfirmPlay = (job) => {
    setOpenConfirmModal(true);
    setSelectedJobId(job?.scheduleId || job?._id);
    setSelectedJob(job);
  };
  const handleExecuteJob = async (jobId) => {
    try {
      setLoading(true);
      setLoadingRowId((prev) => [...prev, jobId]);
      toast.success("Job Execution Started!", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      const response = await executeAdhocJob(jobId);
    } catch (error) {
      toast.success(error.error || "Job Execution Failed", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
      setLoadingRowId((prev) => prev.filter((item) => item !== jobId));
    }
  };

  // Check if logs column should be visible
  const shouldShowLogsColumn = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.SCHEDULE_VIEW_LOGS
  );

  const readPermForSchedule = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.SCHEDULE_READ
  );

  const alwaysVisibleColumns = [
    {
      field: "expand",
      flex: 1,
      headerName: "Expand",
      minWidth: 100,
      width: 100,
      cellClassName: "vertical-align-center",
      renderCell: (params) => (
        <CellWrapper>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(params.row.id);
            }}
          >
            {openRow[params.row.id] ? (
              <KeyboardArrowUp />
            ) : (
              <KeyboardArrowDown />
            )}
          </IconButton>
        </CellWrapper>
      ),
    },
    {
      field: "categoryName",
      headerName: "Category",
      minWidth: 200,
      cellClassName: "vertical-align-center",
      flex: 1.8,
      sortable: true,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const fullText = params?.row?.categoryName || "N|A";
        const truncated =
          fullText.length > 100 ? fullText.substring(0, 25) + "..." : fullText;
        return (
          <CellWrapper>
            <Tooltip
              title={
                <div
                  style={{
                    maxHeight: "150px",
                    overflow: "auto",
                  }}
                >
                  {fullText}
                </div>
              }
              arrow
              placement="top"
            >
              <span
                className="grid-columns"
                onClick={() => handleViewOpen(params.row)}
                style={{
                  cursor: "default",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                }}
              >
                {truncated}
              </span>
            </Tooltip>
          </CellWrapper>
        );
      },
    },
    {
      field: "jobDescription",
      headerName: "Description",
      minWidth: 200,
      cellClassName: "vertical-align-center",
      sortable: true,
      filterable: false,
      disableColumnMenu: true,
      flex: 2.2,
      renderCell: (params) => {
        const fullText = params.row.jobDescription || "N|A";
        const truncated =
          fullText.length > 100 ? fullText.substring(0, 25) + "..." : fullText;

        return (
          <CellWrapper>
            <Tooltip
              title={
                <div
                  style={{
                    maxHeight: "150px",
                    overflow: "auto",
                  }}
                >
                  {fullText}
                </div>
              }
              arrow
              placement="top"
            >
              <span
                className="grid-columns"
                onClick={() => handleViewOpen(params.row)}
                style={{
                  cursor: "default",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                }}
              >
                {truncated}
              </span>
            </Tooltip>
          </CellWrapper>
        );
      },
    },
    {
      field: "scheduleType",
      headerName: "Schedule Type",
      minWidth: 150,
      cellClassName: "vertical-align-center",
      sortable: true,
      filterable: false,
      disableColumnMenu: true,
      flex: 1.5,
      renderCell: (params) => (
        <CellWrapper>
          <span
            className="grid-columns"
            onClick={() => handleViewOpen(params.row)}
            style={{ cursor: "default" }}
          >
            {params.row.scheduleType ? params.row.scheduleType : "N|A"}
          </span>
        </CellWrapper>
      ),
    },
    {
      field: "Job Frequency",
      headerName: "frequency",
      minWidth: 200,
      cellClassName: "vertical-align-center",
      sortable: true,
      filterable: false,
      disableColumnMenu: true,
      flex: 2,
      renderCell: (params) => {
        let frequencyText = params.row.frequency ? params.row.frequency : "-";

        // If frequency is Minutes and cronExpression exists, extract the minute value
        if (params.row.frequency === "Minutes" && params.row.cronExpression) {
          const cronParts = params.row.cronExpression.split(" ");
          if (cronParts.length >= 1 && cronParts[0].startsWith("*/")) {
            const minuteValue = cronParts[0].substring(2);
            frequencyText = `${minuteValue} Minutes`;
          }
        }

        return (
          <CellWrapper>
            <span
              className="grid-columns"
              onClick={() => handleViewOpen(params.row)}
              style={{ cursor: "default" }}
            >
              {frequencyText}
            </span>
          </CellWrapper>
        );
      },
    },
    {
      field: "categoryType",
      headerName: "Job Type",
      minWidth: 100,
      cellClassName: "vertical-align-center",
      sortable: true,
      filterable: false,
      disableColumnMenu: true,
      flex: 1,
      renderCell: (params) => (
        <CellWrapper>
          <span
            className="grid-columns"
            onClick={() => handleViewOpen(params.row)}
            style={{ cursor: "default" }}
          >
            {params.row.categoryType ? params.row.categoryType : "N|A"}
          </span>
        </CellWrapper>
      ),
    },
    {
      field: "hosts",
      headerName: "Servers (Scheduled / Fail)",
      minWidth: 200,
      cellClassName: "vertical-align-center",
      // sortable: true,
      filterable: false,
      disableColumnMenu: true,
      flex: 2,
      renderCell: (params) => {
        const showFailure = params.row.nodes?.failure > 0;

        const width = showFailure ? "110px" : "60px";

        return (
          <CellWrapper>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "20px",
                border: "1px solid #DEDEDE",
                padding: "5px 10px",
                gap: "22px",
                maxWidth: "180px",
                height: "30px",
                marginTop: "12px",
                cursor: "pointer",
              }}
              onClick={() => handleNodePopup(params.row)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  minWidth: 0,
                  flex: 1,
                }}
              >
                <HistoryIcon
                  sx={{ width: "16px", color: "#102459", flexShrink: 0 }}
                />

                <Tooltip
                  title={`${params.row.nodes?.total ?? 0}`}
                  arrow
                  placement="top"
                >
                  <span
                    style={{
                      color: "#2c3e50",
                      fontWeight: "bold",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                    }}
                  >
                    {params.row.nodes?.total ?? 0}
                  </span>
                </Tooltip>
              </div>

              {showFailure && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: "#EE4B2B",
                      borderRadius: "50%",
                      display: "inline-block",
                    }}
                  />
                  <Tooltip
                    title={`${params.row.nodes?.failure}`}
                    arrow
                    placement="top"
                  >
                    <span style={{ color: "#2c3e50", fontWeight: "bold" }}>
                      {params.row.nodes?.failure}
                    </span>
                  </Tooltip>
                </div>
              )}
            </div>
          </CellWrapper>
        );
      },
    },

    // Logs column - conditionally added based on permission
    ...(shouldShowLogsColumn
      ? [
          {
            field: "logs",
            headerName: "Logs",
            cellClassName: "vertical-align-center",
            // sortable: true,
            filterable: false,
            disableColumnMenu: true,
            minWidth: 60,
            flex: 1,
            headerAlign: "center",
            renderCell: (params) => {
              return (
                <CellWrapper>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    {params?.row?.status == "PENDING_APPROVAL" ||
                    params?.row?.status == "REJECTED" ? (
                      <div></div>
                    ) : (
                      <div style={{ margin: "auto" }}>
                        <Tooltip title="Schedule Logs">
                          <button
                            onClick={(e) =>
                              handleOpenExecutionLogs(params.row, e)
                            }
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            <HiOutlineDocumentReport
                              color="#2961F4"
                              size={18}
                            />
                          </button>
                        </Tooltip>
                      </div>
                    )}
                  </Box>
                </CellWrapper>
              );
            },
          },
        ]
      : []),

    {
      field: "actions",
      headerName: "Actions",
      cellClassName: "vertical-align-center",
      // sortable: true,
      filterable: false,
      disableColumnMenu: true,
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <CellWrapper>
            <div style={{ width: "100%", padding: "0 4px " }}>
              {params?.row?.status == "REJECTED" ? (
                <div></div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  {/* its Temporary hidden dont remove the code  */}
                  {/* <Tooltip title={params.row.isOneTime ? "Cannot Delete" : "Delete"}>
            <button
              disabled={params.row.isOneTime}
              onClick={() => onDeleteAction(params.row)}
              style={{
                border: "none",
                background: "transparent",
                cursor: params.row.isOneTime ? "default" : "pointer",
                padding: 0,
              }}
            >

            <Trash size="16" color="#667085" />
            </button>
          </Tooltip> */}
                  {/* <Tooltip title={"View Logs"}>
            {" "}
            <ListIcon
              sx={{ color: "#667085", width: "20px", cursor: "pointer" }}
              onClick={() => handleViewLogsOpen(params.row)}
            />
          </Tooltip> */}

                  {readPermForSchedule && (
                    <Tooltip title={false ? "Cannot Edit" : "View Schedule"}>
                      <button
                        disabled={false}
                        onClick={() => {
                          history.push(
                            `/schedule/${params?.row?.scheduleId}?mode=edit`
                          );
                        }}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: false ? "default" : "pointer",
                          padding: 0,
                        }}
                      >
                        <Eye size="20" color="#2961F4" />
                      </button>
                    </Tooltip>
                  )}

                  {hasInsightsPermission(
                    permissionState,
                    "Schedule",
                    PERMISSION_LIST.SCHEDULE_CLONE
                  ) &&
                    params?.row?.status !== "PENDING_APPROVAL" && (
                      <Tooltip
                        title={false ? "Cannot Clone" : "Clone Schedule"}
                      >
                        <button
                          disabled={false}
                          onClick={() => {
                            history.push(
                              `/schedule/${params?.row?.scheduleId}?mode=copy`
                            );
                          }}
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: false ? "default" : "pointer",
                            padding: 0,
                            color: "#2961F4",
                            fontSize: "18px",
                          }}
                        >
                          <FaRegCopy />
                        </button>
                      </Tooltip>
                    )}

                  {hasInsightsPermission(
                    permissionState,
                    "Schedule",
                    PERMISSION_LIST.SCHEDULE_RESUME_PAUSE
                  ) &&
                    params?.row?.status !== "PENDING_APPROVAL" &&
                    params.row.scheduleType !== "AD_HOC" &&
                    params.row.frequency !== "Execute one time" && (
                      <Tooltip
                        title={
                          params.row.jobRunning
                            ? "Pause Schedule"
                            : "Resume Schedule"
                        }
                      >
                        <button
                          onClick={() => handlePauseResumeJob(params.row)}
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            padding: 0,
                          }}
                        >
                          {params.row.jobRunning ? (
                            <CiPause1 color="#2961F4" size={20} />
                          ) : (
                            <GrResume color="#2961F4" size={20} />
                          )}
                        </button>
                      </Tooltip>
                    )}

                  {hasInsightsPermission(
                    permissionState,
                    "Schedule",
                    PERMISSION_LIST.SCHEDULE_RESUME_PAUSE
                  ) &&
                    params?.row?.status !== "PENDING_APPROVAL" &&
                    params.row.scheduleType === "AD_HOC" && (
                      <Tooltip title="Execute AD_HOC Schedule">
                        <button
                          onClick={() => handleConfirmPlay(params.row)}
                          disabled={loadingRowId.includes(params.row.id)}
                          style={{
                            border: "none",
                            background: "transparent",
                            cursor: loadingRowId.includes(params.row.id)
                              ? "not-allowed"
                              : "pointer",
                            opacity: loadingRowId.includes(params.row.id)
                              ? 0.4
                              : 1,
                            padding: 0,
                          }}
                        >
                          <FaPlay color="#2961F4" />
                        </button>
                      </Tooltip>
                    )}
                </div>
              )}
            </div>
          </CellWrapper>
        );
      },
    },
  ];
  const expandableColumns = [
    {
      field: "_id",
      headerName: "Schedule ID",
      width: 60,
      renderCell: (params) => (
        <span
          onClick={() => handleViewOpen(params.row)}
          style={{ cursor: "default" }}
        >
          {params.row?.scheduleId || params.row?._id || "N|A"}
        </span>
      ),
    },
    {
      field: "createdBy",
      headerName: "Scheduled By",
      width: 60,
      renderCell: (params) => (
        <span
          onClick={() => handleViewOpen(params.row)}
          style={{ cursor: "default" }}
        >
          {params.row.createdBy ? params.row.createdBy : "N|A"}
        </span>
      ),
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 60,
      renderCell: (params) => {
        const tags = params.row.tags || [];
        if (tags.length === 0) {
          return <span>{"-"}</span>;
        }

        const colorSets = [
          [
            { background: "#FDF2FA", color: "#C11574" },
            { background: "#FFF6ED", color: "#C4320A" },
            { background: "#EFF8FF", color: "#175CD3" },
            { background: "#F9F5FF", color: "#6941C6" },
          ],
          [
            { background: "#EFF8FF", color: "#175CD3" },
            { background: "#F9F5FF", color: "#6941C6" },
            { background: "#FDF2FA", color: "#C11574" },
            { background: "#FFF6ED", color: "#C4320A" },
          ],
          [
            { background: "#F9F5FF", color: "#6941C6" },
            { background: "#FDF2FA", color: "#C11574" },
            { background: "#FFF6ED", color: "#C4320A" },
            { background: "#EFF8FF", color: "#175CD3" },
          ],
          [
            { background: "#FFF6ED", color: "#C4320A" },
            { background: "#EFF8FF", color: "#175CD3" },
            { background: "#F9F5FF", color: "#6941C6" },
            { background: "#FDF2FA", color: "#C11574" },
          ],
        ];

        const rowIndex =
          params.api.getRowIndexRelativeToVisibleRows(params.id) % 4;
        const tagColors = colorSets[rowIndex];

        return (
          <div
            className="tag-container"
            onClick={() => handleViewOpen(params.row)}
          >
            {tags.map((tag, index) => {
              const style = tagColors[index % tagColors.length];
              return (
                <div key={index} className="iabot-tagsData" style={style}>
                  <span>{tag}</span>
                </div>
              );
            })}
          </div>
        );
      },
    },
    {
      field: "target",
      headerName: "Target",
      width: 60,
      renderCell: (params) => {
        return (
          <span
            onClick={() => handleViewOpen(params.row)}
            style={{ cursor: "default" }}
          >
            <Tooltip title={params.row.target}>
              {params.row.target ? params.row.target : "N|A"}
            </Tooltip>
          </span>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      width: 60,
      renderCell: (params) => (
        <span
          onClick={() => handleViewOpen(params.row)}
          style={{ cursor: "default" }}
        >
          {params.row.createdAt ? getFormattedDate(params.row.createdAt) : "-"}
        </span>
      ),
    },
    {
      field: "updateAt",
      headerName: "End Date",
      width: 60,
      renderCell: (params) => (
        <span
          onClick={() => handleViewOpen(params.row)}
          style={{ cursor: "default" }}
        >
          {params.row.endTime
            ? getFormattedDate(params.row.endTime)
            : params.row.createdAt
            ? getFormattedDate(params.row.createdAt)
            : "-"}
        </span>
      ),
    },
    {
      field: "updatedAt",
      headerName: "Updated Date",
      width: 120,
      renderCell: (params) => (
        <span
          onClick={() => handleViewOpen(params.row)}
          style={{ cursor: "default" }}
        >
          {params.row.updatedAt ? formattedDate(params.row.updatedAt) : "-"}
        </span>
      ),
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      width: 60,
      renderCell: (params) => (
        <span
          onClick={() => handleViewOpen(params.row)}
          style={{ cursor: "default" }}
        >
          {params.row.updatedBy ? params.row.updatedBy : "N|A"}
        </span>
      ),
    },
  ];
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [singleJob, setSingleJob] = useState([]);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [isNodesModalOpen, setIsNodesModalOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const setModalIsOpenToFalse = () => {
    setModalIsOpen(false);
    if (document.querySelector("#TaskList thead"))
      document.querySelector("#TaskList thead").style.position = "sticky";
  };
  const handleEditClick = (job) => {
    setModalIsOpen(true);
    setJobId(job._id);
    setJobDescription(job.jobName || job.jobDescription);
    setIsEditClicked(true);
    setSingleJob(job);
  };

  const handleViewOpen = (job) => {
    setModalIsOpen(true);
    setSingleJob(job);
    setIsEditClicked(false);
  };

  const handleNodePopup = (job) => {
    setJobId(job._id);
    setIsNodesModalOpen(true);
    setSelectedJob(job);
  };

  const onConfirm = () => {
    setOpenConfirmModal(false);
    handleExecuteJob(selectedJob?._id);
  };
  const onClose = () => {
    setOpenConfirmModal(false);
  };

  const rows = jobs.map((job) => ({
    ...job,
    id: job._id || `job-${Math.random().toString(36).substr(2, 9)}`,
  }));

  function LoadingToast({ loadingMsg }) {
    return (
      <Box display="flex" alignItems="center">
        <CircularProgress size={20} style={{ marginRight: 10 }} />
        <Typography variant="body2">{loadingMsg}...</Typography>
      </Box>
    );
  }

  const handlePauseResumeJob = async (row) => {
    const { jobName, jobRunning, scheduleId } = row;

    let toastId = null;
    try {
      if (jobRunning) {
        // Pausing an active job
        toastId = toast(<LoadingToast loadingMsg={"Schedule Pausing"} />, {
          autoClose: false,
          closeButton: false,
          draggable: false,
        });
        await handleJobAction(scheduleId, false, jobName);
        toast.update(toastId, {
          render: TOAST_MESSAGES.OTHERS.SCHEDULE_PAUSED_SUCCESSFULLY,
          type: "success",
          autoClose: 3000,
          closeButton: true,
          isLoading: false,
        });
      } else {
        // Resuming an inactive job
        toastId = toast(<LoadingToast loadingMsg={"Schedule Resuming"} />, {
          autoClose: false,
          closeButton: false,
          draggable: false,
        });
        await handleJobAction(scheduleId, true, jobName);
        toast.update(toastId, {
          render: TOAST_MESSAGES.OTHERS.SCHEDULE_RESUMED_SUCCESSFULLY,
          type: "success",
          autoClose: 3000,
          closeButton: true,
          isLoading: false,
        });
      }
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Failed to pause/resume job:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        TOAST_MESSAGES.OTHERS.FAILED_TO_UPDATE_JOB_STATUS;
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        autoClose: 3000,
        closeButton: true,
        isLoading: false,
      });
    }
  };
  return (
    <>
      <div
        className="iabot_jobsList_cardsTable_container"
        data-testid="task-list-container"
        style={{
          maxWidth: isSidebarExpanded ? "88vw" : "98vw",
          width: isSidebarExpanded ? "88vw" : "97vw",
        }}
      >
        {isLoading ? (
          <div className="d-flex justify-content-center my-5">
            <LoadingData />
          </div>
        ) : (
          <div>
            {jobs?.length !== 0 ? (
              <>
                <CustomDataGrid
                  key="task-list"
                  tableHeight={
                    isAnyFilterSelected
                      ? "51vh"
                      : showPlatformFilters
                      ? "59vh"
                      : "67vh"
                  }
                  rows={rows}
                  columns={alwaysVisibleColumns}
                  expandableColumns={expandableColumns}
                  hideFooter={true}
                  getRowId={(row) => row.id}
                  openRow={openRow}
                  handleRowClick={handleRowClick}
                  alwaysVisibleColumns={alwaysVisibleColumns}
                  componentType="taskListsCardsTable"
                  paginationMode="client"
                />
              </>
            ) : (
              <div style={{ textAlign: "center", height: "74vh" }} colSpan={12}>
                <NoDataFound />
              </div>
            )}
          </div>
        )}
      </div>
      <HostsModal
        data-testid="nodes-modal"
        jobId={jobId}
        job={selectedJob}
        isModalOpen={isNodesModalOpen}
        setIsModelOpen={setIsNodesModalOpen}
      />

      {openModal && (
        <ViewLogs
          open={openModal}
          onClose={() => setOpenModal(false)}
          jobId={selectedJobId}
          jobDescription={jobDescription}
          originalJobData={
            jobs.find((job) => job._id === selectedJobId)?.nodes || {
              total: 0,
              failure: 0,
            }
          }
        />
      )}

      <ConfirmationDialog
        open={openConfirmModal}
        onClose={onClose}
        onConfirm={onConfirm}
        title={`Schedule`}
        message={`Are you sure you want to run this Schedule?`}
        confirmText={"Yes,Confirm"}
        color={"primary"}
        note={""}
      />
    </>
  );
};

export default TaskListCardsTable;
