import { createGameWebSocket } from '../web-socket/game-websocket.js';
import { WebSocketStatus, getWebSocketStatus, setWebSocketStatus, subscribeWebSocketStatus } from '../web-socket/ws-status.js';

/**
 * Track message subscribers per topic
 * Parse messages JSON automatically
 * Expose typed publish and subscribe for events
 */
export class WebSocketService {
  constructor() {
    this.client = null;
    this.subscribers = [];
    
    // Track current status in the service
    this.wsStatus = { value: getWebSocketStatus() };
    
    // Subscribe to global status changes to update wsStatus.value
    subscribeWebSocketStatus(status => {
      this.wsStatus.value = status;
    });
  }
  
  connect(gameUuid = 'landing-page', onMessage = () => {}, playerUuid = null, playerName = null) {
    if (this.client) return this.client;
    
    setWebSocketStatus(WebSocketStatus.CONNECTING);

    this.client = createGameWebSocket(gameUuid, onMessage, playerUuid, playerName);
    
    // Intercept low-level events to update status
    this.client.onConnect = () => setWebSocketStatus(WebSocketStatus.CONNECTED);
    this.client.onWebSocketClose = () => setWebSocketStatus(WebSocketStatus.DISCONNECTED);
    this.client.onWebSocketError = () => setWebSocketStatus(WebSocketStatus.ERROR);
    
    return this.client;
  }
  
  disconnect() {
    if (this.client) {
      this.client.deactivate?.();
      this.client = null;
      setWebSocketStatus(WebSocketStatus.DISCONNECTED);
    }
  }
  
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }
  
  sendMessage(destination, payload) {
    if (!this.client || !this.client.active) return;
    this.client.publish({ destination, body: JSON.stringify(payload) });
  }
  
  subscribeStatus(callback) {
    return subscribeWebSocketStatus(callback);
  }
  
  get isConnected() {
    return this.wsStatus.value === WebSocketStatus.CONNECTED;
  }
}

export const webSocketService = new WebSocketService();