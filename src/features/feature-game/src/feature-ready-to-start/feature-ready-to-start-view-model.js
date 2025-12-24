import { effect, signal } from '@preact/signals';

export class FeatureReadyToStartViewModel {
  constructor(session, wsService) {
    this.session = session;
    this.wsService = wsService;
    
    this.gameUuid = session.gameUuid;
    this.me = signal(this.session.currentPlayer.value ?? null);
    this.opponent = signal(session.playersList?.value?.find(p => p.uuid !== this.me.value?.uuid));
    
    // Automatically update me/opponent if session changes
    this._dispose = effect(() => {
      this.me.value = session.currentPlayer?.value;
      this.opponent.value = session.playersList?.value?.find(p => p.uuid !== this.me.value?.uuid);
    });
  }
  
  markReady() {
    if (!this.session.currentPlayer.value.readyToStart) {
      this.session.wsService.send({
        type: 'MARK_READY',
        playerUuid: this.session.playerUuid.value
      });
    }
  }
  
  dispose() {
    this._dispose?.();
  }
}