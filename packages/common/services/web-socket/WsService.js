import { signal } from "@preact/signals";
import { Client } from '@stomp/stompjs';
import { WebSocketStatus } from './ws-status.js';
import { AppConfig } from '../../config/app-config.js';
import SockJS from "sockjs-client";

/**
 * Generic STOMP WS wrapper
 * - Tracks subscriptions
 * - Reconnects automatically
 * - Parses JSON payloads
 */
export class WsService {
  constructor() {
    this.stompClient = null;
    this.wsStatus = signal(WebSocketStatus.DISCONNECTED);
    this.wsServerOk = signal(false);
    
    /**
     * @type {Record<string, {
     *   destination: string,
     *   callback: (payload: any) => void,
     *   sub: any
     * }>}
     */
    this.subscriptions = {};
    
    this._connectInProgress = false;
    this._statusConnectInProgress = false;
    
    // Auto-reconnect on tab focus / visibility
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('[WsService] Tab became visible → ensure connection');
        this.connectForStatus();
      }
    });
    
    window.addEventListener('focus', () => {
      console.log('[WsService] Window focused → ensure connection');
      this.connectForStatus();
    });
  }
  
  connectForStatus() {
    if (this._statusConnectInProgress) return;
    this._statusConnectInProgress = true;
    
    if (this._connectInProgress || this.stompClient?.connected) {
      this._statusConnectInProgress = false;
      return;
    }
    
    this._connectInProgress = true;
    this.wsStatus.value = WebSocketStatus.CONNECTING;
    
    console.debug('[WsService] Connecting…');
    
    const socket = new SockJS(AppConfig.wsUrl);
    
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      
      onConnect: () => {
        console.debug('[WsService] Connected to server');
        this.wsStatus.value = WebSocketStatus.CONNECTED;
        this.wsServerOk.value = true;
        this._connectInProgress = false;
        this._statusConnectInProgress = false;
        
        this._resubscribeAll();
      },
      onStompError: frame => {
        console.error('[WS] STOMP error', frame);
        this._handleDisconnect();
      },
      onWebSocketClose: evt => this._handleDisconnect(evt),
      onWebSocketError: evt => this._handleDisconnect(evt)
    });
    
    this.stompClient.activate();
  }
  
  subscribe(destination, callback) {
    // Unsubscribe if already subscribed
    const existing = Object.values(this.subscriptions).find(sub => sub.destination === destination);
    if (existing?.sub) {
      existing.sub.unsubscribe();
    }
    
    // Only subscribe if connected
    let sub = null;
    if (this.stompClient?.connected) {
      sub = this.stompClient.subscribe(destination, (msg) => {
        // Safely get message body (handle text or binary)
        const raw = msg.body ?? (msg._binaryBody && new TextDecoder().decode(msg._binaryBody));
        if (!raw) return;
        
        try {
          const payload = JSON.parse(raw);
          callback(payload);
        } catch (err) {
          console.error('[WsService] Failed to parse message', raw, err);
        }
      });
      
      console.log('[WsService] Subscribed to', destination);
    }
    
    // Store subscription for reconnect/resubscribe
    this.subscriptions[destination] = { destination, callback, sub };
    return sub;
  }
  
  send(destination, payload) {
    if (!this.stompClient?.connected) {
      console.warn('[WsService] Cannot send, not connected');
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
  }
  
  _handleDisconnect() {
    console.warn('[WS] Disconnected, scheduling reconnect in 3s');
    this.wsStatus.value = WebSocketStatus.DISCONNECTED;
    this.wsServerOk.value = false;
    this._connectInProgress = false;
    this._statusConnectInProgress = false;
    
    setTimeout(() => this.connectForStatus(), 3000);
  }
  
  _resubscribeAll() {
    if (!this.stompClient?.connected) return;
    Object.values(this.subscriptions).forEach(entry => {
      entry.sub = this.stompClient.subscribe(entry.destination, msg => {
        try {
          const payload = JSON.parse(msg.body);
          entry.callback(payload);
        } catch (err) {
          console.error('[WS] Failed to parse resub message', msg, err);
        }
      });
    });
  }
}

// Singleton instance
export const wsService = new WsService();