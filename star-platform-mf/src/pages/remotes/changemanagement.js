import safeLazy from '../../utils/safeLazy';

export const PipelineConfig = safeLazy(() => import('changeManagement/pipelineConfig'));
export const ChangemanagementSettings = safeLazy(() => import('changeManagement/settings'));
export const CmApprovalrequest = safeLazy(() => import('changeManagement/approvalrequest'));
export const CmRequestStatus = safeLazy(() => import('changeManagement/requeststatus'));
