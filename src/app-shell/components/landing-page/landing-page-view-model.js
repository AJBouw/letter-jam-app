import { computed, effect, signal } from '@preact/signals';
import { navigateTo } from '../../routing/current-route.js';
import { ApiService } from '../api-service.js';

export class LandingPageViewModel {
  constructor(connectivityService, gameContext) {
    // === Services and context ===
    this.gameContext = gameContext;
    this.connectivityService = connectivityService;
    this.apiService = new ApiService();
    
    // === Derived / computed state ===
    this.canSubmit = computed(() => this.connectivityService.backendOk.value && this.connectivityService.wsServerOk.value);
    
    // === UI state ===
    this.loading = signal(true);
    this.errorMessage = signal('');
    this.featuredGames = signal([]);
    this.welcomeMessage = signal('Welcome!');
    
    this._effects = [];
    
    // Display spinner if backend down or WS disconnected
    effect(() => {
      this.loading.value = !this.canSubmit.value;
    });
  }
  
  start() {
    let loaded = false;
    
    this._effects.push(
      effect(() => {
        this.loading.value = !this.canSubmit.value;
      })
    );
    
    this._effects.push(
      effect(() => {
        if (this.connectivityService.backendOk.value && !loaded) {
          loaded = true;
          this.loadFeaturedGames();
        }
      })
    );
  }
  
  stop() {
    this._effects.forEach(dispose => dispose());
    this._effects = [];
  }
  
  async loadFeaturedGames(retries = 5, delayMs = 2000) {
    if (!this.connectivityService.backendOk.value) {
      console.debug('[landing-page-view-model] Backend is down. Cannot fetch featured games.');
      return;
    }
    
    this.loading.value = true;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.apiService.getFeaturedGames();
        if (response?.length) {
          this.featuredGames.value = response;
          break;
        }
      } catch (err) { console.error('[landing-page-view-model] Fetch attempt failed', err); }
      await new Promise(res => setTimeout(res, delayMs));
    }
    
    if (!this.featuredGames.value.length) {
      this.featuredGames.value = [{ id: 1, name: 'Quick Start' }];
      this.errorMessage.value = 'Failed to load featured games';
    }
    
    this.loading.value = false;
  }
  
  startGame(gameId) {
    const game = this.featuredGames.value.find(g => g.id === gameId);
    if (!game) {
      console.warn('Unknown game', gameId);
      return;
    }
    navigateTo(game.route);
  }
}