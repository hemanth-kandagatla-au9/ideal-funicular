import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import classes from "../auth/role/css/taskList.module.css";
import PopUp from "../popup/popUp.component";
import { DateTimeIconHtml, DeleteIcon, EditIcon } from "../ui/icons/Icons";
import Search from "../ui/search/Search.component";
import { OpenSearchIndexModal } from "./OpenSearchIndexModal";
import Paginate from "../ui/paginate/paginate";
import { deleteOpenSearchIndex } from "../../services/configurations/configService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTargets } from "../../services/jobs/JobsService";
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

function OpenSearchDetailsList({ isSidebarExpanded }) {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("");
  const [editData, setEditData] = useState({});
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [indexData, setIndexData] = useState([]);
  const [editJobId, setEditJobId] = useState();
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
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

  const getIndexData = useCallback(
    async ({ indexName, pageSize, pageNo }) => {
      setIsLoading(true);
      let query = "?";
      if (indexName) {
        query = query + `targetName=${indexName}&`;
      }
      if (pageSize) {
        query = query + `pageSize=${pageSize}&`;
      }
      if (pageNo) {
        query = query + `pageNo=${pageNo}&`;
      }

      try {
        const data = await dispatch(getTargets(query));
        if (data?.data?.targets) {
          setIndexData(data?.data?.targets);
          if (data?.data?.pagination?.totalCount < 10) {
            setTotalPages(1);
          } else {
            setTotalPages(data?.data?.pagination?.totalPage);
          }
        } else {
          setIndexData([]);
          setTotalPages(1);
        }
      } catch (error) {
        toast.error(error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
        setIndexData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const debounceTimer = setTimeout(
      () => {
        getIndexData({
          indexName: filter,
          pageSize: itemsPerPage,
          pageNo: currentPage,
        });
      },
      filter ? 1000 : 0
    );

    return () => clearTimeout(debounceTimer);
  }, [showTaskModal, modalShow, filter, itemsPerPage, pageInput, currentPage]);

  const onEditAction = async (rowData) => {
    setIsEditClicked(true);
    setEditJobId(rowData?._id);
    setShowTaskModal(true);
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    deleteOpenSearchIndex(id)
      .then((response) => {
        if (response?.data?.statusCode === 200) {
          toast.success(
            TOAST_MESSAGES.OTHERS.OPENSEARCH_INDEX_DELETED_SUCCESSFULLY,
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
        toast.error(TOAST_MESSAGES.OTHERS.FAILED_TO_ADD_OPENSEARCH_INDEX, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000,
        });
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  const handleIndex = () => {
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
                  ? "4px solid #FF9800"
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
      field: "indexName",
      headerName: UI_TEXTS.TABLE_TEXTS.OPENSEARCH_INDEX_NAME,
      flex: 1,
    },
    { field: "status", headerName: UI_TEXTS.TABLE_TEXTS.STATUS, flex: 1 },
    {
      field: "createdAt",
      headerName: UI_TEXTS.TABLE_TEXTS.CREATED_DATE,
      flex: 1,
      renderCell: (params) => (
        <DateTimeIconHtml date={params.row.createdAt} type="created" />
      ),
    },
    {
      field: "updatedAt",
      headerName: UI_TEXTS.TABLE_TEXTS.MODIFIED_DATE,
      flex: 1,
      renderCell: (params) =>
        params.row.updatedAt ? (
          <DateTimeIconHtml date={params.row.updatedAt} type="updated" />
        ) : (
          "-"
        ),
    },
    {
      field: "actions",
      headerName: UI_TEXTS.TABLE_TEXTS.ACTION,
      flex: 1,
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{ textAlign: "center" }}>
          <span title="Edit">
            <EditIcon
              height={"15px"}
              id="groupButtonEdit"
              onClickHandle={() => onEditAction(params.row)}
              testid="dropdown-item-edit"
            />
          </span>
          &nbsp;&nbsp;
          <span title="Delete">
            <DeleteIcon
              height={"15px"}
              testid="dropdown-item-delete"
              eventKey="2"
              id="groupButtonDelete"
              onClickHandle={() => {
                setEditData(params.row._id);
                setModalShow(true);
              }}
            />
          </span>
        </div>
      ),
    },
  ];

  const rows = indexData.map((dt, index) => ({
    ...dt,
    index: (currentPage - 1) * itemsPerPage + index,
    id: dt._id,
    status: dt.status || "ACTIVE",
  }));

  return (
    <div style={{ paddingTop: "0px", height: "75vh" }}>
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
                placeholder={UI_TEXTS.PLACEHOLDERS.SEARCH}
                searchIconTowardsRight
                onEnterClear
                customeCss={{ right: "6px", position: "relative" }}
                selection="single"
                handleSearchText={(e) => setFilter(e.toLowerCase())}
                setSearchTextProp={(e) => setFilter(e.toLowerCase())}
              />
            </span>
            {hasInsightsPermission(
              permissionState,
              "Open Search",
              PERMISSION_LIST.OPEN_SEARCH_WRITE
            ) && (
              <span>
                <Button
                  id="AddTaskButton"
                  onClick={() => {
                    handleIndex();
                  }}
                >
                  <Add size="25" />
                  {UI_TEXTS.BUTTONS.ADD_INDEX}
                </Button>
              </span>
            )}
          </div>
        </Col>
      </Row>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          position: "relative",
          maxWidth: isSidebarExpanded ? "86vw" : "95vw",
        }}
      >
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
          tableHeight="59vh"
          showColumnFilters={false}
          loading={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1 }}
        />
      </div>

      {/* <PopUp
        show={modalShow}
        dataObj={{
          header: UI_TEXTS.HEADER_TEXT.DELETE_INDEX,
          body: UI_TEXTS.MESSAGES.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_CATEGORY,
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
        title={UI_TEXTS.HEADER_TEXT.DELETE_INDEX}
        message={
          UI_TEXTS.MESSAGES.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_CATEGORY
        }
        loading={deleteLoading}
      />
      <div
        style={{
          padding: "0 10px",
          position: "absolute",
          bottom: 10,
          width: isSidebarExpanded ? "86vw" : "95vw",
          zIndex: 99,
        }}
      >
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
      <OpenSearchIndexModal
        isEditClicked={isEditClicked}
        isModalOpen={showTaskModal}
        setIsModelOpen={setShowTaskModal}
        indexId={editJobId}
      />
    </div>
  );
}

export default OpenSearchDetailsList;
