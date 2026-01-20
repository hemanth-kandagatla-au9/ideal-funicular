import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import agentManagementAction from "@/redux/actions/agentManagement.action";
import { getAgentGlobalConfig, isGlobalConfigLoading } from "@/redux/selectors/agentManagement.selectors";
import "../css/agentStyle.css";
import { globalConfiguration } from "@/constants/strings";

interface ConfigItem {
  propertyName: string;
  propertyValue: string;
  canModify: boolean;
  isVisible: boolean;
}

interface GlobalConfigurationModalProps {
  show: boolean;
  onHide: () => void;
}

const GlobalConfigurationModal: React.FC<GlobalConfigurationModalProps> = ({ show, onHide }) => {
  const dispatch = useDispatch();
  const globalConfigData = useSelector(getAgentGlobalConfig);
  const loading = useSelector(isGlobalConfigLoading);
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (show) {
      dispatch(agentManagementAction.fetchGlobalConfig());
    }
  }, [show, dispatch]);

  useEffect(() => {
    if (globalConfigData && globalConfigData.configs && Array.isArray(globalConfigData.configs)) {
      setConfigs(globalConfigData.configs);
    }
  }, [globalConfigData]);

  const handleInputChange = (index: number, value: string) => {
    const updatedConfigs = [...configs];
    updatedConfigs[index].propertyValue = value;
    setConfigs(updatedConfigs);
  };

  const togglePasswordVisibility = (propertyName: string) => {
    setShowPasswords(prev => ({ ...prev, [propertyName]: !prev[propertyName] }));
  };

  const isPasswordField = (propertyName: string): boolean => propertyName.toLowerCase().includes("password");

  const handleSave = () => {
    const payload = { riseBot: configs };
    dispatch(agentManagementAction.saveGlobalConfig(payload));
    onHide();
  };

  const handleClose = () => {
    setConfigs([]);
    setShowPasswords({});
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" dialogClassName="globalConfigCustomModalDialog" centered>
      <Modal.Header closeButton>
        <Modal.Title>{globalConfiguration}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : null}
        {!loading && configs.length === 0 ? (
          <div className="text-center py-4">
            <p>No configuration data available.</p>
          </div>
        ) : null}
        {!loading && configs.length > 0 ? (
          <div className="config-fields-container">
            {configs
              .filter(config => config.isVisible)
              .map((config, index) => {
                const isPassword = isPasswordField(config.propertyName);
                const showPassword = showPasswords[config.propertyName];
                return (
                  <div key={config.propertyName} className="mb-3">
                    <Form.Group>
                      <Form.Label>{config.propertyName}</Form.Label>
                      <div style={{ position: "relative" }}>
                        <Form.Control
                          type={isPassword && !showPassword ? "password" : "text"}
                          value={config.propertyValue}
                          onChange={e => handleInputChange(index, e.target.value)}
                          placeholder="--"
                        />
                        {isPassword && (
                          <Button
                            variant="link"
                            onClick={() => togglePasswordVisibility(config.propertyName)}
                            style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}
                          >
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                        )}
                      </div>
                    </Form.Group>
                  </div>
                );
              })}
          </div>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GlobalConfigurationModal;