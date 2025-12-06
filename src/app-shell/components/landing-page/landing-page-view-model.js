import { computed } from '@preact/signals';
import { featureHomeService } from '../api-service.js';
import { navigateTo } from '../../../app-shell/routing/current-route.js';

export class LandingPageViewModel {
  constructor() {
    this.service = featureHomeService;
    
    // Derived signal: just names of featured games
    this.featuredGameNames = computed(() =>
      this.service.featuredGames.value.map(game => game.name)
    );
  }
  
  // Example action: navigate to a game
  startGame(gameId) {
    switch(gameId) {
      case 1:
        navigateTo('/quick-game');
        break;
      case 2:
        navigateTo('/challenge-mode');
        break;
      case 3:
        navigateTo('/multiplayer-tournament');
        break;
      default:
        console.warn('Unknown game id', gameId);
    }
  }
  
  // Optional: refresh data
  async refreshLandingData() {
    await this.service.fetchLandingData();
  }
}