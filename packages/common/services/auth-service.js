import { createAppError } from '../error-handling/app-error.js';
import { userSession } from '../session/user-session.js';

export class AuthService {
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;
  }
  
  async login({ identifier, password }) {
    const payload = { identifier, password, sessionUuid: userSession.sessionUuid.value };
    
    console.info('[AuthService] Login request:\n', JSON.stringify(payload, null, 2));
    
    try {
      const res = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const rawText = await res.text();
      let data;
      try {
        data = rawText ? JSON.parse(rawText) : null;
      } catch {
        data = rawText;
      }
      
      console.info('[AuthService] Login response:\n', JSON.stringify(data, null, 2));
      
      if (!res.ok) {
        throw await this._mapHttpError(res, rawText); // Pass raw text to mapHttpError
      }
      
      // Update session after login
      const me = await this.checkAuth();
      if (!me) throw createAppError({ code: 'INVALID_CREDENTIALS', message: 'Login failed' });
      
      return { message: 'Login successful', identifier };
      
    } catch (err) {
      console.error('[AuthService] Login error:', err);
      throw this._normalizeError(err);
    }
  }
  
  async logout() {
    try {
      await fetch(`${this.apiBaseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } finally {
      userSession.logout();
      userSession.resetSession();
    }
  }
  
  async checkAuth() {
    try {
      const res = await fetch(`${this.apiBaseUrl}/auth/me`, {
        credentials: 'include'
      });
      
      if (!res.ok) {
        userSession.isAuthenticated.value = false;
        userSession.userUuid.value = null;
        return false;
      }
      
      const data = await res.json();
      // Only mark authenticated if backend returned a userUuid
      const loggedIn = !!data.userUuid;
      userSession.isAuthenticated.value = loggedIn;
      userSession.userUuid.value = data.userUuid ?? null;
      
      return loggedIn;
    } catch {
      userSession.isAuthenticated.value = false;
      userSession.userUuid.value = null;
      return false;
    }
  }
  
  // ===== ERROR HANDLING =====
  async _mapHttpError(res, bodyText) {
    // Try to parse error body
    let parsed = null;
    try {
      parsed = bodyText ? JSON.parse(bodyText) : null;
    } catch {
      parsed = null;
    }
    
    const code = parsed?.error?.code || `HTTP_${res.status}`;
    const message = parsed?.error?.message || res.statusText || 'Request failed';
    
    return createAppError({
      code,
      message,
      status: res.status,
      cause: parsed || bodyText
    });
  }
  
  _normalizeError(err) {
    if (err instanceof TypeError) {
      // Network / CORS failure
      return createAppError({
        code: 'NETWORK_ERROR',
        message: 'Cannot reach server. Please try again later.',
        status: null,
        cause: err
      });
    }
    
    if (err?.name === 'AppError') return err;

    return createAppError({
      code: 'UNEXPECTED_ERROR',
      message: err?.message || 'An unexpected error occurred',
      status: err?.status || null,
      cause: err
    });
  }
}