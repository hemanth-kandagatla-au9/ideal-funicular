import {
  AlignBottom,
  Barcode,
  Bill,
  CardEdit,
  ChartSquare,
  Direct,
  Discover,
  HierarchySquare,
  Repeat,
  Shop,
} from "iconsax-react";
import { PiFileSql } from "react-icons/pi";
import { VscTerminalPowershell } from "react-icons/vsc";
import { AiOutlinePython } from "react-icons/ai";
import { RiJavascriptLine } from "react-icons/ri";
import { AiOutlineFileDone } from "react-icons/ai";
import { HiOutlineServerStack } from "react-icons/hi2";
import { SiDatabricks } from "react-icons/si";
import { CiServer } from "react-icons/ci";
import { TfiServer } from "react-icons/tfi";
import { GoRuby } from "react-icons/go";
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
import { BsClipboardCheck } from "react-icons/bs";
import { AiOutlineAppstore } from "react-icons/ai";
import { VscServerProcess } from "react-icons/vsc";
import { AiOutlineLineChart } from "react-icons/ai";
import { TbChartLine } from "react-icons/tb";
import { GoChecklist } from "react-icons/go";

import { Command, CommandSquare, Data } from "iconsax-react";

export const colorSets = [
  [
    { background: "#FDF2FA", color: "#C11574" },
    { background: "#FFF6ED", color: "#C4320A" },
    { background: "#EFF8FF", color: "#175CD3" },
    { background: "#F9F5FF", color: "#6941C6" },
  ],
  [
    { background: "#EFF8FF", color: "#175CD3" },
    { background: "#F9F5FF", color: "#6941C6" },
    { background: "#FDF2FA", color: "#C11574" },
    { background: "#FFF6ED", color: "#C4320A" },
  ],
  [
    { background: "#F9F5FF", color: "#6941C6" },
    { background: "#FDF2FA", color: "#C11574" },
    { background: "#FFF6ED", color: "#C4320A" },
    { background: "#EFF8FF", color: "#175CD3" },
  ],
  [
    { background: "#FFF6ED", color: "#C4320A" },
    { background: "#EFF8FF", color: "#175CD3" },
    { background: "#F9F5FF", color: "#6941C6" },
    { background: "#FDF2FA", color: "#C11574" },
  ],
];

export const IconBadge = ({ children }) => {
  return (
    <div
      style={{
        width: "40px",
        height: "40px",
        backgroundColor: "#F4F6FF",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
};

const ICON_MAP = {
  sql: PiFileSql,
  powershell: PiFileSql,
  python: AiOutlinePython,
  bash: VscTerminalPowershell,
  nodejs: RiJavascriptLine,
  javascript: RiJavascriptLine,
  batch: AiOutlineFileDone,
  php: Command,
  cmdsq: CommandSquare,
  data: Data,
  server: CiServer,
  ansible: SiDatabricks,
  terraform: GoRuby,
  cibase: HiOutlineServerStack,
  datasave: TfiServer,
  all: AiOutlineAppstore,
  ioshieldcheckmarkoutline: IoShieldCheckmarkOutline,
  iosettingsoutline: IoSettingsOutline,
  compliance: GoChecklist,
  hioutlinedocumentchartbar: HiOutlineDocumentChartBar,
  gichart: GiChart,
  bsfolder2: BsFolder2,
  vscfilesubmodule: VscFileSubmodule,
  aioutlinesecurityscan: AiOutlineSecurityScan,
  bscommand: BsCommand,
  vscserverprocess: VscServerProcess,
  tbreportsearch: TbReportSearch,
  bsclipboardcheck: BsClipboardCheck,
  aioutlinelinechart: AiOutlineLineChart,
  tbchartline: TbChartLine,
  pifileslight: PiFilesLight,
  picomputertowerlight: PiComputerTowerLight,
  repeat: Repeat,
  alignBottom: AlignBottom,
  bill: Bill,
  chartSquare: ChartSquare,
  direct: Direct,
  discover: Discover,
  barcode: Barcode,
  cardEdit: CardEdit,
  hierarchySquare: HierarchySquare,
  default: Shop,
};

export const getTemplateIcon = (iconName) => {
  const key = iconName?.toLowerCase();
  const Icon = ICON_MAP[key] || ICON_MAP.default;

  return (
    <IconBadge>
      <Icon style={{ color: "#2961f4", height: "20px", width: "20px" }} />
    </IconBadge>
  );
};

const pastelColors = [
  { background: "#FDF2FA", color: "#C11574" },
  { background: "#EFF8FF", color: "#175CD3" },
  { background: "#F9F5FF", color: "#6941C6" },
  { background: "#FFF6ED", color: "#C4320A" },
  { background: "#E0F7FA", color: "#006064" },
  { background: "#F1F8E9", color: "#33691E" },
  { background: "#EDE7F6", color: "#4527A0" },
  { background: "#FFF3E0", color: "#E65100" },
];

export const getRandomColor = (tag) => {
  // Simple hash based on character codes
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % pastelColors.length;
  return pastelColors[index];
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// export const formattedDate = (dateString) => {
//   const date = new Date(dateString);
//   const options = { year: "numeric", month: "short", day: "2-digit" };
//   return date.toLocaleDateString("en-US", options);
// };

export const formattedDate = (dateString) => {
  const date = new Date(dateString);

  const dateOptions = { year: "numeric", month: "short", day: "2-digit" };
  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

  const formattedDate = date.toLocaleDateString("en-US", dateOptions);
  const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

  return `${formattedDate} | ${formattedTime}`;
};

export const getFormattedDate = (timestamp) => {
  if (!timestamp) return "-";

  const date = new Date(Number(timestamp));

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  return `${day}${getOrdinal(day)} ${month} ${year}`;
};

export const formatTimeStamp = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  const formatted = date.toLocaleString("en-US", options);
  return formatted.replace(" at ", ", ");
};

export const ReportHeaderSkeleton = () => (
  <div className="report-header-skeleton">
    <div className="report-skeleton-direction">
      <div className="report-title-skeleton"></div>
      <div className="report-title-skeleton1"></div>
    </div>
    <div className="report-skeleton-direction">
      <div className="report-filter-skeleton report-filter-skeleton1"></div>
      <div className="report-filter-skeleton report-filter-skeleton2"></div>
      <div className="report-filter-skeleton report-filter-skeleton3"></div>
      <div className="report-filter-skeleton report-filter-skeleton4"></div>
    </div>
  </div>
);

export const getEmptyPageSubtitle = (
  searchText,
  categoriesSelected = [],
  tagsSelected = [],
  createdBySelected = [],
  approvalFilter
) => {
  if (searchText?.trim()) {
    return `No templates match your search "${searchText}"`;
  }

  if (categoriesSelected.length > 0) {
    const names = categoriesSelected.map((item) => item.optionName).join(", ");
    return `No templates found in the "${names}" categor${
      categoriesSelected.length > 1 ? "ies" : "y"
    }`;
  }

  if (tagsSelected.length > 0) {
    const names = tagsSelected
      .map((item) => item.optionName || item)
      .join(", ");
    return `No templates found with tag${
      tagsSelected.length > 1 ? "s" : ""
    }: ${names}`;
  }

  if (createdBySelected.length > 0) {
    const names = createdBySelected.map((item) => item.optionName).join(", ");
    return `No templates created by: ${names}`;
  }

  if (approvalFilter && approvalFilter !== "select approval") {
    const approvalText =
      approvalFilter === "approved"
        ? "approved"
        : approvalFilter === "pending"
        ? "pending approval"
        : "rejected";
    return `No ${approvalText} templates found`;
  }

  return "Get started by creating your first template";
};


export const filterOperations = [
  { value: "equal", label: "Equals" },
  { value: "notEqual", label: "Not Equals" },
  { value: "greaterThan", label: "Greater Than" },
  { value: "lessThan", label: "Less Than" },
  { value: "greaterThanEqual", label: "Greater Than or Equal" },
  { value: "lessThanEqual", label: "Less Than or Equal" },
  { value: "contains", label: "Contains" },
  { value: "notContains", label: "Not Contains" },
  { value: "startsWith", label: "Starts With" },
  { value: "endsWith", label: "Ends With" },
  { value: "matchesRegex", label: "Matches Regex" },
  { value: "isTrue", label: "Is True" },
  { value: "isFalse", label: "Is False" },
];
