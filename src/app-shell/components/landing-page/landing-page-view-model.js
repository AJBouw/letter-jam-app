import { signal } from '@preact/signals';
import { navigateTo } from '../../routing/current-route.js';
import { landingPageService } from './landing-page-service.js';
import { WebSocketService, WebSocketStatus } from '@letter-limbo/common';

export class LandingPageViewModel {
  constructor() {
    this.service = landingPageService;
    this.wsService = new WebSocketService();
    this._backendInterval = null;
    this.wsStatus = signal(WebSocketStatus.DISCONNECTED);
    this._unsubscribeWs = null;
    this._wsClient = null;
  }
  
  start() {
    // Poll backend health every 5 seconds
    this.service.checkBackend();
    this._backendInterval = setInterval(() => {
      this.service.checkBackend();
    }, 5000);
    
    this._unsubscribeWs = this.wsService.subscribeStatus(status => {
      this.wsStatus.value = status;
    });
    
    this._wsClient = this.wsService.connect();
  }
  
  stop() {
    if (this._backendInterval) {
      clearInterval(this._backendInterval);
      this._backendInterval = null;
    }
    this._unsubscribeWs?.();
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
  
  // Expose signals
  get welcomeMessage() { return this.service.welcomeMessage; }
  get featuredGames() { return this.service.featuredGames; }
  get backendError() { return this.service.backendError; }
}