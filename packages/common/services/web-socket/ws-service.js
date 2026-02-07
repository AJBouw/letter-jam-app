import { effect, signal } from '@preact/signals';
import { Client } from '@stomp/stompjs';
import { WebSocketStatus } from './ws-status.js';
import { AppConfig } from '../../config/app-config.js';
import { userSession } from '../../session/user-session.js';
import SockJS from 'sockjs-client';

/**
 * Generic STOMP WS wrapper
 * - Tracks subscriptions
 * - Reconnects automatically
 * - Parses JSON payloads
 */
// export class WsService {
//   constructor() {
//     // === Reactive state ===
//     this.wsStatus = signal(WebSocketStatus.DISCONNECTED);
//     this.wsServerOk = signal(false);
//
//     // Reference; do not copy (.value), instead shared state by reference
//     this.sessionUuid = userSession.sessionUuid;
//
//     // === Internal state ==
//     this.stompClient = null;
//     this.subscriptions = {};
//     this._connectInProgress = false;
//
//     // Auto-reconnect on tab focus / visibility
//     document.addEventListener('visibilitychange', () => {
//       if (document.visibilityState === 'visible') {
//         console.log('[WsService] Tab became visible → ensure connection');
//         this.connectForStatus();
//       }
//     });
//
//     window.addEventListener('focus', () => {
//       console.log('[WsService] Window focused → ensure connection');
//       this.connectForStatus();
//     });
//
//     effect(() => {
//       const sessionUuid = userSession.sessionUuid.value;
//       if (!sessionUuid) {
//         console.debug('[ws-service] No sessionUuid');
//        return;
//       }
//
//       console.debug('[ws-service] Session ready → ensure connection');
//       this.onSessionReady();
//     });
//   }
//
//
//   connectForStatus() {
//     console.debug('[ws-service] Connecting using session uuid: ', this.sessionUuid.value);
//
//     if (!this.sessionUuid.value) {
//       console.warn('[ws-service] No session uuid - abort connecting');
//       return;
//     }
//
//     if (this._connectInProgress || this.stompClient?.active) {
//       console.debug('[ws-service] Client is connecting or connected');
//       return;
//     }
//
//     this._connectInProgress = true;
//     this.wsStatus.value = WebSocketStatus.CONNECTING;
//
//     const socket = new SockJS(AppConfig.wsUrl);
//
//     this.stompClient = new Client({
//       webSocketFactory: () => socket,
//       reconnectDelay: 5000,
//       heartbeatIncoming: 10000,
//       heartbeatOutgoing: 10000,
//
//       connectHeaders: {
//         sessionUuid: this.sessionUuid.value
//       },
//
//       onConnect: () => {
//         console.debug('[ws-service] Connected to server with sessionUuid: ', this.sessionUuid.value);
//
//         this.wsStatus.value = WebSocketStatus.CONNECTED;
//         this.wsServerOk.value = true;
//         this._connectInProgress = false;
//
//         this._resubscribeAll();
//       },
//       onStompError: frame => {
//         console.error('[ws-service] STOMP error', frame);
//         this._handleDisconnect();
//       },
//       onWebSocketClose: evt => this._handleDisconnect(evt),
//       onWebSocketError: evt => this._handleDisconnect(evt)
//     });
//
//     this.stompClient.activate();
//   }
//
//   subscribe(destination, callback) {
//     // Unsubscribe if already subscribed
//     const existing = Object.values(this.subscriptions).find(sub => sub.destination === destination);
//     if (existing?.sub) {
//       existing.sub.unsubscribe();
//     }
//
//     // Only subscribe if connected
//     let sub = null;
//     if (this.stompClient?.connected) {
//       sub = this.stompClient.subscribe(destination, (msg) => {
//         // Safely get message body (handle text or binary)
//         const raw = msg.body ?? (msg._binaryBody && new TextDecoder().decode(msg._binaryBody));
//         if (!raw) return;
//
//         try {
//           const payload = JSON.parse(raw);
//           callback(payload);
//         } catch (err) {
//           console.error('[WsService] Failed to parse message', raw, err);
//         }
//       });
//
//       console.log('[WsService] Subscribed to', destination);
//     }
//
//     // Store subscription for reconnect/resubscribe
//     this.subscriptions[destination] = { destination, callback, sub };
//     return sub;
//   }
//
//   send(destination, payload) {
//     if (!this.stompClient?.connected) {
//       console.warn('[WsService] Cannot send, not connected');
//       return;
//     }
//
//     this.stompClient.publish({
//       destination,
//       body: JSON.stringify(payload)
//     });
//   }
//
//   disconnectAll() {
//     Object.values(this.subscriptions).forEach(entry => {
//       entry.sub?.unsubscribe();
//     });
//
//     this.subscriptions = {};
//     this.stompClient?.deactivate();
//   }
//
//   onSessionReady() {
//     console.debug('[ws-service] Session ready → ensure WS connection');
//     if (!this.stompClient?.connected) {
//       this.connectForStatus();
//     }
//   }
//
//   // ============== //
//   // Helper methods //
//   // ============== //
//   _handleDisconnect() {
//     console.warn('[WS] Disconnected, scheduling reconnect in 3s');
//     this.wsStatus.value = WebSocketStatus.DISCONNECTED;
//     this.wsServerOk.value = false;
//     this._connectInProgress = false;
//
//     setTimeout(() => this.connectForStatus(), 3000);
//   }
//
//   _resubscribeAll() {
//     if (!this.stompClient?.connected) return;
//
//     Object.values(this.subscriptions).forEach(entry => {
//       entry.sub?.unsubscribe();
//
//       entry.sub = this.stompClient.subscribe(entry.destination, msg => {
//         try {
//           const raw = msg.body ?? msg._binaryBody;
//           if (!raw) return;
//
//           const payload = JSON.parse(raw);
//           entry.callback(payload);
//         } catch (err) {
//           console.error('[WS] Failed to parse resub message', msg, err);
//         }
//       });
//     });
//   }
// }
//
// // Singleton instance
// export const wsService = new WsService();

export class WsService {
  constructor() {
    // === Reactive state ===
    this.wsStatus = signal(WebSocketStatus.DISCONNECTED);
    this.wsServerOk = signal(false);
    
    // Shared session reference (DO NOT copy .value)
    this.sessionUuid = userSession.sessionUuid;
    
    // === Internal state ===
    this.stompClient = null;
    this.subscriptions = {};
    this._connectInProgress = false;
    
    // React to session becoming available
    effect(() => {
      if (!this.sessionUuid.value) {
        console.debug('[ws-service] Cannot proceed without sessionUuid')
        return;
      }
      console.debug('[ws] Session ready → ensure connection');
      this.ensureConnected();
    });
    
    // Reconnect when tab regains focus
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.ensureConnected();
      }
    });
    
    window.addEventListener('focus', () => {
      this.ensureConnected();
    });
  }
  
  // ======================
  // Public API
  // ======================
  ensureConnected() {
    if (!this.sessionUuid.value) {
      console.warn('[ws] No sessionUuid yet — skip connect');
      return;
    }
    
    if (this._connectInProgress || this.stompClient?.active) {
      return;
    }
    
    this._connect();
  }
  
  forceReconnect() {
    console.debug('[ws] Force reconnect called');
    
    // Abort any existing connection
    if (this.stompClient?.active) this.stompClient.deactivate();
    
    this._connectInProgress = false;
    this.wsStatus.value = WebSocketStatus.DISCONNECTED;
    this.wsServerOk.value = false;
    
    this.ensureConnected();
  }
  
  subscribe(destination, callback) {
    // Remove existing subscription for destination
    this.subscriptions[destination]?.sub?.unsubscribe();
    
    const entry = {
      destination,
      callback,
      sub: null
    };
    
    // Subscribe immediately if connected
    if (this.stompClient?.connected) {
      entry.sub = this._subscribeInternal(entry);
    }
    
    this.subscriptions[destination] = entry;
    return entry.sub;
  }
  
  send(destination, payload) {
    if (!this.stompClient?.connected) {
      console.warn('[ws] Cannot send — not connected');
      return;
    }
    
    this.stompClient.publish({
      destination,
      body: JSON.stringify(payload)
    });
  }
  
  disconnectAll() {
    Object.values(this.subscriptions).forEach(entry => {
      entry.sub?.unsubscribe();
    });
    
    this.subscriptions = {};
    this.stompClient?.deactivate();
    this.stompClient = null;
    
    this.wsStatus.value = WebSocketStatus.DISCONNECTED;
    this.wsServerOk.value = false;
  }
  
  // ======================
  // Internal helpers
  // ======================
  
  _connect() {
    console.debug('[ws] Connecting with sessionUuid:', this.sessionUuid.value);
    
    this._connectInProgress = true;
    this.wsStatus.value = WebSocketStatus.CONNECTING;
    
    const socket = new SockJS(AppConfig.wsUrl);
    
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 0, // we handle reconnect ourselves
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      connectHeaders: {
        sessionUuid: this.sessionUuid.value
      },
      
      onConnect: () => this._onConnect(),
      onStompError: frame => this._onDisconnect(frame),
      onWebSocketClose: evt => this._onDisconnect(evt),
      onWebSocketError: evt => this._onDisconnect(evt)
    });
    
    this.stompClient.activate();
  }
  
  _onConnect() {
    console.debug('[ws] Connected');
    
    this._connectInProgress = false;
    this.wsStatus.value = WebSocketStatus.CONNECTED;
    this.wsServerOk.value = true;
    
    this._resubscribeAll();
  }
  
  _onDisconnect(reason) {
    console.warn('[ws] Disconnected', reason);
    
    this._connectInProgress = false;
    this.wsStatus.value = WebSocketStatus.DISCONNECTED;
    this.wsServerOk.value = false;
    
    // Retry after delay
    setTimeout(() => this.ensureConnected(), 3000);
  }
  
  _subscribeInternal(entry) {
    return this.stompClient.subscribe(entry.destination, msg => {
      const raw =
        msg.body ??
        (msg._binaryBody && new TextDecoder().decode(msg._binaryBody));
      
      if (!raw) return;
      
      try {
        entry.callback(JSON.parse(raw));
      } catch (err) {
        console.error('[ws] Failed to parse message', raw, err);
      }
    });
  }
  
  _resubscribeAll() {
    if (!this.stompClient?.connected) return;
    
    Object.values(this.subscriptions).forEach(entry => {
      entry.sub?.unsubscribe();
      entry.sub = this._subscribeInternal(entry);
    });
  }
}

// Singleton
export const wsService = new WsService();