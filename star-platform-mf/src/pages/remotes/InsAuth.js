import { safeLazy } from '../../utils/safeLazy';

const REMOTE_URL = 'https://predev.insightsauth.ias.apps.jnj.com/remoteEntry.js';
// const REMOTE_URL = "https://localhost:3005/remoteEntry.js";

// https://localhost:3005/remoteEntry.js
export const InsightsAuth = safeLazy('authApp', REMOTE_URL, './authApp');
