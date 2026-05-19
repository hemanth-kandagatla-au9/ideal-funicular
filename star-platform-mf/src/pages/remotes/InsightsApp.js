import safeLazy from '../../utils/safeLazy';

export const AuditLogs = safeLazy(() => import('Insights/AuditLogs'));
export const Approvalstatus = safeLazy(() => import('Insights/RequestStatus'));
export const SapFacts = safeLazy(() => import('Insights/SapFacts'));
export const RequestApproval = safeLazy(() => import('Insights/RequestApproval'));
export const Cmdb = safeLazy(() => import('Insights/Cmdb'));
export const Users = safeLazy(() => import('Insights/Users'));
export const Codemarketplace = safeLazy(() => import('Insights/Codemarketplace'));
export const Report = safeLazy(() => import('Insights/Report'));
export const Ins_Settings = safeLazy(() => import('Insights/Settings'));
export const Schedule = safeLazy(() => import('Insights/Schedule'));
