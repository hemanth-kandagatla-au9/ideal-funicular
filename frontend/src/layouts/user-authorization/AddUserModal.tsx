import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { FaEye, FaEyeSlash, FaCopy, FaSearch, FaTimes, FaChevronDown } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import { User } from "../../types/UserAuthorization";
import "./AddUserModal.css";

interface AddUserModalProps {
  show: boolean;
  onHide: () => void;
  onAdd: (userData: { username: string; password: string; isActive: boolean; cloneFromUserId?: string }) => void;
  loading?: boolean;
  users?: User[];
}

const AddUserModal: React.FC<AddUserModalProps> = ({ show, onHide, onAdd, loading = false, users = [] }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCloneUser, setSelectedCloneUser] = useState<User | null>(null);
  const [showCloneDropdown, setShowCloneDropdown] = useState(false);
  const [cloneUserSearch, setCloneUserSearch] = useState("");
  const [touched, setTouched] = useState({ username: false, password: false });
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const validateUsername = (value: string): string => {
    if (!value.trim()) return "Username is required";
    if (value.length < 3) return "Username must be at least 3 characters";
    if (value.length > 50) return "Username must not exceed 50 characters";
    if (!/^[A-Za-z0-9_-]+$/.test((value || "").trim())) return "Username can only contain letters, numbers, hyphens, and underscores";
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/[@$!%*?&]/.test(value)) return "Password must contain at least one special character (@$!%*?&)";
    return "";
  };
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUsername(value);
    if (touched.username) {
      setUsernameError(validateUsername(value));
    }
  };

  const handleUsernameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (related?.closest?.(".add-user-modal-close") || related?.closest?.(".add-user-cancel-btn")) {
      return;
    }

    setTouched(prev => ({ ...prev, username: true }));
    setUsernameError(validateUsername(e.target.value));
  };

  const handlePasswordBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (related?.closest?.(".add-user-modal-close") || related?.closest?.(".add-user-cancel-btn")) {
      return;
    }

    setTouched(prev => ({ ...prev, password: true }));
    setPasswordError(validatePassword(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
    if (touched.password) {
      setPasswordError(validatePassword(value));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };
  const filteredUsers = users.filter(
    user => user.userName.toLowerCase().includes(cloneUserSearch.toLowerCase()) && (user.rolesCount || 0) > 0, // Only show users with permissions
  );
  const handleSelectCloneUser = (user: User) => {
    setSelectedCloneUser(user);
    setShowCloneDropdown(false);
    setCloneUserSearch("");
  };

  const handleClearCloneUser = () => {
    setSelectedCloneUser(null);
    setCloneUserSearch("");
  };
  const handleAdd = () => {
    const usernameErr = validateUsername(username);
    const passwordErr = validatePassword(password);

    setUsernameError(usernameErr);
    setPasswordError(passwordErr);
    setTouched({ username: true, password: true });

    if (usernameErr || passwordErr) return;

    onAdd({
      username: username.trim(),
      password,
      isActive,
      cloneFromUserId: selectedCloneUser?.userName,
    });
    setUsername("");
    setPassword("");
    setIsActive(true);
    setSelectedCloneUser(null);
    setCloneUserSearch("");
    setTouched({ username: false, password: false });
    setUsernameError("");
    setPasswordError("");
  };

  const handleCancel = () => {
    setUsername("");
    setPassword("");
    setIsActive(true);
    setSelectedCloneUser(null);
    setCloneUserSearch("");
    setTouched({ username: false, password: false });
    setUsernameError("");
    setPasswordError("");
    onHide();
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleAdd();
    }
  };
  const isFormValid = !validateUsername(username) && !validatePassword(password);

  return (
    <Modal show={show} onHide={handleCancel} centered className="add-user-modal" backdrop="static" keyboard={!loading}>
      <div className="add-user-modal-content">
        <Modal.Header className="add-user-modal-header">
          <Modal.Title className="add-user-modal-title">Add New User</Modal.Title>
          <button className="add-user-modal-close" onClick={handleCancel} disabled={loading} aria-label="Close">
            ✕
          </button>
        </Modal.Header>

        <Modal.Body className="add-user-modal-body">
          <div className="add-user-form-group">
            <label className="add-user-label" htmlFor="username-input">
              Username :
            </label>
            <input
              id="username-input"
              type="text"
              className={`add-user-input ${usernameError ? "add-user-input-error" : ""}`}
              placeholder="Enter username"
              value={username}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              onKeyDown={handleKeyDown}
              disabled={loading}
              autoFocus
            />
            {usernameError && <div className="add-user-error-message">{usernameError}</div>}
          </div>

          <div className="add-user-form-group">
            <label className="add-user-label">Clone Permissions from :</label>

            {selectedCloneUser ? (
              <div className="clone-user-selected">
                <div>
                  <span className="clone-user-name">{selectedCloneUser.userName}</span>
                </div>
                <button type="button" className="clone-user-clear" onClick={handleClearCloneUser} disabled={loading} aria-label="Clear selection">
                  X
                </button>
              </div>
            ) : (
              <div className="clone-user-dropdown-container">
                <div className="clone-user-trigger" onClick={() => !loading && setShowCloneDropdown(!showCloneDropdown)}>
                  <span className="clone-user-placeholder">Select</span>
                  <FaChevronDown style={{ color: "#94a3b8", marginLeft: "auto" }} size={14} />
                </div>

                {showCloneDropdown && (
                  <div className="clone-user-dropdown">
                    <div className="clone-user-search">
                      <FaSearch style={{ color: "#94a3b8" }} size={14} />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={cloneUserSearch}
                        onChange={e => setCloneUserSearch(e.target.value)}
                        className="clone-user-search-input"
                        autoFocus
                      />
                    </div>

                    <div className="clone-user-list">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                          <div key={user.id} className="clone-user-item" onClick={() => handleSelectCloneUser(user)}>
                            <div className="clone-user-item-info">
                              <span className="clone-user-item-name">{user.userName}</span>
                              {!user.isActive && <span className="clone-user-inactive-badge">Inactive</span>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="clone-user-empty">{cloneUserSearch ? "No users found" : "No users with permissions available"}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="add-user-form-group" style={{ position: "relative" }}>
            <label className="add-user-label" htmlFor="password-input">
              Password :
            </label>
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              className={`add-user-input ${passwordError ? "add-user-input-error" : ""}`}
              placeholder="Enter password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              onKeyDown={handleKeyDown}
              disabled={loading}
              style={{ paddingRight: 36 }}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={toggleShowPassword}
              disabled={loading}
              style={{
                position: "absolute",
                right: 8,
                top: 42,
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                height: 24,
                width: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showPassword ? <FaEye size={18} color="#888" /> : <FaEyeSlash size={18} color="#888" />}
            </button>
            {passwordError && <div className="add-user-error-message">{passwordError}</div>}
            <div className="add-user-requirements">
              Password must contain:
              <ul>
                <li>At least 8 characters</li>
                <li>One special character(@$!%*?&)</li>
                <li>May contain numbers and uppercase/lowercase letters</li>
              </ul>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="add-user-modal-footer">
          <Button className="add-user-cancel-btn" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button className="add-user-add-btn" onClick={handleAdd} disabled={!isFormValid || loading}>
            {loading ? "Adding..." : "Add User"}
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default AddUserModal;
