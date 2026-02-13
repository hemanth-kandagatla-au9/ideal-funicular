export const hasPermission = (
  permissions,
  projectName,
  moduleName,
  permissionLabel // optional
) => {
  // console.log("typeof permissions => ", typeof permissions);
  // find project

  if (projectName === 'workflow' && moduleName === 'Workflow Settings') {
    const project = permissions.find((p) => p.project === projectName);
    if (!project) return false;
    // find module
    if (
      project.modules.find(
        (el) =>
          (el.module === 'Approval Settings' && el.hasAccess) ||
          (el.module === 'Category' && el.hasAccess) ||
          (el.module === 'Server' && el.hasAccess)
      )
    ) {
      return true;
    }
    return false;
  }

  if (projectName === 'insights' && moduleName === 'Insights Settings') {
    const project = permissions.find((p) => p.project === projectName);
    if (!project) return false;
    // find module
    if (
      project.modules.find(
        (el) =>
          (el.module === 'Schedule Categories' && el.hasAccess) ||
          (el.module === 'Open Search' && el.hasAccess) ||
          (el.module === 'Command Category' && el.hasAccess) ||
          (el.module === 'Config' && el.hasAccess) ||
          (el.module === 'Approval Flow' && el.hasAccess) ||
          (el.module === 'Internal Jobs' && el.hasAccess) ||
          (el.module === 'Run As Config' && el.hasAccess) ||
          (el.module === 'Schedule System Publish Config' && el.hasAccess)
      )
    ) {
      return true;
    }
    return false;
  }

  const project = permissions.find((p) => p.project === projectName);
  if (!project) return false;

  // find module
  const module = project.modules.find((m) => m.module === moduleName);
  if (!module || !module.hasAccess) return false;

  // if permissionLabel NOT passed → module-level check
  if (!permissionLabel) {
    return true;
  }

  // permission-level check
  const permission = module.permissions.find((p) => p.label === permissionLabel);

  return !!permission?.hasAccess;
};
