import { effect, signal } from '@preact/signals';
import { GameStatus, webSocketService } from '@letter-limbo/common';
import { navigateTo } from '../../../../app-shell/routing/current-route.js';

export class FeatureWaitingForPlayersViewModel {
  constructor(session, wsService) {
    this.session = session;
    this.wsService = wsService;
    
    this.playersList = signal([]);
    this.currentPlayer = signal(null);
    this.opponent = signal(null);
    this.gameUuid = signal(this.session.gameUuid.value);
    this.language = signal(this.session.language.value);
    this.playerName = signal(this.session.playerName.value);
    this.playerUuid = signal(this.session.playerUuid.value);
    this.playersList = signal([...this.session.playersList.value]);
    this.maxPlayers = signal(this.session.maxPlayers.value);
    this.private = signal(this.session.private.value);
    this.gameStatus = signal(this.session.gameStatus.value);
    
    this.me = signal(this.session.currentPlayer.value ?? null);
    this.opponents = signal([...this.session.opponents.value]);
    
    this._syncEffect = effect(() => {
      this.gameUuid.value = this.session.gameUuid.value;
      this.language.value = this.session.language.value;
      this.playerName.value = this.session.playerName.value;
      this.playerUuid.value = this.session.playerUuid.value;
      this.playersList.value = [...this.session.playersList.value];
      this.currentPlayer.value = this.session.currentPlayer.value;
      this.opponent.value = this.session.opponent.value;
      this.maxPlayers.value = this.session.maxPlayers.value;
      this.private.value = this.session.private.value;
      this.gameStatus.value = this.session.gameStatus.value;

      this.me.value = this.session.currentPlayer.value ?? null;
      this.opponents.value = [...this.session.opponents.value];
    });
    
    // Subscribe to WS messages
    this._wsUnsub = this.wsService.subscribe(msg => this.session.handleMessage(msg));
    
    // Navigation effect
    this._navEffect = effect(() => {
      if (this.session.gameStatus.value === GameStatus.READY_TO_START) {
        navigateTo(`/games/${this.session.gameUuid.value}/ready-to-start`);
      }
    });
  }
  
  dispose() {
    this._syncEffect();
    this._navEffect();
    this._wsUnsub?.();
  }
}