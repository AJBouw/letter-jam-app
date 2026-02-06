import { computed, effect } from '@preact/signals';
import { WebSocketStatus } from './web-socket/ws-status.js';
import { backendService } from './backend-service.js';
import { wsService } from './web-socket/ws-service.js';

export class ConnectivityService {
  constructor() {
    this.bService = backendService;
    this.wsService = wsService;
    
    // === health signals ===
    this.backendOk = computed(() =>
      this.bService.status.value === 'UP' &&
      !this.bService.error.value
    );
    
    this.wsServerOk = computed(() =>
      wsService.wsStatus.value === WebSocketStatus.CONNECTED &&
      wsService.wsServerOk.value
    );
    
    // === Effects ===
    effect(() => {
      if (!this.backendOk.value) {
        console.debug('[Connectivity] Backend DOWN → disconnect WS immediately');
        this.wsService.disconnectAll();
      } else {
        console.debug('[Connectivity] Backend UP → ensure WS connection');
        // force reconnect in case previous WS attempt is stuck
        setTimeout(() => this.wsService.forceReconnect(), 200);
      }
    });
    effect(() => {
      console.log(
        '[Connectivity]',
        'backend:', this.backendOk.value ? 'OK' : 'DOWN',
        'ws:', this.wsServerOk.value ? 'CONNECTED' : 'DISCONNECTED'
      );
    });
  }
  
  start() {
    this.bService.startPolling();
    // Backand decides to auto-connect WS
  }
  
  stop() {
    this.bService.stopPolling();
    this.wsService.disconnectAll();
  }
}

// Singleton instance
export const connectivityService = new ConnectivityService();