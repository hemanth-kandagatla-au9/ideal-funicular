import React, { useState, useRef } from "react";
import {
  Card,
  IconButton,
  Tooltip,
  Paper,
  MenuList,
  MenuItem,
  Menu,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import OutboxOutlinedIcon from "@mui/icons-material/OutboxOutlined";
import {
  deleteReport,
  fetchGlobalReportData,
  fetchReportData,
  publishGlobalReports,
  publishGlobalReportsAsSystem,
} from "../../../services/configurations/configService";
import { toast } from "react-toastify";
import ConfirmationDialog from "../DeleteConfirmation";
import "../css/report.css";
import { useDispatch } from "react-redux";
import {
  TOAST_MESSAGES,
  UI_TEXTS,
} from "../../../components/common/Constants/label-contants";
import { formattedDate, getTemplateIcon } from "../../../utils/CommonUtils";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { ArrowCircleUp2, Copy, Edit, Trash } from "iconsax-react";

const ReportCard = ({
  report,
  onEdit,
  onDelete,
  onDuplicate,
  onClick,
  allowedOptions = ["edit", "delete", "clone", "publish"],
  hasWriteAccess = false,
  isPublished = false,
  hasPublishAsSystem = false,
  showVersion = true,
}) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [buttonText, setButtonText] = useState("Publish");
  const [loading, setLoading] = useState(false);

  let publishedReportsLocal = JSON.parse(
    localStorage.getItem("publishedReportsLocal") || "[]"
  );
  if (!Array.isArray(publishedReportsLocal)) {
    publishedReportsLocal = [];
    localStorage.setItem(
      "publishedReportsLocal",
      JSON.stringify(publishedReportsLocal)
    );
  }
  const reportId = localStorage.getItem("report_id");
  const [publishEl, setPublishEl] = useState(null);
  const open = Boolean(publishEl);

  // Helper to check if report is published normally
  const isNormalPublished = publishedReportsLocal.some(
    (obj) => obj.publish === report.id.toString()
  );

  // Helper to check if report is published as system
  const isSystemPublished = publishedReportsLocal.some(
    (obj) => obj.publish_as_system === report.id.toString()
  );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    onEdit(report);
    handleClose();
  };

  const handleDuplicate = (event) => {
    event.stopPropagation();
    onDuplicate(report);
    handleClose();
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    setDeleteDialogOpen(true);
    handleClose();
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteReport(report.id);
      if (response?.data?.success) {
        const reportIdStr = report.id.toString();
        const index = publishedReportsLocal.findIndex(
          (obj) =>
            obj.publish === reportIdStr || obj.publish_as_system === reportIdStr
        );
        if (index > -1) {
          publishedReportsLocal.splice(index, 1);
          localStorage.setItem(
            "publishedReportsLocal",
            JSON.stringify(publishedReportsLocal)
          );
        }
        toast.success(
          `Report "${report.title}" ${TOAST_MESSAGES.SUCCESS.DELETE}`
        );
        onDelete(report);
      }
    } catch (error) {
      toast.error(error.message || TOAST_MESSAGES.ERROR.DELETE);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleTitleClick = (event) => {
    event.stopPropagation();
    onClick(report.id);
  };

  const handleCardClick = (event) => {
    // Only trigger if click is on the main content area, not on action buttons
    const isActionButtonClick =
      event.target.closest(".report-action-buttons") ||
      event.target.closest(".report-color-button") ||
      event.target.closest('[data-action-button="true"]');

    if (!isActionButtonClick) {
      onClick(report.id);
    }
  };

  const publishReports = async () => {
    setButtonText("Publishing...");
    try {
      setLoading(true);
      const response = await dispatch(publishGlobalReports(report.id));
      if (response?.payload?.statusCode === 200) {
        toast.success(response?.payload.message);
        const reportIdStr = report.id.toString();
        let updated = false;
        for (let obj of publishedReportsLocal) {
          if (
            obj.publish === reportIdStr ||
            obj.publish_as_system === reportIdStr
          ) {
            obj.publish = reportIdStr;
            updated = true;
            break;
          }
        }
        if (!updated) {
          publishedReportsLocal.push({
            publish: reportIdStr,
            publish_as_system: null,
          });
        }
        localStorage.setItem(
          "publishedReportsLocal",
          JSON.stringify(publishedReportsLocal)
        );
      }
      setButtonText("Publish");
      await dispatch(fetchGlobalReportData({ type: "GLOBAL" }));
      await dispatch(fetchReportData());
      return response;
    } catch (error) {
      toast.error(`Error: ${error.error || "Something went wrong!"}`);
      setButtonText("Publish");
    } finally {
      setLoading(false);
    }
  };
  const publishReportsAsSystem = async () => {
    handleClose();
    setButtonText("Publishing...");
    try {
      setLoading(true);
      const response = await dispatch(publishGlobalReportsAsSystem(report.id));
      if (response?.payload?.statusCode === 200) {
        toast.success(response?.payload.message);
        const reportIdStr = report.id.toString();
        let updated = false;
        for (let obj of publishedReportsLocal) {
          if (
            obj.publish === reportIdStr ||
            obj.publish_as_system === reportIdStr
          ) {
            obj.publish_as_system = reportIdStr;
            updated = true;
            break;
          }
        }
        if (!updated) {
          publishedReportsLocal.push({
            publish: null,
            publish_as_system: reportIdStr,
          });
        }
        localStorage.setItem(
          "publishedReportsLocal",
          JSON.stringify(publishedReportsLocal)
        );
      }
      setButtonText("Publish");
      await dispatch(fetchGlobalReportData({ type: "GLOBAL" }));
      await dispatch(fetchReportData());
      return response;
    } catch (error) {
      toast.error(`Error: ${error.error || "Something went wrong!"}`);
      setButtonText("Publish");
    } finally {
      setLoading(false);
    }
  };

  const handlePublishClick = (event) => {
    event.stopPropagation();
    setPublishEl(event.currentTarget);
  };

  const handlePublishClose = () => {
    setPublishEl(null);
  };

  return (
    <>
      <Card
        className={`report-card ${isPublished ? "published_report_card" : ""}`}
        onClick={handleCardClick}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            width: "-webkit-fill-available",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "5px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                // flexDirection: "row",
                position: "relative",
              }}
            >
              <span>
                {((report?.status === "PENDING_APPROVAL" &&
                  isNormalPublished) ||
                  (report?.status === "PENDING_APPROVAL" &&
                    isSystemPublished)) && (
                  <div className="report-card-apprval">
                    {UI_TEXTS.PERMISSIONS.APPROVED_REQUIRED}
                  </div>
                )}
              </span>
              {/* <IconButton
                style={{
                  background: "#F4F6FF",
                  borderRadius: "50%",
                  height: "80px",
                  width: "80px",
                  gap: "10px",
                }}
                onClick={handleTitleClick}
              >
                <img
                  src={report.templateIcon}
                  alt="Report icon"
                  style={{ height: "28.33px", width: "22.67px" }}
                />
              </IconButton> */}
              <IconButton
                style={{
                  background: "#F4F6FF",
                  borderRadius: "50%",
                  height: "50px",
                  width: "50px",
                  gap: "10px",
                  cursor: "pointer",
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  handleTitleClick(event);
                }}
              >
                {getTemplateIcon(report.templateIcon)}
              </IconButton>
            </div>
            <div
              style={{ cursor: "pointer" }}
              className="report-text-container"
              onClick={(event) => {
                event.stopPropagation();
                handleTitleClick(event);
              }}
            >
              <div style={{ marginTop: "8px" }}>
                <Tooltip
                  title={report?.title?.length > 30 ? report?.title : ""}
                  placement="top"
                >
                  <div className="report-title">
                    {report?.title?.length > 30
                      ? `${report?.title?.substring(0, 30)}...`
                      : report?.title || ""}
                  </div>
                </Tooltip>
              </div>
              {!isPublished && (
                <div>
                  <Tooltip
                    title={
                      report?.scheduleCategory?.length > 30 && (
                        <div style={{ maxHeight: "100px", overflowY: "auto" }}>
                          {report?.scheduleCategory}
                        </div>
                      )
                    }
                    placement="top"
                  >
                    <div className="report-category">
                      {report?.scheduleCategory?.length > 30
                        ? `${report?.scheduleCategory?.substring(0, 30)}...`
                        : report?.scheduleCategory || ""}
                    </div>
                  </Tooltip>
                </div>
              )}

              <Tooltip title={report?.description || ""}>
                <div className="report-description">
                  <span>
                    {report?.description?.length > 30
                      ? `${report?.description?.substring(0, 30)}...`
                      : report?.description || ""}
                  </span>
                </div>
              </Tooltip>
            </div>
          </div>
          <div className="user-info-section">
            <div className="user_details">
              <span className="user_info">
                On :{" "}
                <span
                  style={{
                    fontFamily: "Manrope",
                    color: "#475569",
                    fontWeight: 500,
                  }}
                >
                  {formattedDate(report?.date)}
                </span>
              </span>
              <span className="user-info-content-username">
                {report?.publishType === "system" ? (
                  "By: System"
                ) : (
                  <>
                    By:{" "}
                    <span
                      style={{
                        fontFamily: "Manrope",
                        color: "#475569",
                        fontWeight: 500,
                      }}
                    >
                      {report?.username || "-"}
                    </span>
                  </>
                )}
              </span>
            </div>
          </div>

          <div
            className="report-action-buttons"
            style={{
              marginTop: isPublished ? "30px" : "7px",
              justifyContent: isPublished ? "flex-end" : "flex-start",
              cursor: "default",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="report-icon-action-badge"
              style={{
                // justifyContent: isPublished ? "flex-end" : "space-between",
                justifyContent: "flex-end",
                cursor: "default",
              }}
            >
              {/* Conditionally show version badge */}
              {/** COMMENTED FOR NOW WILL BE ENABLED LATER  */}
              {/* {showVersion && (
                <Tooltip title="Version" placement="top">
                  <div className="report-icon-badge">V{report?.version}</div>
                </Tooltip>
              )} */}

              {hasWriteAccess && (
                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    backgroundColor: "#fff !important",
                    cursor: "default",
                  }}
                >
                  {allowedOptions?.includes("edit") && (
                    <span
                      className="report-color-button bg_edit"
                      data-action-button="true"
                    >
                      <Tooltip title="Edit" placement="top">
                        <Edit
                          size="18"
                          onClick={handleEdit}
                          className="bg_edit"
                          color="green"
                          style={{
                            backgroundColor: "#f2f7f3",
                            cursor: "pointer",
                            ":hover": {
                              backgroundColor: "#f2f7f3",
                            },
                          }}
                        />
                      </Tooltip>
                    </span>
                  )}
                  {allowedOptions?.includes("clone") && (
                    <span
                      className="report-color-button bg_copy"
                      data-action-button="true"
                    >
                      <Tooltip title="Clone" placement="top">
                        <Copy
                          onClick={handleDuplicate}
                          // className="icon-color"
                          size="18"
                          color="#2961f4"
                          style={{ cursor: "pointer" }}
                        />
                      </Tooltip>
                    </span>
                  )}
                  {/* <span className="report-color-button bg_publish">
                    {allowedOptions?.includes("publish") && (
                      <Tooltip
                        title={
                          report?.status === "PENDING_APPROVAL" &&
                          reportsIdLocal.includes(report.id)
                            ? "Approval Required"
                            : "Publish"
                        }
                        placement="top"
                      >
                        <ArrowCircleUp2
                          size="18"
                          onClick={
                            (report?.status === "PENDING_APPROVAL" &&
                              reportsIdLocal.includes(report.id)) ||
                            loading
                              ? undefined
                              : publishReports
                          }
                          className={`icon-color ${
                            (report?.status === "PENDING_APPROVAL" &&
                              reportsIdLocal.includes(report.id)) ||
                            loading
                              ? "disabled-icon"
                              : ""
                          }`}
                          style={
                            (report?.status === "PENDING_APPROVAL" &&
                              reportsIdLocal.includes(report.id)) ||
                            loading
                              ? { opacity: 0.2, cursor: "not-allowed" }
                              : {}
                          }
                          onClick={publishReports}
                          // className="icon-color"
                          color="#906AFF"
                        />
                      </Tooltip>
                    )}
                  </span> */}
                  {allowedOptions?.includes("publish") && (
                    <span
                      className="report-color-button"
                      data-action-button="true"
                    >
                      <>
                        <Tooltip title="Publish" placement="top">
                          <ArrowCircleUp2
                            size="18"
                            onClick={handlePublishClick}
                            color="#906AFF"
                            style={{ cursor: "pointer" }}
                          />
                        </Tooltip>

                        <Menu
                          anchorEl={publishEl}
                          open={open}
                          onClose={handlePublishClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                          }}
                        >
                          <MenuItem
                            disabled={
                              (report?.status === "PENDING_APPROVAL" &&
                                isNormalPublished) ||
                              (isNormalPublished && loading)
                            }
                            onClick={(event) => {
                              event.stopPropagation();
                              publishReports();
                            }}
                          >
                            Publish
                          </MenuItem>
                          {hasPublishAsSystem && (
                            <MenuItem
                              disabled={
                                (report?.status === "PENDING_APPROVAL" &&
                                  isSystemPublished) ||
                                (isSystemPublished && loading)
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                publishReportsAsSystem();
                              }}
                            >
                              Publish as System
                            </MenuItem>
                          )}
                        </Menu>
                      </>
                    </span>
                  )}
                  {allowedOptions?.includes("delete") && (
                    <span
                      className="report-color-button bg_del"
                      data-action-button="true"
                    >
                      <Tooltip title="Delete" placement="top">
                        <Trash
                          size="18"
                          onClick={handleDeleteClick}
                          className="icon-color"
                          color="#ed3737"
                          style={{ cursor: "pointer" }}
                        />
                      </Tooltip>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => !isDeleting && setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title={`Delete ${report?.title}?`}
        message={`Are you sure you want to delete the report "${report?.title}"?`}
      />
    </>
  );
};

export default ReportCard;
