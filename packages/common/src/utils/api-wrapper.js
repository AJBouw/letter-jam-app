
import { loadingStore } from '../data/loading-store.js';
import { errorStore } from '../data/error-store.js';

/**
 * Wraps any async function to auto-handle loading + error state
 */
export async function apiCall(key, asyncFn) {
    try {
        loadingStore.set(key, true);
        errorStore.clear(key);

        const result = await asyncFn();

        loadingStore.set(key, false);
        return result;
    } catch (err) {
        loadingStore.set(key, false);
        errorStore.set(key, err.message || 'Unknown error');
        throw err;
    }
}