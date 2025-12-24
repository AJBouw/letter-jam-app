import { signal, computed } from '@preact/signals';
import { backendService } from './BackendService.js';
import { WebSocketStatus } from '../web-socket/ws-status.js';
import { webSocketService } from './WebSocketService.js';

class Connectivity {
  constructor(bService, wsService) {
    this.backendService = bService;
    this.wsService = wsService;
    
    // Raw state
    this.backendStatus = bService.status;
    this.backendError = bService.error;
    this.wsStatus = signal(WebSocketStatus.DISCONNECTED);
    
    // Derived
    this.backendOk = computed(() =>
      this.backendStatus.value === 'UP' && !this.backendError.value
    );
    
    this.wsOk = computed(() =>
      this.wsStatus.value === WebSocketStatus.CONNECTED
    );
    
    this.canSubmit = computed(() =>
      this.backendOk.value && this.wsOk.value
    );
  }
  
  start(wsContext) {
    this.backendService.startPolling();
    this.wsService.subscribeStatus(s => this.wsStatus.value = s);
    this.wsService.connect(wsContext);
  }
  
  stop() {
    this.wsService.disconnect();
    this.backendService.stopPolling();
  }
}

export const connectivity = new Connectivity(backendService, webSocketService);