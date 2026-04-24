import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import bulkActionLogsActions from "@/redux/actions/bulkActionLogs.action";
import { getBulkActions, getSelectedBulkAction, isLoadingBulkActions, isLoadingBulkActionDetails } from "@/redux/selectors/bulkActionLog.selectors";
import BulkActionLogsDashboard from "./components/BulkActionLogsDashboard";
import "./css/BulkActionLogsStyles.css";

/**
 * Bulk Action Logs - Main Container
 * Orchestrates Redux data and renders BulkActionLogsDashboard
 */
const BulkActionLogs: React.FC = () => {
  const dispatch = useDispatch();

  // Redux selectors - data layer intact
  useSelector(getBulkActions);
  useSelector(getSelectedBulkAction);
  useSelector(isLoadingBulkActions);
  useSelector(isLoadingBulkActionDetails);

  // Fetch bulk actions on component mount
  useEffect(() => {
    dispatch(
      bulkActionLogsActions.fetchBulkActions({
        filters: { type: [], status: [] },
        pagination: { pageNo: 0, limit: 10 },
      }),
    );
  }, [dispatch]);

  return <BulkActionLogsDashboard />;
};

export default BulkActionLogs;
