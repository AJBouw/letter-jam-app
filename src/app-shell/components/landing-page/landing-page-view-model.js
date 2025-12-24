import { computed, signal } from '@preact/signals';
import { connectivity } from '@letter-limbo/common';
import { navigateTo } from '../../routing/current-route.js';

export class LandingPageViewModel {
  constructor() {
    this.connectivity = connectivity;
    
    // UI / view state
    this.welcomeMessage = signal('Welcome!');
    this.loading = signal(true);
    
    // Internal
    this.canSubmit = computed(() => this.connectivity.backendOk.value && this.connectivity.wsOk.value);
    
    // Game list
    this.featuredGames = signal([
      { id: 1, name: 'Quick Start' },
      { id: 2, name: 'Challenge Mode' },
      { id: 3, name: 'Multiplayer Tournament' }
    ]);
  }
  
  start() {
    this.connectivity.start('landing-page-lobby');
    
    this._readyEffect = this.connectivity.canSubmit.subscribe(ok => {
      if (ok) this.loading.value = false;
    });
  }
  
  stop() {
    this._readyEffect?.();
    this.connectivity.stop();
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