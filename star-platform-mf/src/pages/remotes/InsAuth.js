import safeLazy from '../../utils/safeLazy';

export const InsightsAuthApp = safeLazy(() => import('InsightsAuth/authApp'));
