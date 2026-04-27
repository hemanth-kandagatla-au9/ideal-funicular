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
        height: "80px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingX: "54px",
        paddingY: "19px",
        marginBottom: "12px",
        backgroundColor: "white",
        paddingLeft:"1px",
        paddingRight:"8px"
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
            width: "60px",
            height: "60px",
            minWidth: "60px",
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
              width: "20px",
              height: "20px",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Title */}
        <Typography
          sx={{
            fontSize: "36px",
            fontWeight: 500,
            lineHeight: 2,
            marginLeft: "4px",
            background: "linear-gradient(90deg, #2961F4, #6C5CE7, #EB1700)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "Johnson Display",
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
          gap: "8px",
          height: "36px",
          paddingX: "16px",
          paddingY: "10px",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "36px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          fontFamily: "Johnson Text",
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
