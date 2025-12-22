import { createGameWebSocket } from '../web-socket/game-websocket.js';
import { WebSocketStatus, setWebSocketStatus, subscribeWebSocketStatus } from '../web-socket/ws-status.js';

export class WebSocketService {
  constructor() {
    this.client = null;
  }
  
  connect(gameUuid = 'landing-page', onMessage = () => {}, playerUuid = null, playerName = null) {
    if (this.client) return this.client;
    
    setWebSocketStatus(WebSocketStatus.CONNECTING);
    
    // this.client = createGameWebSocket(gameUuid, (msg) => {
    //   onMessage(msg);
    // }, playerUuid, playerName);
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
  
  sendMessage(destination, payload) {
    if (!this.client || !this.client.active) return;
    this.client.publish({ destination, body: JSON.stringify(payload) });
  }
  
  subscribeStatus(callback) {
    return subscribeWebSocketStatus(callback);
  }
}