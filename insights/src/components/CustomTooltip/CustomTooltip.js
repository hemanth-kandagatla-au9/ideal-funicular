import React, { useState } from "react";
import {
  Tooltip,
  TooltipProps,
  tooltipClasses,
  styled,
  IconButton,
} from "@mui/material";
import CommandEditorDialog from "../common/commonEditorDialogue";
import CodeIcon from "../../assets/images/webide.png";
import { formattedDate } from "../../utils/CommonUtils";
// Custom width tooltip with green styling
const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#ffffff", // Green background
    color: "#000000", // Black text
    maxWidth: 500,
    border: "1px solid #ffffff", // Darker green border
    boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
    padding: 0,
    borderRadius: "4px",
    fontFamily: "Manrope",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#033EDA", // Green arrow to match background
  },
});

const TooltipContent = styled("div")({
  padding: "12px",
  fontFamily: "Manrope",
});

const TooltipRow = styled("div")({
  display: "flex",
  marginBottom: "6px",
  "&:last-child": {
    marginBottom: 0,
  },
  fontFamily: "Manrope",
});

const TooltipLabel = styled("span")({
  fontWeight: 600,
  minWidth: "80px",
  marginRight: "12px",
  color: "#033EDA",
  fontSize: "12px",
  fontFamily: "Manrope",
});

const TooltipValue = styled("span")({
  flex: 1,
  color: "#000000",
  fontSize: "12px",
  fontFamily: "Manrope",
  fontWeight: 600,
});

const TooltipTitle = styled("div")({
  fontWeight: 600,
  marginBottom: "8px",
  color: "#000000", // Black title
  fontSize: "1rem",
  fontFamily: "Manrope",
});

// Main detail tooltip component
export const DetailTooltip = ({ children, details = [], title, ...props }) => {
  return (
    <CustomWidthTooltip
      {...props}
      title={
        <TooltipContent>
          {title && (
            <TooltipTitle sx={{ color: "#334155", fontFamily: "Manrope" }}>
              {title}
            </TooltipTitle>
          )}
          {details.map((item, index) => (
            <TooltipRow key={index}>
              <TooltipLabel>{item.label}:</TooltipLabel>
              {item.value ? (
                <TooltipValue sx={{ fontFamily: "Manrope", color: "#334155" }}>
                  {item.value}
                </TooltipValue>
              ) : item.customComponent ? (
                item.customComponent
              ) : (
                "-"
              )}
            </TooltipRow>
          ))}
        </TooltipContent>
      }
    >
      {children}
    </CustomWidthTooltip>
  );
};

// Specific template tooltip component
// export const TemplateTooltip = ({ template, children }) => {
//   const [currentEditorItem, setCurrentEditorItem] = useState(null);
//   const [showEditor, setShowEditor] = useState(false);
//  console.log("template",template)
//   const handleEditorClick = (e) => {
//     e.stopPropagation();
//     setCurrentEditorItem(template);
//     setShowEditor(true);
//   };

//   const handleClose = () => {
//     setShowEditor(false);
//     setCurrentEditorItem(null);
//   };

//   if (!template) return children;

//   // Format variable parameters for display
//   let variableParamsDisplay = "None";
//   const params = template.variableParameters;

//   if (params && typeof params === "object" && !Array.isArray(params)) {
//     const entries = Object.entries(params).filter(([key]) => key.trim() !== "");

//     if (entries.length > 0) {
//       const allValuesEmpty = entries.every(([, value]) => {
//         return value === null || value === undefined || String(value).trim() === "";
//       });

//       if (allValuesEmpty) {
//         // Show only keys
//         variableParamsDisplay = (
//           <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
//             {entries.map(([key], idx) => (
//               <TooltipRow key={idx}>
//                 <TooltipValue sx={{ fontWeight: 600, color: "#000", fontFamily: "Manrope" }}>
//                   {key}
//                 </TooltipValue>
//               </TooltipRow>
//             ))}
//           </div>
//         );
//       } else {
//         // Show key: value
//         variableParamsDisplay = (
//           <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
//             {entries.map(([key, value], idx) => (
//               <TooltipRow key={idx}>
//                 <TooltipLabel>{key}:</TooltipLabel>
//                 <TooltipValue>{value ?? "—"}</TooltipValue>
//               </TooltipRow>
//             ))}
//           </div>
//         );
//       }
//     }
//   }

//   const details = [
//     { label: "Template Name", value: template.templateName },
//     { label: "Description", value: template.description || "—" },
//     { label: "Type", value: template.templateType },
//     { label: "Access Type", value: template.accessType },
//     { label: "Tags", value: template.tags?.length ? template.tags.join(", ") : "—" },
//     {
//       label: "Script",
//       customComponent: (
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <IconButton
//             onClick={handleEditorClick}
//             size="small"
//             style={{
//               backgroundColor: "#f2f7f3",
//               "&:hover": { backgroundColor: "#e0f0e3" },
//             }}
//           >
//             <img src={CodeIcon} alt="code editor" style={{ width: 20 }} />
//           </IconButton>
//         </div>
//       ),
//     },
//     {
//       label: "Input Variables",
//       customComponent: variableParamsDisplay,
//     },
//     { label: "Version", value: template.templateVersion || "—" },
//     {
//       label: "Created",
//       value: template.createdAt
//         ? new Date(template.createdAt).toLocaleString()
//         : "-",
//     },
//     {
//       label: "Updated",
//       value: template.updatedAt
//         ? new Date(template.updatedAt).toLocaleString()
//         : "-",
//     },
//   ];

//   return (
//     <>
//       <DetailTooltip details={details} title={template.templateName}>
//         {children}
//       </DetailTooltip>
//       {showEditor && (
//         <CommandEditorDialog
//           open={showEditor}
//           setCommand={() => {}}
//           onClose={handleClose}
//           command={currentEditorItem?.commandScripts || ""}
//           viewOnly={true}
//           title="Script Editor"
//           handleSaveChanges={false}
//         />
//       )}
//     </>
//   );
// };

// export const TemplateTooltip = ({ template, children }) => {
//   const [currentEditorItem, setCurrentEditorItem] = useState(null);
//   const [showEditor, setShowEditor] = useState(false);

//   const handleEditorClick = (e) => {
//     e.stopPropagation();
//     setCurrentEditorItem(template);
//     setShowEditor(true);
//   };

//   const handleClose = () => {
//     setShowEditor(false);
//     setCurrentEditorItem(null);
//   };

//   if (!template) return children;

//   // Format variable parameters for display
//   let variableParamsDisplay = "None";
//   const params = template.variableParameters;
// console.log("params======>",params)
//   if (params && typeof params === "object" && !Array.isArray(params)) {
//     const entries = Object.entries(params).filter(([key]) => key.trim() !== "");

//     if (entries.length > 0) {
//       const allValuesEmpty = entries.every(([, value]) => {
//         return (
//           value === null || value === undefined || String(value).trim() === ""
//         );
//       });

//       if (allValuesEmpty) {
//         // Show only keys
//         variableParamsDisplay = (
//           <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
//             {entries.map(([key], idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   fontFamily: "Manrope",
//                   fontSize: "12px",
//                   fontWeight: 600,
//                   color: "#000",
//                   display: "flex",
//                   alignItems: "center",
//                   // gap: "8px",
//                 }}
//               >
//                 <span style={{ minWidth: "100px", fontWeight: 700 }}>
//                   {key}
//                 </span>
//               </div>
//             ))}
//           </div>
//         );
//       } else {
//         // Show key: value
//         variableParamsDisplay = (
//           <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
//             {entries.map(([key, value], idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   fontFamily: "Manrope",
//                   fontSize: "12px",
//                   fontWeight: 600,
//                   color: "#000",
//                   display: "flex",
//                   alignItems: "center",
//                   // gap: "8px",
//                 }}
//               >
//                 <span
//                   style={{ minWidth: "100px", fontWeight: 700, color: "#000" }}
//                 >
//                   {key}:
//                 </span>
//                 <span style={{ flex: 1, fontWeight: 500, color: "#000" }}>
//                   {value ?? "—"}
//                 </span>
//               </div>
//             ))}
//           </div>
//         );
//       }
//     }
//   }

//   const details = [
//     { label: "Template Name", value: template.templateName },
//     { label: "Description", value: template.description || "—" },
//     { label: "Type", value: template.templateType },
//     { label: "Access Type", value: template.accessType },
//     {
//       label: "Tags",
//       value: template.tags?.length ? template.tags.join(", ") : "—",
//     },
//     {
//       label: "Script",
//       customComponent: (
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <IconButton
//             onClick={handleEditorClick}
//             size="small"
//             style={{
//               backgroundColor: "#f2f7f3",
//               "&:hover": { backgroundColor: "#e0f0e3" },
//             }}
//           >
//             <img src={CodeIcon} alt="code editor" style={{ width: 20 }} />
//           </IconButton>
//         </div>
//       ),
//     },
//     {
//       label: "Input Variables",
//       customComponent: variableParamsDisplay,
//     },
//     { label: "Version", value: template.templateVersion || "—" },
//     {
//       label: "Created",
//       value: template.createdAt
//         ? new Date(template.createdAt).toLocaleString()
//         : "-",
//     },
//     {
//       label: "Updated",
//       value: template.updatedAt
//         ? new Date(template.updatedAt).toLocaleString()
//         : "-",
//     },
//   ];

//   return (
//     <>
//       <DetailTooltip details={details} title={template.templateName}>
//         {children}
//       </DetailTooltip>
//       {showEditor && (
//         <CommandEditorDialog
//           open={showEditor}
//           setCommand={() => {}}
//           onClose={handleClose}
//           command={currentEditorItem?.commandScripts || ""}
//           viewOnly={true}
//           title="Script Editor"
//           handleSaveChanges={false}
//         />
//       )}
//     </>
//   );
// };

export const TemplateTooltip = ({ template, children }) => {
  const [currentEditorItem, setCurrentEditorItem] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleEditorClick = (e) => {
    e.stopPropagation();
    setCurrentEditorItem(template);
    setShowEditor(true);
  };

  const handleClose = () => {
    setShowEditor(false);
    setCurrentEditorItem(null);
  };

  if (!template) return children;

  // Safely parse variableParameters
  const params = template.variableParameters;
  let parsedParams = {};
  try {
    parsedParams = typeof params === "string" ? JSON.parse(params) : params;
  } catch (e) {
    parsedParams = {};
  }

  // Determine display for input variables
  let variableParamsDisplay = "None";

  if (
    parsedParams &&
    typeof parsedParams === "object" &&
    !Array.isArray(parsedParams)
  ) {
    const entries = Object.entries(parsedParams).filter(
      ([key]) => key.trim() !== ""
    );

    if (entries.length > 0) {
      const allValuesEmpty = entries.every(([, value]) => {
        return (
          value === null || value === undefined || String(value).trim() === ""
        );
      });

      if (allValuesEmpty) {
        // Show only keys
        variableParamsDisplay = (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {entries.map(([key], idx) => (
              <div
                key={idx}
                style={{
                  fontFamily: "Manrope",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ minWidth: "100px", fontWeight: 700 }}>
                  {key}
                </span>
              </div>
            ))}
          </div>
        );
      } else {
        // Show key: value
        variableParamsDisplay = (
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {entries.map(([key, value], idx) => (
              <div
                key={idx}
                style={{
                  fontFamily: "Manrope",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#000",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{ minWidth: "100px", fontWeight: 700, color: "#000" }}
                >
                  {key}:
                </span>
                <span style={{ flex: 1, fontWeight: 500, color: "#000" }}>
                  {value ?? "—"}
                </span>
              </div>
            ))}
          </div>
        );
      }
    } else {
      // No entries, show "None"
      variableParamsDisplay = "None";
    }
  }

  const details = [
    { label: "Template Name", value: template.templateName },
    { label: "Description", value: template.description || "—" },
    { label: "Type", value: template.templateType },
    { label: "Access Type", value: template.accessType },
    {
      label: "Tags",
      value: template.tags?.length ? template.tags.join(", ") : "—",
    },
    {
      label: "Script",
      customComponent: (
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={handleEditorClick}
            style={{
              backgroundColor: "#f2f7f3",
              border: "none",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            {/* Replace with your icon */}
            <img src={CodeIcon} alt="code editor" style={{ width: 20 }} />
          </button>
        </div>
      ),
    },
    {
      label: "Input Variables",
      customComponent: variableParamsDisplay,
    },
    { label: "Version", value: template.templateVersion || "—" },
    {
      label: "Created",
      value: template.createdAt ? formattedDate(template.createdAt) : "-",
    },
    {
      label: "Updated",
      value: template.updatedAt ? formattedDate(template.updatedAt) : "-",
    },
  ];

  return (
    <>
      <DetailTooltip details={details} title={template.templateName}>
        {children}
      </DetailTooltip>
      {showEditor && (
        <CommandEditorDialog
          open={showEditor}
          setCommand={() => {}}
          onClose={handleClose}
          command={currentEditorItem?.commandScripts || ""}
          viewOnly={true}
          title="Script Editor"
          handleSaveChanges={false}
        />
      )}
    </>
  );
};

export const RecordDetailTooltip = ({
  record,
  title,
  fields = null,
  children,
  ...props
}) => {
  if (!record) return children;

  const preferredOrder = [
    "command",
    "hostname",
    "startTime",
    "timestamp",
    "frequency",
    "exitStatus",
    "subShell",
    "id",
    "pid",
    "jobDescription",
    "jobTags",
    "output",
  ];

  const keys =
    Array.isArray(fields) && fields.length > 0
      ? fields
      : Array.from(new Set([...preferredOrder, ...Object.keys(record)]));

  const fmt = (val) => {
    if (val == null) return "-";
    if (Array.isArray(val)) return val.length ? val.join(", ") : "-";
    if (typeof val === "object") {
      try {
        const s = JSON.stringify(val);
        return s.length > 200 ? s.slice(0, 200) + "..." : s;
      } catch {
        return String(val);
      }
    }
    if (
      typeof val === "string" &&
      /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)
    ) {
      try {
        return formattedDate(val);
      } catch {
        return val;
      }
    }
    return String(val);
  };

  const details = keys.map((k) => ({
    label:
      k === "jobDescription" ? "Job" : k.charAt(0).toUpperCase() + k.slice(1),
    value: fmt(record[k]),
  }));

  return (
    <DetailTooltip {...props} details={details} title={"Schedule Details"}>
      {/* children must NOT include a title attribute */}
      {children}
    </DetailTooltip>
  );
};
