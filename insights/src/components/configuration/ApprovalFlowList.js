import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import classes from "../auth/role/css/taskList.module.css";
import Search from "../ui/search/Search.component";
import { DateTimeIconHtml, DeleteIcon, EditIcon } from "../ui/icons/Icons";
import { CustomDataGrid } from "../common/CustomDatagrid/CustomDatagrid";
import { Add } from "iconsax-react";
import CustomPagination from "../common/CustomPagination/CustomPagination";
import PopUp from "../popup/popUp.component";
import ApprovalFlowModal from "./ApprovalFlowModal";

import { useDispatch, useSelector } from "react-redux";
import {
  deleteApprovalConfig,
  fetchApprovalFlowConfigs,
} from "../../services/jobs/JobsService";
import { TOAST_MESSAGES, UI_TEXTS } from "../common/Constants/label-contants";
import ConfirmationDialog from "../../layouts/report/DeleteConfirmation";
import {
  hasInsightsPermission,
  PERMISSION_LIST,
} from "../../utils/permissionUtil";
import { isLoadingInHost } from "../../utils/DetectHost";

const ApprovalFlowList = ({ isSidebarExpanded }) => {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [approvalFlowsData, setApprovalFlowsData] = useState([]);
  const [pageInput, setPageInput] = useState("");
  const [editData, setEditData] = useState({});
  const [editApprovalFlowId, setEditApprovalFlowId] = useState();
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [flowToDelete, setFlowToDelete] = useState(null);
  const [flowToEdit, setFlowToEdit] = useState(null);
  const [loading, setLoading] = useState(false);

  const [totalRecords, setTotalRecords] = useState(0);

  const approvalList = useSelector((state) => state.jobs.approvalConfig);
  const permissionState = useSelector((state) => state.jobs?.permissions);
  console.log("approvalList", approvalList);

  const handleAddApprovalFlow = () => {
    setIsEditClicked(false);
    setShowModal(true);
  };

  const onEditAction = async (row) => {
    setIsEditClicked(true);
    setEditApprovalFlowId(row?._id);
    setShowModal(true);
  };

  const columns = [
    {
      field: "index",
      headerName: "#",
      flex: 0.5,
      headerAlign: "center",
      renderCell: (params) => (
        <div style={{ textAlign: "center" }}>{params.row.index + 1}</div>
      ),
    },
    {
      field: "moduleType",
      headerName: UI_TEXTS.TABLE_TEXTS.MODULE,
      flex: 1.5,
    },
    {
      field: "approverGroup",
      headerName: UI_TEXTS.TABLE_TEXTS.APPROVERS,
      flex: 2,
      renderCell: (params) => <div>{params.row.approverGroup}</div>,
    },
    hasInsightsPermission(
      permissionState,
      "Approval Flow",
      PERMISSION_LIST.APPROVAL_FLOW_READ
    ) &&
      hasInsightsPermission(
        permissionState,
        "Approval Flow",
        PERMISSION_LIST.APPROVAL_FLOW_WRITE
      ) && {
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
  ].filter(Boolean);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await dispatch(
        fetchApprovalFlowConfigs({
          pageNo: currentPage,
          pageSize: itemsPerPage,
          ...(filter && { search: filter }),
        })
      );
      if (response.status == 200) {
        // Update component state with API response data
        setApprovalFlowsData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalRecords(response.data.pagination.totalRecords);
      }
    } catch (error) {
      toast.error(error.message || TOAST_MESSAGES.ERROR.FETCH, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, itemsPerPage, searchText, filter]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      // Simulate delete operation
      const result = await deleteApprovalConfig(id);

      if (result?.success) {
        toast.success(
          result.message ||
            TOAST_MESSAGES.OTHERS.APPROVAL_FLOW_DELETED_SUCCESSFULLY,
          {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
          }
        );

        setModalShow(false);

        await loadData();
      } else {
        throw new Error(result?.message || "Failed to delete Approval Config");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.message, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });

      await loadData();
    } finally {
      setLoading(false);
    }
  };

  const rows = approvalList.map((flow, index) => ({
    ...flow,
    id: flow._id || `flow-${index}`,
    index: index,
  }));

  const getRowId = (row) => {
    return row._id || row.id;
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
                placeholder={UI_TEXTS.PLACEHOLDERS.SEARCH_BY_MODULE}
                searchIconTowardsRight
                onEnterClear
                customeCss={{ right: "5px", position: "relative" }}
                selection="single"
                handleSearchText={(e) => setFilter(e.toLowerCase())}
                setSearchTextProp={(e) => setFilter(e.toLowerCase())}
              />
            </span>
            {hasInsightsPermission(
              permissionState,
              "Approval Flow",
              PERMISSION_LIST.APPROVAL_FLOW_READ
            ) &&
              hasInsightsPermission(
                permissionState,
                "Approval Flow",
                PERMISSION_LIST.APPROVAL_FLOW_WRITE
              ) && (
                <span>
                  <Button
                    id="AddApprovalFlowButton"
                    onClick={() => {
                      handleAddApprovalFlow();
                    }}
                  >
                    <Add size="25" />
                    {UI_TEXTS.BUTTONS.ADD_APPROVAL_FLOW}
                  </Button>
                </span>
              )}
          </div>
        </Col>
      </Row>

      <div style={gridContainerStyle}>
        {loading && (
          <div className="grid-loader">
            <div className="loader-spinner"></div>
          </div>
        )}
        <CustomDataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          rowCount={rows.length}
          paginationMode="client"
          sortingMode="client"
          rowCursorPointer={true}
          hideFooter={false}
          tableHeight={!isLoadingInHost ? "55vh" : "calc(100vh - 280px)"}
          loading={loading}
          showColumnFilters={false}
        />
      </div>
      <ConfirmationDialog
        open={modalShow}
        onClose={() => setModalShow(false)}
        onConfirm={() => handleDelete(editData)}
        title={UI_TEXTS.HEADER_TEXT.DELETE_APPROVAL_FLOW}
        message={
          UI_TEXTS.MESSAGES.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_APPROVAL_FLOW
        }
        loading={loading}
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
        />
      </div>
      <ApprovalFlowModal
        isEditClicked={isEditClicked}
        isModalOpen={showModal}
        setIsModelOpen={setShowModal}
        approvalFlowId={editApprovalFlowId}
        onSaveSuccess={loadData}
        approvalFlowsData={approvalFlowsData}
      />
    </div>
  );
};

export default ApprovalFlowList;
