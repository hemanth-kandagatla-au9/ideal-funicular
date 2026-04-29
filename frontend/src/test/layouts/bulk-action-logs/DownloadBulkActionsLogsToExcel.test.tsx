/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/namespace
import DownloadBulkActionLogsToExcel from "../../../layouts/bulk-action-logs/helpers/DownloadBulkActionsLogsToExcel";

jest.mock("../../../services/agent/agentManagement.service", () => ({
  __esModule: true,
  default: {
    exportBulkActionLogs: jest.fn(),
  },
}));

jest.mock("@/utils/ExportDataToExcel", () => ({
  __esModule: true,
  default: {
    exportDataToExcel: jest.fn(),
  },
}));

jest.mock("../../../layouts/agent-management/helpers/CustomToast", () => ({
  __esModule: true,
  errortoast: jest.fn(),
  successtoast: jest.fn(),
}));

const agentService = require("../../../services/agent/agentManagement.service").default;
const ExcelUtils = require("@/utils/ExportDataToExcel").default;
const { errortoast, successtoast } = require("../../../layouts/agent-management/helpers/CustomToast");

describe("DownloadBulkActionLogsToExcel helper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows error toast when no records", async () => {
    agentService.exportBulkActionLogs.mockResolvedValue({ data: { data: [] } });

    await DownloadBulkActionLogsToExcel();

    expect(errortoast).toHaveBeenCalledWith("No data available to export.");
    expect(ExcelUtils.exportDataToExcel).not.toHaveBeenCalled();
  });

  it("exports rows and shows success toast when records exist", async () => {
    const payload = {
      data: [{ jobId: "J1", type: "t", status: "Completed", user: "u", createdAt: "d", servers: [{ serverName: "s1", status: "Success", message: "ok", completedAt: "d" }] }],
    };
    agentService.exportBulkActionLogs.mockResolvedValue({ data: payload });

    await DownloadBulkActionLogsToExcel();

    expect(ExcelUtils.exportDataToExcel).toHaveBeenCalled();
    expect(successtoast).toHaveBeenCalledWith("Download started successfully.");
  });

  it("shows error toast on service exception", async () => {
    agentService.exportBulkActionLogs.mockRejectedValue(new Error("network"));

    await DownloadBulkActionLogsToExcel();

    expect(errortoast).toHaveBeenCalledWith("Failed to download. Please try again.");
  });
});
