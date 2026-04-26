/* eslint-disable import/namespace */
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress, Chip, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentFilters, setCurrentFilters] = useState<FilterState>({ type: [], user: [], status: "" });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const pageSize = 10;

  // Convert Redux availableFilters format to component format
  const availableFilters = {
    types: availableFiltersFromRedux?.actions || [],
    users: availableFiltersFromRedux?.users || [],
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch bulk action logs when filters/search changes (reset to page 0)
  useEffect(() => {
    const filters: any = {};

    if (debouncedSearchQuery) {
      filters.search = debouncedSearchQuery;
    }

    if (currentFilters.type.length > 0) {
      filters.type = currentFilters.type;
    }
    if (currentFilters.user.length > 0) {
      filters.users = currentFilters.user;
    }
    if (currentFilters.status) {
      filters.status = [currentFilters.status];
    }

    // Dispatch Redux action to fetch bulk actions (always reset to page 0 when filters change)
    dispatch(
      bulkActionLogsActions.fetchBulkActions({
        filters: { ...filters, sortBy: "date", sortOrder },
        pagination: { pageNo: 0, limit: 10 },
      }),
    );
  }, [currentFilters, debouncedSearchQuery, sortOrder, dispatch]);

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
    dispatch(bulkActionLogsActions.updateBulkActionPagination({ pageNo: newPageNo, limit: 10 }));
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

  const navBtn = {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    padding: "4px",
    color: "#6B7280",
  };
  return (
    <Box
      sx={{
        width: "540px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#FFFFFF",
        border: "1px solid #E0E3E7",
        borderRadius: "12px",
        padding: "12px",
        gap: "8px",
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
        {/* 1.1 SEARCH INPUT */}
        <Box
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
          <SearchIcon sx={{ width: "16px", height: "16px", color: "#9CA3AF", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by Job ID"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: "13px",
              fontFamily: "inherit",
              color: "#374151",
              minWidth: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          />
        </Box>

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
          <TuneIcon sx={{ width: "16px", height: "16px" }} />
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

      {/* ===== 3. FILTER CHIPS ROW ===== */}
      {(currentFilters.type.length > 0 || currentFilters.user.length > 0 || currentFilters.status) && (
        <Box
          sx={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "12px",
            flexShrink: 0,
          }}
        >
          {currentFilters.type.map(type => (
            <Chip
              key={type}
              label={type}
              onDelete={() => handleRemoveChip(type)}
              size="small"
              sx={{
                backgroundColor: "#f0f0f0",
                "& .MuiChip-deleteIcon": {
                  color: "#666",
                  marginLeft: "4px",
                  "&:hover": { color: "#000" },
                },
              }}
            />
          ))}
          {currentFilters.user.map(user => (
            <Chip
              key={user}
              label={user}
              onDelete={() => handleRemoveChip(user)}
              size="small"
              sx={{
                backgroundColor: "#f0f0f0",
                "& .MuiChip-deleteIcon": {
                  color: "#666",
                  marginLeft: "4px",
                  "&:hover": { color: "#000" },
                },
              }}
            />
          ))}
          {currentFilters.status && (
            <Chip
              label={currentFilters.status}
              onDelete={() => handleRemoveChip(currentFilters.status)}
              size="small"
              sx={{
                backgroundColor: "#f0f0f0",
                "& .MuiChip-deleteIcon": {
                  color: "#666",
                  marginLeft: "4px",
                  "&:hover": { color: "#000" },
                },
              }}
            />
          )}
        </Box>
      )}

      {/* ===== 4. JOB LIST HEADER ===== */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "10px 12px",
          backgroundColor: "#F9FAFB",
          borderRadius: "0px",
          borderBottom: "1px solid #E0E3E7",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 0.5,
            fontSize: "11px",
            fontWeight: 700,
            color: "#6B7280",
            textTransform: "uppercase",
            paddingRight: "12px",
            borderRight: "1px solid #E0E3E7",
            minWidth: 0,
          }}
        >
          Job ID & Type
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            flex: 0.3,
            fontSize: "11px",
            fontWeight: 700,
            color: "#6B7280",
            textTransform: "uppercase",
            paddingRight: "12px",
            borderRight: "1px solid #E0E3E7",
          }}
        >
          Status
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", flex: 0.2, fontSize: "11px", fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>Servers</Box>
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "8px",
          borderTop: "1px solid #E0E3E7",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            background: "#FFFFFF",
            padding: "0",
            borderRadius: "0",
            display: "flex",
            alignItems: "center",
            gap: "6px",
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
                  border: currentPage === p ? "1px solid #1d7bd8" : "1px solid #E0E3E7",
                  fontSize: "11px",
                  cursor: "pointer",
                  backgroundColor: currentPage === p ? "#2b87e3" : "#FFFFFF",
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
