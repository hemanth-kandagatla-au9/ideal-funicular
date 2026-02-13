export const SCHEDULE_TYPE_OPTIONS = [
  {
    label: "Startup",
    value: "ON_STARTUP",
  },
  {
    label: "Startup with Schedule",
    value: "ON_STARTUP_CRON",
  },
  {
    label: "Ad-hoc",
    value: "AD_HOC",
  },
  {
    label: "Normal",
    value: "NORMAL",
  },
];

export const SERVER_ATTRIBUTE_OPTIONS = [
  {
    label: "Region",
    value: "region",
  },
  {
    label: "Environment",
    value: "environment",
  },
  {
    label: "SID",
    value: "sid",
  },
  {
    label: "Platform",
    value: "platform",
  },
  {
    label: "CI",
    value: "ci",
  },
];

export const SCHEDULE_TYPE_OPTIONS_AD_HOC = [
  {
    label: "Ad-hoc",
    value: "AD_HOC",
  },
  {
    label: "Normal",
    value: "NORMAL",
  },
];

export const frequencyMapping = {
  Weekdays: "Weekdays",
  Minutes: "Minutes",
  Hourly: "Hour",
  Daily: "Day",
  Weekly: "Week",
  Monthly: "Month",
};

export const frequencyMapping_WithLabels = [
  { value: "Weekdays", label: "Weekdays (Mon - Fri)" },
  { value: "Minutes", label: "Minutes" },
  { value: "Hourly", label: "Hour" },
  { value: "Daily", label: "Day" },
  { value: "Weekly", label: "Week" },
  { value: "Monthly", label: "Month" },
];

export const tagColors = [
  "#FDF2FA",
  "#FFF6ED",
  "#EFF8FF",
  "#F9F5FF",
  "#EFF8FF",
  "#F9F5FF",
  "#FDF2FA",
  "#FFF6ED",
];

export const textColors = [
  "#C11574",
  "#C4320A",
  "#175CD3",
  "#6941C6",
  "#175CD3",
  "#6941C6",
  "#C11574",
  "#C4320A",
];

// export const jobsSortOptions = [
//     { id: "created_date", value: "Start Date" },
//     { id: "description", value: "Description" },
//     { id: "category_type", value: "Category Type" },
//     { id: "category", value: "Category" },
// ];

export const jobsSortOptions = [
  { id: "created_date", value: "Start Date" },
  { id: "description", value: "Description (Asc)" },
  { id: "category_type", value: "Category (Asc)" },
  { id: "category", value: "Schedule Type (Asc)" },
];

export const tagsViewSortOptions = [
  { id: "tagsasc", value: "Tags asc" },
  { id: "tagsdes", value: "Tags des" },
];

export const jobsStatusOptions = [
  { id: "all", value: "All Schedules" },
  { id: "active_jobs", value: "Active" },
  { id: "paused_jobs", value: "Paused" },
  { id: "adhoc_job", value: "Adhoc" },
  { id: "execute_one_time", value: "Execute One time" },
];

// export const MODULE_OPTIONS = [
//   { value: "SCHEDULE", label: "SCHEDULE" },
//  { value: "REPORTS", label: "REPORTS" },
//   { value: "SCHEDULE_CATEGORIES", label: "SCHEDULE CATEGORIES" },
//   { value: "OPENSEARCH", label: "OPENSEARCH" },
//   { value: "COMMAND_CATEGORIES", label: "COMMAND CATEGORIES" },
//   { value: "INTERNAL_JOBS", label: "INTERNAL JOBS" },
//   { value: "GENERAL_CONFIG", label: "CONFIG" },
//   { value: "RUN_AS_CONFIG", label: "RUN AS CONFIGURATION" },
//   {value:"CODE_MARKETPLACE",label:"CODE MARKETPLACE"}
// ];

export const MODULE_OPTIONS = [
  { value: "SCHEDULE", label: "Schedule" },
  { value: "REPORTS", label: "Reports" },
  { value: "SCHEDULE_CATEGORIES", label: "Schedule Categories" },
  { value: "OPENSEARCH", label: "Opensearch" },
  { value: "COMMAND_CATEGORIES", label: "Command Categories" },
  { value: "INTERNAL_JOBS", label: "Internal Jobs" },
  { value: "GENERAL_CONFIG", label: "Config" },
  { value: "RUN_AS_CONFIG", label: "Run as configuration" },
  { value: "CODE_MARKETPLACE", label: "Code Marketplace" },
  {
    value: "SCHEDULE_SYSTEM_PUBLISH_CONFIG",
    label: "Schedule System Publish Config",
  },
  {
    value: "CMDB_TABLE_CONFIG",
    label: "CMDB Table Config",
  },
];

export const DummyiamGroups = [
  { name: "JJT-APP-CYBERSPHERE-DEVELOPER" },
  { name: "JJT-APP-CYBERSPHERE-DEV-ADMIN" },
  { name: "JJT-APP-CYBERSPHERE-PROD-SUPPORT" },
];

export const dummyApprovalFlows = [
  {
    _id: "1",
    module: "User Management",
    approvers: ["Admin", "Manager"],
  },
  {
    _id: "2",
    module: "Content Publishing",
    approvers: ["Editor", "Publisher"],
  },
];
