/* eslint-disable import/namespace */
import { get } from "lodash";
import ExcelUtils from "@/utils/ExportDataToExcel";
import agentManagementService from "../../../services/agent/agentManagement.service";
import { errortoast, successtoast } from "../../agent-management/helpers/CustomToast";

export default async function DownloadBulkActionLogsToExcel() {
  try {
    const response = await agentManagementService.exportBulkActionLogs();

    // Response shape: { data: { flag, data: [...] } }  (axios wraps in .data)
    const payload = response?.data || response;
    const records: any[] = payload?.data || [];

    if (!Array.isArray(records) || records.length === 0) {
      errortoast("No data available to export.");
      return;
    }

    // Flatten each record for Excel columns
    const rows = records.map((job: any) => {
      const servers = get(job, "servers", []);
      return {
        "Job ID": job.jobId,
        "Type": job.type,
        "Status": job.status,
        "User": job.user,
        "Created At": job.createdAt,
        "Total Servers": get(job, "serverSummary.total", servers.length),
        "Successful": get(job, "serverSummary.success", 0),
        "Failed": get(job, "serverSummary.failure", 0),
        "Pending": get(job, "serverSummary.pending", 0),
      };
    });

    ExcelUtils.exportDataToExcel(rows, "BulkActionLogs");
    successtoast("Download started successfully.");
  } catch (error) {
    console.error("Export error:", error);
    errortoast("Failed to download. Please try again.");
  }
}
