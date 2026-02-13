import axios from 'axios';
import axiosInstance from './axiosInstance';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

export const authAction = async (data: any) => {
  try {
    const response = await axiosInstance.post('/auth/authAction', data);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getUserPermissions = async () => {
  try {
    const AUTH_API_URL = process.env.AUTH_API_URL;
    const getAccessToken = () => cookies.get('iasphere_access_token');
    const token = getAccessToken();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const response = await axios.get(`${AUTH_API_URL}/auth/getUserPermission`, {
      headers: headers,
    });
    if (response.data?.statusCode === 401 && response?.data?.message === 'Session Expired') {
      window.location.href = '/session-expired';
      return null;
    }
    console.log('response from getUserPermissions => ', response);
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401 || error?.response?.message === 'Session Expired') {
      window.location.href = '/session-expired';
      return null;
    }
    return error.response;
  }
};

// export const mockPermissions = [
//   {
//     project: "insights",
//     modules: [
//       {
//         module: "Reports",
//         hasAccess: true,
//         permissions: [
//           { label: "Reports : read", hasAccess: false },
//           { label: "Reports : write", hasAccess: false },
//           { label: "Reports : export", hasAccess: false },
//           {
//             label: "Reports : report_publish_as_system",
//             hasAccess: false,
//           },
//         ],
//       },
//       {
//         module: "Request Status",
//         hasAccess: false,
//         permissions: [
//           { label: "Request Status : read", hasAccess: false },
//           { label: "Request Status : write", hasAccess: false },
//         ],
//       },
//       {
//         module: "Users",
//         hasAccess: false,
//         permissions: [{ label: "Users : read", hasAccess: false }],
//       },
//       {
//         module: "CMDB",
//         hasAccess: true,
//         permissions: [{ label: "CMDB : read", hasAccess: true }],
//       },
//     ],
//   },
//    {
//     project : "agent",
//     modules : [{
//       module:"Rise Agent",
//       hasAccess:true,
//        permissions: [
//           { label: "Rise Agent : read", hasAccess: true },
//           { label: "Rise Agent : write", hasAccess: true },
//         ],
//     }]

//   },
//   {
//     project: "workflow",
//     modules: [
//       {
//         module: "Approval Flow",
//         hasAccess: false,
//         permissions: [
//           { label: "Approval Flow : read", hasAccess: false },
//           { label: "Approval Flow : write", hasAccess: false },
//         ],
//       },
//       {
//         module: "Workflow",
//         hasAccess: false,
//         permissions: [{ label: "Workflow : read", hasAccess: false }],
//       },
//       {
//         module: "Execution",
//         hasAccess: false,
//         permissions: [{ label: "Execution : read", hasAccess: false }],
//       },
//       {
//         module: "Capabilities",
//         hasAccess: false,
//         permissions: [{ label: "Capabilities : read", hasAccess: false }],
//       },
//       {
//         module: "Approval Requests",
//         hasAccess: true,
//         permissions: [
//           { label: "Approval Requests : read", hasAccess: false },
//         ],
//       },
//       {
//         module: "Audit",
//         hasAccess: false,
//         permissions: [{ label: "Audit : read", hasAccess: false }],
//       },
//       {
//         module: "Analytics",
//         hasAccess: false,
//         permissions: [{ label: "Analytics : read", hasAccess: false }],
//       },
//       {
//         module: "Manage Nodes",
//         hasAccess: false,
//         permissions: [{ label: "Manage Nodes : read", hasAccess: false }],
//       },
//       {
//         module: "Approval Settings",
//         hasAccess: false,
//         permissions: [
//           { label: "Approval Settings : read", hasAccess: false },
//         ],
//       },
//       {
//         module: "Category",
//         hasAccess: false,
//         permissions: [{ label: "Category : read", hasAccess: false }],
//       },
//       {
//         module: "Server",
//         hasAccess: false,
//         permissions: [{ label: "Server : read", hasAccess: false }],
//       },
//     ],
//   },
// ];

