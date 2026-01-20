import { ReportHandler, getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

/**
 * Function for measuring app performance.
 * @param {ReportHandler} onPerfEntry - The callback function to handle performance metrics
 */
const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    Promise.all([getCLS(onPerfEntry), getFID(onPerfEntry), getFCP(onPerfEntry), getLCP(onPerfEntry), getTTFB(onPerfEntry)]).catch(error => {
      console.error("Error while measuring web vitals:", error);
    });
  }
};

/**
 * Exporting function.
 */
export default reportWebVitals;