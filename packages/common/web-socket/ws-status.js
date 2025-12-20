export const WebSocketStatus = {
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
  ERROR: 'ERROR'
};

let status = WebSocketStatus.CONNECTING;
const listeners = new Set();

export function setWebSocketStatus(newStatus) {
  if (status !== newStatus) {
    status = newStatus;
    listeners.forEach(cb => cb(status));
  }
}

export function getWebSocketStatus() {
  return status;
}

export function subscribeWebSocketStatus(cb) {
  listeners.add(cb);
  cb(status); // emit current value immediately
  return () => listeners.delete(cb);
}