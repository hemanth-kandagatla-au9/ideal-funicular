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
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');


  const filteredServers = useMemo(() => {
    if (!jobDetails?.servers) return [];
    let servers = jobDetails.servers.filter(server => server.serverName.toLowerCase().includes(searchText.toLowerCase()));

    // Apply status filter if a status is selected
    if (selectedStatusFilter && selectedStatusFilter !== 'ALL') {
      if (selectedStatusFilter === "Failure") {
        servers = servers.filter(server => server.status === "Failure" || server.status === "Failed");
      } else if (selectedStatusFilter === "InProgress") {
        servers = servers.filter(server => server.status === "In Progress" || server.status === "InProgress");
      } else {
        servers = servers.filter(server => server.status === selectedStatusFilter);
      }
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
        <CircularProgress size={40} sx={{ color: "#2961F4" }} />
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

  // Use serverSummary from API directly (pre-aggregated, avoids "Failed" vs "Failure" mismatch)
  const { serverSummary } = jobDetails as any;
  const statusCounts = {
    success: serverSummary?.success ?? jobDetails.servers?.filter((s: any) => s.status === "Success").length ?? 0,
    pending: serverSummary?.pending ?? jobDetails.servers?.filter((s: any) => s.status === "Pending").length ?? 0,
    failure: serverSummary?.failure ?? jobDetails.servers?.filter((s: any) => s.status === "Failure" || s.status === "Failed").length ?? 0,
    inProgress: serverSummary?.inProgress ?? jobDetails.servers?.filter((s: any) => s.status === "In Progress" || s.status === "InProgress").length ?? 0,
  };

  const totalServers = serverSummary?.total ?? jobDetails.servers?.length ?? 0;

  const handleCardClick = (filter: string) => {
    setSelectedStatusFilter(filter);
  };

  const getSelectedStyles = (type: string, isSelected: boolean) => {
    const accent: Record<string, string> = {
      ALL: 'rgba(37,99,235,0.25)',
      Success: 'rgba(16,185,129,0.25)',
      Pending: 'rgba(245,158,11,0.18)',
      Failure: 'rgba(239,68,68,0.18)',
    };
    const bg: Record<string, string> = {
      ALL: '#EBF4FF',
      Success: '#ECFDF3',
      Pending: '#FFFBEB',
      Failure: '#FEF2F2',
    };

    return isSelected
      ? {
          backgroundColor: bg[type as keyof typeof bg] || '#F3F4F6',
          borderBottom: `3px solid ${accent[type as keyof typeof accent] || 'rgba(224,227,231,1)'}`,
          transition: 'background-color 0.15s ease, border-bottom 0.15s ease',
        }
      : {};
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        padding: "12px",
        fontFamily:"Johnson Text"
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
              fontSize: "20px",
              fontWeight: 500,
              color: "#2961F4",
              fontFamily:"Johnson Text"
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
              fontFamily:"Johnson Text",
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
                fontSize: "14px",
                color: "#05060F99",
                fontWeight: 400,
                fontFamily:"Johnson Text"
              }}
            >
              Type
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#05060F",
                fontWeight: 500,
                fontFamily:"Johnson Text"
              }}
            >
              {jobDetails.type}
            </Typography>
          </Box>

          {/* User */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#05060F99",
                fontWeight: 400,
                fontFamily:"Johnson Text"
              }}
            >
              User
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#05060F",
                fontWeight: 500,
                fontFamily:"Johnson Text"
              }}
            >
              {jobDetails.user}
            </Typography>
          </Box>

          {/* Created At */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#05060F99",
                fontWeight: 400,
              }}
            >
              Created At
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#05060F",
                fontWeight: 500,
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
          fontFamily:"Johnson Text"
        }}
      >
        {/* Total Card */}
        <Box
          onClick={() => handleCardClick('ALL')}
          sx={{
            margin: "6px",
            padding: "12px",
            background: "#FFFFFF",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "40px",
            border: "1px solid #E0E3E7",
            whiteSpace: "nowrap",
            flex: 1,
            justifyContent: "space-evenly",
            cursor: "pointer",
            transition: "all 0.2s ease",
            ...getSelectedStyles('ALL', selectedStatusFilter === 'ALL'),
          }}
        >
          <Typography sx={{ fontSize: "16px", color: "#2961F4", fontWeight: 700,fontFamily:"Johnson Text" }}>Total Servers</Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#2F3A4C",
              background: "#f0f0f0",
              borderradius: "16px",
              padding: "4px",
            }}
          >
            {String(totalServers).padStart(2, "0")}
          </Typography>
        </Box>

        {/* Success Card */}
        <Box
          onClick={() => handleCardClick("Success")}
          sx={{
            margin: "6px",
            padding: "12px",
            background: "#FFFFFF",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "40px",
            border: "1px solid #E0E3E7",
            whiteSpace: "nowrap",
            flex: 1,
            justifyContent: "space-evenly",
            cursor: "pointer",
            transition: "all 0.2s ease",
            ...getSelectedStyles('ALL', selectedStatusFilter === 'Success'),
          }}
        >
          <Typography sx={{ fontSize: "16px", color: "#328714", fontWeight: 700,fontFamily:"Johnson Text" }}>Success</Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#2F3A4C",
              background: "#f0f0f0",
              borderradius: "16px",
              padding: "4px",
            }}
          >
            {String(statusCounts.success).padStart(2, "0")}
          </Typography>
        </Box>

        {/* Pending Card */}
        <Box
          onClick={() => handleCardClick("Pending")}
          sx={{
            margin: "6px",
            padding: "12px",
            background: "#FFFFFF",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "40px",
            border: "1px solid #E0E3E7",
            whiteSpace: "nowrap",
            flex: 1,
            justifyContent: "space-evenly",
            cursor: "pointer",
            transition: "all 0.2s ease",
            ...getSelectedStyles('ALL', selectedStatusFilter === 'Pending'),
          }}
        >
          <Typography sx={{ fontSize: "16px", color: "#FFB712", fontWeight: 700,fontFamily:"Johnson Text" }}>Pending</Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#2F3A4C",
              background: "#f0f0f0",
              borderradius: "16px",
              padding: "4px",
            }}
          >
            {String(statusCounts.pending).padStart(2, "0")}
          </Typography>
        </Box>

        {/* Failure Card */}
        <Box
          onClick={() => handleCardClick("Failure")}
          sx={{
            margin: "6px",
            padding: "12px",
            background: "#FFFFFF",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "40px",
            border: "1px solid #E0E3E7",
            whiteSpace: "nowrap",
            flex: 1,
            justifyContent: "space-evenly",
            cursor: "pointer",
            transition: "all 0.2s ease",
            ...getSelectedStyles('ALL', selectedStatusFilter === 'Failure'),
          }}
        >
          <Typography sx={{ fontSize: "16px", color: "#DB1500", fontWeight: 700,fontFamily:"Johnson Text" }}>Failure</Typography>
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              color: "#2F3A4C",
              background: "#f0f0f0",
              borderradius: "16px",
              padding: "4px",
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
          fontFamily:"Johnson Text"
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
                      fontSize: "13px",
                      color: "#102459",
                      fontWeight: 600,
                      padding: "8px 10px",
                      cursor: "pointer",
                      fontFamily:"Johnson Text"
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
                        fontSize: "12px",
                        fontWeight: 500,
                        padding: "0 8px",
                        borderRadius:"6px",
                        ...getServerStatusStyle(server.status),
                        "& .MuiChip-label": {
                          padding: "0",
                        },
                         fontFamily:"Johnson Text"
                      }}
                    />
                  </TableCell>

                  {/* Message */}
                  <TableCell
                    sx={{
                      fontSize: "14px",
                      color: "#37383F",
                      padding: "8px 10px",
                      maxWidth: "300px",
                      fontWeight: 400,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontFamily:"Johnson Text"
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
