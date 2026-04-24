/* eslint-disable import/namespace */
import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface HeaderProps {
  onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExport }) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <Box
      sx={{
        height: "56px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingX: "10px",
        marginBottom: "12px",
        backgroundColor: "white",
      }}
    >
      {/* Left Section: Back Icon + Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {/* Back Icon Button */}
        <IconButton
          onClick={handleBack}
          sx={{
            width: "30px",
            height: "30px",
            minWidth: "30px",
            padding: "0",
            backgroundColor: "#F1F3F5",
            color: "#6B7280",
            border: "none",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "#E5E7EB",
              color: "#4B5563",
            },
            "& svg": {
              width: "16px",
              height: "16px",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Title */}
        <Typography
          sx={{
            fontSize: "21px",
            fontWeight: 700,
            lineHeight: 1.2,
            marginLeft: "4px",
            background: "linear-gradient(90deg, #2563EB, #7C3AED, #EF4444)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "Johnson Display, Inter, sans-serif",
          }}
        >
          Bulk Action Logs
        </Typography>
      </Box>

      {/* Right Section: Export Button */}
      <Box
        component="button"
        onClick={onExport}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          height: "30px",
          paddingX: "12px",
          paddingY: "4px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E0E3E7",
          borderRadius: "999px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          fontFamily: "Johnson Text, Inter, sans-serif",
          fontSize: "13px",
          fontWeight: 500,
          color: "#374151",
          outline: "none",
          "&:hover": {
            backgroundColor: "#F9FAFB",
            borderColor: "#D1D5DB",
          },
          "&:active": {
            backgroundColor: "#F3F4F6",
          },
        }}
      >
        <FileDownloadIcon
          sx={{
            width: "16px",
            height: "16px",
            color: "#374151",
          }}
        />
        <span>Export</span>
      </Box>
    </Box>
  );
};

export default Header;
