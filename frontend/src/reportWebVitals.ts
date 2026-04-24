import { ReportHandler, getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";


const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    Promise.all([getCLS(onPerfEntry), getFID(onPerfEntry), getFCP(onPerfEntry), getLCP(onPerfEntry), getTTFB(onPerfEntry)]).catch(error => {
      console.error("Error while measuring web vitals:", error);
    });
  }
};


export default reportWebVitals;
