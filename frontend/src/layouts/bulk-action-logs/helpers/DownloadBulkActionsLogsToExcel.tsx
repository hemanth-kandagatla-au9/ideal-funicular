/* eslint-disable import/namespace */
import { get } from "lodash";
import ExcelUtils from "@/utils/ExportDataToExcel";
import agentManagementService from "../../../services/agent/agentManagement.service";
import { errortoast, successtoast } from "../../agent-management/helpers/CustomToast";

export default async function DownloadBulkActionLogsToExcel(pageNo: number = 0, pageSize: number = 10) {
  try {
    const response = await agentManagementService.exportBulkActionLogs(pageNo, pageSize);

    const payload = response?.data || response;
    const records: any[] = payload?.data || [];

    if (!Array.isArray(records) || records.length === 0) {
      errortoast("No data available to export.");
      return;
    }

    const rows = records.flatMap((job: any) => {
      const servers = get(job, "servers", []);

      if (!servers.length) {
        return [
          {
            "Job ID": job.jobId,
            "Type": job.type,
            "Status": job.status,
            "User": job.user,
            "Created At": job.createdAt,

            "Server Name": "",
            "Server Status": "",
            "Message": "",
            "Completed At": "",
          },
        ];
      }

      return servers.map((server: any) => ({
        "Job ID": job.jobId,
        "Type": job.type,
        "Status": job.status,
        "User": job.user,
        "Created At": job.createdAt,

        "Server Name": server.serverName,
        "Server Status": server.status,
        "Message": server.message,
        "Completed At": server.completedAt,
      }));
    });

    ExcelUtils.exportDataToExcel(rows, "BulkActionLogs");
    successtoast("Download started successfully.");
  } catch (error) {
    console.error("Export error:", error);
    errortoast("Failed to download. Please try again.");
  }
}