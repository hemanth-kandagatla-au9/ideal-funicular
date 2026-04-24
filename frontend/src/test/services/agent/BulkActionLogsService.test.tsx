/**
 * BulkActionLogs Service Tests
 * Tests for getBulkActionLogs and getBulkActionDetails API calls
 */

import agentManagementService from "../../../services/agent/agentManagement.service";
import "@testing-library/jest-dom/extend-expect";

// Helper to create axios-like error
const createAxiosError = (status: number, message = "Error") => ({
  response: { status, data: message },
  isAxiosError: true,
});

// Create a mock instance
const createMockAxiosInstance = () => ({
  get: jest.fn().mockResolvedValue({ data: {} }),
  post: jest.fn().mockResolvedValue({ data: {} }),
  put: jest.fn().mockResolvedValue({ data: {} }),
  delete: jest.fn().mockResolvedValue({ data: {} }),
  patch: jest.fn().mockResolvedValue({ data: {} }),
});

// Create a single mock instance (reused across all tests to avoid caching issues)
const mockInstance = createMockAxiosInstance();

// Mock axios
jest.mock("axios", () => {
  return {
    create: () => mockInstance,
    isAxiosError: (error: any) => !!error?.isAxiosError,
  };
});

// Mock the axiosInstance module - always returns the same mockInstance
jest.mock("../../../services/axiosInstance", () => {
  return jest.fn().mockImplementation(() => ({
    init: () => mockInstance,
  }));
});

describe("BulkActionLogs Service Tests", () => {
  beforeEach(() => {
    // Reset methods on the same instance (avoids the _instance caching problem)
    mockInstance.get = jest.fn().mockResolvedValue({ data: {} });
    mockInstance.post = jest.fn().mockResolvedValue({ data: {} });
    mockInstance.put = jest.fn().mockResolvedValue({ data: {} });
    mockInstance.delete = jest.fn().mockResolvedValue({ data: {} });
    mockInstance.patch = jest.fn().mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock data for all tests
  const createMockBulkActionData = (pageNo = 0, pageSize = 10, totalRecords = 30) => ({
    pagination: {
      pageNo,
      pageSize,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
      hasNextPage: pageNo < Math.ceil(totalRecords / pageSize) - 1,
      hasPreviousPage: pageNo > 0,
    },
    data: Array.from({ length: Math.min(pageSize, totalRecords - pageNo * pageSize) }, (_, i) => ({
      jobId: `BAL-${String(pageNo * pageSize + i + 1).padStart(3, "0")}`,
      type: ["agent_config_sync", "agent_upgrade", "agent_restart"][i % 3],
      status: ["Completed", "In Progress", "Failed"][i % 3],
      user: ["admin@company.com", "devops@company.com", "qa@company.com"][i % 3],
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      serverSummary: {
        total: 20 + i * 5,
        success: 15 + i * 4,
        pending: 3 + i,
        failure: i,
      },
    })),
  });

  describe("getBulkActionLogs", () => {
    it("should call POST with default pagination when no filters provided", async () => {
      const mockResponse = {
        data: {
          flag: "success",
          data: createMockBulkActionData(),
        },
      };

      mockInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await agentManagementService.getBulkActionLogs();

      expect(mockInstance.post).toHaveBeenCalledWith(expect.stringContaining("bulk-action-logs"), {
        pageNo: 0,
        pageSize: 10,
      });
      expect(result).toBeDefined();
      expect(result.data.data.data.length).toBeGreaterThan(0);
    });

    it("should send filters in POST payload", async () => {
      const filters = {
        type: ["agent_config_sync"],
        users: ["admin@company.com"],
        status: ["Completed"],
      };
      const pagination = { pageNo: 1, pageSize: 10 };

      const mockResponse = {
        data: {
          flag: "success",
          data: createMockBulkActionData(pagination.pageNo, pagination.pageSize),
        },
      };

      mockInstance.post.mockResolvedValueOnce(mockResponse);

      const result = await agentManagementService.getBulkActionLogs(filters, pagination);

      expect(mockInstance.post).toHaveBeenCalledWith(expect.stringContaining("bulk-action-logs"), {
        pageNo: 1,
        pageSize: 10,
        type: ["agent_config_sync"],
        users: ["admin@company.com"],
        status: ["Completed"],
      });
      expect(result.data.data.data.length).toBeGreaterThan(0);
    });

    it("should handle search filter", async () => {
      const filters = { search: "BAL-001" };
      const pagination = { pageNo: 0, pageSize: 10 };

      mockInstance.post.mockResolvedValueOnce({
        data: {
          flag: "success",
          data: createMockBulkActionData(pagination.pageNo, pagination.pageSize, 5),
        },
      });

      const result = await agentManagementService.getBulkActionLogs(filters, pagination);

      expect(mockInstance.post).toHaveBeenCalledWith(expect.stringContaining("bulk-action-logs"), expect.objectContaining({ search: "BAL-001" }));
      expect(result.data.data.data.length).toBeGreaterThan(0);
    });

    it("should handle pagination parameters", async () => {
      const pagination = { pageNo: 2, pageSize: 20 };

      mockInstance.post.mockResolvedValueOnce({
        data: {
          flag: "success",
          data: createMockBulkActionData(pagination.pageNo, pagination.pageSize),
        },
      });

      const result = await agentManagementService.getBulkActionLogs({}, pagination);

      expect(mockInstance.post).toHaveBeenCalledWith(expect.stringContaining("bulk-action-logs"), expect.objectContaining({ pageNo: 2, pageSize: 20 }));
      expect(result.data.data.pagination.pageNo).toBe(2);
      expect(result.data.data.pagination.pageSize).toBe(20);
    });

    it("should return formatted response with proper structure", async () => {
      const mockData = {
        pagination: {
          pageNo: 0,
          pageSize: 10,
          totalRecords: 30,
          totalPages: 3,
          hasNextPage: true,
        },
        data: [
          {
            jobId: "BAL-001",
            type: "agent_config_sync",
            status: "Completed",
            user: "admin@company.com",
            createdAt: "2026-04-15T10:30:00Z",
            serverSummary: { total: 45, success: 45, pending: 0, failure: 0 },
          },
        ],
      };

      mockInstance.post.mockResolvedValueOnce({
        data: { flag: "success", data: mockData },
      });

      const result = await agentManagementService.getBulkActionLogs();

      expect(result.data.flag).toBe("success");
      expect(result.data.data.pagination.totalRecords).toBe(30);
      expect(result.data.data.data.length).toBe(1);
      expect(result.data.data.data[0].jobId).toBe("BAL-001");
    });

    it("should handle API errors gracefully", async () => {
      const error = createAxiosError(500, "Server error");
      mockInstance.post.mockRejectedValueOnce(error);

      const result = await agentManagementService.getBulkActionLogs();

      expect(result).toBeDefined();
      expect(mockInstance.post).toHaveBeenCalled();
    });
  });

  describe("getBulkActionDetails", () => {
    it("should fetch details for a specific job ID", async () => {
      const jobId = "BAL-001";
      const mockResponse = {
        data: {
          flag: "success",
          data: {
            jobId,
            type: "agent_config_sync",
            status: "Completed",
            user: "admin@company.com",
            serverSummary: { total: 45, success: 45, pending: 0, failure: 0 },
            servers: [{ serverName: "server-001", status: "Success", message: "OK" }],
          },
        },
      };

      mockInstance.get.mockResolvedValueOnce(mockResponse);

      const result = await agentManagementService.getBulkActionDetails(jobId);

      expect(mockInstance.get).toHaveBeenCalledWith(expect.stringContaining(`bulk-action-logs/${jobId}`));
      expect(result.data.flag).toBe("success");
      expect(result.data.data.jobId).toBe(jobId);
    });

    it("should throw error if jobId is empty", async () => {
      const result = await agentManagementService.getBulkActionDetails("");

      expect(result).toBeDefined();
    });

    it("should handle non-existent job ID (404)", async () => {
      const jobId = "NONEXISTENT";
      const error = createAxiosError(404, "Not found");

      mockInstance.get.mockRejectedValueOnce(error);

      const result = await agentManagementService.getBulkActionDetails(jobId);

      expect(result).toBeDefined();
    });

    it("should return server list in details response", async () => {
      const jobId = "BAL-001";
      const servers = [
        { serverName: "server-001", status: "Success", message: "OK" },
        { serverName: "server-002", status: "Success", message: "OK" },
        { serverName: "server-003", status: "Failure", message: "Timeout" },
      ];

      mockInstance.get.mockResolvedValueOnce({
        data: {
          flag: "success",
          data: {
            jobId,
            servers,
            serverSummary: { total: 3, success: 2, failure: 1, pending: 0 },
          },
        },
      });

      const result = await agentManagementService.getBulkActionDetails(jobId);

      expect(result.data.data.servers).toHaveLength(3);
      expect(result.data.data.servers[0].serverName).toBe("server-001");
    });
  });
});
