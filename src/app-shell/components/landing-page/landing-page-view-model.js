import { computed, effect, signal } from '@preact/signals';
import { connectivityService } from '@letter-limbo/common';
import { navigateTo } from '../../routing/current-route.js';

export class LandingPageViewModel {
  constructor() {
    this.connectivityService = connectivityService;
    
    // UI / view state
    this.welcomeMessage = signal('Welcome!');
    this.loading = signal(true);
    
    // Internal
    this.canSubmit = computed(() => this.connectivityService.backendOk.value && this.connectivityService.wsServerOk.value);
    
    // Game list
    this.featuredGames = signal([
      { id: 1, name: 'Quick Start' },
      { id: 2, name: 'Challenge Mode' },
      { id: 3, name: 'Multiplayer Tournament' }
    ]);
  }
  
  start() {
    this.connectivityService.start();
    
    // Stop loading once both backend + WS server heartbeat are OK
    this._readyEffect = effect(() => {
      if (this.canSubmit.value) this.loading.value = false;
    });
  }
  
  stop() {
    this._readyEffect?.();
    this.connectivityService.stop();
  }
  
  startGame(gameUuid) {
    console.debug('Starting game: ', gameUuid)
    switch (gameUuid) {
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
        console.warn('Unknown game', gameUuid);
    }
  }
}