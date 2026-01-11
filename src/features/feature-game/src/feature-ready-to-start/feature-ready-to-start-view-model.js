import { computed, signal } from '@preact/signals';
import { FeatureGameService } from '../FeatureGameService.js';
import { FeatureGameWsService } from '../FeatureGameWsService.js';

export class FeatureReadyToStartViewModel {
  constructor(sharedGameSession, wsService, connectivityService) {
    this.sharedGameSession = sharedGameSession;
    this.wsService = wsService;
    this.connectivityService = connectivityService;
    this.featureGameService = new FeatureGameService();
    this.featureGameWsService = new FeatureGameWsService(this.sharedGameSession, this.wsService);
    
    // ============================================= //
    // Derived game state (delegated to GameSession) //
    // ============================================= //
    // Players
    this.players = computed(() => this.sharedGameSession.players.value);
    
    // Reactive me / opponent
    this.me = computed(() => this.sharedGameSession.me?.value ?? null);
    this.opponent = computed(() => this.sharedGameSession.opponent?.value ?? null);
    
    this.thisPlayerIsReady = computed(() => this.sharedGameSession.me.value?.readyToStart ?? false);
    this.allPlayersReady = computed(() => this.sharedGameSession.allPlayersReady.value);
    
    this.activePlayerName = computed(() => this.sharedGameSession.activePlayerName.value);
    
    // ======== //
    // UI state //
    // ======== //
    this.markingReady = signal(false);
    this.leavingGame = signal(false);
  }
  
  async markReady() {
    if (this.markingReady.value || this.thisPlayerIsReady.value) return;
    if (this.thisPlayerIsReady.value) return;
    
    this.markingReady.value = true;
    
    const me = this.sharedGameSession.me.value;
    if (me) {
      me.readyToStart = true;
    }
    
    console.debug('[feature-ready-to-start-view-model] this.session.gameUuid.value: ', this.sharedGameSession.gameUuid.value);
    console.debug('[feature-ready-to-start-view-model] this.session.playerUuid.value: ', this.sharedGameSession.playerUuid.value);
    
    try {
      await this.featureGameService.markPlayerReady(this.sharedGameSession.gameUuid.value, this.sharedGameSession.playerUuid.value, true);
      
    } catch (err) {
      console.error('[ready-to-start] Failed to mark ready', err);
      // Only reset markingReady if the request failed
      if (me) me.readyToStart = false;
      this.markingReady.value = false;
    }
  }
  
  leavingGame = signal(false);
  async leaveGame() {
    if (this.leavingGame.value) return;
    
    this.leavingGame.value = true;
    
    try {
      await this.featureGameWsService.leaveGame({
        gameUuid: this.sharedGameSession.gameUuid.value,
        playerUuid: this.sharedGameSession.playerUuid.value
      });
    } catch (err) {
      console.error('Failed to cancel game', err);
    } finally {
      this.leavingGame.value = false;
    }
  }
}