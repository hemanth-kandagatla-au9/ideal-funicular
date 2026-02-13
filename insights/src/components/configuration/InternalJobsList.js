import React, { useEffect, useState } from "react";
import { Button, Col, Row, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import classes from "../auth/role/css/taskList.module.css";
import Search from "../ui/search/Search.component";
import InternalJobsModal from "./InternalJobsModal";
import { DateTimeIconHtml, DeleteIcon, EditIcon } from "../ui/icons/Icons";
import Switch from "@mui/material/Switch";
import { CustomDataGrid } from "../common/CustomDatagrid/CustomDatagrid";
import { Add, Book, CardEdit, Note, Shop } from "iconsax-react";
import CustomPagination from "../common/CustomPagination/CustomPagination";
import PopUp from "../popup/popUp.component";
import { useDispatch, useSelector } from "react-redux";
import {
  getInternalJobs,
  deleteInternalJobs,
  handleInternalJob,
} from "../../services/jobs/JobsService";
import {
  PERMISSION_LIST,
  hasInsightsPermission,
} from "../../utils/permissionUtil";
import CustomizedSwitches from "../common/Button/CustomSwitch";
import "../configuration/css/common.css";
import { Tooltip } from "@mui/material";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";
import { isLoadingInHost } from "../../utils/DetectHost";

const InternalJobsList = ({ isSidebarExpanded }) => {
  const [filter, setFilter] = useState(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [internalJobsData, setInternalJobsData] = useState([]);
  const [pageInput, setPageInput] = useState("");
  const [editData, setEditData] = useState({});
  const [editInternalJobId, setEditInternalJobId] = useState();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const internalJobs = useSelector((state) => state?.jobs?.internalJobs);
  const permissionState = useSelector((state) => state.jobs?.permissions);

  // Check if user has write access for Settings
  const hasSettingsWriteAccess = () => {
    if (!permissionState) return false;

    const insightsProject = permissionState.find(
      (project) => project.project === "insights"
    );
    if (!insightsProject) return false;

    const settingsModule = insightsProject.modules.find(
      (module) => module.module === "Settings"
    );
    const AllModule = insightsProject.modules.find(
      (module) => module.module === "All"
    );
    if (AllModule?.hasAccess) return true;
    return settingsModule?.permissions?.some(
      (p) => p.label === "Settings : write" && p.hasAccess
    );
  };

  const handleAddInternalJob = () => {
    setIsEditClicked(false);
    setShowModal(true);
  };

  const onEditAction = async (row) => {
    setIsEditClicked(true);
    setEditInternalJobId(row?._id);
    setShowModal(true);
  };

  const handleStatusToggle = async (newStatus, rowData) => {
    setIsStatusUpdating(true);
    try {
      const jobData = {
        internalJobId: rowData._id,
        isActive: newStatus,
        jobName: rowData.jobName,
        outputOpenSearchIndex: rowData.outputOpenSearchIndex,
        frequency: rowData.frequency,
        onStartup: rowData.onStartup,
        scriptData: rowData.scriptData,
        codeTemplate: rowData.codeTemplate,
      };

      const response = await dispatch(handleInternalJob(jobData));

      if (response && response.success) {
        toast.success(
          `Job ${newStatus ? "activated" : "deactivated"} successfully`
        );
        loadData(); // Refresh the data
      } else {
        throw new Error(response?.message || "Failed to update job status");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const formatFrequency = (seconds) => {
    if (!seconds || isNaN(seconds)) return "-";
    if (seconds < 60) {
      return `${seconds} sec`;
    } else if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      return `${mins} min`;
    } else {
      const hrs = Math.floor(seconds / 3600);
      return `${hrs} hr`;
    }
  };

  const getJobStyles = (job) => {
    if (job.status === "PENDING_APPROVAL") {
      return {
        label: UI_TEXTS.HEADINGS.PENDING,
        color: "#B36B00",
        backgroundColor: "#FFF3E0",
        border: "4px solid #FF9800",
      };
    } else if (job.status === "ACTIVE" || job.isActive) {
      return {
        label: UI_TEXTS.HEADINGS.ACTIVE,
        color: "#109A48",
        backgroundColor: "#D9FBE7",
        border: "4px solid #4CAF50",
      };
    } else {
      return {
        label: UI_TEXTS.HEADINGS.IN_ACTIVE,
        color: "#CC2901",
        backgroundColor: "#FFEBE6",
        border: "4px solid rgb(236, 28, 28)",
      };
    }
  };

  const columns = [
    {
      field: "index",
      headerName: "#",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <div
          style={{
            textAlign: "center",
            borderLeft: params.row.border,
            marginLeft: "-9px",
          }}
        >
          {params.row.index + 1}
        </div>
      ),
    },
    {
      field: "jobName",
      headerName: UI_TEXTS.TABLE_TEXTS.JOB_NAME,
      flex: 1.5,
    },
    {
      field: "outputOpenSearchIndex",
      headerName: UI_TEXTS.TABLE_TEXTS.LOG_INDEX,
      flex: 1.5,
    },
    {
      field: "frequency",
      headerName: UI_TEXTS.TABLE_TEXTS.FREQUENCY_SEC,
      flex: 1,
      renderCell: (params) => {
        const value = formatFrequency(params.row.frequency);
        return (
          <div title={value || UI_TEXTS.NOT_FOUND.NO_FREQUENCY_AVAILABLE}>
            {value}
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: UI_TEXTS.TABLE_TEXTS.STATUS,
      flex: 1.5,
      renderCell: (params) => {
        return (
          <div
            style={{
              borderRadius: "12px",
              fontSize: "11px",
              fontWeight: 600,
              minWidth: "80px",
              height: "28px",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              fontFamily: "Manrope",
            }}
          >
            {params.row.status}
          </div>
        );
      },
      headerAlign: "center",
      align: "center",
    },
    {
      field: "onStartup",
      headerName: UI_TEXTS.TABLE_TEXTS.RUN_ON_STARTUP,
      flex: 1,
      renderCell: (params) => (
        <div style={{ textAlign: "center", width: "100%" }}>
          {params.row.onStartup ? "Yes" : "No"}
        </div>
      ),
      headerAlign: "center",
      align: "center",
    },

    hasInsightsPermission(
      permissionState,
      "Internal Jobs",
      PERMISSION_LIST.INTERNAL_JOBS_READ
    ) &&
      hasInsightsPermission(
        permissionState,
        "Internal Jobs",
        PERMISSION_LIST.INTERNAL_JOBS_WRITE
      ) && {
        field: "actions",
        headerName: UI_TEXTS.TABLE_TEXTS.ACTION,
        flex: 1,
        headerAlign: "center",
        renderCell: (params) => {
          if (params.row.status === "PENDING") {
            return <div />;
          }
          return (
            <div
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // gap: '16px'
              }}
            >
              <Tooltip
                title={
                  params.row.isActive || params.row.status === "ACTIVE"
                    ? UI_TEXTS.TOOLTIP_TEXT.DEACTIVATE_JOB
                    : UI_TEXTS.TOOLTIP_TEXT.ACTIVATE_JOB
                }
                placement="bottom"
              >
                <div>
                  <CustomizedSwitches
                    isActive={
                      params.row.isActive === true ||
                      params.row.status === "ACTIVE"
                    }
                    onToggle={(newStatus) =>
                      handleStatusToggle(newStatus, params.row)
                    }
                  />
                </div>
              </Tooltip>
              <Tooltip title={UI_TEXTS.BUTTONS.EDIT} placement="bottom">
                <div>
                  <EditIcon
                    height={"15px"}
                    id="groupButtonEdit"
                    onClickHandle={() => onEditAction(params.row)}
                    testid="dropdown-item-edit"
                  />
                </div>
              </Tooltip>
              &nbsp;&nbsp;
            </div>
          );
        },
      },
  ].filter(Boolean);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        getInternalJobs(currentPage, itemsPerPage, filter || "")
      );
      if (response && response.data) {
        setInternalJobsData(response.data.data || []);
        setTotalPages(response.pagination?.totalPage || 1);
      }
    } catch (error) {
      console.error("Error loading internal jobs:", error);
      toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_LOAD_INTERNAL_JOBS, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      setInternalJobsData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchText, filter]);

  useEffect(() => {
    loadData();
  }, [currentPage, itemsPerPage]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);

      const result = await deleteInternalJobs(id);

      if (result?.success) {
        toast.success(
          result.message ||
            TOAST_MESSAGES.OTHERS.INTERNAL_JOB_DELETED_SUCCESSFULLY,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }
        );

        setModalShow(false);

        setInternalJobsData((prev) => prev.filter((job) => job._id !== id));

        await loadData();
      } else {
        throw new Error(result?.message || "Failed to delete Internal Job");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });

      await loadData();
    } finally {
      setLoading(false);
    }
  };

  const rows = internalJobs.map((job, index) => {
    const styles = getJobStyles(job);
    return {
      ...job,
      id: job._id || `job-${index}`,
      index,
      status: styles.label,
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      border: styles.border,
    };
  });

  const getRowId = (row) => {
    return row._id || row.id;
  };
  const containerStyle = {
    paddingTop: "0px",
    height: !isLoadingInHost ? "75vh" : "calc(100vh - 110px)",
    position: "relative",
  };

  const gridContainerStyle = {
    flex: 1,
    overflow: "auto",
    position: "relative",
    maxWidth: !isLoadingInHost ? (isSidebarExpanded ? "86vw" : "95vw") : "100%",
  };

  const footerStyle = !isLoadingInHost
    ? {
        padding: "0 10px",
        position: "absolute",
        bottom: 10,
        width: isSidebarExpanded ? "86vw" : "95vw",
        zIndex: 99,
      }
    : {
        width: "100%",
        padding: "10px",
      };
  return (
    <div style={containerStyle}>
      <Row>
        <Col
          style={{
            marginLeft: "-10px",
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "-20px",
            }}
          >
            <span style={{ paddingRight: "15px" }}>
              <Search
                placeholder={UI_TEXTS.PLACEHOLDERS.SEARCH_BY_INTERNAL_JOB}
                searchIconTowardsRight
                onEnterClear
                customeCss={{ right: "5px", position: "relative" }}
                selection="single"
                handleSearchText={(e) => setFilter(e.toLowerCase())}
                setSearchTextProp={(e) => setFilter(e.toLowerCase())}
              />
            </span>
            {hasInsightsPermission(
              permissionState,
              "Internal Jobs",
              PERMISSION_LIST.INTERNAL_JOBS_READ
            ) &&
              hasInsightsPermission(
                permissionState,
                "Internal Jobs",
                PERMISSION_LIST.INTERNAL_JOBS_WRITE
              ) && (
                <span>
                  <Button
                    id="AddInternalJobButton"
                    onClick={() => {
                      handleAddInternalJob();
                    }}
                  >
                    <Add size="25" />
                    {UI_TEXTS.BUTTONS.ADD_INTERNAL_JOB}
                  </Button>
                </span>
              )}
          </div>
        </Col>
      </Row>

      <div style={gridContainerStyle}>
        {loading && (
          <div className="grid-loader">
            <div className="loader-spinner"></div>
          </div>
        )}
        <CustomDataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          rowCount={rows.length}
          paginationMode="client"
          sortingMode="client"
          rowCursorPointer={true}
          hideFooter={false}
          tableHeight="55vh"
          showColumnFilters={false}
          loading={isStatusUpdating || loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        />
      </div>

      <PopUp
        show={modalShow}
        dataObj={{
          header: UI_TEXTS.MESSAGES.DELETE_INTERNAL_JOB,
          body: UI_TEXTS.MESSAGES
            .ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_INTERNAL_JOB,
          button: {
            buttonOne: { buttonOneName: "YES", buttonBg: "modalButtonWhite" },
            buttonTwo: { buttonTwoName: "NO", buttonBg: "modalButtonBlue" },
          },
        }}
        onHide={() => setModalShow(false)}
        handleClick={() => handleDelete(editData)}
      />
      <div style={footerStyle}>
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          pageInput={pageInput}
          setPageInput={setPageInput}
          disabled={loading}
        />
      </div>
      <InternalJobsModal
        isEditClicked={isEditClicked}
        isModalOpen={showModal}
        setIsModelOpen={setShowModal}
        internalJobId={editInternalJobId}
        onSaveSuccess={loadData}
      />
    </div>
  );
};

export default InternalJobsList;
