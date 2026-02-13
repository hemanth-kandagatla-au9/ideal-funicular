import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import classes from "../auth/role/css/taskList.module.css";
import Search from "../ui/search/Search.component";
import CommandCategoryModal from "./CommandCategoryModal";
import CommonTable from "../common/commonTable";
import { DateTimeIconHtml, DeleteIcon, EditIcon } from "../ui/icons/Icons";
import { getCommandCategory } from "../../services/jobs/JobsService";
import Paginate from "../ui/paginate/paginate";
import PopUp from "../popup/popUp.component";
import { deleteCommandCategory } from "../../services/configurations/configService";
import { useDispatch, useSelector } from "react-redux";
import { CustomDataGrid } from "../common/CustomDatagrid/CustomDatagrid";
import { Add } from "iconsax-react";
import CustomPagination from "../common/CustomPagination/CustomPagination";
import {
  PERMISSION_LIST,
  hasInsightsPermission,
} from "../../utils/permissionUtil";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";
import ConfirmationDialog from "../../layouts/report/DeleteConfirmation";
import { formattedDate } from "../../utils/CommonUtils";
import { isLoadingInHost } from "../../utils/DetectHost";

const CommandCategoryList = ({ isSidebarExpanded }) => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [commandCategoryData, setCommandCategoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editData, setEditData] = useState({});
  const [editCommandCategoryId, setEditCommandCategoryId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [deleteLoading, setDeletingLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const permissionState = useSelector((state) => state.jobs?.permissions);

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

  const handleAddCommandCategory = () => {
    setIsEditClicked(false);
    setShowTaskModal(true);
  };

  const onEditAction = async (row) => {
    setIsEditClicked(true);
    setEditCommandCategoryId(row?._id);

    setShowTaskModal(true);
  };

  const columns = [
    {
      field: "index",
      headerName: "#",
      flex: 1,
      minWidth: 100,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div
            style={{
              textAlign: "center",
              borderLeft:
                params.row.status === "PENDING_APPROVAL"
                  ? "4px solid #FF9800"
                  : params.row.status === "REJECTED"
                  ? "4px solid red"
                  : "4px solid #4CAF50",
              marginLeft: "-9px",
            }}
          >
            {params.row.index + 1}
          </div>
        );
      },
    },
    {
      field: "commandCategory",
      headerName: UI_TEXTS.TABLE_TEXTS.COMMANDS_CATEGORY,
      flex: 1.5,
      minWidth: 150,
    },
    {
      field: "commandCategorySubShell",
      headerName: UI_TEXTS.TABLE_TEXTS.SUB_SHELL,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "status",
      headerName: UI_TEXTS.TABLE_TEXTS.STATUS,
      flex: 1,
      minWidth: 100,
    },
    {
      field: "createdAt",
      headerName: UI_TEXTS.TABLE_TEXTS.CREATED_DATE,
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) => (
        <div title={formattedDate(params.row.createdAt)}>
          <span>{formattedDate(params.row.createdAt)}</span>
        </div>
      ),
    },
    {
      field: "updatedAt",
      headerName: UI_TEXTS.TABLE_TEXTS.MODIFIED_DATE,
      flex: 1.5,
      minWidth: 150,
      renderCell: (params) =>
        params.row.updatedAt ? (
          <div title={formattedDate(params.row.updatedAt)}>
            <span>{formattedDate(params.row.updatedAt)}</span>
          </div>
        ) : (
          "-"
        ),
    },
    hasInsightsPermission(
      permissionState,
      "Command Category",
      PERMISSION_LIST.COMMAND_CATEGORY_READ
    ) &&
      hasInsightsPermission(
        permissionState,
        "Command Category",
        PERMISSION_LIST.COMMAND_CATEGORY_WRITE
      ) && {
        field: "actions",
        headerName: UI_TEXTS.TABLE_TEXTS.ACTION,
        flex: 1,
        minWidth: 100,
        headerAlign: "center",
        renderCell: (params) => (
          <div style={{ textAlign: "center" }}>
            <span
              title="Edit CommandCategory"
              style={{
                opacity: params.row.status === "PENDING_APPROVAL" ? 0.5 : 1,
              }}
            >
              <EditIcon
                height={"15px"}
                id="groupButtonEdit"
                onClickHandle={() => {
                  if (params.row.status !== "PENDING_APPROVAL") {
                    onEditAction(params.row);
                  }
                }}
                testid="dropdown-item-edit"
              />
            </span>
            &nbsp;&nbsp;
            <span
              title="Delete CommandCategory"
              style={{
                opacity: params.row.status === "PENDING_APPROVAL" ? 0.5 : 1,
              }}
            >
              <DeleteIcon
                height={"15px"}
                testid="dropdown-item-delete"
                eventKey="2"
                id="groupButtonDelete"
                onClickHandle={() => {
                  if (params.row.status !== "PENDING_APPROVAL") {
                    setEditData(params.row._id);
                    setModalShow(true);
                  }
                }}
              />
            </span>
          </div>
        ),
      },
  ].filter(Boolean);

  const fetchCommandCategory = async ({
    commandCategory,
    pageSize,
    pageNo,
  }) => {
    let query = "?";
    if (commandCategory && commandCategory.trim() !== "") {
      query = query + `commandCategory=${encodeURIComponent(commandCategory)}&`;
    }
    if (pageSize) {
      query = query + `pageSize=${pageSize}&`;
    }
    if (pageNo) {
      query = query + `pageNo=${pageNo}&`;
    }
    try {
      setIsLoading(true);
      const data = await dispatch(getCommandCategory(query));
      setCommandCategoryData(data?.data?.data);
      if (data?.data?.pagination?.totalCount < 10) {
        setTotalPages(1);
      } else {
        setTotalPages(data?.data?.pagination?.totalPage);
      }
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
      setCommandCategoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(
      () => {
        fetchCommandCategory({
          commandCategory: filter,
          pageSize: itemsPerPage,
          pageNo: currentPage,
        });
      },
      filter ? 1000 : 0
    );

    return () => clearTimeout(debounceTimer);
  }, [showTaskModal, modalShow, filter, itemsPerPage, pageInput, currentPage]);

  const handleDelete = async (id) => {
    setDeletingLoading(true);
    deleteCommandCategory(id)
      .then((response) => {
        if (response?.data?.statusCode === 200) {
          toast.success(
            response?.data?.message === "API executed successfully"
              ? TOAST_MESSAGES.OTHERS.COMMAND_CATEGORY_DELETED_SUCCESSFULLY
              : response?.data?.message,
            {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 2000,
            }
          );
          setModalShow(false);
        } else {
          toast.error(response?.data?.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_DELETE_COMMAND_CATEGORY, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      })
      .finally(() => {
        setDeletingLoading(false);
      });
  };

  const rows = commandCategoryData.map((dt, index) => ({
    ...dt,
    index: (currentPage - 1) * itemsPerPage + index,
    id: dt._id,
    status: dt.status || "ACTIVE",
  }));

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value === "") {
      setFilter("");
      setCurrentPage(1);
    } else {
      setFilter(value);
    }
  };

  const containerStyle = {
    paddingTop: "0px",
    height: !isLoadingInHost ? "75vh" : "calc(100vh - 110px)",
    position: "relative",
  };

  const gridContainerStyle = {
    flex: 1,
    overflow: "auto",
    position: "relative",
    maxWidth: !isLoadingInHost ? (isSidebarExpanded ? "86vw" : "95vw") : "100%",
  };

  const footerStyle = {
    padding: "0 10px",
    position: "absolute",
    bottom: 10,
    width: !isLoadingInHost ? (isSidebarExpanded ? "86vw" : "95vw") : "100%",
    zIndex: 99,
  };

  return (
    <div style={containerStyle}>
      <Row>
        <Col
          style={{
            marginLeft: "-10px",
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "-20px",
            }}
          >
            <span style={{ paddingRight: "15px" }}>
              <Search
                placeholder={UI_TEXTS.PLACEHOLDERS.SEARCH_BY_CATEGORY}
                searchIconTowardsRight
                onEnterClear
                customeCss={{ right: "5px", position: "relative" }}
                selection="single"
                value={searchTerm}
                handleSearchText={handleSearchChange}
                setSearchTextProp={handleSearchChange}
              />
            </span>
            {hasInsightsPermission(
              permissionState,
              "Command Category",
              PERMISSION_LIST.COMMAND_CATEGORY_READ
            ) &&
              hasInsightsPermission(
                permissionState,
                "Command Category",
                PERMISSION_LIST.COMMAND_CATEGORY_WRITE
              ) && (
                <span>
                  <Button
                    id="AddTaskButton"
                    onClick={() => {
                      handleAddCommandCategory();
                    }}
                  >
                    <Add size="25" />
                    {UI_TEXTS.BUTTONS.ADD_COMMAND_CATEGORY}
                  </Button>
                </span>
              )}
          </div>
        </Col>
      </Row>

      <div style={gridContainerStyle}>
        {isLoading && (
          <div className="grid-loader">
            <div className="loader-spinner"></div>
          </div>
        )}
        <CustomDataGrid
          rows={rows}
          columns={columns}
          rowCount={rows.length}
          paginationMode="client"
          sortingMode="client"
          rowCursorPointer={true}
          hideFooter={false}
          tableHeight={!isLoadingInHost ? "55vh" : "calc(100vh - 280px)"}
          showColumnFilters={false}
          loading={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1 }}
        />
      </div>

      {/* <PopUp
        show={modalShow}
        dataObj={{
          header: UI_TEXTS.HEADER_TEXT.DELETE_COMMAND_CATEGORY,
          body: UI_TEXTS.MESSAGES.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_COMMAND_CATEGORY,
          button: {
            buttonOne: { buttonOneName: "YES", buttonBg: "modalButtonWhite" },
            buttonTwo: { buttonTwoName: "NO", buttonBg: "modalButtonBlue" },
          },
        }}
        onHide={() => setModalShow(false)}
        handleClick={() => handleDelete(editData)}
      /> */}
      <ConfirmationDialog
        open={modalShow}
        onClose={() => setModalShow(false)}
        onConfirm={() => handleDelete(editData)}
        title={UI_TEXTS.HEADER_TEXT.DELETE_COMMAND_CATEGORY}
        message={
          UI_TEXTS.MESSAGES
            .ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_COMMAND_CATEGORY
        }
        loading={deleteLoading}
      />
      <div style={footerStyle}>
        <CustomPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalPages={totalPages}
          setTotalPages={setTotalPages}
          pageInput={pageInput}
          setPageInput={setPageInput}
          disabled={isLoading}
        />
      </div>
      <CommandCategoryModal
        isEditClicked={isEditClicked}
        isModalOpen={showTaskModal}
        setIsModelOpen={setShowTaskModal}
        commandCategoryId={editCommandCategoryId}
      />
    </div>
  );
};

export default CommandCategoryList;
