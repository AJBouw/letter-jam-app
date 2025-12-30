import { computed, effect, signal } from '@preact/signals';
import { GameStatus } from '@letter-limbo/common';
import { navigateTo } from '../../../../app-shell/routing/current-route.js';
import { FeatureQuickGameService } from '../../../feature-quick-game/src/FeatureQuickGameService.js';
export class FeatureWaitingForPlayersViewModel {
  constructor(sharedGameSession, wsService, connectivityService) {
    this.sharedGameSession = sharedGameSession;
    this.wsService = wsService;
    this.connectivityService = connectivityService;
    this.service = new FeatureQuickGameService();
    
    // Core game identifiers
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
    this.thisPlayerIsReady = computed(() => this.sharedGameSession.thisPlayerIsReady.value);
    
    this.me = this.sharedGameSession.me;
    console.debug('[feature-waiting-for-players-view-model] this.me: ', this.me);
    
    this.opponent = this.sharedGameSession.opponent;
    console.debug('[feature-waiting-for-players-view-model] this.opponent: ', this.opponent);
    
    // Navigation effect
    this._navEffect = effect(() => {
      if (this.sharedGameSession.gameStatus.value === GameStatus.READY_TO_START &&
        this.sharedGameSession.playersList.value.length > 1) {
        navigateTo(`/games/${this.sharedGameSession.gameUuid.value}/ready-to-start`);
      }
    });
    
    this._connectivityEffect = effect(() => {
      if (this.connectivityService) {
        console.log('[WaitingVM] backendOk:', this.connectivityService.backendOk.value,
          'wsServerOk:', this.connectivityService.wsServerOk.value);
      }
    });
  }
  
  dispose() {
    this._navEffect();
    this._connectivityEffect();
  }
  
  cancelling = signal(false);
  
  async cancelWaiting() {
    if (this.cancelling.value) return;
    
    this.cancelling.value = true;
    
    try {
      await this.service.cancelGame(
        this.sharedGameSession.gameUuid.value,
        this.sharedGameSession.playerUuid.value
      );
    } catch (err) {
      console.error('Failed to cancel game', err);
    } finally {
      this.cancelling.value = false;
    }
  }
}