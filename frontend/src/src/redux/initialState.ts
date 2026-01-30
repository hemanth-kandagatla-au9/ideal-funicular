
interface ResponseState<T> {
  error: boolean;
  message: string;
  loading: boolean;
  data: T;
}

interface GroupData {
  groups: any[]; // Replace 'any' with specific group type if available
}

interface PermissionData {
  permissions: any[]; // Replace 'any' with specific permission type
  pagination?: {
    total_rows: number;
    limit: number;
    pageNo: number;
    total_page: number;
  };
}

interface TaskData {
  tasks: any[]; // Replace 'any' with specific task type
}

interface UserData {
  users?: any[]; // Replace 'any' with specific user type
  user?: Record<string, unknown>;
  usersActivityLog?: any[]; // Replace 'any' with specific activity log type
}

interface AuditData {
  audits: any[]; // Replace 'any' with specific audit type
}

interface InitialState {
  app: {
    appReady: boolean;
  };
  authGroup: {
    getGroupResponse: ResponseState<GroupData>;
    addGroupResponse: ResponseState<GroupData>;
    deleteGroupResponse: ResponseState<GroupData>;
    updateGroupResponse: ResponseState<GroupData>;
  };
  authpermission: {
    getPermissionResponse: ResponseState<PermissionData>;
    addPermissionResponse: ResponseState<PermissionData>;
    deletePermissionResponse: ResponseState<PermissionData>;
    updatePermissionResponse: ResponseState<PermissionData>;
    refreshPermissionCounter: number;
  };
  authtask: {
    getTaskResponse: ResponseState<TaskData>;
    addTaskResponse: ResponseState<TaskData>;
  };
  authUser: {
    getUsersResponse: ResponseState<UserData>;
    getUserResponse: ResponseState<UserData>;
    getUsersActivityLogResponse: ResponseState<UserData>;
  };
  authAudit: {
    getAuthAuditLogResponse: ResponseState<AuditData>;
  };
  utilities: {
    getUtilitiesAuditLogResponse: ResponseState<AuditData>;
  };
}

const INITIAL_STATE: InitialState = {
  app: {
    appReady: false,
  },
  authGroup: {
    getGroupResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        groups: [],
      },
    },
    addGroupResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        groups: [],
      },
    },
    deleteGroupResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        groups: [],
      },
    },
    updateGroupResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        groups: [],
      },
    },
  },
  authpermission: {
    getPermissionResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        permissions: [],
        pagination: {
          total_rows: 0,
          limit: 10,
          pageNo: 1,
          total_page: 0,
        },
      },
    },
    addPermissionResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        permissions: [],
      },
    },
    deletePermissionResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        permissions: [],
      },
    },
    updatePermissionResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        permissions: [],
      },
    },
    refreshPermissionCounter: 0,
  },
  authtask: {
    getTaskResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        tasks: [],
      },
    },
    addTaskResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        tasks: [],
      },
    },
  },
  authUser: {
    getUsersResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        users: [],
      },
    },
    getUserResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        user: {},
      },
    },
    getUsersActivityLogResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        usersActivityLog: [],
      },
    },
  },
  authAudit: {
    getAuthAuditLogResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        audits: [],
      },
    },
  },
  utilities: {
    getUtilitiesAuditLogResponse: {
      error: false,
      message: "Initializing",
      loading: false,
      data: {
        audits: [],
      },
    },
  },
};

export default INITIAL_STATE;
