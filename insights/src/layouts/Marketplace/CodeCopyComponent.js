import {
  createPythonDownloadData,
  createScriptDownloadData,
} from "./marketplaceUtils";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { IconButton, Tooltip } from "@mui/material";
import { useState } from "react";

const CodeCopyComponent = ({
  enableCodeInjection,
  fileTitle,
  actionType,
  command,
  variableMapping,
  pythonSnippet,
  bashSnippet,
  powershellSnippet,
}) => {
  const [copyMsg, setCopyMsg] = useState("Copy Command Script");
  const handleCopy = (e) => {
    e.stopPropagation(); // Prevents bubbling
    let integratedCommand = "";
    if (enableCodeInjection && actionType?.toLowerCase() === "script") {
      integratedCommand = createScriptDownloadData(
        command,
        variableMapping,
        bashSnippet
      );
    } else if (enableCodeInjection && actionType?.toLowerCase() === "python") {
      integratedCommand = createPythonDownloadData(
        command,
        variableMapping,
        pythonSnippet
      );
    } else if (
      enableCodeInjection &&
      actionType?.toLowerCase() === "powershell"
    ) {
      integratedCommand = createPythonDownloadData(
        command,
        variableMapping,
        powershellSnippet
      );
    } else {
      integratedCommand = command;
    }

    navigator.clipboard.writeText(integratedCommand).then(() => {
      setCopyMsg("Copied");
      setTimeout(() => setCopyMsg("Copy Command Script"), 2000);
    });
  };

  return (
    <>
      <Tooltip title={copyMsg} arrow>
        <IconButton
          onClick={handleCopy}
          color="primary"
          size="small"
          sx={{ borderRadius: "4px", padding: "6px" }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default CodeCopyComponent;
