/* eslint-disable import/namespace */
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";
import { BulkActionDetails } from "@/types/BulkActionLogsState";
import BulkActionLogsHeader from "./BulkActionLogsHeader";
import BulkActionsList from "./BulkActionsList";
import BulkActionDetailsPanel from "./BulkActionDetails";
import bulkActionLogsActions from "../../../redux/actions/bulkActionLogs.action";
import { getSelectedBulkAction, isLoadingBulkActionDetails, getSelectedJobId, getBulkActions, getBulkActionPagination } from "../../../redux/selectors/bulkActionLog.selectors";
import DownloadBulkActionLogsToExcel from "../helpers/DownloadBulkActionsLogsToExcel";
import agentManagementService from "../../../services/agent/agentManagement.service";

/**
 * Dashboard Layout Component
 * Main layout structure with Header, LeftPanel, RightPanel
 *
 * Uses Redux for state management:
 * - Components dispatch Redux actions
 * - Redux Sagas call agentManagementService
 * - Reducers update state
 * - Selectors provide data to components
 */
const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch();
  const selectedJobId = useSelector(getSelectedJobId);
  const jobDetails = useSelector(getSelectedBulkAction);
  const loading = useSelector(isLoadingBulkActionDetails);
  const bulkActions = useSelector(getBulkActions);
  const pagination = useSelector(getBulkActionPagination);

  // Fetch job details when selectedJobId changes
  useEffect(() => {
    if (!selectedJobId) {
      return;
    }

    // Dispatch Redux action to fetch job details
    dispatch(bulkActionLogsActions.fetchBulkActionDetails(selectedJobId));
  }, [selectedJobId, dispatch]);

  // Memoize handleSelectJob to prevent unnecessary re-renders in child components
  const memoizedHandleSelectJob = useCallback(
    (jobId: string) => {
      dispatch(bulkActionLogsActions.selectBulkAction(jobId));
    },
    [dispatch],
  );

  // Get total records count
  const getTotalRecords = useCallback(() => {
    return get(pagination, "totalRecords", 0);
  }, [pagination]);

  // Fetch all bulk action logs
  const fetchAllBulkActionLogs = useCallback(async (pageSize: number) => {
    try {
      const response = await agentManagementService.getBulkActionLogs({}, { pageNo: 0, pageSize });
      // Response structure from Axios: { data: { flag, data: { pagination, data: [jobs] } } }
      // Or after saga: { flag, data: { pagination, data: [jobs] } }
      const responseData = response?.data || response;
      const allJobs = responseData?.data?.data || responseData?.data || [];
      return allJobs;
    } catch (error) {
      console.error("Error fetching bulk action logs:", error);
      return [];
    }
  }, []);

  // Handle export
  const handleExport = useCallback(async () => {
    await DownloadBulkActionLogsToExcel(getTotalRecords, fetchAllBulkActionLogs);
  }, [getTotalRecords, fetchAllBulkActionLogs]);

  return (
    <div className="riseagent-bulkActionLogs">
      {/* Header */}
      <BulkActionLogsHeader onExport={handleExport} />

      {/* Content Area with Two Columns */}
      <div className="ral-content">
        {/* Left Panel (Fixed 540px) */}
        <BulkActionsList selectedJobId={selectedJobId} onSelectJob={memoizedHandleSelectJob} />

        {/* Right Panel (Flexible) */}
        <BulkActionDetailsPanel jobDetails={jobDetails} loading={loading} />
      </div>
    </div>
  );
};

export default DashboardLayout;
