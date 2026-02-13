import apiEndpoints from "../../config/apiEndpoints";
import GroupService, {
  AxiosInstance,
} from "../../services/auth/GroupService";
const { post, get, del, patch, baseUrl } = apiEndpoints.auth;

describe("Group Service", () => {
  let mockGet = null;
  let mockPost = null;
  let mockDelete = null;
  let mockUpdate = null;
  beforeEach(() => {
    mockGet = jest.spyOn(AxiosInstance, "get");
    mockPost = jest.spyOn(AxiosInstance, "post");
    mockDelete = jest.spyOn(AxiosInstance, "delete");
    mockUpdate = jest.spyOn(AxiosInstance, "patch");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("getGroups SUCCESS", async () => {
    const response = {
      data: {
        status: true,
        statusCode: 201,
        message: "Saved successfully",
        data: {
          groups: {
            group: "JJT-APP-ERP-mock",
            isDeleted: false,
            _id: "62a0a01c4e99b96f0703c21f",
            createdAt: "2022-06-08T13:11:56.119Z",
            updatedAt: "2022-06-08T13:11:56.119Z",
            __v: 0,
          },
        },
      },
    };
    mockGet.mockImplementation(() => Promise.resolve(response));

    const dataobj = await GroupService.getGroups({
      filter: "mockTask",
      pagination: { pageNo: 1, limit: 10 },
      cancel: { cancelToken: "mock-test" },
    });
    expect(mockGet).toHaveBeenCalled();
  });
  it("getGroups FAILURE", async () => {
    const response = {
      response: {
        data: "Fail",
      },
    };
    mockGet.mockImplementation(() => Promise.reject(response));

    const dataobj = await GroupService.getGroups({
      filter: "mockTask",
      pagination: { pageNo: 1, limit: 10 },
      cancel: { cancelToken: "mock-test" },
    });
    expect(mockGet).toHaveBeenCalled();
  });

  it("addGroup SUCCESS", async () => {
    const response = {
      data: {
        status: true,
        statusCode: 201,
        message: "Saved successfully",
        data: {
          groups: {
            group: "JJT-APP-ERP-Admin",
            group: "abc",
            isDeleted: false,
            _id: "62a1f92d4e99b96f0703c25a",
            createdAt: "2022-06-09T13:44:13.180Z",
            updatedAt: "2022-06-09T13:44:13.180Z",
            __v: 0,
          },
        },
      },
    };
    const mockData = {
      group: "abcc",
      group: "JJT-APP-ERP-Admin",
    };
    mockPost.mockImplementation(() => Promise.resolve(response));
    const dataobj = await GroupService.addGroup(mockData);
    // expect(mockPost).toHaveBeenCalledWith(`${post.addGroup},${ JSON.stringify(mockData)}`);
    expect(mockPost).toHaveBeenCalled();
    const calls = mockPost.mock.calls.length;
    expect(calls).toEqual(1);
  });
  it("addGroup FAILURE", async () => {
    const response = {
      response: {
        data: "Fail",
      },
    };
    const mockData = {
      groupe: "abcc",
      group: "JJT-APP-ERP-Admin",
    };
    mockPost.mockImplementation(() => Promise.reject(response));
    const dataobj = await GroupService.addGroup(mockData);
    expect(mockPost).toHaveBeenCalled();
    const calls = mockPost.mock.calls.length;
    expect(calls).toEqual(1);
  });

  it("deleteGroup SUCCESS", async () => {
    const response = {
      data: {
        status: true,
        statusCode: 201,
        message: "Saved successfully",
        data: {
          groups: {
            group: "JJT-APP-ERP-Admin",
            group: "abc",
            isDeleted: false,
            _id: "62a1f92d4e99b96f0703c25a",
            createdAt: "2022-06-09T13:44:13.180Z",
            updatedAt: "2022-06-09T13:44:13.180Z",
            __v: 0,
          },
        },
      },
    };
    const mockID = {
      _id: "6265395bfa7faa343d0bd806",
    };
    mockDelete.mockImplementation(() => Promise.resolve(response));
    const dataobj = await GroupService.deleteGroup(mockID);
    // expect(mockPost).toHaveBeenCalledWith(`${post.addGroup},${ JSON.stringify(mockID)}`);
    expect(mockDelete).toHaveBeenCalled();
    const calls = mockPost.mock.calls.length;
    expect(calls).toEqual(0);
  });

  it("deleteGroup FAILURE", async () => {
    const response = {
      response: {
        data: "Fail",
      },
    };
    const mockID = {
      _id: "6265395bfa7faa343d0bd8066",
    };
    mockDelete.mockImplementation(() => Promise.reject(response));
    const dataobj = await GroupService.deleteGroup(mockID);
    // expect(mockPost).toHaveBeenCalledWith(`${post.addGroup},${ JSON.stringify(mockID)}`);
    expect(mockDelete).toHaveBeenCalled();
    const calls = mockPost.mock.calls.length;
    expect(calls).toEqual(0);
  });

  it("updateGroup SUCCESS", async () => {
    const response = {
      data: {
        status: true,
        statusCode: 201,
        message: "Saved successfully",
        data: {
          groups: {
            group: "JJT-APP-ERP-Admin",
            group: "abc",
            isDeleted: false,
            _id: "62a1f92d4e99b96f0703c25a",
            createdAt: "2022-06-09T13:44:13.180Z",
            updatedAt: "2022-06-09T13:44:13.180Z",
            __v: 0,
          },
        },
      },
    };
    const mockID = {
      _id: "6265395bfa7faa343d0bd806",
    };
    const mockData = {
      group: "abcc",
      group: "JJT-APP-ERP-Admin",
    };
    mockUpdate.mockImplementation(() => Promise.resolve(response));
    const dataobj = await GroupService.updateGroup(mockID, mockData);
    // expect(mockPost).toHaveBeenCalledWith(`${post.addGroup},${ JSON.stringify(mockData)}`);
    expect(mockUpdate).toHaveBeenCalled();
    const calls = mockPost.mock.calls.length;
    expect(calls).toEqual(0);
  });
  it("updateGroup FAILURE", async () => {
    const response = {
      response: {
        data: "Fail",
      },
    };
    const mockID = {
      _id: "6265395bfa7faa343d0bd8066",
    };
    const mockData = {
      group: "abcc",
      group: "JJT-APP-ERP-Admin",
    };
    mockUpdate.mockImplementation(() => Promise.reject(response));
    const dataobj = await GroupService.updateGroup(mockID, mockData);
    // expect(mockPost).toHaveBeenCalledWith(`${post.addGroup},${ JSON.stringify(mockData)}`);
    expect(mockUpdate).toHaveBeenCalled();
    const calls = mockPost.mock.calls.length;
    expect(calls).toEqual(0);
  });

  it("exportGroups SUCCESS", async () => {
    const responseData = { data: "some data" };
    mockGet.mockResolvedValue(responseData);

    const result = await GroupService.exportGroups({ filter: "mockTask" });

    expect(mockGet).toHaveBeenCalledWith(expect.stringContaining("mockTask"));
    expect(result).toEqual(responseData.data);
  });

  it("exportGroups FAILURE", async () => {
    const errorData = { response: { data: "error message" } };
    mockGet.mockRejectedValue(errorData);

    const result = await GroupService.exportGroups({ filter: "mockTask" });

    expect(mockGet).toHaveBeenCalledWith(expect.stringContaining("mockTask"));
    expect(result).toEqual(errorData.response.data);
  });

  it("getGroups FAILURE with No Data Available", async () => {
    const response = {
      data: {
        status: false,
        message: "No Data Available",
      },
    };
    mockGet.mockImplementation(() => Promise.resolve(response));

    const dataobj = await GroupService.getGroups({
      filter: "mockTask",
      pagination: { pageNo: 1, limit: 10 },
      cancel: { cancelToken: "mock-test" },
    });
    // expect(dataobj).toEqual(response);
    expect(mockGet).toHaveBeenCalled();
  });
});