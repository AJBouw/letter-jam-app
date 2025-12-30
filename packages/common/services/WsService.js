import { WebSocketStatus, wsServerStatus } from '../web-socket/ws-status.js';
import { Client } from '@stomp/stompjs';
import { AppConfig } from '../config/app-config.js';
import SockJS from "sockjs-client";
import { computed, signal } from "@preact/signals";

/**
 * Track message subscribers per topic
 * Parse messages JSON automatically
 * Expose typed publish and subscribe for events
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
    
    // Ensure recovery after tab sleep / focus loss
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        console.log('[WS] Tab became visible → ensure connection');
        this.connectForStatus();
      }
    });

    window.addEventListener('focus', () => {
      console.log('[WS] Window focused → ensure connection');
      this.connectForStatus();
    });
  }
  
  connectForStatus() {
    if (this._statusConnectInProgress) return;
    this._statusConnectInProgress = true;
    
    const tryConnect = () => {
      if (this._connectInProgress) return;
      
      if (this.stompClient?.connected) {
        this._statusConnectInProgress = false;
        return;
      }
      
      this._connectInProgress = true;
      this.wsStatus.value = WebSocketStatus.CONNECTING;
      
      console.log('[WS] Connecting…');
      
      const socket = new SockJS(AppConfig.wsUrl);
      
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        
        onConnect: () => {
          console.log('[WS] Connected to server');
          this.wsStatus.value = WebSocketStatus.CONNECTED;
          this.wsServerOk.value = true;
          
          this._connectInProgress = false;
          this._statusConnectInProgress = false;
          
          this._resubscribeAll();
        },
        
        onStompError: (frame) => {
          console.error('[WS] STOMP error', frame);
          this._handleDisconnect();
        },
        
        onWebSocketClose: (evt) => {
          console.warn('[WS] WebSocket closed', evt);
          this._handleDisconnect();
        },
        
        onWebSocketError: (evt) => {
          console.error('[WS] WebSocket error', evt);
          this._handleDisconnect();
        }
      });
      
      this.stompClient.activate();
    };
    
    tryConnect();
  }
  
  async connectToGame(gameUuid, callback) {
    this.connectForStatus();
    
    const destination = `/topic/games/${gameUuid}`;
    
    // Remove old subscription if present
    if (this.subscriptions[gameUuid]?.sub) {
      this.subscriptions[gameUuid].sub.unsubscribe();
    }
    
    let sub = null;
    
    if (this.stompClient?.connected) {
      sub = this.stompClient.subscribe(destination, msg => {
        this._handleMessage(gameUuid, msg);
      });
      
      console.log('[WS] Subscribed to', destination);
    }
    
    // Persist subscription data for reconnect
    this.subscriptions[gameUuid] = {
      destination,
      callback,
      sub
    };
  }
  
  _handleDisconnect() {
    this.wsStatus.value = WebSocketStatus.DISCONNECTED;
    this.wsServerOk.value = false;
    
    this._connectInProgress = false;
    this._statusConnectInProgress = false;
    
    console.log('[WS] Scheduling reconnect in 3s');
    
    setTimeout(() => {
      this.connectForStatus();
    }, 3000);
  }
  
  _handleMessage(gameUuid, msg) {
    try {
      const payload = JSON.parse(msg.body);
      this.subscriptions[gameUuid]?.callback(payload);
    } catch (err) {
      console.error('[WS] Failed to parse message', msg, err);
    }
  }
  
  _resubscribeAll() {
    if (!this.stompClient?.connected) return;
    
    console.log('[WS] Restoring subscriptions');
    
    Object.entries(this.subscriptions).forEach(([gameUuid, entry]) => {
      entry.sub = this.stompClient.subscribe(entry.destination, msg => {
        this._handleMessage(gameUuid, msg);
      });
    });
  }
  
  send(destination, payload) {
    if (!this.stompClient?.connected) return;
    
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
}

// Singleton
export const wsService = new WsService();