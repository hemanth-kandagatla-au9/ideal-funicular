/**
 * DownloadBulkActionsLogsToExcel Tests
 * Test suite for bulk action logs export functionality
 */


import DownloadBulkActionLogsToExcel from "../../../layouts/bulk-action-logs/helpers/DownloadBulkActionsLogsToExcel";
import agentManagementService from "../../../services/agent/agentManagement.service";
import ExcelUtils from "@/utils/ExportDataToExcel";
import * as CustomToast from "../../../layouts/agent-management/helpers/CustomToast";
jest.unmock("react-redux");

// Mock the service and utilities
jest.mock("../../../services/agent/agentManagement.service");
jest.mock("@/utils/ExportDataToExcel");
jest.mock("../../../layouts/agent-management/helpers/CustomToast", () => ({
  errortoast: jest.fn(),
  successtoast: jest.fn(),
}));

describe("DownloadBulkActionLogsToExcel", () => {
  const mockExportToExcel = ExcelUtils.exportDataToExcel as jest.Mock;
  const mockErrorToast = CustomToast.errortoast as jest.Mock;
  const mockSuccessToast = CustomToast.successtoast as jest.Mock;
  const mockExportBulkActionLogs = agentManagementService.exportBulkActionLogs as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Successful Export", () => {
    it("should export bulk action logs data to Excel", async () => {
      const mockData = [
        {
          jobId: "BAL-001",
          type: "agent_config_sync",
          status: "Completed",
          user: "admin@company.com",
          createdAt: "2024-04-22T10:00:00Z",
          servers: [{ id: "server1" }, { id: "server2" }],
          serverSummary: { total: 2, success: 2, failure: 0, pending: 0 },
        },
      ];

      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: mockData },
      });

      await DownloadBulkActionLogsToExcel();

      expect(mockExportBulkActionLogs).toHaveBeenCalled();
      expect(mockExportToExcel).toHaveBeenCalled();
      expect(mockSuccessToast).toHaveBeenCalledWith("Download started successfully.");
      expect(mockErrorToast).not.toHaveBeenCalled();
    });

    it("should format data correctly for Excel export", async () => {
      const mockData = [
        {
          jobId: "BAL-001",
          type: "agent_config_sync",
          status: "Completed",
          user: "admin@company.com",
          createdAt: "2024-04-22T10:00:00Z",
          serverSummary: { total: 45, success: 45, failure: 0, pending: 0 },
        },
      ];

      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: mockData },
      });

      await DownloadBulkActionLogsToExcel();

      expect(mockExportToExcel).toHaveBeenCalled();
      const callArgs = mockExportToExcel.mock.calls[0];
      const rows = callArgs[0];
      const filename = callArgs[1];

      expect(rows[0]["Job ID"]).toBe("BAL-001");
      expect(rows[0]["Type"]).toBe("agent_config_sync");
      expect(rows[0]["Status"]).toBe("Completed");
      expect(rows[0]["User"]).toBe("admin@company.com");
      expect(rows[0]["Total Servers"]).toBe(45);
      expect(rows[0]["Successful"]).toBe(45);
      expect(rows[0]["Failed"]).toBe(0);
      expect(rows[0]["Pending"]).toBe(0);
      expect(filename).toBe("BulkActionLogs");
    });

    it("should use serverSummary when available", async () => {
      const mockData = [
        {
          jobId: "BAL-001",
          type: "agent_config_sync",
          status: "Completed",
          user: "admin@company.com",
          createdAt: "2024-04-22T10:00:00Z",
          servers: [{ id: "s1" }, { id: "s2" }, { id: "s3" }],
          serverSummary: { total: 100, success: 80, failure: 15, pending: 5 },
        },
      ];

      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: mockData },
      });

      await DownloadBulkActionLogsToExcel();

      const callArgs = mockExportToExcel.mock.calls[0];
      const rows = callArgs[0];

      expect(rows[0]["Total Servers"]).toBe(100);
    });

    it("should fallback to servers.length when serverSummary.total missing", async () => {
      const mockData = [
        {
          jobId: "BAL-001",
          type: "agent_config_sync",
          status: "Completed",
          user: "admin@company.com",
          createdAt: "2024-04-22T10:00:00Z",
          servers: [{ id: "s1" }, { id: "s2" }, { id: "s3" }],
          serverSummary: { success: 2, failure: 1, pending: 0 },
        },
      ];

      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: mockData },
      });

      await DownloadBulkActionLogsToExcel();

      const callArgs = mockExportToExcel.mock.calls[0];
      const rows = callArgs[0];

      expect(rows[0]["Total Servers"]).toBe(3);
    });

    it("should export multiple records", async () => {
      const mockData = Array.from({ length: 50 }, (_, i) => ({
        jobId: `BAL-${i + 1}`,
        type: "agent_config_sync",
        status: "Completed",
        user: `user${i}@company.com`,
        createdAt: `2024-04-${20 + Math.floor(i / 10)}T10:00:00Z`,
        serverSummary: { total: 10, success: 10, failure: 0, pending: 0 },
      }));

      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: mockData },
      });

      await DownloadBulkActionLogsToExcel();

      const callArgs = mockExportToExcel.mock.calls[0];
      const rows = callArgs[0];

      expect(rows.length).toBe(50);
      expect(rows[0]["Job ID"]).toBe("BAL-1");
      expect(rows[49]["Job ID"]).toBe("BAL-50");
    });
  });

  describe("Error Handling", () => {
    it("should show error toast when export fails", async () => {
      mockExportBulkActionLogs.mockRejectedValue(new Error("API Error"));

      await DownloadBulkActionLogsToExcel();

      expect(mockErrorToast).toHaveBeenCalledWith("Failed to download. Please try again.");
      expect(mockSuccessToast).not.toHaveBeenCalled();
    });

    it("should show error toast when no data available", async () => {
      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: [] },
      });

      await DownloadBulkActionLogsToExcel();

      expect(mockErrorToast).toHaveBeenCalledWith("No data available to export.");
      expect(mockSuccessToast).not.toHaveBeenCalled();
      expect(mockExportToExcel).not.toHaveBeenCalled();
    });

    it("should show error toast when data is null", async () => {
      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: null },
      });

      await DownloadBulkActionLogsToExcel();

      expect(mockErrorToast).toHaveBeenCalledWith("No data available to export.");
    });

    it("should show error toast when response is malformed", async () => {
      mockExportBulkActionLogs.mockResolvedValue(null);

      await DownloadBulkActionLogsToExcel();

      expect(mockErrorToast).toHaveBeenCalledWith("No data available to export.");
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network Error");
      mockExportBulkActionLogs.mockRejectedValue(networkError);

      await DownloadBulkActionLogsToExcel();

      expect(mockErrorToast).toHaveBeenCalledWith("Failed to download. Please try again.");
    });

    it("should console.error when error occurs", async () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      const error = new Error("Test Error");
      mockExportBulkActionLogs.mockRejectedValue(error);

      await DownloadBulkActionLogsToExcel();

      expect(consoleSpy).toHaveBeenCalledWith("Export error:", error);
      consoleSpy.mockRestore();
    });
  });

  describe("Data Transformation", () => {
    it("should flatten nested server data", async () => {
      const mockData = [
        {
          jobId: "BAL-001",
          type: "agent_config_sync",
          status: "Completed",
          user: "admin@company.com",
          createdAt: "2024-04-22T10:00:00Z",
          serverSummary: { total: 5, success: 3, failure: 1, pending: 1 },
        },
      ];

      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: mockData },
      });

      await DownloadBulkActionLogsToExcel();

      const callArgs = mockExportToExcel.mock.calls[0];
      const rows = callArgs[0];

      expect(Object.keys(rows[0])).toContain("Job ID");
      expect(Object.keys(rows[0])).toContain("Total Servers");
      expect(Object.keys(rows[0])).toContain("Successful");
      expect(Object.keys(rows[0])).toContain("Failed");
      expect(Object.keys(rows[0])).toContain("Pending");
    });

    it("should handle missing optional fields", async () => {
      const mockData = [
        {
          jobId: "BAL-001",
          type: "agent_config_sync",
          status: "Completed",
          createdAt: "2024-04-22T10:00:00Z",
        },
      ];

      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: mockData },
      });

      await DownloadBulkActionLogsToExcel();

      const callArgs = mockExportToExcel.mock.calls[0];
      const rows = callArgs[0];

      expect(rows[0]["User"]).toBeUndefined();
      expect(rows[0]["Total Servers"]).toBe(0);
      expect(mockExportToExcel).toHaveBeenCalled();
    });

    it("should preserve all job properties in export", async () => {
      const mockData = [
        {
          jobId: "BAL-001",
          type: "agent_config_sync",
          status: "Completed",
          user: "admin@company.com",
          createdAt: "2024-04-22T10:00:00Z",
          serverSummary: { total: 100, success: 85, failure: 10, pending: 5 },
        },
      ];

      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: mockData },
      });

      await DownloadBulkActionLogsToExcel();

      const callArgs = mockExportToExcel.mock.calls[0];
      const rows = callArgs[0];
      const row = rows[0];

      expect(row).toHaveProperty("Job ID");
      expect(row).toHaveProperty("Type");
      expect(row).toHaveProperty("Status");
      expect(row).toHaveProperty("User");
      expect(row).toHaveProperty("Created At");
      expect(row).toHaveProperty("Total Servers");
      expect(row).toHaveProperty("Successful");
      expect(row).toHaveProperty("Failed");
      expect(row).toHaveProperty("Pending");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty server summary", async () => {
      const mockData = [
        {
          jobId: "BAL-001",
          type: "agent_config_sync",
          status: "Completed",
          user: "admin@company.com",
          createdAt: "2024-04-22T10:00:00Z",
          serverSummary: {},
        },
      ];

      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: mockData },
      });

      await DownloadBulkActionLogsToExcel();

      expect(mockExportToExcel).toHaveBeenCalled();
    });

    it("should handle single record export", async () => {
      const mockData = [
        {
          jobId: "BAL-001",
          type: "agent_config_sync",
          status: "Completed",
          user: "admin@company.com",
          createdAt: "2024-04-22T10:00:00Z",
          serverSummary: { total: 1, success: 1, failure: 0, pending: 0 },
        },
      ];

      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: mockData },
      });

      await DownloadBulkActionLogsToExcel();

      const callArgs = mockExportToExcel.mock.calls[0];
      const rows = callArgs[0];

      expect(rows.length).toBe(1);
    });

    it("should handle special characters in data", async () => {
      const mockData = [
        {
          jobId: "BAL-001",
          type: "agent_config_sync",
          status: "Completed",
          user: 'admin+test@company.com"quoted"',
          createdAt: "2024-04-22T10:00:00Z",
          serverSummary: { total: 10, success: 8, failure: 2, pending: 0 },
        },
      ];

      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: mockData },
      });

      await DownloadBulkActionLogsToExcel();

      const callArgs = mockExportToExcel.mock.calls[0];
      const rows = callArgs[0];

      expect(rows[0]["User"]).toContain("admin+test@company.com");
      expect(mockExportToExcel).toHaveBeenCalled();
    });

    it("should handle large dataset", async () => {
      const mockData = Array.from({ length: 100 }, (_, i) => ({
        jobId: `BAL-${i + 1}`,
        type: "agent_config_sync",
        status: i % 2 === 0 ? "Completed" : "In Progress",
        user: `user${i % 50}@company.com`,
        createdAt: `2024-04-22T${String(Math.floor(i / 10)).padStart(2, "0")}:00:00Z`,
        serverSummary: { total: 10, success: 8, failure: 2, pending: 0 },
      }));

      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: mockData },
      });

      await DownloadBulkActionLogsToExcel();

      const callArgs = mockExportToExcel.mock.calls[0];
      const rows = callArgs[0];

      expect(rows.length).toBe(100);
    });
  });

  describe("API Interaction", () => {
    it("should call exportBulkActionLogs service method", async () => {
      mockExportBulkActionLogs.mockResolvedValue({
        data: { data: [{ jobId: "BAL-001", type: "agent_config_sync", status: "Completed", user: "admin@company.com", createdAt: "2024-04-22T10:00:00Z", serverSummary: { total: 10, success: 10, failure: 0, pending: 0 } }] },
      });

      await DownloadBulkActionLogsToExcel();

      expect(mockExportBulkActionLogs).toHaveBeenCalledTimes(1);
      expect(mockExportBulkActionLogs).toHaveBeenCalledWith();
    });

    it("should handle axios wrapped response format", async () => {
      const mockData = [
        {
          jobId: "BAL-001",
          type: "agent_config_sync",
          status: "Completed",
          user: "admin@company.com",
          createdAt: "2024-04-22T10:00:00Z",
          serverSummary: { total: 5, success: 5, failure: 0, pending: 0 },
        },
      ];

      mockExportBulkActionLogs.mockResolvedValue({
        data: { flag: "success", data: mockData },
      });

      await DownloadBulkActionLogsToExcel();

      expect(mockExportToExcel).toHaveBeenCalled();
      const callArgs = mockExportToExcel.mock.calls[0];
      const rows = callArgs[0];

      expect(rows.length).toBe(1);
      expect(rows[0]["Job ID"]).toBe("BAL-001");
    });
  });
});
