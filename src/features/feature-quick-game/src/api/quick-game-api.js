import { post } from '../../../../services/api/api.js';

export function startQuickGame(player) {
    return post('/game/quick-start', player);
}