import React, { useEffect, useMemo, useState } from "react";
import "./css/RunAsConfig.css";
import { FiX } from "react-icons/fi";
import { Edit2 } from "iconsax-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePublishAsSystem,
  getPublishAsSystemConfiguration,
  savePublishAsSystemConfigurations,
} from "../../services/jobs/JobsService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "react-bootstrap";
import ConfirmationDialog from "../../layouts/report/DeleteConfirmation";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";
import { v4 as uuidv4 } from "uuid";
import {
  hasInsightsPermission,
  PERMISSION_LIST,
} from "../../utils/permissionUtil";

const PublishAsSystem = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(""); // Add error state
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const permissionState = useSelector((state) => state.jobs?.permissions);

  const publishAsSystemConfigurations = useSelector(
    (state) => state.jobs.publishAsSystemConfigurations.data || []
  );

  const [publishAsSystemsList, setPublishAsSystemsList] = useState([]);

  useEffect(() => {
    dispatch(getPublishAsSystemConfiguration());
  }, [dispatch]);

  // Validation function - 3-50 chars, allow alphanumeric, _, -
  const validateInput = (value) => {
    const trimmedValue = value.trim();

    // if (trimmedValue.length < 3) {
    //   return "Value must be at least 3 characters";
    // }

    if (trimmedValue.length > 50) {
      return "Value cannot exceed 50 characters";
    }

    // Allow alphanumeric, underscore (_), and hyphen (-)
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedValue)) {
      return "Only alphanumeric characters, underscore (_), and hyphen (-) are allowed";
    }

    return "";
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Block characters not allowed while typing
    if (/[^a-zA-Z0-9_-]/.test(value)) {
      return;
    }

    setInputValue(value);

    // Clear error when user starts typing
    if (inputError) {
      setInputError("");
    }
  };

  const handleInputBlur = () => {
    const error = validateInput(inputValue);
    setInputError(error);
  };

  const handleKeyPress = (e) => {
    if (e.key !== "Enter") return;

    const val = inputValue.trim();

    // Validate before adding
    const validationError = validateInput(val);
    if (validationError) {
      setInputError(validationError);
      toast.error(validationError, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      return;
    }

    if (!val) return;

    const existingValue = publishAsSystemsList.flatMap((el) => {
      if (el.userList && Array.isArray(el.userList)) {
        return el.userList.map((u) => u.value);
      } else if (el.value) {
        return [el.value];
      }
      return [];
    });

    // Check if value already exists in publishAsSystemsList
    if (existingValue.includes(val)) {
      toast.info("This value already exists.");
      setInputValue("");
      setInputError("");
      return;
    }

    if (editingIndex !== null) {
      const updatedPublishAsSystemsList = [...publishAsSystemsList];
      updatedPublishAsSystemsList.map((config) => {
        if (config.uuid === editingIndex) {
          config.value = inputValue.trim();
          config.status = "Not Saved Yet";
        }
      });
      setPublishAsSystemsList(updatedPublishAsSystemsList);
      setEditingIndex(null);
      setInputValue("");
      setInputError("");
    } else {
      // Add new chip
      const updatedPublishAsSystemsList = [
        ...publishAsSystemsList,
        { value: inputValue.trim(), status: "Not Saved Yet", uuid: uuidv4() },
      ];
      setPublishAsSystemsList(updatedPublishAsSystemsList);
      setInputValue("");
      setInputError("");
    }
  };

  const removeNamespace = async (uuid) => {
    try {
      setIsLoading(true);
      const configToDelete = publishAsSystemsList.find(
        (item) => item.uuid === uuid
      );
      if (!configToDelete?._id) {
        const updatedPublishAsSystemsList = publishAsSystemsList.filter(
          (item) => item.uuid !== uuid
        );
        setPublishAsSystemsList(updatedPublishAsSystemsList);
        toast.info(TOAST_MESSAGES.OTHERS.UNSAVED_COMMAND_REMOVED);
        return;
      }

      let response = await deletePublishAsSystem(configToDelete._id);
      if (response.success) {
        toast.success(response?.message);
      }
      await dispatch(getPublishAsSystemConfiguration());
      setIsLoading(false);
    } catch (err) {
      toast.error(
        `Failed to delete configuration: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const editNamespace = (uuid) => {
    const valueToEdit = publishAsSystemsList.find(
      (item) => item.uuid === uuid
    )?.value;
    console.log("publishAsSystemsList 123 => ", publishAsSystemsList);
    console.log("uuid => ", uuid);
    console.log("valueToEdit => ", valueToEdit);
    setInputValue(valueToEdit);
    setEditingIndex(uuid);
    setInputError("");
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const yetToSaveData = publishAsSystemsList
        .filter((el) => el.status === "Not Saved Yet")
        .map((el) =>
          el?._id ? { _id: el?._id, value: el?.value } : { value: el?.value }
        );
      if (yetToSaveData.length === 0) {
        toast.info(TOAST_MESSAGES.OTHERS.NO_CHANGES_TO_SAVE);
        return;
      }

      let response = await dispatch(
        savePublishAsSystemConfigurations(yetToSaveData)
      );

      if (response?.success === true) {
        toast.success(response?.message || "Changes saved successfully");
        await dispatch(getPublishAsSystemConfiguration());
      } else {
        toast.error(response?.message || "Failed to save changes");
      }
    } catch (error) {
      toast.error(`Failed to save configurations: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      removeNamespace(deleteIndex);
      setDeleteIndex(null);
      setDeleteDialogOpen(false);
    }
  };

  const isSaveDisabled = useMemo(() => {
    // No namespaces at all
    const yetToSaveData = publishAsSystemsList
      .filter((el) => el.status === "Not Saved Yet")
      .map((el) =>
        el?._id ? { _id: el?._id, value: el?.value } : { value: el?.value }
      );
    console.log("yetToSaveData => ", yetToSaveData);
    if (yetToSaveData.length === 0) return true;
    else if (yetToSaveData.length !== 0) return false;
    return false; // no changes found
  }, [publishAsSystemsList]);

  const readPermForPublishAsSystem = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.SCHEDULE_READ
  );
  const writePermForPublishAsSystem = hasInsightsPermission(
    permissionState,
    "Schedule",
    PERMISSION_LIST.SCHEDULE_WRITE
  );

  useEffect(() => {
    if (
      publishAsSystemConfigurations &&
      publishAsSystemConfigurations.length > 0
    ) {
      const publishAsSystemData = publishAsSystemConfigurations.flatMap(
        (config) => {
          if (config.userList && Array.isArray(config.userList)) {
            return config.userList.map((el) => {
              return {
                _id: config._id,
                value: el.value,
                status: config.status,
                uuid: uuidv4(),
                isUsed: config.isUsed,
              };
            });
          } else if (config.value) {
            return {
              _id: config._id,
              value: config.value,
              status: config.status,
              uuid: uuidv4(),
              isUsed: config.isUsed,
            };
          }
          return [];
        }
      );
      setPublishAsSystemsList(publishAsSystemData);
    }
  }, [publishAsSystemConfigurations]);

  return (
    <>
      <div className="config-container">
        {isLoading && (
          <div className="grid-loader">
            <div className="loader-spinner"></div>
          </div>
        )}
        <div className="config-body">
          {readPermForPublishAsSystem && writePermForPublishAsSystem && (
            <>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyPress={handleKeyPress}
                placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_VALUE}
                className="namespace-input"
                style={{
                  borderRadius: "30px",
                }}
              />
            </>
          )}
          <div className="namespaces-container">
            {publishAsSystemsList.map((config, configIndex) => {
              const statusClass =
                config.status === "PENDING_APPROVAL"
                  ? "pending"
                  : config.status === "REJECTED"
                  ? "rejected"
                  : config.status === "ACTIVE"
                  ? "active"
                  : config.status === "Not Saved Yet"
                  ? "not_saved_yet"
                  : "";
              const tooltip =
                config.status === "PENDING_APPROVAL"
                  ? "Approval Pending"
                  : config.status === "REJECTED"
                  ? "rejected"
                  : config.status === "ACTIVE"
                  ? "active"
                  : config.status === "Not Saved Yet"
                  ? "not saved yet"
                  : config.isUsed
                  ? "This configuration is already used in schedule"
                  : "";

              return (
                <div
                  key={`saved-${configIndex}`}
                  className={`namespace-tag ${statusClass}`}
                  title={tooltip}
                >
                  <span style={{ minWidth: "30px" }}>{config?.value}</span>
                  {readPermForPublishAsSystem &&
                    writePermForPublishAsSystem &&
                    config.status !== "PENDING_APPROVAL" &&
                    !config?.isUsed && (
                      <div className="tag-actions">
                        <button
                          onClick={() => editNamespace(config?.uuid)}
                          className="edit-tag"
                          title={UI_TEXTS.BUTTONS.EDIT}
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          onClick={() => {
                            setDeleteIndex(config?.uuid);
                            setDeleteDialogOpen(true);
                          }}
                          className="remove-tag"
                          title="Remove"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>

        {readPermForPublishAsSystem && writePermForPublishAsSystem && (
          <div className="config-footer">
            <Button
              className="save-btn"
              onClick={handleSave}
              disabled={isSaveDisabled || isLoading}
              variant="primary"
            >
              {UI_TEXTS.BUTTONS.SAVE}
            </Button>
          </div>
        )}
      </div>
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteIndex(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Command"
        message="Are you sure you want to delete this command?"
      />
    </>
  );
};

export default PublishAsSystem;
