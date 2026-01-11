import { computed, signal } from '@preact/signals';
import { FeatureQuickGameService } from '../../../feature-quick-game/src/FeatureQuickGameService.js';
export class FeatureWaitingForPlayersViewModel {
  constructor(sharedGameSession, wsService, connectivityService) {
    this.sharedGameSession = sharedGameSession;
    this.wsService = wsService;
    this.connectivityService = connectivityService;
    this.service = new FeatureQuickGameService();
    
    // ============================================= //
    // Derived game state (delegated to GameSession) //
    // ============================================= //
    // Players
    this.players = computed(() => this.sharedGameSession.players.value);
    
    // Reactive me / opponent
    this.me = computed(() => this.sharedGameSession.me?.value ?? null);
    this.opponent = computed(() => this.sharedGameSession.opponent?.value ?? null);
    
    // ======== //
    // UI state //
    // ======== //
    this.cancelingGame = signal(false);
  }
  
  async cancelGame() {
    if (this.cancelingGame.value) return;
    
    this.cancelingGame.value = true;
    
    try {
      await this.service.cancelGame(
        this.sharedGameSession.gameUuid.value,
        this.sharedGameSession.playerUuid.value
      );
    } catch (err) {
      console.error('Failed to cancel game', err);
    } finally {
      this.cancelingGame.value = false;
    }
  }
}