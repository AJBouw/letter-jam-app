import { computed, effect } from '@preact/signals';
import { WebSocketStatus } from '../web-socket/ws-status.js';
import { backendService } from "./BackendService.js";
import { wsService } from "./WsService.js";

export class ConnectivityService {
  constructor() {
    this.bService = backendService;
    this.wsService = wsService;
    
    // reactive health signals
    this.backendOk = computed(() =>
      this.bService.status.value === 'UP' && !this.bService.error.value
    );
    
    this.wsServerOk = computed(() =>
      wsService.wsStatus.value === WebSocketStatus.CONNECTED && wsService.wsServerOk.value
    );
    
    effect(() => {
      console.log(
        '[WS STATUS]',
        wsService.wsStatus.value,
        'serverOk:',
        wsService.wsServerOk.value
      );
    });
  }
  
  start() {
    this.bService.startPolling();
    this.wsService.connectForStatus();
  }
  
  stop() {
    this.bService.stopPolling();
    this.wsService.disconnectAll();
  }
}
// Singleton
export const connectivityService = new ConnectivityService();