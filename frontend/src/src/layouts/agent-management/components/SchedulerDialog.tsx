/* eslint-disable */
import { isEmpty, merge } from "lodash";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import agentManagementAction from "../../../redux/actions/agentManagement.action";
import CronTab from "./CronTab";
import {
  cancelButtonText,
  commandText,
  editJobsText,
  scheduleButtonText,
  scheduleJobText,
  sourceDirectory,
  updateButtonText,
  validCommandMessage,
} from "../../../constants/strings";

interface SchedulerDialogProps {
  hostname: string;
  agentId: string;
  commandJob: string;
  scheduledData: {
    cron_expression?: string;
    script_content?: string;
    opensearch_enabled?: boolean;
    opensearch_index?: string;
  };
  resetSchedule: boolean;
  openEditScheduleCommand: boolean;
  openScheduleView: boolean;
  schedulerCommand: boolean;
  onHide: (success?: boolean) => void;
  closeDialog: () => void;
}

const SchedulerDialog: React.FC<SchedulerDialogProps> = ({
  hostname,
  agentId,
  commandJob,
  scheduledData,
  resetSchedule,
  openEditScheduleCommand,
  openScheduleView,
  schedulerCommand,
  onHide,
  closeDialog,
}) => {
  const dispatch = useDispatch();
  const [cronExpression, setCronExpression] = useState<string>("* * * * *");
  const [command, setCommand] = useState<string>("");
  const [enabled, setEnabled] = useState<boolean>(true);
  const [opensearchEnabled, setOpensearchEnabled] = useState<boolean>(true);
  const [opensearchIndex, setOpensearchIndex] = useState<string>("");
  const [validated, setValidated] = useState<boolean>(false);
  const [type, setType] = useState<string>("command");
  const [sourceDir, setSourceDir] = useState<string>("");

  useEffect(() => {
    if (!isEmpty(scheduledData)) {
      const { cron_expression = "", script_content = "", opensearch_enabled = true, opensearch_index = "" } = scheduledData;
      setCronExpression(cron_expression.replace("0 ", ""));
      setCommand(script_content);
      setOpensearchEnabled(opensearch_enabled);
      setOpensearchIndex(opensearch_index);
    }
  }, [scheduledData]);

  useEffect(() => {
    if (resetSchedule) resetValues();
  }, [resetSchedule]);

  const handleInputChange = (id: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    switch (id) {
      case "command":
        setCommand(value);
        break;
      case "opensearchIndex":
        setOpensearchIndex(value.toLowerCase());
        break;
      case "sourceDir":
        setSourceDir(value);
        break;
      default:
        break;
    }
  };

  const handleCronChange = (cron: string) => setCronExpression(cron);

  const resetValues = () => {
    setCronExpression("* * * * *");
    setCommand("");
    setEnabled(true);
    setOpensearchEnabled(true);
    setOpensearchIndex("");
    setType("command");
    setSourceDir("");
  };

  const saveAndUpdateCommandScheduler = (method: "save" | "update", scheduledJobId: string) => {
    setValidated(false);
    const jsonData = {
      hostname,
      agentId,
      cronExpression: `0 ${cronExpression}`,
      command: btoa(command),
      enabled,
      opensearchEnabled,
      opensearchIndex,
      type,
      sourceDir,
    };
    if (method === "save") dispatch(agentManagementAction.saveSchedulerCommand(jsonData));
    else dispatch(agentManagementAction.updateSchedulerCommand(merge(jsonData, { scheduledJobId })));

    resetValues();
    setValidated(true);
    onHide(true);
  };

  return (
    <div data-testid="schedulerId">
      <Modal show={schedulerCommand} backdrop="static" onHide={onHide} className="risebotschedularDialog">
        <Modal.Header closeButton>
          <Modal.Title className="risebot-ModalTitle">{openEditScheduleCommand ? editJobsText : scheduleJobText}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <Form noValidate validated={validated} className="scheduleForm">
            <div className="flexProperty">
              <div className="flexPadding leftSwitchSection">
                {!openEditScheduleCommand && (
                  <div className="flexPadding">
                    <div className="fieldDetails alignWidth">
                      <div className="formLabel scheduleLabel">{commandText}</div>
                      <div>
                        <Form.Control
                          data-testid="scheduleCommandInput"
                          as="textarea"
                          rows={1}
                          id="command"
                          name="command"
                          value={command}
                          onChange={e => handleInputChange("command", e)}
                          className="w-100"
                        />
                        <Form.Control.Feedback type="invalid">{validCommandMessage}</Form.Control.Feedback>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {openEditScheduleCommand && (
                <div className="flexPadding">
                  <div className="formLabel scheduleLabel">{sourceDirectory}</div>
                  <div className="fieldDetails alignWidth">
                    <Form.Control
                      data-testid="sourceDirTestid"
                      size="sm"
                      type="text"
                      id="sourceDir"
                      name="sourceDir"
                      value={sourceDir}
                      onChange={e => handleInputChange("sourceDir", e)}
                      className="w-100"
                    />
                  </div>
                </div>
              )}
            </div>
            <div>{enabled && <CronTab value={cronExpression} onClear={() => setCronExpression("* * * * *")} onChange={handleCronChange} />}</div>
            <div>
              <div className="risebotschedulerdCover">
                <button type="button" data-testid="risebotscheduleSaveCommand" className="cancelButtonAgent" onClick={closeDialog}>
                  {cancelButtonText}
                </button>
                {openScheduleView && (
                  <button
                    type="button"
                    data-testid="scheduleSaveCommand"
                    className="saveButtonAgent"
                    onClick={() => saveAndUpdateCommandScheduler("save", commandJob)}
                    disabled={command.trim() === ""}
                  >
                    {scheduleButtonText}
                  </button>
                )}
                {openEditScheduleCommand && (
                  <button type="button" data-testid="scheduleUpdateCommand" className="saveButtonAgent" onClick={() => saveAndUpdateCommandScheduler("update", commandJob)}>
                    {updateButtonText}
                  </button>
                )}
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SchedulerDialog;
