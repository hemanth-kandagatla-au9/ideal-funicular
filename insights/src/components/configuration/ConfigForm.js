import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Card, InputGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "../auth/role/css/taskList.module.css";
import {
  getAppConfig,
  getConfig,
  updateConfig,
} from "../../services/jobs/JobsService";
import "../configuration/css/common.css";
import {
  PERMISSION_LIST,
  hasInsightsPermission,
} from "../../utils/permissionUtil";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";

const ConfigForm = () => {
  const dispatch = useDispatch();
  const config = useSelector((state) => state?.jobs?.configSetting);
  const permissionState = useSelector((state) => state.jobs?.permissions);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    opensearchUsername: "",
    threshold: "",
    // opensearchPassword: "",
    opensearchURL: "",
    applicationIndex: "",
  });

  // Check if user has write access for Settings
  const hasSettingsWriteAccess = () => {
    if (!permissionState) return false;

    const insightsProject = permissionState.find(
      (project) => project.project === "insights"
    );
    if (!insightsProject) return false;

    const settingsModule = insightsProject.modules.find(
      (module) => module.module === "Settings"
    );
    const AllModule = insightsProject.modules.find(
      (module) => module.module === "All"
    );
    if (AllModule?.hasAccess) return true;
    return settingsModule?.permissions?.some(
      (p) => p.label === "Settings : write" && p.hasAccess
    );
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        await dispatch(getConfig());
      } catch (error) {
        toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_LOAD_CONFIGURATION);
      }
    };

    fetchConfig();
  }, [dispatch]);

  useEffect(() => {
    if (config) {
      setFormData({
        opensearchUsername: config.opensearchUsername || "",
        // opensearchPassword: config.opensearchPassword || "",
        opensearchURL: config.opensearchURL || "",
        applicationIndex: config.applicationIndex || "",
        threshold: config.threshold || "",
      });
    }
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const configData = {
        _id: config?._id,
        ...formData,
      };

      const result = await dispatch(updateConfig(configData));

      if (result.error) {
        throw new Error(result.error.message);
      }

      toast.success(result?.data?.message);
    } catch (error) {
      toast.error(
        error.message || TOAST_MESSAGES.OTHERS.FAILED_TO_SAVE_CONFIGURATION
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleThresholdChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      threshold: value,
    }));
  };

  const hasWritePermission = hasInsightsPermission(
    permissionState,
    "Config",
    PERMISSION_LIST.CONFIG_WRITE
  );

  return (
    <>
      <Card className="mt-3 mb-3">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="label_title">
                    {UI_TEXTS.LABELS.USER_NAME}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="opensearchUsername"
                    value={formData.opensearchUsername}
                    onChange={handleChange}
                    placeholder={
                      UI_TEXTS.PLACEHOLDERS.ENTER_OPENSEARCH_USERNAME
                    }
                    style={{
                      borderRadius: "30px",
                      backgroundColor: !hasWritePermission ? "#FFFFFF" : "",
                    }}
                    disabled={!hasWritePermission}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="label_title">
                    {UI_TEXTS.LABELS.THRESHOLD}
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="threshold"
                    value={formData.threshold}
                    // onChange={handleChange}
                    onChange={handleThresholdChange}
                    placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_THRESHOLD}
                    style={{
                      borderRadius: "30px",
                      backgroundColor: !hasWritePermission ? "#FFFFFF" : "",
                    }}
                    disabled={!hasWritePermission}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="label_title">
                {UI_TEXTS.LABELS.OPENSEARCH_URL}
              </Form.Label>
              <Form.Control
                type="url"
                name="opensearchURL"
                value={formData.opensearchURL}
                onChange={handleChange}
                placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_OPENSEARCH_URL}
                style={{
                  borderRadius: "30px",
                  backgroundColor: !hasWritePermission ? "#FFFFFF" : "",
                }}
                disabled={!hasWritePermission}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="label_title">
                {UI_TEXTS.LABELS.APPLICATION_INDEX}
              </Form.Label>
              <Form.Control
                type="text"
                name="applicationIndex"
                value={formData.applicationIndex}
                onChange={handleChange}
                placeholder={UI_TEXTS.PLACEHOLDERS.ENTER_APPLICATION_INDEX}
                style={{
                  borderRadius: "30px",
                  backgroundColor: !hasWritePermission ? "#FFFFFF" : "",
                }}
                disabled={!hasWritePermission}
              />
            </Form.Group>

            {hasWritePermission && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading
                    ? UI_TEXTS.LOADING.SAVING
                    : UI_TEXTS.LOADING.SAVE_CONFIGURATION}
                </Button>
              </Box>
            )}
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default ConfigForm;
