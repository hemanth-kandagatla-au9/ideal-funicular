import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { CustomDataGrid } from "../../components/common/CustomDatagrid/CustomDatagrid";
import CustomPagination from "../../components/common/CustomPagination/CustomPagination";
import { UI_TEXTS } from "../../components/common/Constants/label-contants";
import { formattedDate } from "../../utils/CommonUtils";
import { getTemplateScheduleDetails } from "../../store/TemplateSlice/templateSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "85%",
  bgcolor: "background.paper",
  border: "1px solid #FFFFFF",
  boxShadow: 0,
  p: 4,
  overflow: "auto",
  maxHeight: "90vh",
};

export function ScheduleViewModal({
  isModalOpen,
  setIsModelOpen,
  templateId,
  templateName,
}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(isModalOpen);

  const [scheduleData, setScheduleData] = useState({
    regularJobs: [],
    internalJobs: [],
    summary: { totalJobs: 0, regularJobsCount: 0, internalJobsCount: 0 },
  });

  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pageInput, setPageInput] = useState("");

  console.log("scheduleData", scheduleData); // Debug log

  const handleClose = () => {
    setIsModelOpen(false);
    setOpen(false);
    setTabValue(0);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchScheduleDetails = async () => {
      if (!open || !templateId) return;

      console.log("Fetching schedule details for template:", templateId);
      setLoading(true);

      try {
        const response = await dispatch(
          getTemplateScheduleDetails(templateId)
        ).unwrap();

        console.log("API Response:", response); // Debug log

        // FIX: Handle the response structure properly
        if (response && response.data) {
          setScheduleData({
            regularJobs: response.data.regularJobs || [],
            internalJobs: response.data.internalJobs || [],
            summary: response.data.summary || {
              totalJobs: 0,
              regularJobsCount: 0,
              internalJobsCount: 0,
            },
          });
        } else {
          setScheduleData({
            regularJobs: [],
            internalJobs: [],
            summary: {
              totalJobs: 0,
              regularJobsCount: 0,
              internalJobsCount: 0,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching template schedule details:", error);
        setScheduleData({
          regularJobs: [],
          internalJobs: [],
          summary: { totalJobs: 0, regularJobsCount: 0, internalJobsCount: 0 },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleDetails();
  }, [dispatch, open, templateId]);

  // Columns for Regular Jobs
  const regularJobColumns = [
    {
      field: "scheduleId",
      headerName: "Schedule ID",
      flex: 1.5,
      filterable: false,
    },
    {
      field: "jobName",
      headerName: "Job Name",
      flex: 1.8,
      filterable: false,
    },
    {
      field: "categoryName",
      headerName: "Category",
      flex: 1.3,
      filterable: false,
    },
    {
      field: "frequency",
      headerName: "Frequency",
      flex: 1.3,
      filterable: false,
      renderCell: (params) => {
        return params.value ? params.value : "--";
      },
    },
    {
      field: "scheduleType",
      headerName: "Type",
      flex: 1,
      filterable: false,
    },
    {
      field: "jobRunning",
      headerName: "Status",
      flex: 1,
      filterable: false,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1.3,
      filterable: false,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.5,
      filterable: false,
      renderCell: (params) => formattedDate(params.row.createdAt),
    },
  ];

  // Columns for Internal Jobs
  const internalJobColumns = [
    {
      field: "jobName",
      headerName: "Job Name",
      flex: 1.8,
      filterable: false,
    },
    {
      field: "outputIndex",
      headerName: "Output Index",
      flex: 1.5,
      filterable: false,
    },
    {
      field: "frequency",
      headerName: "Frequency (mins)",
      flex: 1.2,
      filterable: false,
    },
    {
      field: "onStartup",
      headerName: "On Startup",
      flex: 1,
      filterable: false,
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 1.3,
    //   filterable: false,
    // },
    // {
    //   field: "createdBy",
    //   headerName: "Created By",
    //   flex: 1.3,
    //   filterable: false,
    // },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.5,
      filterable: false,
      renderCell: (params) => formattedDate(params.row.createdAt),
    },
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setCurrentPage(1);
  };

  const currentData =
    tabValue === 0 ? scheduleData.regularJobs : scheduleData.internalJobs;
  const currentColumns =
    tabValue === 0 ? regularJobColumns : internalJobColumns;

  useEffect(() => {
    setOpen(isModalOpen);
    if (currentData?.length > 0) {
      setTotalPages(Math.ceil(currentData.length / itemsPerPage));
    } else {
      setTotalPages(1);
    }
  }, [isModalOpen, itemsPerPage, currentData]);

  const paginatedRows = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return currentData.slice(startIndex, startIndex + itemsPerPage);
  }, [currentData, currentPage, itemsPerPage]);

  // Get unique row IDs
  const getRowId = (row) => {
    return row.scheduleId || row.id || row._id || Math.random().toString();
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose} sx={{ border: "none" }}>
        <Box sx={style}>
          <div style={{ paddingBottom: "7px" }}>
            <Typography
              id="schedule-details-title"
              className="preview-modal-title"
            >
              Template Schedule Details - {templateName}
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  float: "right",
                  position: "absolute",
                  top: "27px",
                  right: "27px",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Typography>
          </div>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab
              label={`Schedules (${scheduleData.regularJobs.length})`}
              sx={{ textTransform: "none" }}
            />
            <Tab
              label={`Internal Jobs (${scheduleData.internalJobs.length})`}
              sx={{ textTransform: "none" }}
            />
          </Tabs>

          {loading && (
            <div
              style={{
                height: "400px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          )}

          {!loading && (
            <div style={{ marginTop: "20px" }}>
              <CustomDataGrid
                tableHeight="46vh"
                key={`schedule-list-${tabValue}-${currentData.length}`}
                rows={paginatedRows}
                columns={currentColumns}
                hideFooter={true}
                getRowId={getRowId}
                components={{
                  NoRowsOverlay: () => (
                    <div className="not_found_card">
                      {tabValue === 0
                        ? "No regular jobs found using this template"
                        : "No internal jobs found using this template"}
                    </div>
                  ),
                }}
              />

              {currentData.length > 0 && (
                <CustomPagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  totalPages={totalPages}
                  setTotalPages={setTotalPages}
                  pageInput={pageInput}
                  setPageInput={setPageInput}
                  disabled={currentData.length === 0}
                />
              )}
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
}
