import { GridColDef } from "@mui/x-data-grid";
import { Box, Typography, IconButton } from "@mui/material";
import { Edit as EditIcon, Visibility as VisibilityIcon } from "@mui/icons-material";
import gitBranch from "../../../../images/agent-management/assets/gitBranch.svg";
import linux from "../../../../images/agent-management/assets/linux.svg";
import windows from "../../../../images/agent-management/assets/windows.svg";

import { BinaryVersion } from "./binarytypes";

interface OSCompatibility {
  agentType?: string;
  osVersion?: string;
}
const getVersionLabel = (version: string) => {
  if (version.includes("beta")) return "Beta";
  if (version === "v2.1.3") return "Latest";
  if (version === "v2.1.2") return "Previous";
  return "";
};
interface BinaryVersionsColumnsProps {
  onView?: (version: BinaryVersion) => void;
  onEdit?: (version: BinaryVersion) => void;
}

const BinaryVersionsColumns = ({ onView, onEdit }: BinaryVersionsColumnsProps): GridColDef[] => {
  return [
    {
      field: "version",
      headerName: "VERSION",
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <Box
            sx={{
              width: "33px",
              height: "33px",
              borderRadius: "8px",
              bgcolor: "#B9B9B9",
              mr: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={gitBranch} style={{ color: "#FFF", fontSize: "14px" }} alt="gitBranch" />
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography
              fontWeight={600}
              sx={{
                fontFamily: "Johnson Text",
                fontSize: "16px",
                color: "#475569",
                lineHeight: 1.2,
              }}
            >
              {row.version}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Johnson Text",
                fontSize: "14px",
                fontWeight: 600,
                color: "#64748B",
                lineHeight: 1.2,
                mt: 0.5,
              }}
            >
              {getVersionLabel(row.version)}
            </Typography>
          </Box>
        </Box>
      ),
      headerClassName: "data-grid-header",
    },
    {
      field: "osCompatibility",
      headerName: "OS COMPATIBILITY",
      flex: 1.2,
      sortable: false,
      renderCell: ({ row }) => (
        <Box
          display="flex"
          flexDirection="row"
          gap={1}
          alignItems="center"
          sx={{
            maxWidth: "100%",
            flexWrap: "wrap",
            py: 0.5,
          }}
        >
          {Array.isArray(row.osCompatibility) &&
            row.osCompatibility.map((os: OSCompatibility | string, index: number) => {
              let agentType = "";
              let osVersion = "";

              if (typeof os === "string") {
                agentType = os.split(" ")[0] || "";
                osVersion = os.split(" ")[1] || "";
              } else {
                agentType = os?.agentType || "";
                osVersion = os?.osVersion || "";
              }

              if (!agentType) return null;

              let icon;
              const lowerAgentType = agentType.toLowerCase();
              if (lowerAgentType.includes("windows")) {
                icon = <img src={windows} alt="Windows" style={{ width: 20, height: 20, marginRight: 4 }} />;
              } else if (lowerAgentType.includes("linux")) {
                icon = <img src={linux} alt="Linux" style={{ width: 20, height: 20, marginRight: 4 }} />;
              }

              return (
                <Box
                  key={`${agentType}-${osVersion}-${index}`}
                  display="flex"
                  alignItems="center"
                  sx={{
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {icon}
                  <Typography
                    sx={{
                      fontFamily: "Johnson text",
                      fontSize: "14px",
                      color: "#475569",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {`${agentType} ${osVersion}`}
                  </Typography>
                </Box>
              );
            })}
        </Box>
      ),
      headerClassName: "data-grid-header",
    },
    {
      field: "upgradeType",
      headerName: "UPGRADE TYPE",
      flex: 1,
      renderCell: ({ value }) => (
        <Box
          sx={{
            fontFamily: "Johnson Text",
            fontSize: "14px",
            fontWeight: 500,
            color: value === "Mandatory" ? "#EB1700" : "#CA8A04",
            backgroundColor: value === "Mandatory" ? "#FEF2F2" : "#FEFCE8",
            px: 1.5,
            py: 0.5,
            borderRadius: "20px",
            display: "inline-block",
          }}
        >
          {value}
        </Box>
      ),
      headerClassName: "data-grid-header",
    },
    {
      field: "buildDate",
      headerName: "BUILD DATE",
      flex: 1,
      sortable: true,
      sortComparator: (v1, v2) => {
        if (v1 === "N/A" && v2 === "N/A") return 0;
        if (v1 === "N/A") return 1;
        if (v2 === "N/A") return -1;
        const date1 = new Date(v1).getTime();
        const date2 = new Date(v2).getTime();
        return date1 - date2;
      },
      renderCell: ({ row }) => (
        <Typography
          sx={{
            fontSize: "14px",
            fontFamily: "Johnson text",
            color: "#475569",
          }}
        >
          {row.buildDateDisplay}
        </Typography>
      ),
      headerClassName: "data-grid-header",
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      flex: 1,
      sortable: false,
      renderCell: ({ row }) => (
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              "&:hover": {
                bgcolor: "#F1F5F9",
              },
            }}
            onClick={() => onView?.(row)}
            title="View version details"
          >
            <VisibilityIcon sx={{ fontSize: "16px", color: "#64748B" }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              bgcolor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              "&:hover": {
                bgcolor: "#F1F5F9",
              },
            }}
            onClick={() => onEdit?.(row)}
            title="Edit version"
          >
            <EditIcon sx={{ fontSize: "16px", color: "#64748B" }} />
          </IconButton>
        </Box>
      ),
      headerClassName: "data-grid-header",
    },
  ];
};

export default BinaryVersionsColumns;
