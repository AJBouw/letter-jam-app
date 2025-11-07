import { post } from '../../../../services/api/api.js';

export function startQuickGame(player) {
    console.log('Calling API endpoint:', '/games/quick-start');
    return post('/games/quick-start', player);
}