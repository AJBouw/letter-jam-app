import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { setWebSocketStatus, WebSocketStatus } from "./ws-status.js";

export function createGameWebSocket(gameUuid, onMessage) {
  const client = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/ws-game'),
    reconnectDelay: 5000,
    debug: (str) => console.debug('[STOMP]', str)
  });
  
  client.onConnect = () => {
    console.debug('[WS] Connected to game WS');
    setWebSocketStatus(WebSocketStatus.CONNECTED);
    
    // Subscribe to game updates
    client.subscribe(`/topic/game/${gameUuid}`, (msg) => {
      const body = JSON.parse(msg.body);
      onMessage(body);
    });
  };
  
  client.onStompError = frame => {
    console.error('[WS] STOMP error', frame);
    setWebSocketStatus(WebSocketStatus.ERROR);
  }
  
  client.onWebSocketClose = () => {
    console.warn('[WS] Disconnected');
    setWebSocketStatus(WebSocketStatus.DISCONNECTED);
  }
  
  client.onWebSocketError = err => {
    console.error('[WS] Websocket error', err);
    setWebSocketStatus(WebSocketStatus.ERROR);
  }
  
  client.onUnhandledMessage = msg => {
    console.debug('[WS] Unhandled message', msg.body);
    onMessage(JSON.parse(msg.body));
  }
  
  client.activate();
  
  return client;
}

/**
 * Send game message
 * @param client
 * @param destination
 * @param payload
 */
export function sendGameMessage(client, destination, payload) {
  if (!client?.connected) {
    console.warn('[WS] Tried to send while disconnected');
    return;
  }
  
  client.publish({
    destination,
    body: JSON.stringify(payload),
  });
}