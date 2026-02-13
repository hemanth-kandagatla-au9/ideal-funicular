import React, { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestoreIcon from "@mui/icons-material/Restore";
import Button from "@mui/material/Button";
import { CustomDataGrid } from "../../components/common/CustomDatagrid/CustomDatagrid";
import CustomPagination from "../../components/common/CustomPagination/CustomPagination";
import {
  getAllTemplateVersions,
  getTemplateDetails,
  restoreTemplateVersion,
} from "../../store/TemplateSlice/templateSlice";
import { toast } from "react-toastify";
import {
  TOAST_MESSAGES,
  UI_TEXTS,
} from "../../components/common/Constants/label-contants";
import { formattedDate } from "../../utils/CommonUtils";
import "./marketplace.css";
import ConfirmationDialog from "../report/DeleteConfirmation";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "1px solid #FFFFFF",
  boxShadow: 0,
  p: 4,
  overflow: "auto",
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

export function TemplatesVersionModal({
  isModalOpen,
  setIsModelOpen,
  versionId,
}) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(isModalOpen);
  const handleClose = () => {
    setIsModelOpen(false);
    setOpen(false);
  };
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [templateVersionData, setAllTemplateVersionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restoringTemplates, setRestoringTemplates] = useState({});
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [currentItem, setcurrentItem] = useState(null);
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pageInput, setPageInput] = useState("");

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(templateVersionData.length / itemsPerPage));
  }, [templateVersionData.length, itemsPerPage]);

  const handleRestore = async (item, e) => {
    e.stopPropagation();
    setcurrentItem(item);
    setRestoreDialogOpen(true);
  };

  useEffect(() => {
    const fetchAllTemplates = async () => {
      if (!open || !versionId) return;

      setLoading(true);

      try {
        const response = await dispatch(
          getAllTemplateVersions(versionId)
        ).unwrap();

        setAllTemplateVersionData(response.data || response);
      } catch (error) {
        console.error("Error fetching template versions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTemplates();
  }, [dispatch, open, versionId]);

  useEffect(() => {
    setOpen(isModalOpen);
    if (isModalOpen) {
      setCurrentPage(1);
      setPageInput("");
      setItemsPerPage(10);
    }
  }, [isModalOpen]);

  // Handle page changes to keep within bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleConfirmRestore = async () => {
    let template = currentItem;
    try {
      setLoadingRestore(true);
      setRestoringTemplates((prev) => ({
        ...prev,
        [template._id]: true,
      }));
      setSelectedTemplate(
        templateVersionData.find((t) => t.templateId === template.templateId)
      );

      // Updated: Now uses the modified restore action that triggers update flow
      const response = await dispatch(
        restoreTemplateVersion({
          id: template._id,
          templateId: template.templateId,
          templateVersion: template.templateVersion,
        })
      ).unwrap();

      if (response.success) {
        // Show enhanced success message with update summary
        const updateSummary = response.updateSummary;
        let successMessage =
          TOAST_MESSAGES.OTHERS.TEMPLATE_RESTORED_SUCCESSFULLY;

        if (updateSummary) {
          successMessage += ` Updated ${
            updateSummary.successfulJobUpdates || 0
          } jobs and ${
            updateSummary.successfulInternalJobUpdates || 0
          } internal jobs.`;
        }

        toast.success(successMessage);

        // Refresh the template versions list
        const updatedResponse = await dispatch(
          getAllTemplateVersions(versionId)
        ).unwrap();
        setAllTemplateVersionData(updatedResponse.data || updatedResponse);
        dispatch(getTemplateDetails());
      }
    } catch (error) {
      console.error("Error restoring template:", error);
      toast.error(TOAST_MESSAGES.OTHERS.TEMPLATE_RESTORE_FAILED);
    } finally {
      setRestoringTemplates((prev) => ({
        ...prev,
        [template._id]: false,
      }));
      setLoadingRestore(false);
      setRestoreDialogOpen(false);
    }
  };

  const columns = [
    {
      field: "templateName",
      headerName: "Template Name",
      flex: 1.8,
      filterable: false,
    },
    {
      field: "templateVersion",
      headerName: "Version",
      flex: 1.2,
      filterable: false,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1.8,
      filterable: false,
      renderCell: (params) => formattedDate(params.row.createdAt),
    },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1.2,
      filterable: false,
      // renderCell: (params) => formatDate(params.row.createdBy),
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 1.8,
      filterable: false,
      renderCell: (params) => formattedDate(params.row.updatedAt),
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      flex: 1.2,
      filterable: false,
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   flex: 2.5,
    //   filterable: false,
    //   renderCell: (params) => {
    //     const isCurrentVersion = params.row.isVersionRestored;

    //     return (
    //       <div style={{ display: "flex", gap: "8px", marginTop: "15px" }}>
    //         <Button
    //           variant="outlined"
    //           size="small"
    //           startIcon={<VisibilityIcon />}
    //           onClick={() => {
    //             setSelectedTemplate(params.row);
    //             setPreviewOpen(true);
    //           }}
    //         >
    //           Preview
    //         </Button>
    //         <Button
    //           variant="contained"
    //           size="small"
    //           color="primary"
    //           startIcon={
    //             restoringTemplates[params.row._id] ? (
    //               <CircularProgress size={20} color="inherit" />
    //             ) : (
    //               <RestoreIcon />
    //             )
    //           }
    //           onClick={() => handleRestore(params.row)}
    //           disabled={
    //             restoringTemplates[params.row._id] || isCurrentVersion
    //           }
    //           key={params.row._id}
    //           title={isCurrentVersion ? "This is the current active version" : "Restore this version"}
    //         >
    //           {restoringTemplates[params.row._id]
    //             ? "Restoring..."
    //             : isCurrentVersion
    //             ? "Restored"
    //             : "Restore"}
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2.5,
      filterable: false,
      renderCell: (params) => {
        const isCurrentVersion = params.row.isVersionRestored;
        if (isCurrentVersion) {
          return (
            <Button
              variant="contained"
              size="small"
              color="success"
              disabled
              className="template-active-btn"
              title="This is the currently active version"
            >
              Active
            </Button>
          );
        }

        return (
          <div style={{ display: "flex", gap: "8px", marginTop: "15px" }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={() => {
                setSelectedTemplate(params.row);
                setPreviewOpen(true);
              }}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              size="small"
              color="primary"
              startIcon={
                restoringTemplates[params.row._id] ? (
                  <CircularProgress
                    size={14}
                    color="inherit"
                    sx={{
                      margin: "0 2px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                ) : (
                  <RestoreIcon fontSize="small" />
                )
              }
              // onClick={() => {
              //   handleRestore(params.row)
              //   setRestoreDialogOpen(true);
              // }}
              onClick={(e) => {
                e.stopPropagation();
                handleRestore(params.row, e);
              }}
              disabled={restoringTemplates[params.row._id] || isCurrentVersion}
              key={params.row._id}
              title={
                isCurrentVersion
                  ? "This is the current active version"
                  : "Restore this version"
              }
              sx={{
                minWidth: "100px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {restoringTemplates[params.row._id]
                ? "Restoring..."
                : isCurrentVersion
                ? "Restored"
                : "Restore"}
            </Button>
          </div>
        );
      },
    },
  ];

  // Calculate paginated rows
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return templateVersionData.slice(startIndex, startIndex + itemsPerPage);
  }, [templateVersionData, currentPage, itemsPerPage]);

  console.log("row--cmp", paginatedRows);

  // const handleRestore = async (template) => {
  //   try {
  //     setRestoringTemplates((prev) => ({
  //       ...prev,
  //       [template._id]: true,
  //     }));
  //     setSelectedTemplate(
  //       templateVersionData.find((t) => t.templateId === template.templateId)
  //     );

  //     const response = await dispatch(
  //       restoreTemplateVersion({
  //         id: template._id,
  //         templateId: template.templateId,
  //         templateVersion: template.templateVersion,
  //       })
  //     ).unwrap();

  //     if (response.success) {
  //       // Refresh the template versions list
  //       const updatedResponse = await dispatch(
  //         getAllTemplateVersions(versionId)
  //       ).unwrap();
  //       setAllTemplateVersionData(updatedResponse.data || updatedResponse);
  //       toast.success(TOAST_MESSAGES.OTHERS.TEMPLATE_RESTORED_SUCCESSFULLY);
  //       dispatch(getTemplateDetails());
  //     }
  //   } catch (error) {
  //     console.error("Error restoring template:", error);
  //     toast.error(TOAST_MESSAGES.OTHERS.TEMPLATE_RESTORE_FAILED);
  //   } finally {
  //     setRestoringTemplates((prev) => ({
  //       ...prev,
  //       [template._id]: false,
  //     }));
  //   }
  // };

  return (
    <div>
      <Modal open={open} onClose={handleClose} sx={{ border: "none" }}>
        <Box sx={style}>
          <div style={{ paddingBottom: "7px" }}>
            <Typography
              id="template-details-title"
              className="preview-modal-title"
            >
              {UI_TEXTS.TEXTS.TEMPLATE_VERSIONS}
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  float: "right",
                  position: "absolute",
                  top: "27px",
                  right: "27px",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Typography>
          </div>

          {loading && (
            <div
              style={{
                height: "400px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress />
            </div>
          )}

          {!loading && (
            <div style={{ marginTop: "10px" }}>
              <CustomDataGrid
                tableHeight="46vh"
                key="template-list"
                rows={paginatedRows}
                columns={columns}
                hideFooter={true}
                getRowId={(row) => row._id}
                components={{
                  NoRowsOverlay: () => (
                    <div className="not_found_card">
                      {UI_TEXTS.NOT_FOUND.OLDER_VERSIONS_NOT_AVAILABLE}
                    </div>
                  ),
                }}
              />
              <CustomPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                totalPages={totalPages}
                pageInput={pageInput}
                setPageInput={setPageInput}
                totalCount={templateVersionData.length}
                disabled={templateVersionData.length === 0}
              />
            </div>
          )}
        </Box>
      </Modal>

      <ConfirmationDialog
        open={restoreDialogOpen}
        onClose={() => setRestoreDialogOpen(false)}
        onConfirm={handleConfirmRestore}
        title={`Restore Template`}
        message={`Are you sure you want to restore the template?`}
        showRestoreNote={true}
        confirmText={"Yes, Restore"}
        loadingText={"Restoring..."}
        restoreNote={"All existing schedules will be updated to this version."}
        loading={loadingRestore}
      />

      <Modal open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            height: "500px",
          }}
        >
          <Typography id="preview-modal-title" className="preview-modal-title">
            Template Preview:
            <span className="preview-modal-value">
              {selectedTemplate?.templateName}
            </span>
            <IconButton
              aria-label="close"
              onClick={() => setPreviewOpen(false)}
              sx={{ float: "right" }}
            >
              <CloseIcon />
            </IconButton>
          </Typography>
          <div style={{ marginTop: "16px", height: "400px" }}>
            {selectedTemplate && (
              <div>
                <Typography className="preview-modal-value">
                  <strong className="preview-modal-labels">Version:</strong>{" "}
                  {selectedTemplate.templateVersion}
                </Typography>
                <Typography className="preview-modal-value">
                  <strong className="preview-modal-labels">
                    Last Updated:
                  </strong>{" "}
                  {formattedDate(selectedTemplate.updatedAt)}
                </Typography>
                <Typography className="preview-modal-value">
                  <strong
                    className="preview-modal-labels"
                    sx={{ textTransform: "ellipses" }}
                  >
                    Description:
                  </strong>{" "}
                  {selectedTemplate.description}
                </Typography>
                <div
                  style={{
                    marginTop: "16px",
                    padding: "16px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                    height: "300px",
                    overflow: "scroll",
                  }}
                >
                  <Typography className="preview-modal-labels">
                    {UI_TEXTS.TEXTS.COMMAND_SCRIPTS}
                  </Typography>
                  <pre
                    style={{ whiteSpace: "pre-wrap", fontFamily: "Manrope" }}
                  >
                    {selectedTemplate.commandScripts}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
