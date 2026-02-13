// // helpers.ts
// import { AuthPermissionsResponse } from "./types";

// let permissionIndex: Record<string, boolean> = {};

// export function buildPermissionIndex(data: AuthPermissionsResponse) {
//   const index: Record<string, boolean> = {};

//   data.permissions.forEach(project => {
//     project.modules.forEach(mod => {
//       const base = `${project.project}:${mod.module}`.toLowerCase();
//       index[`${base}:any`] = mod.hasAccess;

//       mod.permissions.forEach(p => {
//         const act = p.label.split(":")[1].trim().toLowerCase();
//         index[`${base}:${act}`] = p.hasAccess;
//       });
//     });
//   });

//   permissionIndex = index;
//   return index;
// }

// export function hasPermission(project: string, module: string, action: PermissionAction = "any") {
//   return !!permissionIndex[`${project}:${module}:${action}`.toLowerCase()];
// }
