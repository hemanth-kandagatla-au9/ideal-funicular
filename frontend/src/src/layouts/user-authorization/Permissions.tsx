import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlinePlus } from "react-icons/ai";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import PopUp from "@/components/popup/popUp.component";
import Pagination from "@/components/ui/pagination/Pagination.component";
import { getPermissions, isUsersLoading, getPermissionsPagination } from "@/redux/selectors/userAuthorization.selectors";
import userAuthorizationActions from "../../redux/actions/userAuthorization.action";
import NoDataFoundImg from "../../images/agent-management/NoDATA.png";
import "./Permissions.css";

interface Permission {
  id: string;
  project: string;
  module: string;
  permission: string;
  code: string;
  description?: string;
  createdAt: string;
  createdBy: string;
}

const Permissions: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const permissions = useSelector(getPermissions);
  const loading = useSelector(isUsersLoading);
  const permissionsPagination = useSelector(getPermissionsPagination);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [projectInput, setProjectInput] = useState("");
  const [moduleInput, setModuleInput] = useState("");
  const [permissionInput, setPermissionInput] = useState("");
  const [projectError, setProjectError] = useState("");
  const [moduleError, setModuleError] = useState("");
  const [permissionError, setPermissionError] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<{ id: string; name: string } | null>(null);
  useEffect(() => {
    dispatch(
      userAuthorizationActions.fetchPermissions({
        page: 1,
        limit: 10,
        project: "",
        module: "",
        permission: "",
      }),
    );
  }, [dispatch]);
  const handleBack = () => {
    history.push("/userAuthorization");
  };
  const handleRowSelect = (permissionId: string) => {
    setSelectedPermissions(prev => (prev.includes(permissionId) ? prev.filter(id => id !== permissionId) : [...prev, permissionId]));
  };
  const handleSelectAll = () => {
    if (selectedPermissions.length === permissions.length && permissions.length > 0) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissions.map((p: Permission) => p.id));
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${month} ${day}, ${year} | ${time}`;
  };
  const handleAddPermission = () => {
    setProjectError("");
    setModuleError("");
    setPermissionError("");
    let hasError = false;
    if (!projectInput.trim()) {
      setProjectError("Project is required");
      hasError = true;
    }
    if (!moduleInput.trim()) {
      setModuleError("Module is required");
      hasError = true;
    }
    if (!permissionInput.trim()) {
      setPermissionError("Permission is required");
      hasError = true;
    }

    if (hasError) {
      return;
    }

    dispatch(
      userAuthorizationActions.createPermission({
        project: projectInput.trim(),
        module: moduleInput.trim().toLowerCase(),
        permission: permissionInput.trim().toLowerCase(),
      }),
    );
    setProjectInput("");
    setModuleInput("");
    setPermissionInput("");
  };
  const handleDeletePermission = (id: string, permissionName: string) => {
    setPermissionToDelete({ id, name: permissionName });
    setShowDeleteConfirmation(true);
  };

  const confirmDeletePermission = () => {
    if (permissionToDelete) {
      dispatch(userAuthorizationActions.deletePermission(permissionToDelete.id));
      setShowDeleteConfirmation(false);
      setPermissionToDelete(null);
    }
  };

  const cancelDeletePermission = () => {
    setShowDeleteConfirmation(false);
    setPermissionToDelete(null);
  };

  const permissionLabels = ["Project", "Module", "Permission", "Created At", "Created By", "Action"];

  return (
    <div className="permissions-container">
      <div className="permissions-header">
        <IoIosArrowBack color="#000" size="24px" onClick={handleBack} style={{ cursor: "pointer", marginRight: "12px" }} />
        <span className="breadcrumb-link" onClick={handleBack}>
          User Authorization
        </span>
        <span className="breadcrumb-separator"> / </span>
        <span className="breadcrumb-current">Permissions</span>
      </div>

      <div className="permissions-filters">
        <div className="filter-group">
          <label className="filter-label">Project</label>
          <select
            className={`filter-select ${projectError ? "filter-select-error" : ""}`}
            value={projectInput}
            onChange={e => {
              setProjectInput(e.target.value);
              if (projectError) setProjectError("");
            }}
          >
            <option value="">Select project</option>
            <option value="agent">Agent</option>
            <option value="workflow">Workflow</option>
            <option value="insights">Insights</option>
            <option value="cybersphere">Cybersphere</option>
          </select>
          {projectError && <span className="filter-error">{projectError}</span>}
        </div>

        <div className="filter-group">
          <label className="filter-label">Module</label>
          <input
            type="text"
            className={`filter-select ${moduleError ? "filter-select-error" : ""}`}
            placeholder="Enter Module"
            value={moduleInput}
            onChange={e => {
              setModuleInput(e.target.value);
              if (moduleError) setModuleError("");
            }}
          />
          {moduleError && <span className="filter-error">{moduleError}</span>}
        </div>

        <div className="filter-group">
          <label className="filter-label">Permissions</label>
          <input
            type="text"
            className={`filter-select ${permissionError ? "filter-select-error" : ""}`}
            placeholder="Enter Permission"
            value={permissionInput}
            onChange={e => {
              setPermissionInput(e.target.value);
              if (permissionError) setPermissionError("");
            }}
          />
          {permissionError && <span className="filter-error">{permissionError}</span>}
        </div>

        <div className="filter-group-btn">
          <button type="button" className="add-btn" onClick={handleAddPermission}>
            <AiOutlinePlus size={20} color="#ffffff" />
            <span className="add-btn-text">Add</span>
          </button>
        </div>
      </div>

      <div className="table-header">
        <div className="table-cell table-cell-project">
          <span className="table-label">{permissionLabels[0]}</span>
        </div>
        <div className="table-cell table-cell-module">
          <span className="table-label">{permissionLabels[1]}</span>
        </div>
        <div className="table-cell table-cell-permissions">
          <span className="table-label">{permissionLabels[2]}</span>
        </div>
        <div className="table-cell table-cell-created-at">
          <span className="table-label">{permissionLabels[3]}</span>
        </div>
        <div className="table-cell table-cell-created-by">
          <span className="table-label">{permissionLabels[4]}</span>
        </div>
        <div className="table-cell table-cell-action">
          <span className="table-label">{permissionLabels[5]}</span>
        </div>
      </div>

      {loading && (
        <div className="table-body">
          {Array.from({ length: permissionsPagination.limit }).map((_, i) => (
            <div className="table-row" key={i}>
              <div className="table-cell table-cell-project">
                <Skeleton animation="wave" variant="text" width="120px" height={25} />
              </div>
              <div className="table-cell table-cell-module">
                <Skeleton animation="wave" variant="text" width="120px" height={25} />
              </div>
              <div className="table-cell table-cell-permissions">
                <Skeleton animation="wave" variant="text" width="100px" height={25} />
              </div>
              <div className="table-cell table-cell-created-at">
                <Skeleton animation="wave" variant="text" width="140px" height={25} />
              </div>
              <div className="table-cell table-cell-created-by">
                <Skeleton animation="wave" variant="text" width="80px" height={25} />
              </div>
              <div className="table-cell table-cell-action">
                <Skeleton animation="wave" variant="circular" width={24} height={24} />
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && permissions.length === 0 && (
        <div className="table-empty">
          <div className="table-empty-content">
            <img src={NoDataFoundImg} alt="No Data" />
            <p>No permissions found</p>
          </div>
        </div>
      )}
      {!loading && permissions.length > 0 && (
        <div className="table-body">
          {permissions.map((permission: Permission) => (
            <div className="table-row" key={permission.id}>
              <div className="table-cell table-cell-project">
                <span className="table-value">{permission.project}</span>
              </div>
              <div className="table-cell table-cell-module">
                <span className="table-value">{permission.module}</span>
              </div>
              <div className="table-cell table-cell-permissions">
                <span className="table-value">{permission.permission}</span>
              </div>
              <div className="table-cell table-cell-created-at">
                <span className="table-value">{formatDate(permission.createdAt)}</span>
              </div>
              <div className="table-cell table-cell-created-by">
                <span className="table-value">{permission.createdBy}</span>
              </div>
              <div className="table-cell table-cell-action">
                <button type="button" className="table-action-btn" onClick={() => handleDeletePermission(permission.id, permission.permission)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 5H17.5" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path
                      d="M15.8332 5V16.6667C15.8332 17.5 14.9998 18.3333 14.1665 18.3333H5.83317C4.99984 18.3333 4.1665 17.5 4.1665 16.6667V5"
                      stroke="#667085"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.6665 4.99984V3.33317C6.6665 2.49984 7.49984 1.6665 8.33317 1.6665H11.6665C12.4998 1.6665 13.3332 2.49984 13.3332 3.33317V4.99984"
                      stroke="#667085"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {permissionsPagination.total > 0 && (
        <div style={{ marginTop: "20px" }}>
          <Pagination
            pagination={{
              pageNo: permissionsPagination.page,
              totalPage: Math.ceil(permissionsPagination.total / permissionsPagination.limit),
              totalRows: permissionsPagination.total,
              limit: permissionsPagination.limit,
            }}
            handlePagination={(limit: number, pageNo: number) => {
              dispatch(
                userAuthorizationActions.fetchPermissions({
                  page: pageNo,
                  limit,
                }),
              );
            }}
          />
        </div>
      )}

      <PopUp
        show={showDeleteConfirmation}
        onHide={cancelDeletePermission}
        handleClick={confirmDeletePermission}
        dataObj={{
          header: "Delete Permission",
          body: (
            <span>
              Are you sure you want to delete permission <strong style={{ color: "black" }}>&quot;{permissionToDelete?.name}&quot;</strong>?
              <br />
            </span>
          ),
          button: {
            buttonOne: {
              buttonOneName: "Delete",
              buttonBg: "modalButtonDanger",
              variant: "danger",
            },
            buttonTwo: {
              buttonTwoName: "Cancel",
              buttonBg: "modalButtonWhite",
            },
          },
        }}
      />
    </div>
  );
};

export default Permissions;
