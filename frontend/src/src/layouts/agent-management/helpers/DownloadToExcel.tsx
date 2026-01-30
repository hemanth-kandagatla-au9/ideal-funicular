import ExcelUtils from "@/utils/ExportDataToExcel";
import Utils from "@/utils/utils";
import { errortoast, successtoast } from "./CustomToast";
import { convertDate } from "./agentHelpers";

export default async function DownloadToExcel(getTotalRowsCount: any, fetchDataForDownload: any) {
  try {
    const pageSizeForDownload = getTotalRowsCount();
    let dataForDownload = await fetchDataForDownload(pageSizeForDownload);
    successtoast("download started successfully.");

    dataForDownload = dataForDownload.map((item: any) => {
      const flattenedData = { ...item, ...item.cmdb, ...item.agent_details };
      return {
        Hostname: flattenedData.hostname,
        IP: flattenedData.vm_ip,
        Port: flattenedData.server_port,
        pid: flattenedData.pid,
        Version: flattenedData.version,
        Uptime: flattenedData.up_time,
        Status: flattenedData.status,
        OS: flattenedData.os,
        "Agent Env": flattenedData.agent_env,
        "Agent Last Start Time": convertDate(flattenedData.agent_last_start_time, 10),
        "CPU Usage": Utils.toPercentage(flattenedData.cpu_usage),
        "Disk Usage": Utils.bytesToMB(flattenedData.disk_usage),
        "Install dir": flattenedData.install_dir,
        Memory: Utils.bytesToMB(flattenedData.memory),
        "OS Name": flattenedData.os_name,
        "OS Version": flattenedData.os_version,
        "Rust Version": flattenedData.rust_version,
        Region: flattenedData.slRegion,
        "SL Name": flattenedData.slName,
        Platform: flattenedData.slPlatform,
        "SAP Name Env": flattenedData.ciSapNameEnv,
        "SAP Name SID": flattenedData.ciSapNameSid,
        Jobs: flattenedData.jobs?.join(", ") ?? "",
      };
    });

    ExcelUtils.exportDataToExcel(dataForDownload, "RISEBOT");
  } catch (error) {
    errortoast("failed to download. please try again.");
  }
}
