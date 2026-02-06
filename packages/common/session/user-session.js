// import { signal } from '@preact/signals';
// import {
//   createOrRestoreSessionUuid,
//   persistSessionUuid,
//   SESSION_KEY,
//   PERSIST_KEY,
//   clearSessionUuid
// } from './session-storage.js';
//
// class UserSession {
//   constructor() {
//     this.sessionUuid = signal(createOrRestoreSessionUuid());
//     this.isAuthenticated = signal(false);
//     this.userUuid = signal(null);
//     this._listeners = [];
//     this._ensureSession();
//   }
//
//   initSession() {
//     console.debug('[user-session] sessionUuid: ', this.sessionUuid);
//     if (!this.sessionUuid.value) {
//       console.debug('[user-session] create or restore session uuid');
//       this.sessionUuid.value = createOrRestoreSessionUuid();
//     }
//
//     console.debug('[user-session] session ready:', this.sessionUuid.value);
//     this._listeners.forEach(callback => callback(this.sessionUuid.value));
//
//     return this.sessionUuid.value;
//   }
//
//   onReady(callback) {
//     if (typeof callback !== 'function') return;
//
//     this._listeners.push(callback);
//
//     // If already ready, call immediately
//     if (this.sessionUuid.value) {
//       callback(this.sessionUuid.value);
//     }
//   }
//
//   persist() {
//     persistSessionUuid(this.sessionUuid.value);
//   }
//
//   resetSession() {
//     clearSessionUuid();
//     this.sessionUuid.value = createOrRestoreSessionUuid();
//
//     // notify listeners of new session
//     this._listeners.forEach(callback => callback(this.sessionUuid.value));
//   }
//
//   login() {
//     // call backend, verify credentials...
//     this.isAuthenticated.value = true;
//   }
//
//   logout() {
//     this.isAuthenticated.value = false;
//     this.userUuid.value = null;
//   }
//
//   // ============== //
//   // Helper methods //
//   // ============== //
//   _ensureSession() {
//     if (!this.sessionUuid.value) {
//       this.sessionUuid.value = crypto.randomUUID();
//       sessionStorage.setItem(SESSION_KEY, this.sessionUuid.value);
//       console.debug('[user-session] New session created', this.sessionUuid.value);
//     }
//   }
// }
//
// export const userSession = new UserSession();

import { signal } from '@preact/signals';
import {
  createOrRestoreSessionUuid,
  persistSessionUuid,
  SESSION_KEY,
  PERSIST_KEY,
  clearSessionUuid
} from './session-storage.js';

class UserSession {
  constructor() {
    // Load sessionUuid from sessionStorage first, fallback to persisted (localStorage), then create new
    const session = sessionStorage.getItem(SESSION_KEY);
    const persisted = localStorage.getItem(PERSIST_KEY);
    this.sessionUuid = signal(session || persisted || createOrRestoreSessionUuid());
    
    this.isAuthenticated = signal(false);
    this.userUuid = signal(null);
    this._listeners = [];
    
    this._ensureSession();
  }
  
  initSession() {
    console.debug('[user-session] sessionUuid: ', this.sessionUuid.value);
    
    if (!this.sessionUuid.value) {
      console.debug('[user-session] create or restore session uuid');
      this.sessionUuid.value = createOrRestoreSessionUuid();
    }
    
    console.debug('[user-session] session ready:', this.sessionUuid.value);
    this._listeners.forEach(callback => callback(this.sessionUuid.value));
    
    return this.sessionUuid.value;
  }
  
  onReady(callback) {
    if (typeof callback !== 'function') return;
    
    this._listeners.push(callback);
    
    if (this.sessionUuid.value) {
      callback(this.sessionUuid.value);
    }
  }
  
  // Persist session across tabs & reloads
  persist() {
    persistSessionUuid(this.sessionUuid.value); // writes to localStorage (PERSIST_KEY)
  }
  
  resetSession() {
    clearSessionUuid(); // clears both SESSION_KEY & PERSIST_KEY
    this.sessionUuid.value = createOrRestoreSessionUuid();
    this.isAuthenticated.value = false;
    this.userUuid.value = null;
    
    this._listeners.forEach(callback => callback(this.sessionUuid.value));
  }
  
  login(userUuid) {
    this.isAuthenticated.value = true;
    this.userUuid.value = userUuid;
    
    // Persist across reloads
    this.persist();
  }
  
  logout() {
    this.isAuthenticated.value = false;
    this.userUuid.value = null;
    this.resetSession();
  }
  
  _ensureSession() {
    if (!this.sessionUuid.value) {
      this.sessionUuid.value = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, this.sessionUuid.value);
      console.debug('[user-session] New session created', this.sessionUuid.value);
    } else {
      // Always store in sessionStorage
      sessionStorage.setItem(SESSION_KEY, this.sessionUuid.value);
    }
  }
}

export const userSession = new UserSession();