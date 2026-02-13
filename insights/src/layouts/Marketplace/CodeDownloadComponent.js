import {
  createPowershellDownloadData,
  createPythonDownloadData,
  createScriptDownloadData,
} from "./marketplaceUtils";
import { FaFileDownload } from "react-icons/fa";
import { IconButton, Tooltip } from "@mui/material";
import { toast } from "react-toastify";

const CodeDownloadComponent = ({
  enableCodeInjection,
  fileTitle,
  actionType,
  command,
  variableMapping,
  pythonSnippet,
  bashSnippet,
  powershellSnippet,
}) => {
  const handleDownload = () => {
    toast.info("Downloading command script", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
    let integratedCommand = "";
    let extension = "doc";
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
      integratedCommand = createPowershellDownloadData(
        command,
        variableMapping,
        powershellSnippet
      );
    } else {
      integratedCommand = command;
    }

    if (actionType?.toLowerCase() === "script") extension = "sh";
    else if (actionType?.toLowerCase() === "python") extension = "py";
    else if (actionType?.toLowerCase() === "powershell") extension = "ps1";

    const filename = `${fileTitle}.${extension}`;
    const blob = new Blob([integratedCommand], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Tooltip title="Download Command Script" arrow>
        <IconButton
          onClick={handleDownload}
          color="primary"
          size="small"
          sx={{ borderRadius: "4px", padding: "6px" }}
        >
          <FaFileDownload />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default CodeDownloadComponent;
