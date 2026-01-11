import { AppConfig } from '../config/app-config.js';
import { loadingStore } from '../store/loading-store.js';
import { errorStore } from '../store/error-store.js';

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

export async function apiGet(key, path) {
  return apiCall(key, async () => {
    const res = await fetch(`${AppConfig.apiBase}${path}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || res.statusText);
    }
    return res.json();
  });
}

export async function apiPost(key, path, body) {
  return apiCall(key, async () => {
    const res = await fetch(`${AppConfig.apiBase}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const raw = await res.text();
    
    if (!res.ok) {
      let message = res.statusText;
      try {
        const parsed = raw ? JSON.parse(raw) : null;
        message = parsed?.message || message;
      } catch {
        // ignore JSON parse errors
      }
      throw new Error(message)
    }
    
    // 204 or empty body
    if (!raw) {
      return;
    }
    
    return JSON.parse(raw);
  });
}