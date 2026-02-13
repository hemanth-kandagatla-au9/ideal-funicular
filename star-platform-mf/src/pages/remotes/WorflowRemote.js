import { safeLazy } from '../../utils/safeLazy';
import { resolveRemoteUrl } from '../../utils/Remoteurls';

//Flip this when you want to test predev from localhost
const FORCE_PREDEV = false;

window.location.hostname.startsWith('predev');

const WORKFLOW_REMOTE_URL = resolveRemoteUrl(
  {
    local: 'http://localhost:3002/remoteEntry.js',
    predev: 'https://predev.workflow.ias.apps.jnj.com/remoteEntry.js',
    dev: 'https://dev.workflow.ias.apps.jnj.com/remoteEntry.js',
    qa: 'https://qa.workflow.ias.apps.jnj.com/remoteEntry.js',
    prod: 'https://workflow.ias.jnj.com/remoteEntry.js',
  },
  FORCE_PREDEV
);

export const DashboardJNJ = safeLazy('workflow', WORKFLOW_REMOTE_URL, './DashboardJNJ');
export const Execution = safeLazy('workflow', WORKFLOW_REMOTE_URL, './Execution');
export const Settings = safeLazy('workflow', WORKFLOW_REMOTE_URL, './Settings');
export const Capability = safeLazy('workflow', WORKFLOW_REMOTE_URL, './Capability');
export const Metrics = safeLazy('workflow', WORKFLOW_REMOTE_URL, './Metrics');
export const NodeManagement = safeLazy('workflow', WORKFLOW_REMOTE_URL, './NodeManagement');
export const Approvalrequest = safeLazy('workflow', WORKFLOW_REMOTE_URL, './Approvalrequest');
export const AuditLogsPage = safeLazy('workflow', WORKFLOW_REMOTE_URL, './AuditLogs');
export const WorkflowCreation = safeLazy('workflow', WORKFLOW_REMOTE_URL, './WorkflowCreation');
export const ExecutionViewPage = safeLazy('workflow', WORKFLOW_REMOTE_URL, './ExecutionViewPage');
export const AddWorkflowPage = safeLazy('workflow', WORKFLOW_REMOTE_URL, './AddWorkflowPage');
