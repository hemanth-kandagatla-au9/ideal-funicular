// export const shouldHideHeader = (pathname: string): boolean => {
//   if (pathname === '/app/workflow/myspace-add' || pathname === '/app/workflow/helpcontent') {
//     return true;
//   }

//   if (pathname === '/app/workflow/capability' || pathname === '/app/workflow/capability/') {
//     return false;
//   }

//   // Hide only when there's something AFTER capability/
//   if (/^\/app\/workflow\/capability\/[^/]+/.test(pathname)) {
//     return true;
//   }

//   return false;
// };

export const shouldHideHeader = (pathname: string): boolean => {
  const cleanPath = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

  return (
    // workflow routes
    cleanPath === '/app/workflow/myspace-add' ||
    cleanPath === '/app/workflow/helpcontent' ||
    /^\/app\/workflow\/capability\/[^/]+$/.test(cleanPath) ||
    // approval request detail
    /^\/app\/cm-approvalrequest\/[^/]+$/.test(cleanPath) ||
    // request status detail
    /^\/app\/cm-requeststatus\/[^/]+$/.test(cleanPath) ||
    // pipeline create
    cleanPath === '/app/pipeline-configuration/create' ||
    // pipeline edit
    /^\/app\/pipeline-configuration\/[^/]+$/.test(cleanPath) ||
    // pipeline view
    /^\/app\/pipeline-configuration\/view\/[^/]+$/.test(cleanPath)
  );
};
