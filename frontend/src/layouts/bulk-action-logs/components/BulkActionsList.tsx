/* eslint-disable import/namespace */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Chip, Tooltip } from "@mui/material";
import ArrowUpIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";

import SortIcon from "@mui/icons-material/Sort";
import BulkActionCard from "./BulkActionCard";
import BulkActionFilterDialog, { FilterState } from "./BulkActionFilterDialog";
import bulkActionLogsActions from "../../../redux/actions/bulkActionLogs.action";
import { getBulkActions, getBulkActionPagination, isLoadingBulkActions, getAvailableFilters } from "../../../redux/selectors/bulkActionLog.selectors";

interface LeftPanelProps {
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({ selectedJobId, onSelectJob }) => {
  const dispatch = useDispatch();
  const jobs = useSelector(getBulkActions);
  const pagination = useSelector(getBulkActionPagination);
  const loading = useSelector(isLoadingBulkActions);
  const availableFiltersFromRedux = useSelector(getAvailableFilters);

  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<FilterState>({ type: [], user: [], status: "", dateRange: { from: "", to: "" } });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showChips, setShowChips] = useState(true);
  const pageSize = 10;

  // Convert Redux availableFilters format to component format
  const availableFilters = {
    types: availableFiltersFromRedux?.actions || [],
    users: availableFiltersFromRedux?.users || [],
  };

  // Fetch bulk action logs when filters/search changes (reset to page 0)
  useEffect(() => {
    const filters: any = {};

    if (currentFilters.type.length > 0) {
      filters.type = currentFilters.type;
    }
    if (currentFilters.user.length > 0) {
      filters.users = currentFilters.user;
    }
    if (currentFilters.status) {
      filters.status = [currentFilters.status];
    }
    if (currentFilters.dateRange?.from || currentFilters.dateRange?.to) {
      filters.dateRange = {
        ...(currentFilters.dateRange.from && { start: currentFilters.dateRange.from }),
        ...(currentFilters.dateRange.to && { end: currentFilters.dateRange.to }),
      };
    }

    // Dispatch Redux action to fetch bulk actions (always reset to page 0 when filters change)
    dispatch(
      bulkActionLogsActions.fetchBulkActions({
        filters: { ...filters, sortBy: "date", sortOrder },
        pagination: { pageNo: 0, limit: 10 },
      }),
    );
  }, [currentFilters, sortOrder, dispatch]);

  // Auto-select first job whenever list updates (initial load, filters, pagination, search)
  useEffect(() => {
    if (jobs && jobs.length > 0) {
      onSelectJob(jobs[0].jobId);
    }
  }, [jobs, onSelectJob]);

  // Transform API data to display format
  const displayJobs = (Array.isArray(jobs) ? jobs : []).map((job: any) => {
    const serverIndicators = [];
    if (job.serverSummary?.success > 0) {
      serverIndicators.push({ color: "success" as const, count: job.serverSummary.success });
    }
    if (job.serverSummary?.pending > 0) {
      serverIndicators.push({ color: "pending" as const, count: job.serverSummary.pending });
    }
    if (job.serverSummary?.failure > 0) {
      serverIndicators.push({ color: "failed" as const, count: job.serverSummary.failure });
    }

    return {
      jobId: job.jobId,
      type: job.type,
      user: job.user || "",
      status: job.status as "Completed" | "Partial" | "Failed" | "InProgress",
      totalServers: job.serverSummary?.total || 0,
      serverIndicators,
    };
  });

  const handleRemoveChip = (chipToRemove: string) => {
    // Check if it's a type, user, or status
    const isType = availableFilters.types.includes(chipToRemove);
    const isUser = availableFilters.users.includes(chipToRemove);

    if (isType) {
      setCurrentFilters(prev => ({
        ...prev,
        type: prev.type.filter(t => t !== chipToRemove),
      }));
    } else if (isUser) {
      setCurrentFilters(prev => ({
        ...prev,
        user: prev.user.filter(u => u !== chipToRemove),
      }));
    } else {
      // It's a status
      setCurrentFilters(prev => ({
        ...prev,
        status: "",
      }));
    }
  };

  const handleApplyFilters = (filters: FilterState) => {
    setCurrentFilters(filters);
  };

  const handlePageChange = (newPageNo: number) => {
    // Always include active filters when paginating — prevents unfiltered results on other pages
    const activeFilters: any = {};
    if (currentFilters.type.length > 0) activeFilters.type = currentFilters.type;
    if (currentFilters.user.length > 0) activeFilters.users = currentFilters.user;
    if (currentFilters.status) activeFilters.status = [currentFilters.status];
    if (currentFilters.dateRange?.from || currentFilters.dateRange?.to) {
      activeFilters.dateRange = {
        ...(currentFilters.dateRange.from && { start: currentFilters.dateRange.from }),
        ...(currentFilters.dateRange.to && { end: currentFilters.dateRange.to }),
      };
    }
    dispatch(
      bulkActionLogsActions.fetchBulkActions({
        filters: { ...activeFilters, sortBy: "date", sortOrder },
        pagination: { pageNo: newPageNo, limit: pageSize },
      }),
    );
  };

  const totalPages = (pagination as any)?.totalPages || 1;
  const currentPageNo = (pagination as any)?.pageNo || 0;

  // Convert to UI (1-based)
  const currentPage = currentPageNo + 1;

  // Ellipsis pagination logic
  const getPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 1) return [1];

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const hasDateRange = !!(currentFilters.dateRange?.from || currentFilters.dateRange?.to);
  const hasActiveFilters = currentFilters.type.length > 0 || currentFilters.user.length > 0 || !!currentFilters.status || hasDateRange;

  const navBtn = {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    padding: "4px",
    color: "#6B7280",
  };

  const chipSx = {
    height: "24px",
    fontSize: "11px",
    fontWeight: 500,
    backgroundColor: "#F0F4FF",
    color: "#374151",
    borderRadius: "4px",
    border: "1px solid #D0DCFF",
    "& .MuiChip-label": { paddingLeft: "8px", paddingRight: "4px" },
    "& .MuiChip-deleteIcon": {
      color: "#6B7280",
      fontSize: "14px",
      "&:hover": { color: "#111827" },
    },
  };

  return (
    <Box
      sx={{
        width: "540px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: "12px",
        padding: "0px",
        gap: "4px",
        overflow: "hidden",
      }}
    >
      {/* ===== 1. TOP CONTROL ROW ===== */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "8px",
          marginBottom: "8px",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* 1.3 FILTER BUTTON */}
        <Box
          component="button"
          onClick={() => setShowFilterDialog(true)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            height: "36px",
            padding: "6px 16px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E0E3E7",
            borderRadius: "36px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 500,
            color: "#374151",
            flexShrink: 0,
            "&:hover": {
              backgroundColor: "#F9FAFB",
            },
          }}
        >
          <svg width="15" height="18" viewBox="0 0 15 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.4238 7.08333C11.0786 7.08333 10.7988 6.80351 10.7988 6.45833L10.7988 0.625C10.7988 0.279822 11.0786 0 11.4238 0C11.7689 0 12.0488 0.279822 12.0488 0.625L12.0488 6.45833C12.0488 6.80351 11.7689 7.08333 11.4238 7.08333Z" fill="currentColor"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M3.125 3.75C4.85089 3.75 6.25 5.14911 6.25 6.875C6.25 8.60089 4.85089 10 3.125 10C1.39911 10 0 8.60089 0 6.875C0 5.14911 1.39911 3.75 3.125 3.75ZM5 6.875C5 5.83947 4.16053 5 3.125 5C2.08947 5 1.25 5.83947 1.25 6.875C1.25 7.91053 2.08947 8.75 3.125 8.75C4.16053 8.75 5 7.91053 5 6.875Z" fill="currentColor"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M11.4583 14.1667C13.1842 14.1667 14.5833 12.7676 14.5833 11.0417C14.5833 9.31578 13.1842 7.91667 11.4583 7.91667C9.73244 7.91667 8.33333 9.31578 8.33333 11.0417C8.33333 12.7676 9.73244 14.1667 11.4583 14.1667ZM13.3333 11.0417C13.3333 12.0772 12.4939 12.9167 11.4583 12.9167C10.4228 12.9167 9.58333 12.0772 9.58333 11.0417C9.58333 10.0061 10.4228 9.16667 11.4583 9.16667C12.4939 9.16667 13.3333 10.0061 13.3333 11.0417Z" fill="currentColor"/>
            <path d="M2.46543 11.4583C2.46543 11.1132 2.74526 10.8333 3.09043 10.8333C3.43561 10.8333 3.71543 11.1132 3.71543 11.4583V17.2917C3.71543 17.6368 3.43561 17.9167 3.09043 17.9167C2.74526 17.9167 2.46543 17.6368 2.46543 17.2917V11.4583Z" fill="currentColor"/>
            <path d="M11.4238 17.9167C11.0786 17.9167 10.7988 17.6368 10.7988 17.2917V15.625C10.7988 15.2798 11.0786 15 11.4238 15C11.7689 15 12.0488 15.2798 12.0488 15.625V17.2917C12.0488 17.6368 11.7689 17.9167 11.4238 17.9167Z" fill="currentColor"/>
            <path d="M2.46543 0.625C2.46543 0.279822 2.74526 0 3.09043 0C3.43561 0 3.71543 0.279822 3.71543 0.625V2.29167C3.71543 2.63685 3.43561 2.91667 3.09043 2.91667C2.74526 2.91667 2.46543 2.63685 2.46543 2.29167V0.625Z" fill="currentColor"/>
          </svg>
          <span>Filter</span>
        </Box>
        {/* 1.2 SORT BUTTON */}
        <Tooltip title={sortOrder === "desc" ? "Sorted by date: newest first" : "Sorted by date: oldest first"} arrow>
          <Box
            component="button"
            onClick={() => setSortOrder(prev => (prev === "desc" ? "asc" : "desc"))}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              height: "36px",
              padding: "6px 14px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E0E3E7",
              borderRadius: "36px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              color: "#374151",
              "&:hover": {
                backgroundColor: "#F9FAFB",
              },
            }}
          >
            <SortIcon sx={{ width: "16px", height: "16px" }} />

            <span>Sort</span>

            {sortOrder === "desc" ? <ArrowDownIcon sx={{ width: "16px", height: "16px" }} /> : <ArrowUpIcon sx={{ width: "16px", height: "16px" }} />}
          </Box>
        </Tooltip>
        {/* ===== FILTER DIALOG ===== */}
        <BulkActionFilterDialog
          open={showFilterDialog}
          onClose={() => setShowFilterDialog(false)}
          onApply={handleApplyFilters}
          availableTypes={availableFilters.types}
          availableUsers={availableFilters.users}
          currentFilters={currentFilters}
        />
      </Box>

      {/* ── ACTIVE FILTER CHIPS ── */}
      {hasActiveFilters && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0, border: "1px solid #E2E8F0", borderRadius: "8px", padding: "8px 10px" }}>
          <Box sx={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
            {/* Show/Hide Filters toggle — only collapses chips, does NOT reopen dialog */}
            <Box
              component="button"
              onClick={() => setShowChips(v => !v)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#374151",
                cursor: "pointer",
                background: "none",
                border: "1px solid #D1D5DB",
                borderRadius: "999px",
                padding: "3px 10px 3px 8px",
                flexShrink: 0,
                "&:hover": { borderColor: "#9CA3AF", backgroundColor: "#F9FAFB" },
              }}
            >
              <span style={{ fontSize: "13px", color: "#6B7280", lineHeight: 1 }}>{showChips ? "▾" : "▸"}</span>
              <span style={{ fontSize: "12px", color: "#374151" }}>Show Filters</span>
              <Box
                sx={{
                  backgroundColor: "#374151",
                  color: "#fff",
                  borderRadius: "999px",
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  lineHeight: 1.4,
                  minWidth: "18px",
                  textAlign: "center",
                }}
              >
                {currentFilters.type.length + currentFilters.user.length + (currentFilters.status ? 1 : 0) + (hasDateRange ? 1 : 0)}
              </Box>
            </Box>

            {showChips && currentFilters.type.map(t => <Chip key={t} label={`Type: ${t}`} onDelete={() => handleRemoveChip(t)} size="small" sx={chipSx} />)}
            {showChips && currentFilters.user.map(u => <Chip key={u} label={`User: ${u}`} onDelete={() => handleRemoveChip(u)} size="small" sx={chipSx} />)}
            {showChips && currentFilters.status && (
              <Chip label={`Status: ${currentFilters.status}`} onDelete={() => handleRemoveChip(currentFilters.status)} size="small" sx={chipSx} />
            )}
            {showChips && hasDateRange && (
              <Chip
                label={`Date: ${currentFilters.dateRange?.from || "…"} → ${currentFilters.dateRange?.to || "…"}`}
                onDelete={() => setCurrentFilters(prev => ({ ...prev, dateRange: { from: "", to: "" } }))}
                size="small"
                sx={chipSx}
              />
            )}
          </Box>
        </Box>
      )}

      {/* ===== 4. JOB LIST HEADER ===== */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "12px",
          color: "#FAF9F7",
          backgroundColor: "#FAF9F7",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 0.5,
            fontSize: "16px",
            fontWeight: 500,
            color: "#64748B",
            paddingRight: "12px",
            minWidth: 0,
            fontFamily: "Johnson Text",
          }}
        >
          Type & User
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flex: 0.3,
            fontSize: "16px",
            fontWeight: 500,
            color: "#64748B",
            paddingRight: "12px",
            fontFamily: "Johnson Text",
          }}
        >
          Status
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", flex: 0.2, fontSize: "16px", fontFamily: "Johnson Text", fontWeight: 500, color: "#64748B" }}>Servers</Box>
      </Box>

      {/* ===== 5. JOBS LIST ===== */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          paddingRight: "4px",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#F9FAFB",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#D1D5DB",
            borderRadius: "3px",
            "&:hover": {
              backgroundColor: "#9CA3AF",
            },
          },
        }}
      >
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <CircularProgress size={40} />
          </Box>
        )}

        {!loading &&
          displayJobs.map(job => (
            <BulkActionCard
              key={job.jobId}
              jobId={job.jobId}
              type={job.type}
              user={job.user}
              status={job.status}
              totalServers={job.totalServers}
              serverIndicators={job.serverIndicators}
              isActive={selectedJobId === job.jobId}
              onClick={() => onSelectJob(job.jobId)}
            />
          ))}
      </Box>

      {/* ===== 5. PAGINATION ===== */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1px 4px",
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #E5EAF2",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            background: "#FFFFFF",
            padding: "0",
            borderRadius: "0",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Prev */}
          <Box
            component="button"
            onClick={() => handlePageChange(currentPageNo - 1)}
            disabled={currentPageNo === 0}
            sx={{
              ...navBtn,
              opacity: currentPageNo === 0 ? 0.4 : 1,
              cursor: currentPageNo === 0 ? "not-allowed" : "pointer",
            }}
          >
            ‹
          </Box>

          {/* Pages */}
          {getPages().map((p, i) =>
            p === "..." ? (
              <Box key={i} sx={{ fontSize: "12px", px: "2px" }}>
                ...
              </Box>
            ) : (
              <Box
                key={i}
                component="div"
                onClick={() => handlePageChange((p as number) - 1)}
                sx={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "3px !important",
                  border: currentPage === p ? "1px solid #1d7bd8" : "",
                  fontSize: "11px",
                  cursor: "pointer",
                  backgroundColor: currentPage === p ? "#2961F4" : "transparent",
                  color: currentPage === p ? "#fff" : "#374151",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {p}
              </Box>
            ),
          )}

          {/* Next */}
          <Box
            component="button"
            onClick={() => handlePageChange(currentPageNo + 1)}
            disabled={currentPageNo === totalPages - 1}
            sx={{
              ...navBtn,
              opacity: currentPageNo === totalPages - 1 ? 0.4 : 1,
              cursor: currentPageNo === totalPages - 1 ? "not-allowed" : "pointer",
            }}
          >
            ›
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LeftPanel;
