import { createBrowserHistory } from "history";
import Cookies from "universal-cookie";
import moment from "moment";
import cronstrue from "cronstrue";

export const history = createBrowserHistory();
export const cookies = new Cookies();

export const ExcelDateToJSDateOnly = (d) => {
  if (d) {
    const temp = new Date(d).toDateString().split(" ");
    const num1 = 1;
    const num2 = 2;
    const num3 = 3;
    return `${temp[num1]} ${temp[num2]} , ${temp[num3]}`;
  }
  return "";
};

export const getDateFormatByRegion = (date, isDateOnly = false) => {
  const locale = navigator.language;
  const dateObj = new Date(date);
  console.log("isDateOnly", isDateOnly);

  if (isDateOnly === true) {
    let month = dateObj
      .toLocaleString("default", { month: "long" })
      .substring(0, 3);
    let day = dateObj.getDate().toString().padStart(2, "0");
    let year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  } else {
    let month = dateObj
      .toLocaleString("default", { month: "long" })
      .substring(0, 3);
    let day = dateObj.getDate().toString().padStart(2, "0");
    let year = dateObj.getFullYear();
    let time = dateObj.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    console.log("date format", `${day} ${month} ${year} | ${time}`);
    return `${month} ${day}, ${year} | ${time}`;
  }
};

export const getFormatDate = (date, isDateOnly = false) => {
  const locale = navigator.language;
  const temp = isDateOnly
    ? `${new Date(date).toLocaleDateString(locale)}`
    : `${new Date(date).toLocaleDateString(locale)} ${new Date(
        date
      ).toLocaleTimeString()}`;
  const tim = temp.split(" ");
  return `${moment(temp).format("DD-MMM-YYYY")} ${tim[1]} ${tim[2]}`;
};

export const validateData = (property, value, drpdwnGroup) => {
  let validity = true;
  if (property === "title") {
    if (!value) {
      validity = false;
    }
  }
  if (property === "assetID") {
    if (!value) {
      validity = false;
    } else if (!drpdwnGroup.includes(value)) {
      validity = false;
    }
  }
  if (property === "assignedTo") {
    if (!value) {
      validity = false;
    } else if (!drpdwnGroup.map((e1) => e1.key).includes(value)) {
      validity = false;
    }
  }
  if (property === "status") {
    if (!value) {
      validity = false;
    } else if (!drpdwnGroup.map((e1) => e1.key).includes(value)) {
      validity = false;
    }
  }
  if (property === "completePercentage") {
    if (value) {
      if (isNaN(value) || value < 0 || value > 100) {
        validity = false;
      }
    } else {
      validity = false;
    }
  }
  if (property === "priority") {
    if (!value) {
      validity = false;
    } else if (!drpdwnGroup.map((e1) => e1.key).includes(value)) {
      validity = false;
    }
  }
  if (property === "startDate") {
    if (value) {
      if (isNaN(Date.parse(value))) {
        validity = false;
      }
    } else {
      validity = false;
    }
  }
  if (property === "dueDate") {
    if (value[1]) {
      if (isNaN(Date.parse(value[0]) || isNaN(Date.parse(value[1])))) {
        validity = false;
      } else {
        validity = new Date(value[0]) < new Date(value[1]);
      }
    } else {
      validity = false;
    }
  }
  if (property === "completedDate") {
    if (value[1]) {
      if (isNaN(Date.parse(value[1]))) {
        validity = false;
      } else {
        validity = new Date(value[0]) < new Date(value[1]);
      }
    }
  }
  if (property === "serviceLine") {
    if (!value) {
      validity = false;
    } else if (!drpdwnGroup.map((e1) => e1.key).includes(value)) {
      validity = false;
    }
  }
  if (property === "platform") {
    if (!value) {
      validity = false;
    } else if (!drpdwnGroup.map((e1) => e1.key).includes(value)) {
      validity = false;
    }
  }
  if (property === "taskCategory") {
    if (!value) {
      validity = false;
    } else if (!drpdwnGroup.map((e1) => e1.key).includes(value)) {
      validity = false;
    }
  }
  if (property === "maintenanceGroup") {
    if (!value) {
      validity = false;
    } else if (!drpdwnGroup.map((e1) => e1.key).includes(value)) {
      validity = false;
    }
  }
  if (property === "iris") {
    if (!value) {
      validity = false;
    }
  }
  if (property === "activityStartDate") {
    if (value) {
      validity = moment(new Date(value), "mm-dd-yyyy", true).isValid();
    } else {
      validity = false;
    }
  }
  if (property === "activityStopDate") {
    if (value[1]) {
      validity = moment(new Date(value[1]), "mm-dd-yyyy", true).isValid();
      if (validity) {
        validity = new Date(value[0]) < new Date(value[1]);
        return validity;
      }
    } else {
      validity = false;
    }
    return validity;
  }
  if (property === "impact") {
    if (!value) {
      validity = false;
    } else if (!drpdwnGroup.map((e1) => e1.key).includes(value)) {
      validity = false;
    }
  }
  if (property === "testLevel") {
    if (!value) {
      validity = false;
    } else if (!drpdwnGroup.map((e1) => e1.key).includes(value)) {
      validity = false;
    }
  }
  return validity;
};

export const getColorBasedOnImpact = (status) => {
  switch (status) {
    case "Online":
      return "planner_online-card";
    case "Reduced capacity":
      return "planner_reduced-capacity-card";
    case "Unavailable":
      return "planner_unavailable-card";
    default:
      return "none";
  }
};

export const getCardTitleText_40_chars = (assetId) => {
  let firstColTextLength = assetId?.length;
  if (firstColTextLength > 25) {
    return assetId?.substring(0, 25) + "...";
  } else {
    return assetId;
  }
};

export const getCardTitleText_45_chars = (title) => {
  let firstColTextLength = title?.length;
  if (firstColTextLength > 26) {
    return title?.substring(0, 30) + "...";
  } else {
    return title;
  }
};

export const formatDateToSave = (e) => {
  const temp = new Date(e).toISOString();
  return temp;
};

export const filterTheSuggestions = (suggestions, userInput) => {
  const suggestionsAfterFiltering = suggestions?.filter((suggestion) =>
    suggestion
      ? suggestion?.toLowerCase().indexOf(userInput?.toLowerCase()) > -1
      : ""
  );
  return suggestionsAfterFiltering;
};

export const maxLength = (arr) => {
  let maxLen = 0;
  arr.forEach((i) => {
    const temp = typeof i === "object" ? JSON.stringify(i) : i;
    if (temp?.length > maxLen) {
      maxLen = temp.length;
    }
  });
  return maxLen;
};

export const retainScrollPosition = () => {
  const scrollPosition = sessionStorage.getItem("scrollPosition");
  if (scrollPosition) {
    window.scrollTo({
      top: parseInt(scrollPosition),
      left: 0,
      behavior: "smooth",
    });
    sessionStorage.removeItem("scrollPosition");
  }
};

export const saveScrollPosition = () => {
  sessionStorage.setItem("scrollPosition", window.pageYOffset);
};

export const getTimeZone = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone;
};

export const getDateStyleConfigs = (dateType) => {
  switch (dateType) {
    case "startDateInputProps":
      return {
        marginLeft: "20px",
        placeholder: "Activity Start Date",
        maxHeight: "40px",
        maxWidth: "300px",
        fontWeight: "600",
        fontSize: "14px",
      };
    case "endDateInputProps":
      return {
        marginLeft: "20px",
        placeholder: "Activity End Date",
        maxHeight: "40px",
        maxWidth: "300px",
        fontWeight: "600",
        fontSize: "14px",
      };
    case "startDatePlaceHolder":
      return {
        maxHeight: "40px",
        placeholder: "Start Date",
        maxWidth: "300px",
        fontWeight: "600",
        fontSize: "14px",
      };
    case "dueDatePlaceHolder":
      return {
        placeholder: "Due Date",
        maxHeight: "40px",
        maxWidth: "300px",
        fontWeight: "600",
        fontSize: "14px",
      };
    case "completedDatePlaceHolder":
      return {
        placeholder: "Completed Date",
        maxHeight: "40px",
        maxWidth: "300px",
        fontWeight: "600",
        fontSize: "14px",
      };
    default:
      return null;
  }
};

export const formatDate_Time = (dateString) => {
  if (!dateString) {
    return "-";
  }
  const date = new Date(dateString);

  const dateOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  // Format date and time separately, then combine
  const formattedDate = date
    .toLocaleDateString("en-GB", dateOptions)
    .replace(/\s/g, "-");
  const formattedTime = date.toLocaleTimeString("en-GB", timeOptions);

  return `${formattedDate} ${formattedTime}`;
};

export function convertCronToHumanReadable(cronExpression) {
  try {
    // cronstrue.toString() handles all complex parsing and translation
    const result = cronstrue.toString(cronExpression, {
      // Optional: Use 24-hour time format (e.g., 14:30 instead of 02:30 PM)
      use24HourTimeFormat: true,
      verbose: true,
    });
    return result;
  } catch (error) {
    console.error("Invalid Cron Expression:", cronExpression, error);
    return "Invalid cron expression";
  }
}

const Utils = {
  history,
  cookies,
  ExcelDateToJSDateOnly,
  getDateFormatByRegion,
  validateData,
  getFormatDate,
  getColorBasedOnImpact,
  getCardTitleText_40_chars,
  getCardTitleText_45_chars,
  formatDateToSave,
  getTimeZone,
  getDateStyleConfigs,
  formatDate_Time,
  convertCronToHumanReadable,
};
export default Utils;
