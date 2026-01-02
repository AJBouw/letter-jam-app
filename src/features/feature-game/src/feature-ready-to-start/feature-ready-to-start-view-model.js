import { computed, effect, signal } from '@preact/signals';
import { FeatureGameService } from '../FeatureGameService.js';

export class FeatureReadyToStartViewModel {
  constructor(sharedGameSession, wsService, connectivityService) {
    this.sharedGameSession = sharedGameSession;
    this.wsService = wsService;
    this.connectivityService = connectivityService;
    this.service = new FeatureGameService();
    
    // Core
    this.gameUuid = computed(() => this.sharedGameSession.gameUuid.value);
    this.gameStatus = computed(() => this.sharedGameSession.gameStatus.value);
    this.language = computed(() => this.sharedGameSession.language.value);
    this.maxPlayers = computed(() => this.sharedGameSession.maxPlayers.value);
    this.private = computed(() => this.sharedGameSession.private.value);
    
    // Players
    this.playersList = computed(() => this.sharedGameSession.playersList.value);
    
    // Viewer-based
    this.playerUuid = computed(() => this.sharedGameSession.playerUuid.value);
    this.playerName = computed(() => this.sharedGameSession.playerName.value);
    
    this.thisPlayerIsReady = computed(() => this.sharedGameSession.me.value?.isReadyToStart ?? false);
    this.allPlayersReady = computed(() => this.sharedGameSession.allPlayersReady.value);
    
    this.me = this.sharedGameSession.me;
    console.debug('[feature-waiting-for-players-view-model] this.me: ', this.me);
    
    this.opponent = this.sharedGameSession.opponent;
    console.debug('[feature-waiting-for-players-view-model] this.opponent: ', this.opponent);
    
    this.activePlayerUuid = computed(() => this.sharedGameSession.activePlayerUuid.value);
    this.activePlayerName = computed(() => this.sharedGameSession.activePlayerName.value);
    
    this.markingReady = signal(false);
    this.leavingGame = signal(false);
  }
  
  async markReady() {
    if (this.markingReady.value || this.thisPlayerIsReady.value) return;
    if (this.thisPlayerIsReady.value) return;
    
    this.markingReady.value = true;
    
    const me = this.sharedGameSession.me.value;
    if (me) me.isReadyToStart = true;
    
    console.debug('[feature-ready-to-start-view-model] this.session.gameUuid.value: ', this.sharedGameSession.gameUuid.value);
    console.debug('[feature-ready-to-start-view-model] this.session.playerUuid.value: ', this.sharedGameSession.playerUuid.value);
    
    try {
      await this.service.markPlayerReady(this.sharedGameSession.gameUuid.value, this.sharedGameSession.playerUuid.value);
      
    } catch (err) {
      console.error('[ready-to-start] Failed to mark ready', err);
      // Only reset markingReady if the request failed
      if (me) me.isReadyToStart = false;
      this.markingReady.value = false;
    }
  }
  
  leavingGame = signal(false);
  async leaveGame() {
    if (this.leavingGame.value) return;
    
    this.leavingGame.value = true;
    
    try {
      await this.service.cancelGame(
        this.sharedGameSession.gameUuid.value,
        this.sharedGameSession.playerUuid.value
      );
    } catch (err) {
      console.error('Failed to cancel game', err);
    } finally {
      this.leavingGame.value = false;
    }
  }
}