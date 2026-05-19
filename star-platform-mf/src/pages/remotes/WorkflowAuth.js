import safeLazy from '../../utils/safeLazy';

export const workflowAuthApp = safeLazy(() => import('WorkflowAuth/authApp'));
