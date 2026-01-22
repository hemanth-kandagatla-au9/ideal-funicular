import apiEndpoints from "../../../config/apiEndpoints";
import PermissionService, { AxiosInstance } from "../../../services/auth/PermissionService";
const { post, get, del, patch, baseUrl } = apiEndpoints.auth;

describe("Permission Service", () => {
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
  it("getPermissions SUCCESS", async () => {
    const response = {
      data: {
        status: true,
        statusCode: 200,
        message: "Api executed successfully",
        data: {
          permissions: [
            {
              _id: "62a2d73a4e99b96f0703c299",
              taskId: "62506c7ebe11eacb364ffc71",
              roleId: "62a2d72c4e99b96f0703c295",
              type: "Display",
              isDeleted: false,
              createdAt: "2022-06-10T05:31:38.933Z",
              updatedAt: "2022-06-10T05:31:38.933Z",
              __v: 0,
              role: "RoleTest1",
              task: "Create Studio workflow",
            },
            {
              _id: "629dbc0ea4b0317a9993e164",
              taskId: "62506c7ebe11eacb364ffc75",
              roleId: "62653952fa7faa343d0bd802",
              type: "Edit (Add, Update)",
              isDeleted: false,
              createdAt: "2022-06-06T08:34:22.163Z",
              updatedAt: "2022-06-06T08:34:22.163Z",
              __v: 0,
              role: "Role1",
              task: "CI Dashboard - View 1",
            },
            {
              _id: "627a579d72aa9fe19aad2825",
              taskId: "62506c7ebe11eacb364ffc72",
              roleId: "6265395bfa7faa343d0bd806",
              type: "Display",
              isDeleted: false,
              createdAt: "2022-05-10T12:16:29.702Z",
              updatedAt: "2022-05-10T12:16:29.702Z",
              __v: 0,
              role: "Role11",
              task: "Execute Task",
            },
            {
              _id: "627a53ac72aa9fe19aad280b",
              taskId: "62506c7ebe11eacb364ffc72",
              roleId: "62653952fa7faa343d0bd802",
              type: "Display",
              isDeleted: false,
              createdAt: "2022-05-10T11:59:40.019Z",
              updatedAt: "2022-05-10T11:59:40.019Z",
              __v: 0,
              role: "Role1",
              task: "Execute Task",
            },
            {
              _id: "62666541fa7faa343d0bd8ae",
              taskId: "62506c7ebe11eacb364ffc76",
              roleId: "62653952fa7faa343d0bd802",
              type: "Display",
              isDeleted: false,
              createdAt: "2022-04-25T09:09:21.751Z",
              updatedAt: "2022-04-25T09:09:21.751Z",
              __v: 0,
              role: "Role1",
              task: "CI Dashboard - View 2",
            },
            {
              _id: "626539c4fa7faa343d0bd80f",
              taskId: "62506c7ebe11eacb364ffc71",
              roleId: "62653952fa7faa343d0bd802",
              type: "Display",
              isDeleted: false,
              createdAt: "2022-04-24T11:51:32.942Z",
              updatedAt: "2022-04-24T11:51:32.942Z",
              __v: 0,
              role: "Role1",
              task: "Create Studio workflow",
            },
          ],
          pagination: { totalRows: 6, limit: "10", pageNo: "1", totalPage: 1 },
        },
      },
    };

    mockGet.mockImplementation(() => Promise.resolve(response));
    const mockPagination = {
      pagination: { totalRows: 6, limit: "10", pageNo: "1", totalPage: 1 },
    };
    const filter = null;
    const dataobj = await PermissionService.getPermissionsByGroup("123");
    expect(mockGet).toHaveBeenCalledWith(`${get.permissionsByGroup}/123`);
  });
  it("getPermissions FAILURE", async () => {
    const response = {
      response: {
        data: "Fail",
      },
    };

    mockGet.mockImplementation(() => Promise.reject(response));
    const mockPagination = {
      pagination: { totalRows: 6, limit: "10", pageNo: "1", totalPage: 1 },
    };
    const filter = null;
    const dataobj = await PermissionService.getPermissionsByGroup("123");
    expect(mockGet).toHaveBeenCalledWith(`${get.permissionsByGroup}/123`);
  });

  it("addPermission SUCCESS", async () => {
    const response = {
      data: {
        status: true,
        statusCode: 201,
        message: "Saved successfully",
        data: {
          permissions: {
            taskId: "62506c7ebe11eacb364ffc71",
            roleId: "62a2d72c4e99b96f0703c295",
            type: "Display",
            isDeleted: false,
            _id: "62a2d73a4e99b96f0703c299",
            createdAt: "2022-06-10T05:31:38.933Z",
            updatedAt: "2022-06-10T05:31:38.933Z",
            __v: 0,
          },
        },
      },
    };
    const mockData = {
      taskId: "62506c7ebe11eacb364ffc71",
      roleId: "62a2d72c4e99b96f0703c295",
      type: "Display",
    };
    mockPost.mockImplementation(() => Promise.resolve(response));
    const dataobj = await PermissionService.addPermission(mockData);
    expect(mockPost).toHaveBeenCalled();
    const calls = mockPost.mock.calls.length;
    expect(calls).toEqual(1);
  });
  it("addPermission FAILURE", async () => {
    const response = {
      response: {
        data: "Fail",
      },
    };
    const mockData = {
      taskId: "62506c7ebe11eacb364ffc71",
      roleId: "62a2d72c4e99b96f0703c295",
      type: "Display",
    };
    mockPost.mockImplementation(() => Promise.reject(response));
    const dataobj = await PermissionService.addPermission(mockData);
    expect(mockPost).toHaveBeenCalled();
    const calls = mockPost.mock.calls.length;
    expect(calls).toEqual(1);
  });
});




