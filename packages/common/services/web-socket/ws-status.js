import { signal } from '@preact/signals';

export const WebSocketStatus = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR'
};

// Singleton instance
export const wsServerStatus = signal(WebSocketStatus.DISCONNECTED);