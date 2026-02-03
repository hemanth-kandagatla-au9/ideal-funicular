/* eslint-disable import/no-extraneous-dependencies */
import { createBrowserHistory } from "history";
import Cookies from "universal-cookie";

export const history = createBrowserHistory();
export const cookies = new Cookies();

export const ExcelDateToJSDateOnly = (d: Date | string | number): string => {
  if (d) {
    const temp = new Date(d).toDateString().split(" ");
    return `${temp[1]} ${temp[2]} , ${temp[3]}`;
  }
  return "";
};

export const formatNameByFirstLetterCase = (value: string | null | undefined): string => {
  if (value == null) return "";
  const str = String(value);

  const firstLetterMatch = str.match(/[A-Za-z]/);
  if (!firstLetterMatch) return str;

  const firstLetter = firstLetterMatch[0];
  return firstLetter === firstLetter.toLowerCase() ? str.toLowerCase() : str.toUpperCase();
};

export const getDateFormatByRegion = (date: string | number | Date, isDateOnly: boolean): string => {
  const locale = navigator.language;
  const dt = new Date(date);
  return isDateOnly ? dt.toLocaleDateString(locale) : `${dt.toLocaleDateString(locale)} ${dt.toLocaleTimeString(locale)}`;
};

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

export const bytesToMB = (bytes: number): string => {
  if (isNaN(bytes)) {
    return "Invalid input";
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

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
  formatNameByFirstLetterCase,
};

export default Utils;
