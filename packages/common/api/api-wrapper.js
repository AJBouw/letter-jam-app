import { AppConfig } from '../config/app-config.js';
import { loadingStore } from '../store/loading-store.js';
import { errorStore } from '../store/error-store.js';
import { createAppError } from "../error-handling/app-error.js";

/**
 * Wraps any async function to auto-handle loading + error state
 */
export async function apiCall(key, asyncFn) {
  loadingStore.set(key, true);
  errorStore.clear(key);
  
  try {
    return await asyncFn();
  } catch (err) {
    const appError = err?.name === 'AppError'
      ? err
      : createAppError({
        code: err?.code || 'NETWORK_ERROR',
        message: err?.message,
        status: err?.status,
        cause: err
      });
    
    // Store message for the frontend
    errorStore.set(key, appError.message);
    
    // Throw normalized error so ViewModel can rely on it
    throw appError;
  } finally {
    loadingStore.set(key, false);
  }
}

export async function apiGet(key, path) {
  return apiCall(key, async () => {
    const res = await fetch(`${AppConfig.apiBase}${path}`);
    return handleResponse(res);
  });
}

export async function apiPost(key, path, body) {
  return apiCall(key, async () => {
    const res = await fetch(`${AppConfig.apiBase}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(res);
  });
}

async function handleResponse(res) {
  const raw = await res.text();
  let parsed = null;
  
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    // ignore parse errors
  }
  
  if (!res.ok) {
    throw createAppError({
      message: parsed?.error?.message || res.statusText || 'Request failed',
      code: parsed?.error?.code || `HTTP_${res.status}`,
      status: res.status,
      cause: parsed
    });
  }
  
  return parsed;
}