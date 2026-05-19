import safeLazy from '../../utils/safeLazy';

export const RisebotModule = safeLazy(() => import('risebot/risebot'));
