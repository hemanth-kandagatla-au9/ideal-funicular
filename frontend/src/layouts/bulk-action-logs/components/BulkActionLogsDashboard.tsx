/* eslint-disable import/namespace */
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";
import { BulkActionDetails } from "@/types/BulkActionLogsState";
import BulkActionLogsHeader from "./BulkActionLogsHeader";
import BulkActionsList from "./BulkActionsList";
import BulkActionDetailsPanel from "./BulkActionDetails";
import bulkActionLogsActions from "../../../redux/actions/bulkActionLogs.action";
import { getSelectedBulkAction, isLoadingBulkActionDetails, getSelectedJobId, getBulkActionPagination } from "../../../redux/selectors/bulkActionLog.selectors";
import DownloadBulkActionLogsToExcel from "../helpers/DownloadBulkActionsLogsToExcel";

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

  const currentPageNo: number = get(pagination, "pageNo", 0);
  const pageSize = 10;

  // Handle export
  const handleExport = useCallback(async () => {
    await DownloadBulkActionLogsToExcel(currentPageNo, pageSize);
  }, [currentPageNo]);

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
