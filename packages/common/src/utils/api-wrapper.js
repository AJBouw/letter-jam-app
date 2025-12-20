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

const API_BASE = 'http://localhost:8080';

/**
 * GET wrapper
 */
export async function apiGet(key, path) {
  return apiCall(key, async () => {
    const res = await fetch(API_BASE + path);
    
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || res.statusText);
    }
    
    return res.json();
  });
}

/**
 * POST wrapper
 */
export async function apiPost(key, path, body) {
  return apiCall(key, async () => {
    const res = await fetch(API_BASE + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || res.statusText);
    }
    
    return res.json();
  });
}