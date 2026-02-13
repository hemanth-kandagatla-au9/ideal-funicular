import React, { useEffect, useState, useCallback } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Add } from "iconsax-react";
import { DateTimeIconHtml, DeleteIcon, EditIcon } from "../ui/icons/Icons";
import Search from "../ui/search/Search.component";
import { CategoryModal } from "./CategoryModal";
import { deleteCategory } from "../../services/configurations/configService";
import { getCategories } from "../../services/jobs/JobsService";
import { CustomDataGrid } from "../common/CustomDatagrid/CustomDatagrid";
import CustomPagination from "../common/CustomPagination/CustomPagination";
import {
  PERMISSION_LIST,
  hasInsightsPermission,
} from "../../utils/permissionUtil";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";
import ConfirmationDialog from "../../layouts/report/DeleteConfirmation";
import "react-toastify/dist/ReactToastify.css";
import "./css/common.css";
import { formattedDate } from "../../utils/CommonUtils";
import { isLoadingInHost } from "../../utils/DetectHost";

function CategoryDetailsList({ isSidebarExpanded }) {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("");
  const [editData, setEditData] = useState({});
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [editJobId, setEditJobId] = useState();
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const getCategoryData = useCallback(
    async ({ categoryName, pageSize, pageNo }) => {
      setIsLoading(true);
      let query = "?";
      if (categoryName) {
        query = query + `categoryName=${encodeURIComponent(categoryName)}&`;
      }
      if (pageSize) {
        query = query + `pageSize=${pageSize}&`;
      }
      if (pageNo) {
        query = query + `pageNo=${pageNo}&`;
      }
      if (query.endsWith("&")) {
        query = query.slice(0, -1);
      }

      try {
        const data = await dispatch(getCategories(query));
        if (data?.data?.data) {
          setCategoryData(data.data.data);

          if (data?.data?.pagination?.totalCount < 10) {
            setTotalPages(1);
          } else {
            setTotalPages(data.data.pagination.totalPage || 1);
          }
        } else {
          setCategoryData([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_FETCH_CATEGORIES, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        setCategoryData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const debouncedGetCategoryData = useCallback(
    debounce((params) => getCategoryData(params), 500),
    [getCategoryData]
  );

  useEffect(() => {
    getCategoryData({
      categoryName: filter,
      pageSize: itemsPerPage,
      pageNo: currentPage,
    });
  }, [currentPage]);

  useEffect(() => {
    if (filter !== null) {
      debouncedGetCategoryData({
        categoryName: filter,
        pageSize: itemsPerPage,
        pageNo: 1,
      });
    }
  }, [filter, itemsPerPage, debouncedGetCategoryData]);

  useEffect(() => {
    if (currentPage !== 1 || pageInput !== "") {
      getCategoryData({
        categoryName: filter,
        pageSize: itemsPerPage,
        pageNo: currentPage,
      });
    }
  }, [currentPage, pageInput, showTaskModal, modalShow]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value === "") {
      setFilter("");
      setCurrentPage(1);
    } else {
      setFilter(value);
    }
  };

  const onEditAction = async (rowData) => {
    setIsEditClicked(true);
    setEditJobId(rowData?._id);
    setShowTaskModal(true);
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await deleteCategory(id);
      if (response?.data?.statusCode === 200) {
        toast.success(
          response?.data?.message === "API executed successfully"
            ? TOAST_MESSAGES.OTHERS.CATEGORY_DELETED_SUCCESSFULLY
            : response?.data?.message,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }
        );
        setModalShow(false);
        getCategoryData({
          categoryName: filter,
          pageSize: itemsPerPage,
          pageNo: currentPage,
        });
      } else {
        toast.error(response?.data?.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_DELETE_CATEGORY, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCategory = () => {
    setIsEditClicked(false);
    setShowTaskModal(true);
  };

  const columns = [
    {
      field: "index",
      headerName: "#",
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div
            style={{
              textAlign: "center",
              borderLeft:
                params.row.status === "PENDING_APPROVAL"
                  ? "4px solid #FF9800" // Orange
                  : params.row.status === "REJECTED"
                  ? "4px solid #CC2901" // Red
                  : "4px solid #4CAF50", // Green (Active or others)
              marginLeft: "-9px",
            }}
          >
            {params.row.index + 1}
          </div>
        );
      },
    },
    {
      field: "categoryName",
      headerName: UI_TEXTS.TABLE_TEXTS.CATEGORY_NAME,
      flex: 1,
    },
    { field: "status", headerName: UI_TEXTS.TABLE_TEXTS.STATUS, flex: 1 },
    {
      field: "createdAt",
      headerName: UI_TEXTS.TABLE_TEXTS.CREATED_DATE,
      flex: 1,
      renderCell: (params) => (
        <div title={formattedDate(params.row.createdAt)}>
          <span>{formattedDate(params.row.createdAt)}</span>
        </div>
      ),
    },
    {
      field: "updatedAt",
      headerName: UI_TEXTS.TABLE_TEXTS.MODIFIED_DATE,
      flex: 1,
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
      "Schedule Categories",
      PERMISSION_LIST.SCHEDULE_CATEGORIES_READ
    ) &&
      hasInsightsPermission(
        permissionState,
        "Schedule Categories",
        PERMISSION_LIST.SCHEDULE_CATEGORIES_WRITE
      ) && {
        field: "actions",
        headerName: UI_TEXTS.TABLE_TEXTS.ACTION,
        flex: 1,
        headerAlign: "center",
        renderCell: (params) => (
          <div style={{ textAlign: "center" }}>
            <span
              title="Edit Category"
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
              title="Delete Category"
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

  const rows = categoryData.map((dt, index) => ({
    ...dt,
    index: (currentPage - 1) * itemsPerPage + index,
    id: dt._id,
    status: dt.status || "ACTIVE",
  }));

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

  const footerStyle = !isLoadingInHost
    ? {
        padding: "0 10px",
        position: "absolute",
        bottom: 10,
        width: isSidebarExpanded ? "86vw" : "95vw",
        zIndex: 99,
      }
    : {
        width: "100%",
        padding: "10px",
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
                customeCss={{ right: "6px", position: "relative" }}
                selection="single"
                value={searchTerm}
                handleSearchText={handleSearchChange}
                setSearchTextProp={handleSearchChange}
              />
            </span>
            {hasInsightsPermission(
              permissionState,
              "Schedule Categories",
              PERMISSION_LIST.SCHEDULE_CATEGORIES_READ
            ) &&
              hasInsightsPermission(
                permissionState,
                "Schedule Categories",
                PERMISSION_LIST.SCHEDULE_CATEGORIES_WRITE
              ) && (
                <span>
                  <Button
                    id="AddTaskButton"
                    onClick={handleCategory}
                    disabled={isLoading}
                  >
                    <Add size="25" />
                    {UI_TEXTS.BUTTONS.ADD_CATEGORY}
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
          noRowsMessage={
            categoryData.length === 0 && !isLoading
              ? "No data found"
              : "No rows"
          }
        />
      </div>

      <ConfirmationDialog
        open={modalShow}
        onClose={() => setModalShow(false)}
        onConfirm={() => handleDelete(editData)}
        title={UI_TEXTS.HEADER_TEXT.DELETE_CATEGORY}
        message={
          UI_TEXTS.MESSAGES.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_CATEGORY
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

      <CategoryModal
        isEditClicked={isEditClicked}
        isModalOpen={showTaskModal}
        setIsModelOpen={setShowTaskModal}
        categoryId={editJobId}
        onSuccess={() => {
          // Refresh data after modal operation
          getCategoryData({
            categoryName: filter,
            pageSize: itemsPerPage,
            pageNo: currentPage,
          });
        }}
      />
    </div>
  );
}

export default CategoryDetailsList;
