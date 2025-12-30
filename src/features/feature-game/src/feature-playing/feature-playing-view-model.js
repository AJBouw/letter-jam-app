import { computed, effect, signal } from '@preact/signals';
import { GameStatus } from '@letter-limbo/common';
import { navigateTo } from '../../../../app-shell/routing/current-route.js';
import { FeatureGameService } from "../FeatureGameService.js";

export class FeaturePlayingViewModel {
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
    
    // Reactive me / opponent
    this.me = computed(() => this.sharedGameSession.me.value);
    this.opponent = computed(() => this.sharedGameSession.opponent.value);
    
    // Safe reactive derived values
    this.thisPlayerIsReady = computed(() => this.me.value?.isReadyToStart ?? false);
    this.allPlayersReady = computed(() => this.sharedGameSession.allPlayersReady.value);
    this.activePlayerUuid = computed(() => this.sharedGameSession.activePlayerUuid.value);
    this.activePlayerName = computed(() => this.sharedGameSession.activePlayerName.value);
    
    // Game state signals
    this.leavingGame = signal(false);
    
    // Navigate when game starts
    this._navEffect = effect(() => {
      if (this.sharedGameSession.gameStatus.value === GameStatus.PLAYING) {
        navigateTo(`/games/${this.gameUuid.value}/playing`);
      }
    });
    
    // Optional: log when me/opponent becomes available
    effect(() => {
      if (this.me.value) console.debug('[PlayingViewModel] me ready:', this.me.value);
      if (this.opponent.value) console.debug('[PlayingViewModel] opponent ready:', this.opponent.value);
    });
  }
  
  dispose() {
    this._navEffect();
  }
  
  // Leave game
  async leaveGame() {
    if (this.leavingGame.value) return;
    this.leavingGame.value = true;
    
    try {
      await this.service.cancelGame(this.gameUuid.value, this.playerUuid.value);
    } catch (err) {
      console.error('[playing] Failed to leave game', err);
    } finally {
      this.leavingGame.value = false;
    }
  }
}