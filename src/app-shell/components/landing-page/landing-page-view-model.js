import { signal } from '@preact/signals';
import { navigateTo } from '../../routing/current-route.js';
import { BackendService, WebSocketService, WebSocketStatus } from '@letter-limbo/common';

export class LandingPageViewModel {
  constructor() {
    this.backendService = new BackendService();
    this.wsService = new WebSocketService();
    
    this.backendStatus = signal('UNKNOWN');
    this.backendError = signal(null);
    this.wsStatus = signal(WebSocketStatus.DISCONNECTED);
    this.featuredGames = signal([
      { id: 1, name: 'Quick Start' },
      { id: 2, name: 'Challenge Mode' },
      { id: 3, name: 'Multiplayer Tournament' }
    ]);
    
    this.welcomeMessage = signal('Welcome to Letter Limbo!');
    
    // Internal unsubscribes
    this._backendSub = null;
    this._wsSub = null;
  }
  
  start() {
    // Start backend polling
    this.backendService.startPolling();
    this._backendSub = this.backendService.status.subscribe(status => {
      this.backendStatus.value = status;
      this.backendError.value = this.backendService.error.value;
    });
    
    // Subscribe to WebSocket status
    this._wsSub = this.wsService.subscribeStatus(status => {
      this.wsStatus.value = status;
    });
    
    // Connect WebSocket
    this.wsService.connect('landing-page');
  }
  
  stop() {
    this._backendSub?.();
    this._wsSub?.();
    this.backendService.stopPolling();
    this.wsService.disconnect();
  }
  
  startGame(gameId) {
    switch (gameId) {
      case 1:
        navigateTo('/games/quick-start');
        break;
      case 2:
        navigateTo('/challenge-mode');
        break;
      case 3:
        navigateTo('/multiplayer-tournament');
        break;
      default:
        console.warn('Unknown game', gameId);
    }
  }
}