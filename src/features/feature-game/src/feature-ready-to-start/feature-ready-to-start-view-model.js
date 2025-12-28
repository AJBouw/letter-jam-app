import { computed, effect, signal } from '@preact/signals';
import { GameStatus } from "@letter-limbo/common";
import { navigateTo } from "../../../../app-shell/routing/current-route.js";
import { FeatureQuickGameService } from '../../../feature-quick-game/src/FeatureQuickGameService.js';

export class FeatureReadyToStartViewModel {
  constructor(session, wsService) {
    this.session = session;
    this.wsService = wsService;
    this.service = new FeatureQuickGameService();
    
    this.gameUuid = computed(() => this.session.gameUuid.value);
    this.gameStatus = computed(() => this.session.gameStatus.value);
    this.language = computed(() => this.session.language.value);
    this.maxPlayers = computed(() => session.maxPlayers.value);
    this.private = computed(() => this.session.private.value);
    
    // Players
    this.playersList = computed(() => this.session.playersList.value);

    
    // Viewer-based
    this.playerUuid = computed(() => this.session.playerUuid.value);
    this.playerName = computed(() => this.session.playerName.value);
    this.thisPlayerIsReady = computed(() => this.session.thisPlayerIsReady.value);
    
    // Computed
    this.me = computed(() => {
      const meFromList = session.playersList.value.find(p => p.uuid === this.session.playerUuid.value);
      if (meFromList) return meFromList;
      if (this.session.playerUuid.value && this.session.playerName.value) {
        return {
          uuid: this.session.playerUuid.value,
          name: this.session.playerName.value,
          readyToStart: this.session.thisPlayerIsReady.value
        };
      }
      return null;
    });
    
    this.opponent = computed(() => {
      console.debug('[feature-ready-to-start-view-model] this.session.playersList: ', this.session.playersList.value);
      return this.session.playersList.value.find(p => p.uuid !== this.session.playerUuid.value) ?? null;
    });
    
    this.activePlayerUuid = computed(() => this.session.activePlayerUuid.value);
    this.activePlayerName = computed(() => {
      const active = this.session.activePlayer.value;
      if (!active) return null;
      return active.name;
    });
    
    this._navEffect = effect(() => {
      if (this.session.gameStatus.value === GameStatus.PLAYING) {
        navigateTo(`/games/${this.gameUuid.value}/playing`);
      }
    });
  }
  
  dispose() {
    this._navEffect();
  }
  
  updateActivePlayer(uuid, name) {
    const active = this.playersList.value.find(p => p.uuid === uuid);
    this.activePlayerUuid.value = active?.uuid ?? uuid;
    this.activePlayerName.value = active?.name ?? name;
  }
  
  leavingGame = signal(false);
  
  async leaveGame() {
    if (this.leavingGame.value) return;
    
    this.leavingGame.value = true;
    
    try {
      await this.service.cancelQuickGame(
        this.session.gameUuid.value,
        this.session.playerUuid.value
      );
    } catch (err) {
      console.error('Failed to cancel game', err);
    } finally {
      this.leavingGame.value = false;
    }
  }
  
  markReady() {
    if (!this.session.activePlayer.value.readyToStart) {
      this.session.wsService.send({
        type: 'MARK_READY',
        playerUuid: this.session.playerUuid.value
      });
    }
  }
}