/* eslint-disable react/button-has-type */
/**
 * User Authorization Component
 * Displays a list of users with their authorization details
 */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Skeleton } from "@mui/material";
import { IoIosArrowBack } from "react-icons/io";
import { MdCheckBox, MdCheckBoxOutlineBlank, MdDelete } from "react-icons/md";
import userAuthorizationActions from "@/redux/actions/userAuthorization.action";
import { getUsers, isUsersLoading, getUsersError, getUsersPagination, getSelectedUsers } from "@/redux/selectors/userAuthorization.selectors";
import { User } from "@/types/UserAuthorization";
import AssignPermissionsModal from "../user-authorization/AssignPermissionModal";
import Pagination from "@/components/ui/pagination/Pagination.component";
import AddUserModal from "../user-authorization/AddUserModal";
import NoDataFoundImg from "../../images/agent-management/NoDATA.png";
import buttonBaseIcon from "../../images/agent-management/assets/Button_base.png";
import actionIcon from "../../images/agent-management/assets/action_icon.png";
import PopUp from "@/components/popup/popUp.component";
import searchIcon from "../../images/agent-management/assets/searchIcon.svg";
import "./UserAuthorization.css";
import "../user-authorization/AssignPermissionsModal.css";

const UserAuthorization: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // Redux selectors
  const users = useSelector(getUsers);
  const loading = useSelector(isUsersLoading);
  const error = useSelector(getUsersError);
  const pagination = useSelector(getUsersPagination);
  const selectedUsers = useSelector(getSelectedUsers);

  // Ensure users is always an array
  const usersList = Array.isArray(users) ? users : [];

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAssignPermissionsModal, setShowAssignPermissionsModal] = useState(false);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<User | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Fetch users on component mount only
  useEffect(() => {
    dispatch(
      userAuthorizationActions.fetchUsers({
        page: 1,
        limit: 10,
        search: searchTerm,
      }),
    );
  }, [dispatch, searchTerm]);

  // Handle search submit
  const handleSearch = () => {
    setSearchTerm(searchInput.trim());
  };

  // Handle back navigation
  const handleBack = () => {
    history.push("/");
  };

  // Handle Permission List button (placeholder)
  const handlePermissionList = () => {
    history.push("/permissions");
  };

  // Handle Add User button
  const handleAddUserClick = () => {
    setShowAddUserModal(true);
  };

  // Handle Add User modal submit
  const handleAddUser = (userData: { username: string; password: string; isActive: boolean; cloneFromUser?: string }) => {
    dispatch(userAuthorizationActions.createUser(userData));
    setShowAddUserModal(false);

    // If cloneFromUser is provided, show a message about cloning permissions
    if (userData.cloneFromUser) {
      const clonedFromUser = usersList.find(u => u.id === userData.cloneFromUser);
      if (clonedFromUser) {
        console.log(`Cloning permissions from ${clonedFromUser.userName} to new user ${userData.username}`);
      }
    }
  };

  // Handle row selection
  const handleRowSelect = (userId: string) => {
    dispatch(userAuthorizationActions.selectUser(userId));
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedUsers.length === usersList.length && usersList.length > 0) {
      dispatch(userAuthorizationActions.clearSelectedUsers());
    } else {
      dispatch(userAuthorizationActions.selectAllUsers(usersList.map((u: User) => u.id)));
    }
  };

  const handleDeleteUser = (username: string) => {
    setUserToDelete(username);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      dispatch(userAuthorizationActions.deleteUser(userToDelete));
      setShowDeleteConfirmation(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setShowDeleteConfirmation(false);
    setUserToDelete(null);
  };

  // Handle assign permissions modal
  const handleAssignPermissions = (user: User) => {
    setSelectedUserForPermissions(user);
    setShowAssignPermissionsModal(true);
  };

  // Handle assign permissions submit
  const handleAssignPermissionsSubmit = (userId: string, permissionCodes: string[]) => {
    // Pass userId and permission codes array to the action
    dispatch(userAuthorizationActions.assignUserPermissions(userId, permissionCodes));
    setShowAssignPermissionsModal(false);
    setSelectedUserForPermissions(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();
    const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    return `${month} ${day}, ${year} | ${time}`;
  };

  const userLabels = ["User name", "Created By", "Updated By", "Created At", "Updated At", "Action"];
  return (
    <div className="user-authorization-container">
      <div className="user-authorization-header">
        {/* Left Section - Back Arrow + Title */}
        <div className="header-left">
          <IoIosArrowBack color="#000" size="24px" onClick={handleBack} style={{ cursor: "pointer" }} />
          <h1 className="header-title">User Authorisation</h1>
        </div>
      </div>

      {/* ============================================ */}
      {/* USERS COUNT + PERMISSION LIST SECTION       */}
      {/* ============================================ */}
      <div className="users-section">
        {/* Left - Users Count */}
        <div className="users-count">
          <span className="users-label">Users</span>
          <span className="users-number">{pagination.total}</span>
        </div>
        <div className="users-actions">
          <div className="risebot-searchfilter-user">
            <input
              type="text"
              className="user-search-input search-icon-input"
              placeholder="Search by Username"
              value={searchInput}
                         onChange={e => {
                const value = e.target.value;
                setSearchInput(value);
                if (value.trim() === "") {
                  setSearchTerm("");
                }
              }}
              onKeyDown={e => {
                if (e.key === "Enter") handleSearch();
              }}
              aria-label="Search by username"
              style={{
                backgroundImage: `url(${searchIcon})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "0px center",
                backgroundSize: "20px 20px",
                paddingLeft: "28px",
              }}
            />
          </div>
          {/* Right - Buttons */}
          <button type="button" className="permission-list-btn" onClick={handlePermissionList}>
            <img src={buttonBaseIcon} alt="users icon" className="permission-icon" />
            <span className="permission-text">Permission List</span>
          </button>
          <button className="add-user-btn" onClick={handleAddUserClick}>
            <span className="add-user-btn-icon">+</span>
            <span className="add-user-btn-text">Add User</span>
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* TABLE HEADER                                */}
      {/* ============================================ */}
      <div className="user-table-header">
        {/* <div className="user-table-cell user-table-cell-checkbox">
          <button type="button" className="user-checkbox-btn" onClick={handleSelectAll}>
            {selectedUsers.length === users.length && users.length > 0 ? (
              <MdCheckBox size={20} color="#2961f4" />
            ) : (
              <MdCheckBoxOutlineBlank size={20} color="#64748B" />
            )}
          </button>
        </div> */}
        <div className="user-table-cell user-table-cell-name">
          <span className="user-table-label">{userLabels[0]}</span>
        </div>
        <div className="user-table-cell user-table-cell-created-by">
          <span className="user-table-label">{userLabels[1]}</span>
        </div>
        <div className="user-table-cell user-table-cell-updated-by">
          <span className="user-table-label">{userLabels[2]}</span>
        </div>
        <div className="user-table-cell user-table-cell-date">
          <span className="user-table-label">{userLabels[3]}</span>
        </div>
        <div className="user-table-cell user-table-cell-date">
          <span className="user-table-label">{userLabels[4]}</span>
        </div>
        <div className="user-table-cell user-table-cell-actions">
          <span className="user-table-label">{userLabels[5]}</span>
        </div>
      </div>

      {/* ============================================ */}
      {/* TABLE ROWS - USER DATA                      */}
      {/* ============================================ */}
      {loading && (
        // Loading State with Skeletons
        <div className="user-table-body">
          {Array.from({ length: pagination.limit }).map((_, i) => (
            <div className="user-table-row" key={i}>
              <div className="user-table-cell user-table-cell-checkbox">
                <Skeleton animation="wave" variant="circular" width={18} height={18} />
              </div>
              <div className="user-table-cell user-table-cell-name">
                <Skeleton animation="wave" variant="text" width="150px" height={25} />
              </div>
              <div className="user-table-cell user-table-cell-created-by">
                <Skeleton animation="wave" variant="text" width="80px" height={25} />
              </div>
              <div className="user-table-cell user-table-cell-updated-by">
                <Skeleton animation="wave" variant="text" width="80px" height={25} />
              </div>
              <div className="user-table-cell user-table-cell-date">
                <Skeleton animation="wave" variant="text" width="140px" height={25} />
              </div>
              <div className="user-table-cell user-table-cell-date">
                <Skeleton animation="wave" variant="text" width="140px" height={25} />
              </div>
              <div className="user-table-cell user-table-cell-actions">
                <Skeleton animation="wave" variant="circular" width={24} height={24} />
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && usersList.length === 0 && (
        // Empty State
        <div className="user-table-empty">
          <div className="user-table-empty-content">
            <img src={NoDataFoundImg} alt="No Data" />
            <p>No users found</p>
          </div>
        </div>
      )}
      {!loading && usersList.length > 0 && (
        // User Data Rows
        <div className="user-table-body">
          {usersList.map((user: User) => (
            <div className="user-table-row" key={user.id}>
              {/* <div className="user-table-cell user-table-cell-checkbox">
                <button type="button" className="user-checkbox-btn" onClick={(e) => {
                  e.stopPropagation();
                  handleRowSelect(user.id);
                }}>
                  {selectedUsers.includes(user.id) ? <MdCheckBox size={20} color="#2961f4" /> : <MdCheckBoxOutlineBlank size={20} color="#64748B" />}
                </button>
              </div> */}
              <div className="user-table-cell user-table-cell-name">
                <span className="user-table-value">{user.userName}</span>
              </div>
              <div className="user-table-cell user-table-cell-created-by">
                <span className="user-table-value">{user.createdBy}</span>
              </div>
              <div className="user-table-cell user-table-cell-updated-by">
                <span className="user-table-value">{user.updatedBy}</span>
              </div>
              <div className="user-table-cell user-table-cell-date">
                <span className="user-table-value">{formatDate(user.createdAt)}</span>
              </div>
              <div className="user-table-cell user-table-cell-date">
                <span className="user-table-value">{formatDate(user.updatedAt)}</span>
              </div>
              <div className="user-table-cell user-table-cell-actions">
                <button
                  type="button"
                  className="user-action-btn"
                  onClick={() => handleAssignPermissions(user)}
                  title="Assign Permissions"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 13C20 18 16.5 20.5 12.34 21.95C12.1222 22.0238 11.8855 22.0202 11.67 21.94C7.5 20.5 4 18 4 13V5.99996C4 5.73474 4.10536 5.48039 4.29289 5.29285C4.48043 5.10532 4.73478 4.99996 5 4.99996C7 4.99996 9.5 3.79996 11.24 2.27996C11.4519 2.09896 11.7214 1.99951 12 1.99951C12.2786 1.99951 12.5481 2.09896 12.76 2.27996C14.51 3.80996 17 4.99996 19 4.99996C19.2652 4.99996 19.5196 5.10532 19.7071 5.29285C19.8946 5.48039 20 5.73474 20 5.99996V13Z" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 12L11 14L15 10" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="user-action-btn"
                  onClick={() => handleDeleteUser(user.userName)}
                  title="Delete User"
                  style={{ marginLeft: "8px" }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 5H17.5" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M15.8332 5V16.6667C15.8332 17.5 14.9998 18.3333 14.1665 18.3333H5.83317C4.99984 18.3333 4.1665 17.5 4.1665 16.6667V5" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.6665 4.99984V3.33317C6.6665 2.49984 7.49984 1.6665 8.33317 1.6665H11.6665C12.4998 1.6665 13.3332 2.49984 13.3332 3.33317V4.99984" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================ */}
      {/* PAGINATION                                  */}
      {/* ============================================ */}
      {pagination.total > 0 && (
        <div style={{ marginTop: "20px" }}>
          <Pagination
            pagination={{
              pageNo: pagination.page,
              totalPage: Math.ceil(pagination.total / pagination.limit),
              totalRows: pagination.total,
              limit: pagination.limit,
            }}
            handlePagination={(limit: number, pageNo: number) => {
              dispatch(
                userAuthorizationActions.fetchUsers({
                  page: pageNo,
                  limit,
                  search: searchTerm,
                }),
              );
            }}
          />
        </div>
      )}

      <AddUserModal show={showAddUserModal} onHide={() => setShowAddUserModal(false)} onAdd={handleAddUser} loading={loading} users={usersList} />

      {/* ============================================ */}
      {/* ASSIGN PERMISSIONS MODAL                    */}
      {/* ============================================ */}
      <AssignPermissionsModal
        show={showAssignPermissionsModal}
        onHide={() => {
          setShowAssignPermissionsModal(false);
          setSelectedUserForPermissions(null);
        }}
        selectedUser={selectedUserForPermissions}
        onAssign={handleAssignPermissionsSubmit}
        loading={loading}
      />

      {/* ============================================ */}
      {/* DELETE CONFIRMATION MODAL                   */}
      {/* ============================================ */}
      <PopUp
        show={showDeleteConfirmation}
        onHide={cancelDeleteUser}
        handleClick={confirmDeleteUser}
        dataObj={{
          header: "Delete User",
          body: (
            <span>
              Are you sure you want to delete user  <strong style={{ color: "black" }}>&quot;{userToDelete}&quot;</strong>?
              <br />
            </span>
          ),
           button: {
            buttonOne: {
            buttonOneName: "Delete",
            buttonBg: "modalButtonDanger",
            variant: "danger"
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

export default UserAuthorization;