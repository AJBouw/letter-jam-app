import { gameStore } from './game-store.js';
import { loadingStore } from './loading-store.js';
import { errorStore } from './error-store.js';

export const GlobalStore = {
    game: gameStore,
    loading: loadingStore,
    error: errorStore
};