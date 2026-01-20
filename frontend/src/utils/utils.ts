/* eslint-disable import/no-extraneous-dependencies */
import { createBrowserHistory } from "history";
import Cookies from "universal-cookie";

// History instance for navigation
export const history = createBrowserHistory();

// Cookies instance
export const cookies = new Cookies();

/**
 * Convert Excel date to readable JS date (e.g. "Mon Jan , 2024").
 */
export const ExcelDateToJSDateOnly = (d: Date | string | number): string => {
  if (d) {
    const temp = new Date(d).toDateString().split(" ");
    return `${temp[1]} ${temp[2]} , ${temp[3]}`;
  }
  return "";
};

/**
 * Return date string formatted by region.
 */
export const getDateFormatByRegion = (date: string | number | Date, isDateOnly: boolean): string => {
  const locale = navigator.language;
  const dt = new Date(date);
  return isDateOnly ? dt.toLocaleDateString(locale) : `${dt.toLocaleDateString(locale)} ${dt.toLocaleTimeString(locale)}`;
};

/**
 * Format timestamp into "MM-DD-YYYY HH:MM:SS" in UTC.
 */
export const formatTimestamp = (originalTimestamp: string | number | Date): string => {
  const dateObj = new Date(originalTimestamp);
  const day = dateObj.getUTCDate().toString().padStart(2, "0");
  const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getUTCFullYear();
  const hours = dateObj.getUTCHours().toString().padStart(2, "0");
  const minutes = dateObj.getUTCMinutes().toString().padStart(2, "0");
  const seconds = dateObj.getUTCSeconds().toString().padStart(2, "0");

  return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
};

/**
 * Convert bytes to MB, fixed to 2 decimals.
 */
export const bytesToMB = (bytes: number): string => {
  if (isNaN(bytes)) {
    return "Invalid input";
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Convert number to percentage string with 3 decimals.
 */
export const toPercentage = (number: number): string => {
  return `${number.toFixed(3)}%`;
};

const Utils = {
  history,
  cookies,
  ExcelDateToJSDateOnly,
  getDateFormatByRegion,
  formatTimestamp,
  bytesToMB,
  toPercentage,
};

export default Utils;

