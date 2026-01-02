import { signal } from '@preact/signals';

export const WebSocketStatus = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR'
};

// Server status signal
export const wsServerStatus = signal(WebSocketStatus.DISCONNECTED);