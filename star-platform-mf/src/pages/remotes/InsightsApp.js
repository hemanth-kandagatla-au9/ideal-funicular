import { safeLazy } from '../../utils/safeLazy';

import { resolveRemoteUrl } from '../../utils/Remoteurls';

//Flip this when you want to test predev from localhost
const FORCE_PREDEV = false;

const INSIGHTS_REMOTE_URL = resolveRemoteUrl(
  {
    local: 'http://localhost:3000/remoteEntry.js',
    predev: 'https://predev.insights.ias.apps.jnj.com/remoteEntry.js',
    dev: 'https://dev.insights.ias.apps.jnj.com/remoteEntry.js',
    qa: 'https://qa.insights.ias.apps.jnj.com/remoteEntry.js',
    prod: 'https://insights.ias.jnj.com/remoteEntry.js',
  },
  FORCE_PREDEV
);

//1
export const AuditLogs = safeLazy('Insights', INSIGHTS_REMOTE_URL, './AuditLogs');
//2
export const Approvalstatus = safeLazy('Insights', INSIGHTS_REMOTE_URL, './RequestStatus');
//3
export const RequestApproval = safeLazy('Insights', INSIGHTS_REMOTE_URL, './RequestApproval');
//4
export const SapFacts = safeLazy('Insights', INSIGHTS_REMOTE_URL, './SapFacts');
//5
export const Cmdb = safeLazy('Insights', INSIGHTS_REMOTE_URL, './Cmdb');
//6
export const Users = safeLazy('Insights', INSIGHTS_REMOTE_URL, './Users');
//7
export const Codemarketplace = safeLazy('Insights', INSIGHTS_REMOTE_URL, './Codemarketplace');
//8
export const Report = safeLazy('Insights', INSIGHTS_REMOTE_URL, './Report');
//9
export const Ins_Settings = safeLazy('Insights', INSIGHTS_REMOTE_URL, './Settings');

export const Schedule = safeLazy('Insights', INSIGHTS_REMOTE_URL, './Schedule');
