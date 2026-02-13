import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WebIde from "../planning/WebIDE";
import Classes from "../planning/css/subheader.module.css";
import { UI_TEXTS } from "./Constants/label-contants";

const CommandEditorDialog = ({
  open,
  onClose,
  command,
  setCommand,
  viewOnly = false,
  handleSaveChanges = false,
  showSaveButton = false,
  dataVariable,
}) => {
  const [editedCommand, setEditedCommand] = React.useState(command);

  React.useEffect(() => {
    setEditedCommand(command);
  }, [command]);

  const handleSave = () => {
    setCommand(editedCommand);
    onClose();
  };

  const handleDialogClose = () => {
    // if (setCommand) setCommand(editedCommand);
    if (onClose) onClose();
  };

  return (
    <Dialog
      fullScreen
      open={open}
      // onClose={onClose}
      onClose={handleDialogClose}
      //  onClose={() => {
      //   setCommand(editedCommand);
      //   onClose();
      // }}
      aria-labelledby="command-editor-dialog-title"
    >
      <DialogTitle sx={{ m: 0, p: "2rem" }} id="command-editor-dialog-title">
        <div data-testid="tasklist" className="iabot-filter-row">
          <div data-testid="plannerTest1">
            <div
              style={{
                fontFamily: "Manrope",
                fontSize: "24px",
                marginBottom: "15px",
                color: "#101828",
                fontWeight: 500,
              }}
            >
              {viewOnly ? "View Command Scripts" : UI_TEXTS.LABELS.INSIGHTS}
            </div>
            {dataVariable && (
              <section
                style={{
                  color: "#2961f4",
                  fontSize: "14px",
                  marginBottom: "5px",
                  fontFamily: "Manrope",
                }}
              >
                <span
                  style={{
                    color: "#101828",
                    fontSize: "16px",
                    fontFamily: "Manrope",
                    marginRight: "5px",
                  }}
                >
                  Template:
                </span>
                {dataVariable}
              </section>
            )}
            <section
              style={{
                color: "#82807c",
                fontSize: "16px",
                fontFamily: "Manrope",
              }}
            >
              {viewOnly 
                ? UI_TEXTS.SECTIONS.VIEW_COMMAND_SCRIPTS 
                : UI_TEXTS.SECTIONS.COMMAND_SCRIPTS_EDITOR}
            </section>
          </div>
        </div>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleDialogClose}
        // onClick={onClose}
        // onClick={() => {
        //   setCommand(editedCommand);
        //   onClose();
        // }}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <WebIde
          style={{
            height: "100%",
            width: "100%",
            fontFamily: "Manrope",
            color: "#101828",
          }}
          language="javascript"
          onChange={(value) => setEditedCommand(value)}
          value={editedCommand}
          defaultValue={command}
          selectedMode={!viewOnly} 
          dataVariable={dataVariable}
          readOnly={viewOnly}
        />
      </DialogContent>
      {!viewOnly && ( 
        <>
          {handleSaveChanges && (
            <DialogActions>
              <Button onClick={handleSave} variant="contained" color="primary">
                {UI_TEXTS.BUTTONS.SAVE_CHANGES}
              </Button>
            </DialogActions>
          )}
          {showSaveButton && (
            <DialogActions>
              <Button onClick={handleSave} variant="contained" color="primary">
                {UI_TEXTS.BUTTONS.SAVE}
              </Button>
            </DialogActions>
          )}
        </>
      )}
    </Dialog>
  );
};

export default CommandEditorDialog;
