import { computed, signal } from '@preact/signals';
import { navigateTo } from '../../../../app-shell/routing/current-route.js';
import { featureGameService } from "../feature-game-service.js";

export class FeatureWaitingForPlayersViewModel {
  
  constructor(uuid) {
    this.service = featureGameService;
    this.uuid = uuid;
    
    console.log('[VM] FeatureWaitingForPlayersViewModel created with UUID:', this.uuid);
    
    // Start polling for game updates
    this.service.startPolling(this.uuid);
    
    // Derived signals
    this.playersList = computed(() => {
      const list = this.service.currentGame.value?.playersList || [];
      console.log('[VM] playersList updated:', list);
      return list;
    });
    
    this.maxPlayers = computed(() => {
      const max = this.service.currentGame.value?.maxPlayers || 0;
      console.log('[VM] maxPlayers updated:', max);
      return max;
    });
    
    this.gameStatus = computed(() => {
      const status = this.service.currentGame.value?.gameStatus || 'WAITING_FOR_PLAYERS';
      console.log('[VM] gameStatus updated:', status);
      return status;
    });
    
    // Button state
    this.canStart = computed(() => {
      const ready = this.gameStatus.value === 'READY_TO_START';
      console.log('[VM] canStart computed:', ready);
      return ready;
    });
    
    // Automatic navigation when all players joined
    this._checkNavigation = () => {
      if (this.canStart.value) {
        console.log('[VM] All players ready, navigating to playing page');
        this.service.stopPolling();
        navigateTo(`/games/quick-game/${this.uuid}/playing`);
      }
    };
    
    // Subscribe to changes
    this._unsubscribe = [
      this.playersList.subscribe(this._checkNavigation),
      this.maxPlayers.subscribe(this._checkNavigation),
      this.gameStatus.subscribe(this._checkNavigation)
    ];
  }
  
  disconnect() {
    console.log('[VM] Disconnecting view model, stopping polling');
    this._unsubscribe.forEach(fn => fn());
    this.service.stopPolling();
  }
  
  async cancelWaiting() {
    console.log('[VM] Cancel waiting clicked');
    await this.service.cancelWaiting(this.uuid);
    navigateTo('/'); // back to home
  }
}