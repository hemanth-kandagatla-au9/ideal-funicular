/**
 * Assign Permissions Modal Component
 * Modal dialog for assigning permissions to a specific user with hierarchical permission structure
 */
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { User, ProjectPermissions, ModulePermissions, PermissionItem } from "@/types/UserAuthorization";
import userAuthorizationActions from "../../redux/actions/userAuthorization.action";
import "./AssignPermissionsModal.css";

interface AssignPermissionsModalProps {
  show: boolean;
  onHide: () => void;
  selectedUser: User | null;
  onAssign: (userId: string, permissionCodes: string[]) => void;
  loading?: boolean;
}

const AssignPermissionsModal: React.FC<AssignPermissionsModalProps> = ({ show, onHide, selectedUser, onAssign, loading = false }) => {
  const dispatch = useDispatch();
  const globalPermissions = useSelector((state: any) => state.userAuthorization.globalPermissions);

  const [localPermissions, setLocalPermissions] = useState<ProjectPermissions[]>([]);
  const [originalPermissions, setOriginalPermissions] = useState<ProjectPermissions[]>([]);

  // Fetch global permissions when modal opens
  useEffect(() => {
    if (show && selectedUser) {
      console.log("Fetching permissions for user:", selectedUser.id);
      dispatch(userAuthorizationActions.fetchGlobalPermissions(selectedUser.id));
    }
  }, [show, selectedUser, dispatch]);

  // Update local permissions when global permissions are loaded
  useEffect(() => {
    if (globalPermissions?.projects) {
      // Map backend response to local state with UI helpers
      const mappedProjects = globalPermissions.projects.map((project: any) => ({
        ...project,
        id: project.project,
        modules: project.modules.map((module: any) => ({
          ...module,
          id: module.module,
          allSelected: module.permissions.every((p: any) => p.granted),
        })),
      }));
      setLocalPermissions(mappedProjects);
      setOriginalPermissions(mappedProjects);
    }
  }, [globalPermissions]);

  // Helper function to extract granted permission codes
  const getGrantedPermissions = (permissions: ProjectPermissions[]) => {
    const granted: string[] = [];
    permissions.forEach(project => {
      project.modules.forEach(module => {
        module.permissions.forEach(permission => {
          if (permission.granted) {
            granted.push(permission.code);
          }
        });
      });
    });
    return granted.sort();
  };

  // Compute whether permissions have changed
  const hasChanges = useMemo(() => {
    if (originalPermissions.length === 0) return false;
    
    const currentGranted = getGrantedPermissions(localPermissions);
    const originalGranted = getGrantedPermissions(originalPermissions);
    
    // Compare arrays
    if (currentGranted.length !== originalGranted.length) return true;
    const changed = !currentGranted.every((code, index) => code === originalGranted[index]);
    
    return changed;
  }, [localPermissions, originalPermissions]);

  // Handle permission toggle
  const handlePermissionToggle = (projectId: string, moduleId: string, permissionCode: string) => {
    setLocalPermissions(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            modules: project.modules.map(module => {
              if (module.id === moduleId) {
                const updatedPermissions = module.permissions.map(permission =>
                  permission.code === permissionCode ? { ...permission, granted: !permission.granted } : permission,
                );

                // Update module allSelected based on permissions
                const allSelected = updatedPermissions.every(p => p.granted);

                return {
                  ...module,
                  permissions: updatedPermissions,
                  allSelected,
                };
              }
              return module;
            }),
          };
        }
        return project;
      }),
    );
  };

  // Handle module select all toggle
  const handleModuleSelectAll = (projectId: string, moduleId: string) => {
    setLocalPermissions(prevProjects =>
      prevProjects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            modules: project.modules.map(module => {
              if (module.id === moduleId) {
                const newSelectedState = !module.allSelected;
                return {
                  ...module,
                  allSelected: newSelectedState,
                  permissions: module.permissions.map(permission => ({
                    ...permission,
                    granted: newSelectedState,
                  })),
                };
              }
              return module;
            }),
          };
        }
        return project;
      }),
    );
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedUser) return;

    // Collect all selected permission codes (not IDs)
    const selectedPermissionCodes: string[] = [];
    localPermissions.forEach(project => {
      project.modules.forEach(module => {
        module.permissions.forEach(permission => {
          if (permission.granted) {
            // Use the code field (e.g., "agent:status:read")
            selectedPermissionCodes.push(permission.code);
          }
        });
      });
    });

    console.log("Submitting permissions:", selectedPermissionCodes);
    onAssign(selectedUser.id, selectedPermissionCodes);
  };

  // Handle cancel
  const handleCancel = () => {
    if (!loading) {
      onHide();
    }
  };

  if (!selectedUser) return null;

  return (
    <Modal show={show} onHide={handleCancel} centered size="xl" className="assign-permissions-modal" backdrop="static" keyboard={!loading}>
      <Modal.Header className="assign-permissions-modal-header">
        <Modal.Title className="assign-permissions-modal-title">Assign Permission: {selectedUser.userName}</Modal.Title>
        <button type="button" className="assign-permissions-modal-close" onClick={handleCancel} disabled={loading} aria-label="Close">
          Ã
        </button>
      </Modal.Header>

      <Modal.Body className="assign-permissions-modal-body">
        {loading ? (
          <div className="permissions-loading">
            <p>Loading permissions...</p>
          </div>
        ) : (
          <div className="Assignpermissions-container">
            {localPermissions.map(project => (
              <div key={project.id} className="project-section">
                <h3 className="project-title">{project.project}</h3>

                <div className="modules-grid">
                  {project.modules.map(module => (
                    <div key={module.id} className="module-card">
                      <div className="module-header">
                        <h4 className="module-title">{module.module}</h4>
                      </div>

                      <div className="module-permissions">
                        <div className="permission-item select-all-item">
                          <label className="permission-label">
                            <input
                              type="checkbox"
                              className="permission-checkbox"
                              checked={module.allSelected}
                              onChange={() => handleModuleSelectAll(project.id, module.id)}
                              disabled={loading}
                            />
                            <span className="toggle-switch" />
                            <span className="permission-text">Select All</span>
                          </label>
                        </div>

                        {module.permissions.map(permission => (
                          <div key={permission.code} className="permission-item">
                            <label className="permission-label">
                              <input
                                type="checkbox"
                                className="permission-checkbox"
                                checked={permission.granted}
                                onChange={() => handlePermissionToggle(project.id, module.id, permission.code)}
                                disabled={loading}
                              />
                              <span className="toggle-switch" />
                              <span className="permission-text">{permission.permission}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="assign-permissions-modal-footer">
        <Button variant="secondary" onClick={handleCancel} disabled={loading} className="assign-permissions-cancel-btn">
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading || !hasChanges} className="assign-permissions-save-btn">
          Grant : Permissions
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignPermissionsModal;
