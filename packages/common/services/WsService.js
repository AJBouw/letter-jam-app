import { WebSocketStatus, getWebSocketStatus, setWebSocketStatus, subscribeWebSocketStatus } from '../web-socket/ws-status.js';
import { Client } from '@stomp/stompjs';
import { signal } from "@preact/signals";
import { AppConfig } from '../config/app-config.js';
import SockJS from "sockjs-client";

/**
 * Track message subscribers per topic
 * Parse messages JSON automatically
 * Expose typed publish and subscribe for events
 */
export class WsService {
  constructor() {
    this.stompClient = null;
    this.status = signal(WebSocketStatus.DISCONNECTED);
    this.subscriptions = {}; // topic -> subscription object
  }
  
  /**
   * Connect to a game WebSocket topic
   * @param {string} gameUuid
   * @param {(msg) => void} onMessage
   * @param {string} playerUuid
   * @param {string} playerName
   */
  connect(gameUuid, onMessage, playerUuid, playerName) {
    // Deactivate existing client if connected
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.deactivate();
      this.subscriptions = {};
    }
    
    const socket = new SockJS(AppConfig.wsUrl);
    
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (msg) => console.debug('[STOMP]', msg),
      
      // STOMP lifecycle hooks
      onConnect: () => {
        console.debug('[WS] Connected to game topic', gameUuid);
        this.status.value = WebSocketStatus.CONNECTED;
        this.subscribe(`/topic/games/${gameUuid}`, onMessage);
      },
      
      onStompError: (frame) => {
        console.error('[WS] STOMP error:', frame);
        this.status.value = WebSocketStatus.ERROR;
      },
      
      onWebSocketError: (evt) => {
        console.error('[WS] WebSocket error:', evt);
        this.status.value = WebSocketStatus.ERROR;
      },
      
      onWebSocketClose: (evt) => {
        console.warn('[WS] WebSocket disconnected', evt);
        this.status.value = WebSocketStatus.DISCONNECTED;
        this.subscriptions = {};
      }
    });
    
    this.status.value = WebSocketStatus.CONNECTING;
    this.stompClient.activate();
  }
  
  /**
   * Subscribe to a STOMP topic
   * @param {string} destination
   * @param {(msg) => void} callback
   */
  subscribe(destination, callback) {
    if (!this.stompClient || !this.stompClient.connected) return;
    
    if (this.subscriptions[destination]) return; // already subscribed
    
    const sub = this.stompClient.subscribe(destination, (msg) => {
      try {
        const payload = JSON.parse(msg.body);
        callback(payload);
      } catch (err) {
        console.error('[WS] Failed to parse message', msg, err);
      }
    });
    
    this.subscriptions[destination] = sub;
  }
  
  /**
   * Send a message to a STOMP destination
   * @param {string} destination
   * @param {object} payload
   */
  send(destination, payload) {
    if (!this.stompClient || !this.stompClient.connected) return;
    
    this.stompClient.publish({
      destination,
      body: JSON.stringify(payload),
    });
  }
  
  /**
   * Disconnect WebSocket and clear subscriptions
   */
  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.stompClient = null;
    }
    this.subscriptions = {};
    this.status.value = WebSocketStatus.DISCONNECTED;
  }
  
  /**
   * Check connection state
   */
  get isConnected() {
    return this.status.value === WebSocketStatus.CONNECTED;
  }
}

// export class WsService {
//   constructor() {
//     this.client = null;
//     this.gameSubscription = null;
//
//     // Track current status in the service
//     this.wsStatus = { value: getWebSocketStatus() };
//
//     // Subscribe to global status changes to update wsStatus.value
//     subscribeWebSocketStatus(status => { this.wsStatus.value = status; });
//   }
//
//   connect(gameUuid = 'landing-page', onMessage = () => {}, playerUuid = null, playerName = null) {
//     if (this.client) return this.client;
//
//     setWebSocketStatus(WebSocketStatus.CONNECTING);
//
//     this.client = createGameWebSocket(gameUuid, msg => { onMessage(msg); this.subscribers.forEach(cb => cb(msg)); }, playerUuid, playerName);
//
//     // Intercept low-level events to update status
//     this.client.onConnect = () => setWebSocketStatus(WebSocketStatus.CONNECTED);
//     this.client.onWebSocketClose = () => setWebSocketStatus(WebSocketStatus.DISCONNECTED);
//     this.client.onWebSocketError = () => setWebSocketStatus(WebSocketStatus.ERROR);
//
//     return this.client;
//   }
//
//   disconnect() {
//     if (this.client) {
//       this.client.deactivate?.();
//       this.client = null;
//       setWebSocketStatus(WebSocketStatus.DISCONNECTED);
//     }
//   }
//
//   subscribe(callback) {
//     this.subscribers.push(callback);
//     return () => { this.subscribers = this.subscribers.filter(cb => cb !== callback); };
//   }
//
//   subscribeStatus(callback) {
//     return subscribeWebSocketStatus(callback);
//   }
//
//   sendMessage(destination, payload) {
//     if (!this.client || !this.client.active) return;
//     this.client.publish({ destination, body: JSON.stringify(payload) });
//   }
//
//   get isConnected() {
//     return this.wsStatus.value === WebSocketStatus.CONNECTED;
//   }
// }

export const wsService = new WsService();