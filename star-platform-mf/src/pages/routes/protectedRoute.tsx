// // host/src/routes/ProtectedRoute.jsx
// import React from "react";
// import { Route, Redirect } from "react-router-dom";
// import { useSelector } from "react-redux";
// import ModalCustomLoader from "../components/common/loader/ModalCustomLoader";
// import {
//   PERMISSION_LIST,
//   hasInsightsPermission,
//   MODULE_LIST,
// } from "../utils/permissionUtil";
// import { isSessionValid } from "../utils/TokenUtils";

// const ProtectedRoute = ({
//   component: Component,
//   module,
//   permissionType = "read",
//   ...rest
// }) => {
//   const permissions = useSelector((state) => state.permissions.permissions);
//   const isLoading = useSelector((state) => state.permissions.isLoading);

//   if (!isSessionValid()) return <Redirect to="/login" />;

//   if (isLoading) {
//     return (
//       <div style={{
//         height: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}>
//         <ModalCustomLoader isLoading={true} />
//       </div>
//     );
//   }

//   let hasPermission = false;
//   const moduleNames = Array.isArray(MODULE_LIST[module])
//     ? MODULE_LIST[module]
//     : [MODULE_LIST[module] || module];

//   for (const modName of moduleNames) {
//     const modKey = modName.toUpperCase().replace(/ /g, "_");
//     const permKey = `${modKey}_${permissionType.toUpperCase()}`;
//     const permLabel = PERMISSION_LIST[permKey];

//     if (permLabel && hasInsightsPermission(permissions, modName, permLabel)) {
//       hasPermission = true;
//       break;
//     }
//   }

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         hasPermission ? (
//           <Component {...props} />
//         ) : (
//           <Redirect to="/unauthorized" />
//         )
//       }
//     />
//   );
// };

// export default ProtectedRoute;
