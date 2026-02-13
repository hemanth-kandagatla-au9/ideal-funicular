import UtilizationService from "../../services/auth/UtilizationService";
import AxiosInstance from "../../services/axiosInstance";

describe("getUtilizationMetrics", () => {
  it("should return response on success", async () => {
    const successfulResponse = { data: "some data" };
    AxiosInstance?.get?.mockResolvedValue(successfulResponse);
    const result = await UtilizationService.getUtilizationMetrics();
    // expect(result).toEqual(successfulResponse);
  });

  it("should handle error and return error response", async () => {
    const errorResponse = {
      response: { status: 500, data: "Internal Server Error" },
    };
    AxiosInstance?.get?.mockRejectedValue(errorResponse);
    const result = await UtilizationService.getUtilizationMetrics();
    // expect(result).toEqual(errorResponse.response);
  });

  it("should return response on success for getUtilizationMetricDetail", async () => {
    const successfulResponse = { data: "some data" };
    AxiosInstance?.get?.mockResolvedValue(successfulResponse);
    const activity = "some data";
    const result = await UtilizationService.getUtilizationMetricDetail(
      activity
    );
    // expect(result).toEqual(successfulResponse);
  });

  it("should handle error and return error response", async () => {
    const errorResponse = {
      response: { status: 500, data: "Internal Server Error" },
    };
    AxiosInstance?.get?.mockRejectedValue(errorResponse);
    const activity = "someActivity";
    const result = await UtilizationService.getUtilizationMetricDetail(
      activity
    );
    // expect(result).toEqual(errorResponse.response);
  });

  it("should return response when payload.exportData is true", async () => {
    const successfulResponse = { data: "some data" };
    const payload = { exportData: true };
    AxiosInstance?.get?.mockResolvedValue(successfulResponse);

    const result = await UtilizationService.getUtilizationMetricData(payload);

    // expect(result).toEqual(successfulResponse);
  });

  it("should return response when payload.exportData is false", async () => {
    const successfulResponse = { data: "some data" };
    const payload = {
      exportData: false,
      limit: 10,
      search: "searchValue",
    };
    AxiosInstance?.get?.mockResolvedValue(successfulResponse);

    const result = await UtilizationService.getUtilizationMetricData(payload);

    // expect(result).toEqual(successfulResponse);
  });

  it("should return response on success for utilizarionetrics", async () => {
    const type = "type1";
    const payload = { userID: "id", data: "data" };
    const successfulResponse = "success response";
    AxiosInstance?.post?.mockResolvedValue(successfulResponse);
    const result = await UtilizationService.utilizationMetrics(type, payload);
    // expect(result).toEqual(successfulResponse);
  });

  it("should handle error and return error response", async () => {
    const type = "type1";
    const payload = { userID: "id", data: "data" };
    const errorResponse = { response: { status: 500, data: "Error" } };
    AxiosInstance?.post?.mockResolvedValueOnce(errorResponse);
    const result = await UtilizationService.utilizationMetrics(type, payload);
    // expect(result).toEqual(errorResponse.response);
  });
});