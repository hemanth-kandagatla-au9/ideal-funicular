import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import agentManagementAction from "@/redux/actions/agentManagement.action";
import { getAgentGlobalConfig, isGlobalConfigLoading } from "@/redux/selectors/agentManagement.selectors";
import "../css/agentStyle.css";
import { updateButtonText, viewEditConfigurationButtonText } from "@/constants/strings";

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

  const formatPythonScriptForEditor = (value: string): string => {
    const input = String(value ?? "");
    if (!input) return input;
    if (input.includes("\n")) return input;
    if (!input.includes(";")) return input;

    let quote: '"' | "'" | null = null;
    let escaped = false;
    let depth = 0;
    let out = "";

    for (let i = 0; i < input.length; i += 1) {
      const ch = input[i];

      if (escaped) {
        out += ch;
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        out += ch;
        escaped = true;
        continue;
      }
      if (quote) {
        out += ch;
        if (ch === quote) quote = null;
        continue;
      }
      if (ch === "'" || ch === '"') {
        out += ch;
        quote = ch as '"' | "'";
        continue;
      }
      if (ch === "(" || ch === "[" || ch === "{") depth += 1;
      if (ch === ")" || ch === "]" || ch === "}") depth = Math.max(0, depth - 1);

      if (ch === ";" && depth === 0) {
        out += ";\n";
        continue;
      }

      out += ch;
    }

    return out
      .split("\n")
      .map(line => line.trim())
      .filter((line, idx, arr) => !(line === "" && (idx === 0 || idx === arr.length - 1)))
      .join("\n");
  };

  const formatKeyAsCamelCase = (key: string): string => {
    const normalized = String(key ?? "")
      .trim()
      .replace(/[_\s-]+/g, " ")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .replace(/\s+/g, " ")
      .trim();

    if (!normalized) return key;
    return normalized
      .split(" ")
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    if (show) {
      dispatch(agentManagementAction.fetchGlobalConfig());
    }
  }, [show, dispatch]);

  useEffect(() => {
    if (globalConfigData && globalConfigData.configs && Array.isArray(globalConfigData.configs)) {
      setConfigs(
        globalConfigData.configs.map(cfg => {
          if (isTechnicalScriptField(cfg.propertyName)) {
            return { ...cfg, propertyValue: formatPythonScriptForEditor(cfg.propertyValue) };
          }
          return cfg;
        }),
      );
    }
  }, [globalConfigData]);

  const handleInputChange = (index: number, value: string) => {
    const updatedConfigs = [...configs];
    updatedConfigs[index].propertyValue = value;
    setConfigs(updatedConfigs);
  };

  const isPasswordField = (propertyName: string): boolean => propertyName.toLowerCase().includes("password");

  const isTechnicalScriptField = (propertyName: string): boolean => propertyName.toLowerCase() === "technical_info_python_script";

  const shouldUseTextarea = (propertyName: string, propertyValue: string): boolean => {
    const name = propertyName.toLowerCase();
    if (isPasswordField(propertyName)) return false;
    if (isTechnicalScriptField(propertyName)) return false;
    if (propertyValue.includes("\n")) return true;
    if (name.includes("private_key") || name.includes("pub_key") || name.includes("certificate") || name.includes("cert")) return true;
    return propertyValue.length >= 160;
  };

  const shouldSpanFullWidth = (propertyName: string, displayKey: string): boolean => {
    const key = propertyName.toLowerCase();
    if (key.includes("endpoint") || key.includes("url")) return true;
    if (key.includes("log_index") || key.includes("logindex")) return true;
    return displayKey.replace(/\u200B/g, "").length >= 26;
  };

  const handleSave = () => {
    const payload = { configs };
    dispatch(agentManagementAction.saveGlobalConfig(payload as any));
    onHide();
  };

  const handleClose = () => {
    setConfigs([]);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" dialogClassName="globalConfigCustomModalDialog" centered>
      <Modal.Header closeButton>
        <Modal.Title>{viewEditConfigurationButtonText.replace("/", "/ ")}</Modal.Title>
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
            {configs.map((config, index) => {
              const isPassword = isPasswordField(config.propertyName);
              const isTechnicalScript = isTechnicalScriptField(config.propertyName);
              const displayKey = formatKeyAsCamelCase(config.propertyName);
              const value = config.propertyValue ?? "";
              const useTextarea = shouldUseTextarea(config.propertyName, value);
              const fullWidth =
                shouldSpanFullWidth(config.propertyName, displayKey) ||
                useTextarea ||
                value.includes("\n") ||
                value.length >= 80;

              return (
                <div key={config.propertyName} className={`config-field ${fullWidth ? "config-field--full" : ""}`.trim()}>
                  <Form.Group>
                    <Form.Label>{displayKey}</Form.Label>
                    <div style={{ position: "relative" }}>
                      {isTechnicalScript ? (
                        <div className="global-config-code-editor-wrapper">
                          <CodeMirror
                            value={value}
                            height="200px"
                            extensions={[python()]}
                            onChange={(nextValue: string) => handleInputChange(index, nextValue)}
                            basicSetup={{
                              lineNumbers: true,
                              highlightActiveLine: true,
                              highlightSelectionMatches: true,
                            }}
                          />
                        </div>
                      ) : (
                        <Form.Control
                          as={useTextarea ? "textarea" : undefined}
                          rows={useTextarea ? 4 : undefined}
                          type={!useTextarea && isPassword ? "password" : "text"}
                          className={isPassword ? "global-config-password-input" : undefined}
                          value={config.propertyValue}
                          onChange={e => handleInputChange(index, e.target.value)}
                        />
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
          {loading ? "Updating..." : updateButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GlobalConfigurationModal;
