import { safeLazy } from '../../utils/safeLazy';
import { resolveRemoteUrl } from '../../utils/Remoteurls';

//Flip this when you want to test predev from localhost
const FORCE_PREDEV = false;

const AGENT_REMOTE_URL = resolveRemoteUrl(
  {
    local: 'http://localhost:3005/remoteEntry.js',
    predev: 'https://predev.agent.ias.apps.jnj.com/remoteEntry.js',
    dev: 'https://dev.agent.ias.apps.jnj.com/remoteEntry.js',
    qa: 'https://qa.agent.ias.apps.jnj.com/remoteEntry.js',
    prod: 'https://agent.ias.jnj.com/remoteEntry.js',
  },
  FORCE_PREDEV
);

export const RisebotModule = safeLazy('risebot', AGENT_REMOTE_URL, './risebot');
