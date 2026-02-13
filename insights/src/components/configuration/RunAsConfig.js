import React, { useEffect, useMemo, useState } from "react";
import "./css/RunAsConfig.css";
import { FiX } from "react-icons/fi";
import { Edit2 } from "iconsax-react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserConfiguration,
  getUserConfigurations,
  saveUserConfigurations,
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
} from "./../../utils/permissionUtil";

const RunAsConfig = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const permissionState = useSelector((state) => state.jobs?.permissions);

  const userConfigurations = useSelector(
    (state) => state.jobs.userConfigurations.data || []
  );

  const [runAsConfigsList, setRunAsConfigsList] = useState([]);

  useEffect(() => {
    dispatch(getUserConfigurations());
  }, [dispatch]);

  // Validation function
  const validateInput = (value) => {
    const trimmedValue = value.trim();

    // if (!trimmedValue) {
    //   return "Value is required";
    // }

    if (trimmedValue.length < 4) {
      return "Value must be at least 4 characters";
    }

    if (trimmedValue.length > 50) {
      return "Value cannot exceed 50 characters";
    }

    // Allow alphanumeric AND question marks
    if (!/^[a-zA-Z0-9?]+$/.test(trimmedValue)) {
      return "Only alphanumeric characters allowed";
    }

    return "";
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Clear error when user starts typing
    if (inputError) {
      setInputError("");
    }

    // Optional: Validate while typing (only show error for disallowed characters)
    if (value.trim() && /[^a-zA-Z0-9?]/.test(value)) {
      setInputError("Only alphanumeric characters are allowed");
    } else {
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

    const existingValue = runAsConfigsList.flatMap((el) => {
      if (el.userList && Array.isArray(el.userList)) {
        return el.userList.map((u) => u.value);
      } else if (el.value) {
        return [el.value];
      }
      return [];
    });

    // Check if value already exists in runAsConfigsList
    if (existingValue.includes(val)) {
      toast.info("This value already exists.");
      setInputValue("");
      setInputError("");
      return;
    }

    if (editingIndex !== null) {
      const updatedRunAsConfigsList = [...runAsConfigsList];
      updatedRunAsConfigsList.map((config) => {
        if (config.uuid === editingIndex) {
          config.value = inputValue.trim();
          config.status = "Not Saved Yet";
        }
      });
      setRunAsConfigsList(updatedRunAsConfigsList);
      setEditingIndex(null);
      setInputValue("");
      setInputError("");
    } else {
      // Add new chip
      const updatedRunAsConfigsList = [
        ...runAsConfigsList,
        { value: inputValue.trim(), status: "Not Saved Yet", uuid: uuidv4() },
      ];
      setRunAsConfigsList(updatedRunAsConfigsList);
      setInputValue("");
      setInputError("");
    }
  };

  const removeNamespace = async (uuid) => {
    try {
      setIsLoading(true);
      const configToDelete = runAsConfigsList.find(
        (item) => item.uuid === uuid
      );
      setIsLoading(false);
      if (!configToDelete?._id) {
        const updatedRunAsConfigsList = runAsConfigsList.filter(
          (item) => item.uuid !== uuid
        );
        setRunAsConfigsList(updatedRunAsConfigsList);
        toast.info(TOAST_MESSAGES.OTHERS.UNSAVED_COMMAND_REMOVED);
        return;
      }

      let response = await deleteUserConfiguration(configToDelete._id);
      if (response.success) {
        toast.success(response?.message);
      }
      await dispatch(getUserConfigurations());
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
    const valueToEdit = runAsConfigsList.find(
      (item) => item.uuid === uuid
    )?.value;
    console.log("runAsConfigsList 123 => ", runAsConfigsList);
    console.log("uuid => ", uuid);
    console.log("valueToEdit => ", valueToEdit);
    setInputValue(valueToEdit);
    setEditingIndex(uuid);
    setInputError("");
  };

  const handleSave = async () => {
    try {
      // Validate all items before saving
      const invalidItems = runAsConfigsList
        .filter((el) => el.status === "Not Saved Yet")
        .filter((el) => {
          const error = validateInput(el.value);
          return error;
        });

      if (invalidItems.length > 0) {
        toast.error(
          "Some items have validation errors. Please fix them before saving.",
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }
        );
        return;
      }

      setIsLoading(true);
      const yetToSaveData = runAsConfigsList
        .filter((el) => el.status === "Not Saved Yet")
        .map((el) =>
          el?._id ? { _id: el?._id, value: el?.value } : { value: el?.value }
        );
      if (yetToSaveData.length === 0) {
        toast.info(TOAST_MESSAGES.OTHERS.NO_CHANGES_TO_SAVE);
        return;
      }

      let response = await dispatch(saveUserConfigurations(yetToSaveData));

      if (response?.success === true) {
        toast.success(response?.message || "Changes saved successfully");
        await dispatch(getUserConfigurations());
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
    const yetToSaveData = runAsConfigsList
      .filter((el) => el.status === "Not Saved Yet")
      .map((el) =>
        el?._id ? { _id: el?._id, value: el?.value } : { value: el?.value }
      );

    // Also check if any unsaved items have validation errors
    const hasValidationErrors = runAsConfigsList
      .filter((el) => el.status === "Not Saved Yet")
      .some((el) => validateInput(el.value));

    return yetToSaveData.length === 0 || hasValidationErrors;
  }, [runAsConfigsList]);

  const readPermForRunAsConfig = hasInsightsPermission(
    permissionState,
    "Run As Config",
    PERMISSION_LIST.RUN_AS_CONFIG_READ
  );
  const writePermForRunAsConfig = hasInsightsPermission(
    permissionState,
    "Run As Config",
    PERMISSION_LIST.RUN_AS_CONFIG_WRITE
  );

  useEffect(() => {
    if (userConfigurations && userConfigurations.length > 0) {
      const runAsConfigData = userConfigurations.flatMap((config) => {
        if (config.userList && Array.isArray(config.userList)) {
          return config.userList.map((el) => {
            return {
              _id: config._id,
              value: el.value,
              status: config.status,
              uuid: uuidv4(),
            };
          });
        } else if (config.value) {
          return {
            _id: config._id,
            value: config.value,
            status: config.status,
            uuid: uuidv4(),
          };
        }
        return [];
      });
      setRunAsConfigsList(runAsConfigData);
    }
  }, [userConfigurations]);

  return (
    <>
      <div className="config-container">
        {isLoading && (
          <div className="grid-loader">
            <div className="loader-spinner"></div>
          </div>
        )}
        <div className="config-body">
          {readPermForRunAsConfig && writePermForRunAsConfig && (
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_VALUE}
              className="namespace-input"
              style={{ borderRadius: "30px" }}
            />
          )}
          <div className="namespaces-container">
            {runAsConfigsList.map((config, configIndex) => {
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
                  : "";

              // Validate existing items for display
              const configError = validateInput(config.value);

              return (
                <div
                  key={`saved-${configIndex}`}
                  className={`namespace-tag ${statusClass} ${
                    configError ? "invalid-tag" : ""
                  }`}
                  title={tooltip}
                >
                  <span style={{ minWidth: "30px" }}>{config?.value}</span>
                  {readPermForRunAsConfig &&
                    writePermForRunAsConfig &&
                    config.status !== "PENDING_APPROVAL" && (
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

        {readPermForRunAsConfig && writePermForRunAsConfig && (
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

export default RunAsConfig;
