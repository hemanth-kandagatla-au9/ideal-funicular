/* eslint-disable import/namespace */
import React from "react";
import { Box, Typography } from "@mui/material";

interface ServerIndicator {
  color: "success" | "pending" | "failed";
  count: number;
}

interface JobCardProps {
  jobId: string;
  type: string;
  status: "Completed" | "Partial" | "Failed" | "InProgress";
  totalServers: number;
  serverIndicators: ServerIndicator[];
  isActive?: boolean;
  onClick?: () => void;
}

const getStatusStyles = (status: JobCardProps["status"]) => {
  const statusConfig = {
    Completed: {
      backgroundColor: "#E6F4EA",
      color: "#2E7D32",
    },
    Partial: {
      backgroundColor: "#E8F0FE",
      color: "#1976D2",
    },
    Failed: {
      backgroundColor: "#FDECEA",
      color: "#D32F2F",
    },
    InProgress: {
      backgroundColor: "#FFF4E6",
      color: "#F57C00",
    },
  };
  return statusConfig[status] || {
    backgroundColor: "#F5F5F5",
    color: "#616161",
  };
};

const getIndicatorColor = (type: "success" | "pending" | "failed") => {
  const colors = {
    success: "#10B981",
    pending: "#F59E0B",
    failed: "#EF4444",
  };
  return colors[type];
};

const JobCard: React.FC<JobCardProps> = ({ jobId, type, status, totalServers, serverIndicators, isActive = false, onClick }) => {
  const statusStyles = getStatusStyles(status);

  return (
    <Box
      onClick={onClick}
      sx={{
        width: "100%",
        padding: "14px",
        borderRadius: "16px",
        border: isActive ? "1px solid #2961F4" : "1px solid #E2E8F0",
        backgroundColor: isActive ? "#f7f4f4" : "#FFFFFF",
        marginBottom: "2px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isActive ? "0px 4px 4px rgba(41, 97, 244, 0.20)" : "none",
        "&:hover": {
          backgroundColor: isActive ? "#FFFFFF" : "#F9FAFB",
          borderColor: isActive ? "#2961F4" : "#D1D5DB",
        },
      }}
    >
      {/* ===== LEFT SECTION: JOB INFO ===== */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
          flex: 0.5,
          minWidth: 0,
          paddingRight: "12px",
        }}
      >
        {/* Job ID */}
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#334155",
            lineHeight: "20px",
            fontFamily: "Johnson Text",
            wordBreak: "break-all",
          }}
        >
          {jobId}
        </Typography>

        {/* Job Type */}
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#334155",
            marginTop: "4px",
            lineHeight: "20px",
            fontFamily: "Johnson Text",
          }}
        >
          {type}
        </Typography>
      </Box>

      {/* ===== CENTER SECTION: STATUS ===== */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          flex: 0.3,
          paddingRight: "12px",
        }}
      >
        <Box
          sx={{
            height: "22px",
            padding: "4px 8px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: statusStyles.backgroundColor,
            color: statusStyles.color,
            whiteSpace: "nowrap",
            width: "90px",
          }}
        >
          {status}
        </Box>
      </Box>

      {/* ===== RIGHT SECTION: SERVERS INFO ===== */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "2px",
          flex: 0.2,
        }}
      >
        {/* Total Servers */}
        <Typography
          sx={{
            fontSize: "11px",
            color: "#6B7280",
            lineHeight: 1.2,
          }}
        >
          {totalServers} Servers
        </Typography>

        {/* Server Indicators Row */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "6px",
          }}
        >
          {serverIndicators.map((indicator, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px",
              }}
            >
              {/* Dot */}
              <Box
                sx={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: getIndicatorColor(indicator.color),
                  flexShrink: 0,
                }}
              />
              {/* Count */}
              <Typography
                sx={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#374151",
                  lineHeight: 1,
                }}
              >
                {indicator.count}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default JobCard;
