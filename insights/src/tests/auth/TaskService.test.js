import apiEndpoints from "../../config/apiEndpoints";
import TaskService, {
  AxiosInstance,
} from "../../services/auth/TaskService";
import axiosMock from "axios-mock-adapter";

const { get } = apiEndpoints.auth;
const mock = new axiosMock(AxiosInstance);

mock.onPost("/your/api/endpoint").reply(200, { data: "mocked response" });

describe("Job Service", () => {
  let mockGet = null;
  let mockPost = null;
  beforeEach(() => {
    mockGet = jest.spyOn(AxiosInstance, "get");
    mockPost = jest.spyOn(AxiosInstance, "post");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle successful task addition and return response data", async () => {
    const taskData = {};

    const responseData = { data: undefined };
    mock.onPost("auth/tasks/categories").reply(200, responseData);

    const result = await TaskService.addTask(taskData);

    expect(result).toEqual(responseData.data);
  });

  it("should handle task addition failure", async () => {
    const taskData = {};

    mock
      .onPost("auth/tasks/categories")
      .reply(500, { error: "Internal Server Error" });

    const result = await TaskService.addTask(taskData);

    // expect(result).toEqual({ error: "Internal Server Error" });
  });

  it("should fetch task list by subcategory successfully", async () => {
    const responseData = { data: "mocked data" };
    mock.onGet("auth/tasks/categories/").reply(200, responseData);

    const result = await TaskService.getTaskListBySubCategory();

    const expectedResponse = {
      config: result?.config,
      data: result?.data,
      status: result?.status,
    };

    // expect(result).toEqual(expectedResponse);
  });

  it("should handle error when fetching task list by subcategory", async () => {
    const errorMessage = "Request failed with status code 404";
    mock.onGet("auth/tasks/categories/").reply(404, { error: errorMessage });

    const result = await TaskService.getTaskListBySubCategory();

    // expect(result).toEqual({ error: errorMessage });
  });

  it("TaskService setSubCategory SUCCESS", async () => {
    const response = {
      data: {
        status: true,
        statusCode: 200,
        message: "Api executed successfully",
        data: {
          subCategories: [
            {
              _id: "643fd870f9802ee44c98103f",
              subCategory: "General",
              isDeleted: false,
              createdBy: "JSing114",
              modifiedBy: "JSing114",
              createdAt: "2023-04-19T12:02:56.554Z",
              updatedAt: "2023-04-19T12:02:56.554Z",
              __v: 0,
            },
          ],
        },
      },
    };
    mockGet.mockImplementation(() => Promise.resolve(response));
    await TaskService.getSubCategory("mockUserId");
    expect(mockGet).toHaveBeenCalled();
    const calls = mockGet.mock.calls.length;
    expect(calls).toEqual(1);
  });
  it("TaskService setSubCategory FAILURE", async () => {
    const response = {
      response: {
        data: {
          status: false,
          statusCode: 401,
          message: "unauthorized",
        },
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));
    await TaskService.getSubCategory("mockUserId");
    expect(mockGet).toHaveBeenCalled();
    const calls = mockGet.mock.calls.length;
    expect(calls).toEqual(1);
  });
});