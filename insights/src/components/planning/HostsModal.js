import React, { useState, useEffect, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { gridClasses } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import { CustomDataGrid } from "../common/CustomDatagrid/CustomDatagrid";
import { getHostDetail } from "../../services/jobs/JobsService";
import { useDispatch } from "react-redux";
import CustomPagination from "../common/CustomPagination/CustomPagination";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ComputerIcon from "@mui/icons-material/Computer";
import { UI_TEXTS } from "../common/Constants/label-contants";
import "../configuration/css/common.css";
import { formatTimeStamp } from "../../utils/CommonUtils";
import { Pending, Refresh } from "@mui/icons-material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  [`.${gridClasses.cell}.fail`]: {
    color: "#FF0000",
  },
  [`.${gridClasses.cell}.success`]: {
    color: "#008000",
  },
  overflow: "auto",
};

const CountBox = ({ icon, title, value, color, active, onClick, disabled }) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={`host-modal-count-tile ${
      active ? "host-modal-count-tile--active" : ""
    } ${disabled ? "host-modal-count-tile--disabled" : ""}`}
    style={{
      backgroundColor: active ? `${color}30` : `${color}20`,
      border: active ? `2px solid ${color}` : "none",
    }}
  >
    <div className="host-modal-count-tile__content">
      <div className="host-modal-count-tile__icon" style={{ color: color }}>
        {icon}
      </div>
      <div className="host-modal-count-tile__title">{title}</div>
      <div className="host-modal-count-tile__value">{value}</div>
    </div>
  </div>
);

const CustomNoRowsOverlay = ({ message = "No results found" }) => (
  <div className="host-modal-no-rows-overlay">
    <Typography variant="h6" className="host-modal-no-rows-message">
      {message}
    </Typography>
  </div>
);

export function HostsModal({ isModalOpen, setIsModelOpen, job, jobId }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [totalCounts, setTotalCounts] = useState({
    total: 0,
    success: 0,
    fail: 0,
    pending: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentExecutionData, setCurrentExecutionData] = useState([]);
  const isFetchingRef = useRef(false);
  const prevJobIdRef = useRef(null);

  const handleClose = () => {
    setIsModelOpen(false);
    setOpen(false);
    setStatusFilter("All");
    setCurrentPage(1);
    setCurrentExecutionData([]);
    setTotalCounts({ total: 0, success: 0, fail: 0, pending: 0 });
    isFetchingRef.current = false;
    prevJobIdRef.current = null;
  };

  const columns = [
    {
      field: "hostname",
      headerName: UI_TEXTS.TABLE_TEXTS.SERVER,
      flex: 1,
      filterable: false,
      renderCell: (params) => (
        <span
          className={`host-modal-table-cell ${
            params.row.status === "Pending"
              ? "host-modal-table-cell--pending"
              : params.row.status === "success"
              ? "host-modal-table-cell--success"
              : "host-modal-table-cell--fail"
          }`}
        >
          {params.row.hostname?.toUpperCase() || ""}
        </span>
      ),
    },
    {
      field: "environment",
      headerName: "Environment",
      flex: 1,
      filterable: false,
      renderCell: (params) => (
        <span
          className={`host-modal-table-cell ${
            params.row.status === "Pending"
              ? "host-modal-table-cell--pending"
              : params.row.status === "success"
              ? "host-modal-table-cell--success"
              : "host-modal-table-cell--fail"
          }`}
        >
          {params.row.environment && params.row.environment !== "unknown"
            ? params.row.environment.toUpperCase()
            : "N/A"}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      type: "singleSelect",
      valueOptions: ["success", "fail", "Pending"],
      filterable: true,
      renderCell: (params) => (
        <span
          className={`host-modal-status-cell host-modal-status-cell--${
            params.row.status?.toLowerCase() || "pending"
          }`}
        >
          {params.row.status || "Pending"}
        </span>
      ),
    },
    {
      field: "reason",
      headerName: "Reason",
      flex: 1.5,
      filterable: false,
      renderCell: (params) => {
        const statusClass =
          params.row.status === "Pending"
            ? "host-modal-table-cell--pending"
            : params.row.status === "success"
            ? "host-modal-table-cell--success"
            : "host-modal-table-cell--fail";
        return (
          <span className={`host-modal-table-cell ${statusClass}`}>
            {params.row.reason}
          </span>
        );
      },
    },
    {
      field: "time",
      headerName: UI_TEXTS.TABLE_TEXTS.DATE_AND_TIME,
      flex: 1.5,
      filterable: false,
      renderCell: (params) => {
        const statusClass =
          params.row.status === "Pending"
            ? "host-modal-table-cell--pending"
            : params.row.status === "success"
            ? "host-modal-table-cell--success"
            : "host-modal-table-cell--fail";
        return (
          <span className={`host-modal-table-cell ${statusClass}`}>
            {formatTimeStamp(params.row.createdAt)}
          </span>
        );
      },
    },
  ];

  // Create pending data from job configuration
  const createPendingDataFromJob = useCallback(() => {
    if (!Array.isArray(job?.hostname) || job.hostname.length === 0) return [];

    return job.hostname.map((hostname, index) => ({
      id: `pending-${index}-${hostname}`,
      hostname: hostname,
      status: "Pending",
      reason: "Awaiting response...",
      createdAt: new Date().toISOString(),
      environment: "unknown",
    }));
  }, [job]);

  // Process API data
  const processAPIData = useCallback((apiData) => {
    return apiData.map((item) => ({
      id: item._id || item.id || Math.random().toString(),
      hostname: item.hostname,
      environment: item.environment || "unknown",
      status: item.status || "Pending",
      reason:
        item.status === "fail"
          ? item.failedReason
          : item.agentResponse?.message || "Completed",
      createdAt: item.createdAt || new Date().toISOString(),
    }));
  }, []);

  // Fetch data with status filter
  const fetchData = useCallback(
    async (filter, page = 1, pageSize = itemsPerPage) => {
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;
        setIsLoading(true);

        const currentJobId = job?.scheduleId || jobId;

        const statusToSend = filter === "All" ? undefined : filter;

        const response = await dispatch(
          getHostDetail(currentJobId, page, pageSize, statusToSend)
        );

        const apiData = response?.data?.data || [];
        const totalCount = response?.data?.pagination?.totalCount || 0;
        const totalPage = response?.data?.pagination?.totalPage || 1;

        const successCount = response?.data?.pagination?.successCount || 0;
        const failCount = response?.data?.pagination?.failCount || 0;
        const pendingCount = response?.data?.pagination?.pendingCount || 0;

        let processedData = [];

        if (apiData.length > 0) {
          processedData = processAPIData(apiData);
          setCurrentExecutionData(processedData);

          if (filter === "All") {
            setTotalCounts({
              total: totalCount,
              success: successCount,
              fail: failCount,
              pending: pendingCount,
            });
          } else {
            setTotalCounts((prev) => ({
              ...prev,
              [filter]: totalCount,
            }));
          }

          setTotalPages(totalPage);
        } else {
          setCurrentExecutionData([]);

          if (filter === "All") {
            const pendingData = createPendingDataFromJob();
            const total = pendingData.length;

            if (total > 0) {
              const startIndex = (page - 1) * pageSize;
              const endIndex = startIndex + pageSize;
              const pageData = pendingData.slice(startIndex, endIndex);

              setCurrentExecutionData(pageData);
            }

            setTotalCounts({
              total,
              success: 0,
              fail: 0,
              pending: total,
            });

            setTotalPages(Math.ceil(total / pageSize));
          } else {
            setTotalPages(1);
            setTotalCounts((prev) => ({
              ...prev,
              [filter]: 0,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching host data:", error);

        if (filter === "All") {
          const pendingData = createPendingDataFromJob();
          const total = pendingData.length;

          if (total > 0) {
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageData = pendingData.slice(startIndex, endIndex);

            setCurrentExecutionData(pageData);
          }

          setTotalCounts({
            total,
            success: 0,
            fail: 0,
            pending: total,
          });
          setTotalPages(Math.ceil(total / itemsPerPage));
        } else {
          setCurrentExecutionData([]);
          setTotalPages(1);
        }
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [
      dispatch,
      job,
      jobId,
      processAPIData,
      createPendingDataFromJob,
      currentPage,
      itemsPerPage,
    ]
  );

  const handleRefresh = async () => {
    await fetchData(statusFilter, 1, itemsPerPage);
  };

  // Fetch initial counts for all statuses
  const fetchInitialCounts = useCallback(async () => {
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;

      const currentJobId = job?.scheduleId || jobId;

      const response = await dispatch(getHostDetail(currentJobId, 1, 10));

      const totalCount = response?.data?.pagination?.totalCount || 0;
      const successCount = response?.data?.pagination?.successCount || 0;
      const failCount = response?.data?.pagination?.failCount || 0;
      const pendingCount = response?.data?.pagination?.pendingCount || 0;

      if (successCount === 0 && failCount === 0 && pendingCount === 0) {
        setTotalCounts({
          total: totalCount,
          success: 0,
          fail: 0,
          pending: 0,
        });
      } else {
        setTotalCounts({
          total: totalCount,
          success: successCount,
          fail: failCount,
          pending: pendingCount,
        });
      }
    } catch (error) {
      console.error("Error fetching initial counts:", error);

      const pendingData = createPendingDataFromJob();
      const total = pendingData.length;
      setTotalCounts({
        total,
        success: 0,
        fail: 0,
        pending: total,
      });
    } finally {
      isFetchingRef.current = false;
    }
  }, [dispatch, job, jobId, createPendingDataFromJob]);

  // Handle tile click for filtering
  const handleTileClick = useCallback(
    async (filter) => {
      if (filter === statusFilter) return;

      setStatusFilter(filter);
      setCurrentPage(1);

      await fetchData(filter, 1, itemsPerPage);
    },
    [statusFilter, fetchData, itemsPerPage]
  );

  // Handle page change
  const handlePageChange = useCallback(
    async (newPage) => {
      if (newPage < 1 || newPage > totalPages || newPage === currentPage)
        return;

      setCurrentPage(newPage);

      await fetchData(statusFilter, newPage, itemsPerPage);
    },
    [currentPage, totalPages, statusFilter, fetchData, itemsPerPage]
  );

  // Handle items per page change
  const handleItemsPerPageChange = useCallback(
    async (newItemsPerPage) => {
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1);

      await fetchData(statusFilter, 1, newItemsPerPage);
    },
    [statusFilter, fetchData]
  );

  // Sync open state with parent
  useEffect(() => {
    setOpen(isModalOpen);
  }, [isModalOpen]);

  // Fetch initial data when modal opens
  useEffect(() => {
    if (isModalOpen) {
      const currentJobId = job?.scheduleId || jobId;

      if (currentJobId !== prevJobIdRef.current) {
        setIsLoading(true);
        setCurrentPage(1);
        setStatusFilter("All");

        fetchInitialCounts().then(() => {
          fetchData("All", 1, itemsPerPage);
        });

        prevJobIdRef.current = currentJobId;
      }
    }
  }, [isModalOpen, job, jobId, fetchInitialCounts, fetchData, itemsPerPage]);

  const { total, success, fail, pending } = totalCounts;

  // Get message for no rows
  const getNoRowsMessage = () => {
    if (statusFilter === "All") return "No server data available";
    return `No servers with status: ${statusFilter}`;
  };

  return (
    <div className="host-modal-container">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        disableEscapeKeyDown={isLoading}
      >
        <Box className="host-modal-content">
          <div className="host-modal-header">
            <div className="host-modal-header-content">
              <Typography
                id="modal-modal-title"
                className="host-modal-title label_title"
              >
                {UI_TEXTS.TYPOGRAPHY.SERVER_DETAILS}
              </Typography>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                className="host-modal-close-button"
                disabled={isLoading}
              >
                <CloseIcon />
              </IconButton>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              marginBottom: "8px",
            }}
          >
            <IconButton
              style={{
                border: "1px solid #e4e4e4",
                width: "40px",
                height: "40px",
              }}
              onClick={handleRefresh}
              size="medium"
              color="#344054"
              title="Refresh"
            >
              <Refresh />
            </IconButton>
          </div>

          {/* Status Count Tiles */}
          <div className="host-modal-count-tiles">
            <CountBox
              icon={<ComputerIcon fontSize="medium" />}
              title={UI_TEXTS.LABELS.ALL}
              value={total}
              color="#2196F3"
              active={statusFilter === "All"}
              onClick={() => handleTileClick("All")}
              disabled={isLoading}
              // disabled={isLoading || total === 0}
            />
            <CountBox
              icon={<CheckCircleIcon fontSize="medium" />}
              title={UI_TEXTS.LABELS.SUCCESS}
              value={success}
              color="#4CAF50"
              active={statusFilter === "success"}
              onClick={() => handleTileClick("success")}
              disabled={isLoading || success === 0}
            />
            {/* <CountBox
              icon={<Pending fontSize="medium" />}
              title={UI_TEXTS.LABELS.PENDING}
              value={pending}
              color="#FFC107"
              active={statusFilter === "Pending"}
              onClick={() => handleTileClick("Pending")}
              disabled={isLoading || pending === 0}
            /> */}
            <CountBox
              icon={<ErrorIcon fontSize="medium" />}
              title={UI_TEXTS.LABELS.FAILED}
              value={fail}
              color="#F44336"
              active={statusFilter === "fail"}
              onClick={() => handleTileClick("fail")}
              disabled={isLoading || fail === 0}
            />
          </div>

          {/* DataGrid Container */}
          <div className="host-modal-datagrid-container">
            <CustomDataGrid
              tableHeight="47vh"
              key={`hosts-${
                job?.scheduleId || jobId
              }-${statusFilter}-${currentPage}`}
              rows={isLoading ? [] : currentExecutionData}
              columns={columns}
              hideFooter={true}
              getRowId={(row) => row.id}
              getRowClassName={(params) =>
                `host-modal-datagrid-row ${
                  params.row.status === "fail"
                    ? "host-modal-datagrid-row--fail"
                    : params.row.status === "success"
                    ? "host-modal-datagrid-row--success"
                    : ""
                }`
              }
              components={{
                NoRowsOverlay: () => {
                  if (isLoading) {
                    return (
                      <div className="host-modal-loading-overlay">
                        <CircularProgress
                          size={40}
                          className="host-modal-loading-spinner"
                        />
                        <Typography
                          variant="body2"
                          className="host-modal-loading-text"
                        >
                          Loading server data...
                        </Typography>
                      </div>
                    );
                  }
                  return <CustomNoRowsOverlay message={getNoRowsMessage()} />;
                },
              }}
            />

            {/* Manual loading overlay for older DataGrid versions */}
            {isLoading && (
              <div className="host-modal-manual-loading-overlay">
                <div className="host-modal-manual-loading-content">
                  <CircularProgress
                    size={40}
                    className="host-modal-loading-spinner"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pagination - Show only when we have data and not loading */}
          {!isLoading && currentExecutionData.length > 0 && (
            <div className="host-modal-pagination-container">
              <CustomPagination
                currentPage={currentPage}
                setCurrentPage={handlePageChange}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={handleItemsPerPageChange}
                totalPages={totalPages}
                setTotalPages={setTotalPages}
                pageInput={pageInput}
                setPageInput={setPageInput}
                ModalStyling={true}
                disabled={isLoading}
              />
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
