/* eslint-disable */

/**
 * Bulk Action Logs - Type Definitions
 * Master-Detail split view for viewing bulk action logs
 * Left: Job list (API 1), Right: Job details (API 2)
 */

/** Status of a bulk action */
export type BulkActionStatusType = 'Pending' | 'Success' | 'Failure' | 'Partial' | 'In Progress';

/** Type of bulk action */
export type BulkActionTypeT = 'SYNC_CONFIG' | 'SYNC_SCRIPTS' | 'UPGRADE' | 'HEALTH_CHECK' | 'RESTART';

/** Individual server sync status */
export interface ServerSyncStatus {
  serverId: string;
  serverName: string;
  status: 'Success' | 'Pending' | 'Failure' | 'In Progress';
  configSyncedSuccessfully?: boolean;
  message: string;
  syncedAt?: string;
  errorDetails?: string;
  retryCount?: number;
}

/** Bulk action list item (API 1 response) */
export interface BulkAction {
  jobId: string;
  jobName: string;
  type: BulkActionTypeT;
  status: BulkActionStatusType;
  createdAt: string;
  totalServers: number;
  successCount?: number;
  failureCount?: number;
  pendingCount?: number;
  completionPercentage: number;
  user: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number; // in seconds
}

/** Detailed bulk action with servers (API 2 response) */
export interface BulkActionDetails extends BulkAction {
  servers: ServerSyncStatus[];
  version?: string;
  description?: string;
  isActive: boolean;
  configuration?: Record<string, any>;
  logs?: string;
  retryPolicy?: {
    maxRetries: number;
    retryInterval: number;
  };
}

/** Filter options for bulk actions list */
export interface BulkActionLogsFilter {
  type: BulkActionTypeT[] | string[];
  status: BulkActionStatusType[] | string[];
  dateRange?: {
    start: string;
    end: string;
  };
  user?: string;
  searchText?: string;
}

/** Pagination metadata */
export interface PaginationMetadata {
  pageNo: number;
  limit: number;
  totalRows: number;
  totalPage: number;
}

/** API Response for bulk actions list (API 1) */
export interface BulkActionsListResponse {
  data: BulkAction[];
  pagination: PaginationMetadata;
}

/** API Response for single bulk action details (API 2) */
export interface BulkActionDetailsResponse {
  data: BulkActionDetails;
}

/** Redux state for bulk action logs module */
export interface BulkActionLogsState {
  // Data from API 1 - Left section (job list)
  bulkActions: BulkAction[];
  
  // Data from API 2 - Right section (job details)
  selectedBulkAction: BulkActionDetails | null;
  
  // Filters
  filters: BulkActionLogsFilter;
  
  // Pagination
  pagination: PaginationMetadata;
  
  // Loading states
  loading: boolean;
  detailsLoading: boolean;
  
  // Error handling
  error: string | null;
  detailsError: string | null;
  
  // Action-specific states
  syncInProgress: boolean;
  syncError: string | null;
  
  // Available filters from API (stored globally to show all options)
  availableFilters: {
    actions: string[];
    users: string[];
  };
  
  // UI state
  selectedJobId: string | null;
  expandedServerId: string | null;
  filterPanelOpen: boolean;
}

/** Initial state factory */
export const INITIAL_BULK_ACTION_LOGS_STATE: BulkActionLogsState = {
  bulkActions: [],
  selectedBulkAction: null,
  filters: {
    type: [],
    status: [],
    dateRange: undefined,
    user: '',
    searchText: '',
  },
  pagination: {
    pageNo: 0,
    limit: 10,
    totalRows: 0,
    totalPage: 0,
  },
  loading: false,
  detailsLoading: false,
  error: null,
  detailsError: null,
  syncInProgress: false,
  syncError: null,
  selectedJobId: null,
  expandedServerId: null,
  filterPanelOpen: false,
  availableFilters: {
    actions: [],
    users: [],
  },
};

/** Redux action payloads */
export interface FetchBulkActionsPayload {
  filters?: BulkActionLogsFilter;
  pagination?: {
    pageNo: number;
    limit: number;
  };
}

export interface FetchBulkActionDetailsPayload {
  jobId: string;
}

export interface UpdateFiltersPayload {
  filters: Partial<BulkActionLogsFilter>;
}

export interface UpdatePaginationPayload {
  pageNo: number;
  limit?: number;
}
