import React, { useEffect, useState } from "react";
import apiEndpoints from "./../../config/apiEndpoints";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  OutlinedInput,
} from "@mui/material";
import { UI_TEXTS } from "../common/Constants/label-contants";

const CMDBQueryDialog = ({ open, onClose, item, onSave }) => {
  const [query, setQuery] = useState("");
  const [originalQuery, setOriginalQuery] = useState("");
  const tableName = item?.cmdb_table || "";
  const instance = apiEndpoints.others.cmdb_instance;
  const hostnamePlaceholder = "{hostname}";
  const [copied, setCopied] = useState(false);

  const fields =
    item?.variableMapping && Array.isArray(item.variableMapping)
      ? [
          ...new Set(
            item.variableMapping.map((v) => v.fieldName?.trim()).filter(Boolean)
          ),
        ].join(",")
      : "";

  const fullServiceNowURL = query
    ? `${instance}/api/now/table/${tableName}?sysparm_query=nameIN${hostnamePlaceholder}${query}&sysparm_fields=${fields}`
    : "";

  useEffect(() => {
    if (!open) return;

    const initialQuery = item?.query || "";
    setQuery(initialQuery);
    setOriginalQuery(initialQuery);
  }, [open]);

  const isQueryEmpty = query.trim() === "";
  const isQueryUnchanged = query === originalQuery;
  const disableSave = isQueryUnchanged;

  const handleSave = () => {
    onSave(query);
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullServiceNowURL);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div style={{ fontFamily: "Manrope" }}>
          {item?.templateName && (
            <section
              style={{
                fontSize: "14px",
                marginBottom: "6px",
              }}
            >
              <span style={{ color: "#101828", fontSize: "16px" }}>
                Template:
              </span>{" "}
              <span style={{ color: "#2961f4" }}>{item.templateName}</span>
            </section>
          )}
        </div>
      </DialogTitle>

      <DialogContent dividers>
        <Typography sx={{ mb: 2, fontSize: "14px", color: "#475467" }}>
          <b>Usage:</b> Enter a ServiceNow encoded query to filter CMDB records.
          <br />
          Use <b>^</b> for AND conditions and <b>^OR</b> for OR conditions.
          <br />
          <b>Supported operators:</b> =, !=, LIKE, STARTSWITH, ENDSWITH, IN
        </Typography>

        <Typography
          sx={{
            mb: 2,
            fontSize: "13px",
            fontFamily: "monospace",
            background: "#f9fafb",
            padding: "8px",
            borderRadius: "6px",
          }}
        >
          Example:
          <br />
          ^osLIKELinux^operational_status=1
        </Typography>

        <OutlinedInput
          fullWidth
          multiline
          rows={2}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={"Enter Query"}
          sx={{ mt: 1, pr: 5, borderRadius: "16px" }}
          // className="model_input_field"
        />
        {query && (
          <>
            <Typography
              sx={{
                mt: 2,
                fontSize: "13px",
                color: "#475467",
                fontWeight: 600,
              }}
            >
              Full ServiceNow API URL (for Postman):
            </Typography>

            <OutlinedInput
              fullWidth
              multiline
              rows={2}
              value={fullServiceNowURL}
              readOnly
              sx={{
                mt: 1,
                fontFamily: "monospace",
                background: "#f9fafb",
                borderRadius: "12px",
              }}
            />
            <Button
              size="small"
              sx={{ mt: 1, textTransform: "none" }}
              onClick={handleCopy}
            >
              {copied ? "Copied" : "Copy URL"}
            </Button>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {UI_TEXTS.BUTTONS.CANCEL}
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={disableSave}>
          {UI_TEXTS.BUTTONS.SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CMDBQueryDialog;
