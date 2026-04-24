/* eslint-disable import/namespace */
import React, { useState, useMemo } from "react";
import { Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputAdornment, Chip, CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { BulkActionDetails, ServerSyncStatus } from "@/types/BulkActionLogsState";

interface RightPanelProps {
  jobDetails: BulkActionDetails | null;
  loading?: boolean;
}

const getStatusBadgeStyle = (status: string): { backgroundColor: string; color: string } => {
  const styles: Record<string, { backgroundColor: string; color: string }> = {
    Success: { backgroundColor: "#E6F4EA", color: "#2E7D32" },
    Failure: { backgroundColor: "#FDECEA", color: "#D32F2F" },
    Failed: { backgroundColor: "#FDECEA", color: "#D32F2F" },
    "In Progress": { backgroundColor: "#E8F0FE", color: "#1976D2" },
    InProgress: { backgroundColor: "#E8F0FE", color: "#1976D2" },
    Partial: { backgroundColor: "#FEF0E6", color: "#EA8D24" },
    Pending: { backgroundColor: "#F3F4F6", color: "#6B7280" },
    Completed: { backgroundColor: "#E6F4EA", color: "#2E7D32" },
  };
  return styles[status] || styles.Pending;
};

const getServerStatusStyle = (status: string): { backgroundColor: string; color: string } => {
  const styles: Record<string, { backgroundColor: string; color: string }> = {
    Success: { backgroundColor: "#E6F4EA", color: "#2E7D32" },
    Failure: { backgroundColor: "#FDECEA", color: "#D32F2F" },
    Failed: { backgroundColor: "#FDECEA", color: "#D32F2F" },
    "In Progress": { backgroundColor: "#E8F0FE", color: "#1976D2" },
    InProgress: { backgroundColor: "#E8F0FE", color: "#1976D2" },
    Pending: { backgroundColor: "#F3F4F6", color: "#6B7280" },
  };
  return styles[status] || styles.Pending;
};

const getIndicatorDotColor = (type: string): string => {
  const colors: Record<string, string> = {
    success: "#10B981",
    pending: "#F59E0B",
    failure: "#EF4444",
    total: "#2563EB",
  };
  return colors[type] || "#6B7280";
};

const formatDateTime = (dateString?: string): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) + (dateString.includes("T") ? ` | ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}` : "")
    );
  } catch {
    return dateString;
  }
};

const RightPanel: React.FC<RightPanelProps> = ({ jobDetails, loading }) => {
  const [searchText, setSearchText] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | null>(null);

  const filteredServers = useMemo(() => {
    if (!jobDetails?.servers) return [];
    let servers = jobDetails.servers.filter(server => server.serverName.toLowerCase().includes(searchText.toLowerCase()));

    // Apply status filter if a status is selected
    if (selectedStatusFilter) {
      servers = servers.filter(server => server.status === selectedStatusFilter);
    }

    return servers;
  }, [jobDetails?.servers, searchText, selectedStatusFilter]);

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
        }}
      >
        <CircularProgress size={40} sx={{ color: "#7C3AED" }} />
      </Box>
    );
  }

  if (!jobDetails) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
        }}
      >
        Select a job to view details
      </Box>
    );
  }

  const statusCounts = {
    success: jobDetails.servers?.filter(s => s.status === "Success").length || 0,
    pending: jobDetails.servers?.filter(s => s.status === "Pending").length || 0,
    failure: jobDetails.servers?.filter(s => s.status === "Failure").length || 0,
    inProgress: jobDetails.servers?.filter(s => s.status === "In Progress").length || 0,
  };

  const totalServers = jobDetails.servers?.length || 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        padding: "12px",
      }}
    >
      {/* ===== TOP HEADER SECTION ===== */}
      <Box sx={{ marginBottom: "8px" }}>
        {/* Line 1: Job ID + Status Badge */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "6px",
          }}
        >
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#2563EB",
            }}
          >
            JOB ID : {jobDetails.jobId}
          </Typography>
          <Chip
            label={jobDetails.status}
            sx={{
              height: "20px",
              fontSize: "11px",
              fontWeight: 600,
              padding: "0 8px",
              ...getStatusBadgeStyle(jobDetails.status),
              "& .MuiChip-label": {
                padding: "0",
              },
            }}
          />
        </Box>

        {/* Line 2: Metadata Row */}
        <Box
          sx={{
            display: "flex",
            gap: "0",
            alignItems: "flex-start",
            paddingBottom: "6px",
            borderBottom: "1px solid #E0E3E7",
            justifyContent: "space-between",
          }}
        >
          {/* Type */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#6B7280",
                fontWeight: 500,
              }}
            >
              Type
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#111827",
                fontWeight: 600,
              }}
            >
              {jobDetails.type}
            </Typography>
          </Box>

          {/* User */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#6B7280",
                fontWeight: 500,
              }}
            >
              User
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#111827",
                fontWeight: 600,
              }}
            >
              {jobDetails.user}
            </Typography>
          </Box>

          {/* Created At */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
            <Typography
              sx={{
                fontSize: "11px",
                color: "#6B7280",
                fontWeight: 500,
              }}
            >
              Created At
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#111827",
                fontWeight: 600,
              }}
            >
              {formatDateTime(jobDetails.createdAt)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ===== SUMMARY CARDS ROW ===== */}
      <Box
        sx={{
          display: "flex",
          gap: "12px",
          marginBottom: "12px",
          marginTop: "8px",
          overflow: "visible",
          paddingY: "6px",
          justifyContent: "space-between",
        }}
      >
        {/* Total Card */}
        <Box
          onClick={() => setSelectedStatusFilter(null)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "36px",
            padding: "0 12px",
            borderRadius: "999px",
            border: "1px solid #E0E3E7",
            backgroundColor: "#F0F4FF",
            whiteSpace: "nowrap",
            flex: 1,
            justifyContent: "flex-start",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <Box
            sx={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: getIndicatorDotColor("total"),
            }}
          />
          <Typography sx={{ fontSize: "12px", color: "#374151", fontWeight: 500 }}>Total Servers</Typography>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#2563EB",
            }}
          >
            {String(totalServers).padStart(2, "0")}
          </Typography>
        </Box>

        {/* Success Card */}
        <Box
          onClick={() => setSelectedStatusFilter("Success")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "36px",
            padding: "0 12px",
            borderRadius: "999px",
            border: "1px solid #E0E3E7",
            backgroundColor: "#F0FDF4",
            whiteSpace: "nowrap",
            flex: 1,
            justifyContent: "flex-start",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <Box
            sx={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: getIndicatorDotColor("success"),
            }}
          />
          <Typography sx={{ fontSize: "12px", color: "#047857", fontWeight: 600 }}>Success</Typography>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#10B981",
            }}
          >
            {String(statusCounts.success).padStart(2, "0")}
          </Typography>
        </Box>

        {/* Pending Card */}
        <Box
          onClick={() => setSelectedStatusFilter("Pending")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "36px",
            padding: "0 12px",
            borderRadius: "999px",
            border: "1px solid #E0E3E7",
            backgroundColor: "#FFFBEB",
            whiteSpace: "nowrap",
            flex: 1,
            justifyContent: "flex-start",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <Box
            sx={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: getIndicatorDotColor("pending"),
            }}
          />
          <Typography sx={{ fontSize: "12px", color: "#92400E", fontWeight: 600 }}>Pending</Typography>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#F59E0B",
            }}
          >
            {String(statusCounts.pending).padStart(2, "0")}
          </Typography>
        </Box>

        {/* Failure Card */}
        <Box
          onClick={() => setSelectedStatusFilter("Failure")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "36px",
            padding: "0 12px",
            borderRadius: "999px",
            border: "1px solid #E0E3E7",
            backgroundColor: "#FEF2F2",
            whiteSpace: "nowrap",
            flex: 1,
            justifyContent: "flex-start",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <Box
            sx={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: getIndicatorDotColor("failure"),
            }}
          />
          <Typography sx={{ fontSize: "12px", color: "#991B1B", fontWeight: 600 }}>Failure</Typography>
          <Typography
            sx={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#EF4444",
            }}
          >
            {String(statusCounts.failure).padStart(2, "0")}
          </Typography>
        </Box>
      </Box>

      {/* ===== SEARCH BAR ===== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "6px",
        }}
      >
        <TextField
          placeholder="Search servers..."
          size="small"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9CA3AF", fontSize: "16px" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "180px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "999px",
              fontSize: "12px",
              height: "30px",
              backgroundColor: "#FFFFFF",
              padding: "2px 8px",
              "& fieldset": {
                borderColor: "#E0E3E7",
              },
              "&:hover fieldset": {
                borderColor: "#E0E3E7",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3B82F6",
              },
            },
            "& .MuiOutlinedInput-input": {
              padding: "4px 6px",
            },
            "& .MuiOutlinedInput-input::placeholder": {
              color: "#9CA3AF",
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* ===== TABLE HEADER SECTION ===== */}
      <Box
        sx={{
          display: "table",
          width: "100%",
          backgroundColor: "#F3F4F6",
          borderRadius: "12px 12px 0 0",
          marginBottom: "0px",
          border: "1px solid #E0E3E7",
          borderBottom: "none",
          tableLayout: "fixed",
        }}
      >
        <Box
          sx={{
            display: "table-row",
          }}
        >
          <Box
            sx={{
              display: "table-cell",
              padding: "8px 10px",
              verticalAlign: "middle",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                color: "#111827",
                fontWeight: 700,
              }}
            >
              Server Name
            </Typography>
          </Box>
          <Box
            sx={{
              display: "table-cell",
              padding: "8px 10px",
              textAlign: "left",
              verticalAlign: "middle",
              width: "120px",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                color: "#111827",
                fontWeight: 700,
              }}
            >
              Status
            </Typography>
          </Box>
          <Box
            sx={{
              display: "table-cell",
              padding: "8px 10px",
              verticalAlign: "middle",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                color: "#111827",
                fontWeight: 700,
              }}
            >
              Message
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ===== TABLE CONTAINER ===== */}
      <TableContainer
        sx={{
          flex: 1,
          overflow: "auto",
          borderRadius: "0 0 12px 12px",
          border: "1px solid #E0E3E7",
          borderTop: "none",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Table size="small" sx={{ tableLayout: "fixed" }}>
          {/* TABLE BODY */}
          <TableBody>
            {filteredServers.length > 0 ? (
              filteredServers.map((server: ServerSyncStatus, index: number) => (
                <TableRow
                  key={`${server.serverId}-${index}`}
                  sx={{
                    height: "38px",
                    "&:hover": {
                      backgroundColor: "#F9FAFB",
                    },
                    "&:not(:last-child)": {
                      borderBottom: "1px solid #E0E3E7",
                    },
                  }}
                >
                  {/* Server Name */}
                  <TableCell
                    sx={{
                      fontSize: "12px",
                      color: "#2563EB",
                      fontWeight: 500,
                      padding: "8px 10px",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {server.serverName}
                  </TableCell>

                  {/* Status */}
                  <TableCell
                    sx={{
                      padding: "8px 10px",
                      width: "120px",
                      minWidth: "120px",
                      textAlign: "left",
                    }}
                  >
                    <Chip
                      label={server.status}
                      size="small"
                      sx={{
                        height: "20px",
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "0 8px",
                        ...getServerStatusStyle(server.status),
                        "& .MuiChip-label": {
                          padding: "0",
                        },
                      }}
                    />
                  </TableCell>

                  {/* Message */}
                  <TableCell
                    sx={{
                      fontSize: "12px",
                      color: "#6B7280",
                      padding: "8px 10px",
                      maxWidth: "300px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={server.message}
                  >
                    {server.message}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  sx={{
                    textAlign: "center",
                    padding: "12px 10px",
                    color: "#9CA3AF",
                    fontSize: "12px",
                  }}
                >
                  {searchText ? "No servers found" : "No servers available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RightPanel;
