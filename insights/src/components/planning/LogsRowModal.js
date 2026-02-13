import { useState } from "react";
import {
  Dialog,
  Tooltip,
  IconButton,
  Grid,
  OutlinedInput,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { FiCopy } from "react-icons/fi";
import ReactJson from "react-json-view";
import { UI_TEXTS } from "../common/Constants/label-contants";

import "./css/tasks.css";

const LogsRowModal = ({ modalData, setModalData, showModal, setShowModal }) => {
  const [copied, setCopied] = useState(false);

  const isRawField =
    modalData?.field === "command" || modalData?.field === "output";

  // Helper function to safely parse JSON
  function isJsonString(value) {
    if (typeof value !== "string") return null;
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed;
      }
      return false;
    } catch {
      return null;
    }
  }

  const outputMappingArr = () => {
    const valueMap = isJsonString(modalData?.row?.output);
    const result = modalData?.row?.variableMapping?.map((item) => ({
      ...item,
      value: valueMap ? valueMap[item.description] : "-",
    }));
    return result;
  };

  //  const handleCopy = async () => {
  //   if (modalData?.value) {
  //     try {
  //       // If it's an object or array → stringify it nicely
  //       const valueToCopy =
  //         typeof modalData.value === "object"
  //           ? JSON.stringify(modalData.value, null, 2)
  //           : String(modalData.value);

  //       await navigator.clipboard.writeText(valueToCopy);
  //       setCopied(true);
  //       setTimeout(() => setCopied(false), 2000);
  //     } catch (err) {
  //       console.error("Failed to copy text:", err);
  //     }
  //   }
  // };

  const handleCopy = async () => {
    try {
      let valueToCopy;
      if (modalData?.field === "variableMapping") {
        const mappingData = outputMappingArr();
        valueToCopy = JSON.stringify(mappingData, null, 2);
      } else if (typeof modalData?.value === "object") {
        valueToCopy = JSON.stringify(modalData.value, null, 2);
      } else {
        valueToCopy = String(modalData?.value || "");
      }
      await navigator.clipboard.writeText(valueToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Dialog
      open={showModal}
      onClose={() => setShowModal(!showModal)}
      maxWidth={false}
      sx={{
        "& .MuiDialog-paper": {
          margin: "auto",
          minWidth: "650px",
          minHeight: "350px",
          maxHeight: modalData?.field === "variableMapping" ? "90vh" : null,
        },
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #cdcdcd",
          color: "#2B87E3",
          fontSize: "20px",
          padding: "10px 15px",
        }}
      >
        <p className="left-panel-title" style={{ margin: 0, fontWeight: 500 }}>
          {modalData?.field === "variableMapping"
            ? UI_TEXTS.TABLE_TEXTS.OUTPUT_FIELD_MAPPING
            : modalData?.field}
        </p>
        <p
          style={{
            cursor: "pointer",
            margin: 0,
            display: "flex",
            alignItems: "center",
          }}
          onClick={() => setShowModal(false)}
        >
          <RxCross2 size={22} />
        </p>
      </div>

      {/* Content with Copy Icon */}
      <div style={{ padding: "20px", position: "relative" }}>
        <Tooltip title={copied ? "Copied!" : "Copy"}>
          <IconButton
            size="small"
            onClick={handleCopy}
            style={{
              position: "absolute",
              top: "25px",
              right: "25px",
              color: copied ? "green" : "#2B87E3",
            }}
          >
            <FiCopy size={18} />
          </IconButton>
        </Tooltip>
        {isRawField ? (
          <>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontFamily: "Manrope",
                margin: 0,
                width: "850px",
                height: "350px",
                overflowY: "scroll",
                fontSize: "14px",
                border: "1px solid #eee",
                padding: "10px",
                borderRadius: "6px",
                background: "#fafafa",
              }}
            >
              {modalData?.value && isJsonString(modalData.value) ? (
                <ReactJson
                  src={JSON.parse(modalData.value)}
                  name={false}
                  collapsed={false}
                  enableClipboard={false}
                  displayDataTypes={false}
                />
              ) : (
                <>{modalData?.value}</>
              )}
            </pre>
          </>
        ) : modalData?.field === "variableMapping" ? (
          <ul style={{ paddingLeft: "0px" }}>
            {outputMappingArr()?.map((mapping, index) => (
              <li
                key={`logs-vm-${index}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  gap: "20px",
                  marginTop: "10px",
                }}
              >
                <section style={{ width: "50%" }}>
                  <label className="market_place_title_ele">Description</label>
                  <OutlinedInput
                    fullWidth
                    placeholder="Enter description"
                    value={mapping.description}
                    sx={{
                      borderRadius: "16px",
                      "& input": {
                        height: "12px",
                      },
                    }}
                    onClick={() => {}}
                  />
                </section>
                <section style={{ width: "50%" }}>
                  <label className="market_place_title_ele">Field Name</label>
                  <OutlinedInput
                    fullWidth
                    placeholder="Enter field name"
                    value={mapping.fieldName}
                    sx={{
                      borderRadius: "16px",
                      "& input": {
                        height: "12px",
                      },
                    }}
                    onClick={() => {}}
                  />
                </section>
                <section style={{ width: "50%" }}>
                  <label className="market_place_title_ele">Value</label>
                  <OutlinedInput
                    fullWidth
                    placeholder="Enter field name"
                    value={mapping.value}
                    sx={{
                      borderRadius: "16px",
                      "& input": {
                        height: "12px",
                      },
                    }}
                    onClick={() => {}}
                  />
                </section>
              </li>
            ))}
          </ul>
        ) : (
          <ul style={{ padding: "0px", margin: "0px", listStyle: "none" }}>
            <li>{modalData?.value}</li>
          </ul>
        )}
      </div>
    </Dialog>
  );
};

export default LogsRowModal;
