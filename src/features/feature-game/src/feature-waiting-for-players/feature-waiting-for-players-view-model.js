import { computed, effect, signal } from '@preact/signals';
import { GameStatus } from '@letter-limbo/common';
import { navigateTo } from '../../../../app-shell/routing/current-route.js';
import { FeatureQuickGameService } from '../../../feature-quick-game/src/FeatureQuickGameService.js';
export class FeatureWaitingForPlayersViewModel {
  constructor(session, wsService) {
    this.session = session;
    this.wsService = wsService;
    this.service = new FeatureQuickGameService();
    
    // Core game identifiers
    this.gameUuid = computed(() => session.gameUuid.value);
    this.gameStatus = computed(() => session.gameStatus.value);
    this.language = computed(() => session.language.value);
    this.maxPlayers = computed(() => session.maxPlayers.value);
    this.private = computed(() => session.private.value);
    
    // Players
    this.playersList = computed(() => this.session.playersList.value);
    
    // Viewer-based
    this.playerUuid = computed(() => session.playerUuid.value);
    this.playerName = computed(() => session.playerName.value);
    this.thisPlayerIsReady = computed(() => session.thisPlayerIsReady.value);
    
    // Computed
    this.me = computed(() =>
      session.playersList.value.find(p => p.uuid === session.playerUuid.value) ?? null
    );
    console.debug('[feature-waiting-for-players-view-model] this.me: ', this.me);
    
    this.opponent = computed(() =>
      session.playersList.value.find(p => p.uuid !== session.playerUuid.value) ?? null
    );
    console.debug('[feature-waiting-for-players-view-model] this.opponent: ', this.opponent);
    
    // Navigation effect
    this._navEffect = effect(() => {
      if (this.session.gameStatus.value === GameStatus.READY_TO_START &&
        this.session.playersList.value.length > 1) {
        navigateTo(`/games/${this.session.gameUuid.value}/ready-to-start`);
      }
    });
  }
  
  dispose() {
    this._navEffect();
  }
  
  cancelling = signal(false);
  
  async cancelWaiting() {
    if (this.cancelling.value) return;
    
    this.cancelling.value = true;
    
    try {
      await this.service.cancelQuickGame(
        this.session.gameUuid.value,
        this.session.playerUuid.value
      );
    } catch (err) {
      console.error('Failed to cancel game', err);
    } finally {
      this.cancelling.value = false;
    }
  }
}