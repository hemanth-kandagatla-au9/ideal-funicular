import safeLazy from '../../utils/safeLazy';

export const DashboardJNJ = safeLazy(() => import('workflow/DashboardJNJ'));
export const Execution = safeLazy(() => import('workflow/Execution'));
export const Settings = safeLazy(() => import('workflow/Settings'));
export const Capability = safeLazy(() => import('workflow/Capability'));
export const Metrics = safeLazy(() => import('workflow/Metrics'));
export const NodeManagement = safeLazy(() => import('workflow/NodeManagement'));
export const Approvalrequest = safeLazy(() => import('workflow/Approvalrequest'));
export const AuditLogsPage = safeLazy(() => import('workflow/AuditLogs'));
export const WorkflowCreation = safeLazy(() => import('workflow/WorkflowCreation'));
export const ExecutionViewPage = safeLazy(() => import('workflow/ExecutionViewPage'));
export const AddWorkflowPage = safeLazy(() => import('workflow/AddWorkflowPage'));
export const HelpContent = safeLazy(() => import('workflow/HelpContent'));
