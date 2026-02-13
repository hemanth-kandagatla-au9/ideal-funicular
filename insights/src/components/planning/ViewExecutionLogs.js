import "./css/tasks.css";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { CustomDataGrid } from "../common/CustomDatagrid/CustomDatagrid";
import CustomPagination from "../common/CustomPagination/CustomPagination";
import { getOpenSearchIndex } from "../../services/configurations/configService";
import CodeIcon from "../../assets/images/webide.png";
import CommandEditorDialog from "../common/commonEditorDialogue";
import CommonProgressBar from "../common/CommonComponents/ProgressBars";
import { UI_TEXTS } from "../common/Constants/label-contants";

const ExecutionLogs = ({ open, onClose, jobId, originalJobData }) => {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRunId, setSelectedRunId] = useState(null);
  const [serverDetails, setServerDetails] = useState([]);
  const [showServerModal, setShowServerModal] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [command, setCommand] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const handleSortOrderChange = (event) => {
    const newSortOrder = event.target.value;
    setSortOrder(newSortOrder);

    setGroupedData((prevData) => {
      const sortedData = [...prevData];
      sortedData.sort((a, b) => {
        const timeA = new Date(a.startTime).getTime();
        const timeB = new Date(b.startTime).getTime();
        return newSortOrder === "asc" ? timeA - timeB : timeB - timeA;
      });
      return sortedData;
    });
  };

  const handleCommandChange = (e) => {
    setCommand(e.target.value);
  };

  const totalPages = Math.ceil(groupedData.length / itemsPerPage);

  useEffect(() => {
    if (open && jobId) {
      fetchData();
    }
  }, [open, jobId]);

  useEffect(() => {
    if (data.length > 0) {
      groupDataByRunId();
    }
  }, [data]);

  const fetchData = async () => {
    if (!jobId) {
      console.warn("No jobId provided, skipping API call");
      return;
    }

    try {
      const response = await getOpenSearchIndex({ jobId });

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
        startTime: item._source.startTime || "-",
        endTime: item._source.endTime || "-",
        exitStatus: item._source.exitStatus || "-",
        timestamp: item._source.timestamp
          ? new Date(item._source.timestamp).toLocaleString()
          : "-",
      }));

      setData(logs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const groupDataByRunId = () => {
    const grouped = data.reduce((acc, item) => {
      if (!acc[item.runId]) {
        acc[item.runId] = {
          runId: item.runId,
          jobDescription: item.jobDescription,
          command: item.command,
          startTime: item.startTime,
          endTime: item.endTime,
          servers: [],
          successCount: 0,
          totalCount: 0,
        };
      }

      acc[item.runId].servers.push({
        hostname: item.hostname,
        exitStatus: item.exitStatus,
        timestamp: item.timestamp,
        output: item.output,
        startTime: item.startTime,
        endTime: item.endTime,
        command: item.command,
      });

      acc[item.runId].totalCount++;
      if (item.exitStatus === 0) {
        acc[item.runId].successCount++;
      }

      return acc;
    }, {});

    const groupedArray = Object.values(grouped);
    groupedArray.sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return timeB - timeA;
    });

    setGroupedData(groupedArray);
  };

  const handleProgressClick = (runId) => {
    const job = groupedData.find((item) => item.runId === runId);
    if (job) {
      setServerDetails(job.servers);
      setSelectedRunId(runId);
      setShowServerModal(true);
    }
  };

  const handleServerModalClose = () => {
    setShowServerModal(false);
    setSelectedRunId(null);
  };

  const handleEditorOpen = (commandValue) => {
    setCommand(commandValue);
    setShowEditor(true);
  };

  const columns = [
    {
      field: "startTime",
      headerName: "Job Start Time",
      flex: 1.5,
      renderCell: (params) => (
        <div>
          {params.row.startTime !== "-"
            ? new Date(params.row.startTime).toLocaleString()
            : "-"}
        </div>
      ),
    },
    {
      field: "runId",
      headerName: "Job Run ID",
      flex: 2.5,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {params.value}
        </div>
      ),
    },
    {
      field: "progress",
      headerName: "Status",
      flex: 2.5,
      renderCell: (params) => {
        return (
          <div
            style={{ width: "80%", cursor: "pointer", marginTop: "20px" }}
            onClick={() => handleProgressClick(params.row.runId)}
          >
            <CommonProgressBar
              originalJobData={originalJobData}
              openSearchData={groupedData}
              jobRunID={params.row.runId}
            />
          </div>
        );
      },
    },

    {
      field: "command",
      headerName: "Script/Code",
      flex: 2,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            marginTop: "20px",
          }}
        >
          <img
            src={CodeIcon}
            alt="code editor"
            style={{
              cursor: "pointer",
              width: 24,
            }}
            onClick={() => handleEditorOpen(params.row.command)}
          />
        </div>
      ),
    },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = groupedData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <Modal open={open} onClose={onClose} className="modal-overlay">
        <Box className="jobs-modal-container">
          <Box
            className="jobs-modal-header"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" className="job-details">
              {UI_TEXTS.TYPOGRAPHY.JOB_EXECUTION_DETAILS}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <FormControl
                size="small"
                sx={{ minWidth: 150, marginRight: 2, marginBottom: "5px" }}
              >
                <Select
                  value={sortOrder}
                  onChange={handleSortOrderChange}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return (
                        <em style={{ color: "#9e9e9e" }}>
                          {UI_TEXTS.FILTERS_TEXT.SORTING}
                        </em>
                      );
                    }
                    return selected === "asc"
                      ? UI_TEXTS.TEXTS.INITIAL_JOB_EXECUTIONS
                      : UI_TEXTS.TEXTS.RECENT_JOB_EXECUTIONS;
                  }}
                  className="server-grid-headers"
                  sx={{
                    borderRadius: "16px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderWidth: "1px",
                      borderColor: "#E0E0E0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#BDBDBD",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                      borderWidth: "1px",
                    },
                    "& .MuiSelect-select": {
                      padding: "8px",
                      paddingRight: "40px !important",
                      display: "flex",
                      alignItems: "center",
                    },
                    "& .MuiSelect-icon": {
                      right: "8px",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        marginTop: "8px",
                        borderRadius: "8px",
                      },
                    },
                  }}
                >
                  <MenuItem value="asc" className="server-grid-headers">
                    {" "}
                    {UI_TEXTS.TEXTS.INITIAL_JOB_EXECUTIONS}
                  </MenuItem>
                  <MenuItem value="desc" className="server-grid-headers">
                    {UI_TEXTS.TEXTS.RECENT_JOB_EXECUTIONS}
                  </MenuItem>
                </Select>
              </FormControl>
              <IconButton onClick={onClose}>
                <CloseIcon />{" "}
              </IconButton>
            </Box>
          </Box>

          <div
            className="jobs-modal-content jobs-flex"
            style={{ marginBottom: "20px", boxShadow: "none", padding: "0" }}
          >
            <CustomDataGrid
              rows={paginatedData}
              columns={columns}
              getRowId={(row) => row.runId}
              hideFooter={true}
              tableHeight="60vh"
            />
          </div>
          <CustomPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalPages={totalPages}
          />
        </Box>
      </Modal>
      <Modal
        open={showServerModal}
        onClose={handleServerModalClose}
        className="modal-overlay"
      >
        <Box className="jobs-modal-container" sx={{ width: "60%" }}>
          <Box className="jobs-modal-header">
            <Typography variant="h6" className="job-details">
              {UI_TEXTS.TEXTS.SERVER_EXECUTION_DETAILS} - {selectedRunId}
            </Typography>
            <IconButton onClick={handleServerModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              padding: 2,
              width: "90%",
              height: "400px",
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TableContainer
              component={Paper}
              sx={{ flex: 1, overflow: "auto", minHeight: "200px" }}
            >
              <Table>
                <TableHead sx={{ backgroundColor: "#F6F9FF" }}>
                  <TableRow>
                    <TableCell className="server-grid-headers">
                      {UI_TEXTS.TABLE_TEXTS.SERVER}
                    </TableCell>
                    <TableCell className="server-grid-headers">
                      {UI_TEXTS.TABLE_TEXTS.START_DATE}
                    </TableCell>
                    <TableCell className="server-grid-headers">
                      {UI_TEXTS.TABLE_TEXTS.END_DATE}
                    </TableCell>
                    <TableCell className="server-grid-headers">
                      {UI_TEXTS.TABLE_TEXTS.OUTPUT}
                    </TableCell>
                    <TableCell className="server-grid-headers">
                      {UI_TEXTS.TABLE_TEXTS.COMMAND}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serverDetails.map((server, index) => (
                    <TableRow key={index}>
                      <TableCell className="server-grid-cols">
                        {server.hostname}
                      </TableCell>
                      <TableCell className="server-grid-cols">
                        {server.startTime
                          ? new Date(server.startTime).toLocaleString()
                          : ""}
                      </TableCell>
                      <TableCell className="server-grid-cols">
                        {server.endTime
                          ? new Date(server.endTime).toLocaleString()
                          : ""}
                      </TableCell>
                      <TableCell className="server-grid-cols">
                        {server.output}
                      </TableCell>
                      <TableCell className="server-grid-cols">
                        {server.command}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Modal>
      {showEditor && (
        <CommandEditorDialog
          open={showEditor}
          onClose={() => setShowEditor(false)}
          command={command}
          setCommand={setCommand}
          viewOnly={true}
        />
      )}
    </>
  );
};

export default ExecutionLogs;
