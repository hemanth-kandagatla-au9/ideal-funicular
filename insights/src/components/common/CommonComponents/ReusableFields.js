import React from "react";
import { Box, Chip, Typography, Grid, Tooltip } from "@mui/material";
import { getRandomColor } from "../../../utils/CommonUtils";
import "./common.css";
import { UI_TEXTS } from "../Constants/label-contants";
import { ToggleButton } from "@mui/material"; // or your ToggleButton import
import { TbFileTypeSql } from "react-icons/tb";
import {
  FaPython,
  FaTerminal,
  FaPhp,
  FaCogs,
  FaDatabase,
} from "react-icons/fa";
import { DiJavascript1, DiRuby } from "react-icons/di";
import { BsFileEarmarkCodeFill } from "react-icons/bs";
import { PiFileSql } from "react-icons/pi";
import { VscTerminalPowershell } from "react-icons/vsc";
import { AiOutlinePython } from "react-icons/ai";
import { RiJavascriptLine } from "react-icons/ri";
import { AiOutlineFileDone } from "react-icons/ai";
import { CiDatabase } from "react-icons/ci";
import { HiOutlineServerStack } from "react-icons/hi2";
import { SiDatabricks } from "react-icons/si";
import { CiServer } from "react-icons/ci";
import { VscServer } from "react-icons/vsc";
import { GoRuby } from "react-icons/go";
import { TfiServer } from "react-icons/tfi";
import "../../../layouts/Marketplace/marketplace.css";
import {
  AlignBottom,
  Barcode,
  Bill,
  CardEdit,
  ChartSquare,
  Command,
  CommandSquare,
  Data,
  Direct,
  Discover,
  HierarchySquare,
  Repeat,
} from "iconsax-react";
import { AiOutlineAppstore } from "react-icons/ai";
import { RiShieldCheckLine } from "react-icons/ri";
import { HiOutlineCog } from "react-icons/hi";
import { FiDollarSign, FiSave } from "react-icons/fi";
import { GoChecklist } from "react-icons/go";
import { TbChartBar } from "react-icons/tb";
import { BiData } from "react-icons/bi";
import classes from "../../planning/css/tasklist.module.css";
// Security alternatives
import { MdSecurity } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";
import { AiOutlineSecurityScan } from "react-icons/ai";
import { TbReportSearch } from "react-icons/tb";
import { VscFileSubmodule } from "react-icons/vsc";
import { PiFilesLight } from "react-icons/pi";
import { PiComputerTowerLight } from "react-icons/pi";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";
import { GiChart } from "react-icons/gi";
import { BsFolder2 } from "react-icons/bs";
import { BsCommand } from "react-icons/bs";
import { GiProcessor } from "react-icons/gi";
import { VscServerProcess } from "react-icons/vsc";
import { AiOutlineDollar } from "react-icons/ai";
import { FaMoneyBillWave } from "react-icons/fa";
import { BsClipboardCheck } from "react-icons/bs";
import { MdAssignmentTurnedIn } from "react-icons/md";
import { AiOutlineLineChart } from "react-icons/ai";
import { TbChartLine } from "react-icons/tb";
export const StatusCard = ({
  title,
  count,
  color,
  icon,
  onClick,
  tooltip,
  active,
}) => (
  <div
    className="custom_card"
    style={{
      backgroundColor: `${color}30`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      transition: "all 0.2s ease",
      "&:hover": {
        transform: "scale(1.02)",
      },
      border: active ? `2px solid ${color}` : "none",
    }}
    onClick={onClick}
    title={tooltip}
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: "0.8rem",
          fontWeight: "bold",
          color: "#333",
          display: "flex",
          fontFamily: "Manrope",
          gap: "8px",
        }}
      >
        <span
          style={{
            color: color,
          }}
        >
          {" "}
          {icon}
        </span>
        <span>{title}</span>
        <span>{count}</span>
      </div>
    </div>
  </div>
);

export const JobSummary = ({ jobData, openSearchJobData, allRunIds = [] }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#F8FAFC",
        borderRadius: "8px",
        padding: "8px",
        border: "1px solid #E2E8F0",
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={4} sm={6} md={4}>
          <Typography className="job-summery-accordion-label">
            {UI_TEXTS.LABELS.SCHEDULE_TITLE} :{" "}
            <span className="job-summery-accordion-value">
              {" "}
              {openSearchJobData?.jobDescription || "-"}
            </span>
          </Typography>
        </Grid>

        <Grid item xs={4} sm={6} md={4}>
          <Typography className="job-summery-accordion-label">
            {UI_TEXTS.LABELS.SCHEDULE_CATEGORY} :{" "}
            <span className="job-summery-accordion-value">
              {" "}
              {openSearchJobData?.categoryName || "-"}
            </span>
          </Typography>
        </Grid>

        <Grid item xs={4} sm={6} md={4}>
          <Typography className="job-summery-accordion-label">
            {UI_TEXTS.LABELS.SCHEDULE_TYPE}:
            <span className="job-summery-accordion-value">
              {" "}
              {openSearchJobData?.scheduleType || "-"}
            </span>
          </Typography>
        </Grid>

        <Grid item xs={4} sm={6} md={4}>
          <Typography className="job-summery-accordion-label">
            {UI_TEXTS.LABELS.FREQUENCY} :{" "}
            <span className="job-summery-accordion-value">
              {" "}
              {openSearchJobData?.frequency || "-"}
            </span>
          </Typography>
        </Grid>
        <Grid item xs={4} sm={6} md={4}>
          <Typography className="job-summery-accordion-label">
            Type :{" "}
            <span className="job-summery-accordion-value">
              {" "}
              {openSearchJobData?.categoryType || "-"}
            </span>
          </Typography>
        </Grid>

        {/* <Grid item xs={4} sm={6} md={4}>
          <Typography
            className="job-summery-accordion-label"
            sx={{ display: "flex" }}
          >
            {UI_TEXTS.TABLE_TEXTS.TAGS} :{" "}
            <Box
              sx={{
                display: "flex",
                flexWrap: "nowrap",
                gap: "6px",
                overflow: "hidden",
              }}
            >
              {openSearchJobData?.jobTags?.length > 0 ? (
                <>
                  {openSearchJobData.jobTags.slice(0, 3).map((tag, index) => {
                    const { background, color } = getRandomColor(tag);

                    return (
                      <Tooltip key={index} title={tag}>
                        <Box
                          sx={{
                            backgroundColor: background,
                            color: color,
                            maxWidth: "90px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "inline-block",
                            padding: "6px 10px",
                            borderRadius: "16px",
                            fontSize: "13px",
                            fontWeight: 600,
                            marginRight: "6px",
                          }}
                        >
                          {tag}
                        </Box>
                      </Tooltip>
                    );
                  })}

                  {openSearchJobData.jobTags.length > 3 && (
                    <Tooltip
                      title={openSearchJobData.jobTags.slice(3).join(", ")}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#ddd",
                          color: "#000",
                          padding: "4px 8px",
                          borderRadius: "16px",
                          fontSize: "13px",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}
                      >
                        +{openSearchJobData.jobTags.length - 3}
                      </Box>
                    </Tooltip>
                  )}
                </>
              ) : (
                <span className="job-summery-accordion-value">{"-"}</span>
              )}
            </Box>
          </Typography>
        </Grid> */}

        <Grid item xs={4} sm={6} md={4}>
          <Typography className="job-summery-accordion-label">
            {openSearchJobData.scheduleType === "AD_HOC"
              ? "Run By : "
              : "Scheduled By : "}{" "}
            <span className="job-summery-accordion-value">
              {openSearchJobData?.username || "-"}
            </span>
          </Typography>
        </Grid>

        <Grid item xs={4} sm={6} md={4}>
          <Typography className="job-summery-accordion-label">
            {"Execution Count : "}{" "}
            <span className="job-summery-accordion-value">
              {`${allRunIds.length}`}
            </span>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export const LanguageToggleButtons = () => {
  return (
    <>
      <ToggleButton value="powershell" className="lang-toggle-button">
        <PiFileSql className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="python" className="lang-toggle-button">
        <AiOutlinePython className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="bash" className="lang-toggle-button">
        <VscTerminalPowershell className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="nodejs" className="lang-toggle-button">
        <RiJavascriptLine className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="batch" className="lang-toggle-button">
        <AiOutlineFileDone className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="datasave" className="lang-toggle-button">
        <TfiServer className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="php" className="lang-toggle-button">
        <Command className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="data" className="lang-toggle-button">
        <Data className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="server" className="lang-toggle-button">
        <CiServer className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="cmdsq" className="lang-toggle-button">
        <CommandSquare className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="ansible" className="lang-toggle-button">
        <SiDatabricks className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="terraform" className="lang-toggle-button">
        <GoRuby className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="cibase" className="lang-toggle-button">
        <HiOutlineServerStack className="lang-icon" />
      </ToggleButton>
    </>
  );
};

// Skeleton Loader Components
export const TaskListTableSkeleton = () => {
  return (
    <div className={classes.skeletonContainer}>
      <div className={classes.skeletonTable}>
        {[...Array(10)].map((_, index) => (
          <div key={index} className={classes.skeletonRow}>
            <div className={classes.skeletonCell}></div>
            <div className={classes.skeletonCell}></div>
            <div className={classes.skeletonCell}></div>
            <div className={classes.skeletonCell}></div>
            <div className={classes.skeletonCell}></div>
            <div className={classes.skeletonCell}></div>
            <div className={classes.skeletonCell}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TagCardsSkeleton = () => {
  return (
    <div className={classes.tagCardsSkeleton}>
      {[...Array(6)].map((_, index) => (
        <div key={index} className={classes.tagCardSkeletonItem}>
          <div className={classes.tagCardSkeletonHeader}></div>
          <div className={classes.tagCardSkeletonContent}></div>
          <div className={classes.tagCardSkeletonContent}></div>
          <div className={classes.tagCardSkeletonContent}></div>
        </div>
      ))}
    </div>
  );
};

export const FilterHeaderSkeleton = () => {
  return (
    <div className={classes.skeletonHeader}>
      <div className={classes.skeletonDirection}>
        <div className={classes.skeletonSearch}></div>
        <div className={classes.skeletonSearch1}></div>
      </div>
      <div className={classes.skeletonDirection}>
        <div className={classes.skeletonButton}></div>
        <div className={classes.skeletonButton}></div>
        <div className={classes.skeletonButton}></div>
        <div className={classes.skeletonButton}></div>
        <div className={classes.skeletonButton}></div>
      </div>
    </div>
  );
};

export const ReportsCategoryToggleButtons = () => {
  return (
    <>
      <ToggleButton value="all" className="lang-toggle-button">
        <AiOutlineAppstore className="lang-icon" />
      </ToggleButton>
      <ToggleButton
        value="ioshieldcheckmarkoutline"
        className="lang-toggle-button"
      >
        <IoShieldCheckmarkOutline className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="iosettingsoutline" className="lang-toggle-button">
        <IoSettingsOutline className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="compliance" className="lang-toggle-button">
        <GoChecklist className="lang-icon" />
      </ToggleButton>
      <ToggleButton
        value="hioutlinedocumentchartbar"
        className="lang-toggle-button"
      >
        <HiOutlineDocumentChartBar className="lang-icon" />
      </ToggleButton>
      {/* <ToggleButton value="gichart" className="lang-toggle-button">
        <GiChart className="lang-icon" />
      </ToggleButton> */}
      <ToggleButton value="bsfolder2" className="lang-toggle-button">
        <BsFolder2 className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="vscfilesubmodule" className="lang-toggle-button">
        <VscFileSubmodule className="lang-icon" />
      </ToggleButton>
      <ToggleButton
        value="aioutlinesecurityscan"
        className="lang-toggle-button"
      >
        {" "}
        {/* Changed to lowercase */}
        <AiOutlineSecurityScan className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="bscommand" className="lang-toggle-button">
        <BsCommand className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="repeat" className="lang-toggle-button">
        <Repeat className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="bsclipboardcheck" className="lang-toggle-button">
        <BsClipboardCheck className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="aioutlinelinechart" className="lang-toggle-button">
        <AiOutlineLineChart className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="tbchartline" className="lang-toggle-button">
        <TbChartLine className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="pifileslight" className="lang-toggle-button">
        <PiFilesLight className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="picomputertowerlight" className="lang-toggle-button">
        <PiComputerTowerLight className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="alignBottom" className="lang-toggle-button">
        <AlignBottom className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="bill" className="lang-toggle-button">
        <Bill className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="chartSquare" className="lang-toggle-button">
        <ChartSquare className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="direct" className="lang-toggle-button">
        <Direct className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="discover" className="lang-toggle-button">
        <Discover className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="barcode" className="lang-toggle-button">
        <Barcode className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="cardEdit" className="lang-toggle-button">
        <CardEdit className="lang-icon" />
      </ToggleButton>
      <ToggleButton value="hierarchySquare" className="lang-toggle-button">
        <HierarchySquare className="lang-icon" />
      </ToggleButton>
    </>
  );
};
export const statusColorMap = {
  All: { color: "#6c757d", filterType: "all" },
  Active: { color: "#4CAF50", filterType: "active_jobs" },
  Paused: { color: "#BDBDBD", filterType: "paused_jobs" },
  Adhoc: { color: "#906AFF", filterType: "adhoc_job" },
  "Execute One time": { color: "#0243f5", filterType: "execute_one_time" },
  "Pending Approval": { color: "#FF9800", filterType: "pending_approval" },
  Rejected: { color: "rgb(238, 33, 33)", filterType: "rejected_jobs" },
};
