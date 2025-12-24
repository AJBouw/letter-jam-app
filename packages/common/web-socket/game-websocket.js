import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AppConfig } from '../config/app-config.js';
import { setWebSocketStatus, WebSocketStatus } from "./ws-status.js";

export function createGameWebSocket(gameUuid, onMessage, playerUuid, playerName) {
  console.log('[WS] createGameWebSocket');
  const client = new Client({
    webSocketFactory: () => new SockJS(AppConfig.wsUrl),
    reconnectDelay: 5000,
    debug: (msg) => console.log('[STOMP]', msg),
  });
  
  client.onConnect = () => {
    console.log('[WS] Connected');
    setWebSocketStatus(WebSocketStatus.CONNECTED);
    
    client.subscribe(`/topic/game/${gameUuid}`, (msg) => onMessage(JSON.parse(msg.body)));
    
    if (playerUuid && playerName) {
      client.publish({
        destination: `/app/game/${gameUuid}/join`,
        body: JSON.stringify({ playerUuid, playerName }),
      });
    }
  };
  
  client.onStompError = (frame) => {
    console.error('[WS] STOMP error', frame);
    setWebSocketStatus(WebSocketStatus.ERROR);
  };
  
  client.onWebSocketError = (evt) => {
    console.error('[WS] WebSocket error', evt);
    setWebSocketStatus(WebSocketStatus.ERROR);
  };
  
  client.onWebSocketClose = (evt) => {
    console.warn('[WS] WebSocket disconnected', evt);
    setWebSocketStatus(WebSocketStatus.DISCONNECTED);
  };
  setWebSocketStatus(WebSocketStatus.CONNECTING);
  client.activate();
  return client;
}

export function sendGameMessage(client, destination, payload) {
  if (!client || !client.active) return;
  client.publish({ destination, body: JSON.stringify(payload) });
}