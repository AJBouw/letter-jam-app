import { computed, signal } from '@preact/signals';
import { GameStatus } from './game-status.js';

/**
 * Holds signals
 * Derive computed values
 * Apply backend snapshots
 * React to WS messages by delegating to applyBackendSnapshot
 */
export class GameSession {
  constructor() {
    // Core game identifiers
    this.gameUuid = signal(null);
    this.language = signal(null);
    this.gameStatus = signal(GameStatus.FORM);
    this.maxPlayers = signal(null);
    this.private = signal(false);
    
    // Player identity (viewer / local player)
    this.playerUuid = signal(null);
    this.playerName = signal(null);
    
    // Players
    this.playersList = signal([]);
    
    // Round / gameplay
    this.roundUuid = signal(null);
    this.roundNumber = signal(null);
    this.roundStatus = signal(null);
    this.maxTurns = signal(null);
    this.targetWordUuid = signal(null);
    this.maskedWord = signal(null);
    this.turnsList = signal([]);
    this.activePlayerUuid = signal(null);
    this.winningPlayerUuid = signal(null);
    
    // Computed / derived
    this.me = computed(() =>
      this.playersList.value.find(p => p.uuid === this.playerUuid.value) ?? null
    );
    this.opponents = computed(() =>
      this.playersList.value.filter(p => p.uuid !== this.playerUuid.value)
    );
    
    this.opponent = computed(() => {
      const me = this.me.value;
      if (!me) return null;
      
      return (
        this.playersList.value.find(p => p.uuid !== me.uuid) ?? null
      );
    });
    
    // this.thisPlayerIsReady = computed(() => this.me.value?.readyToStart ?? false);
    this.thisPlayerIsReady = computed(() =>
      this.playersList.value.find(p => p.uuid === this.playerUuid.value)?.isReadyToStart ?? false
    );
    this.allPlayersReady = computed(() =>
      this.playersList.value.length > 0 &&
      this.playersList.value.every(p => p.readyToStart)
    );
    this.activePlayer = computed(() =>
      this.playersList.value.find(p => p.uuid === this.activePlayerUuid.value) ?? null
    );
    this.activePlayerName = computed(() => {
      const active = this.activePlayer.value;
      if (!active) return null;
      return active.uuid === this.playerUuid.value ? 'me' : active.name;
    });
    this.blocks = computed(() =>
      this.maskedWord.value ? this.maskedWord.value.split('') : []
    );
  }
  
  initPlayer({ playerUuid, playerName }) {
    if (this.playerUuid.value) return;
    this.playerUuid.value = playerUuid;
    this.playerName.value = playerName;
    
    sessionStorage.setItem('playerUuid', playerUuid);
    sessionStorage.setItem('playerName', playerName);
    
    console.debug('[GameSession] Viewer initialized', { playerUuid, playerName });
    
    // Add "me" to playersList if not already present
    const existing = this.playersList.value.find(p => p.uuid === playerUuid);
    if (!existing) {
      this.playersList.value = [
        ...this.playersList.value,
        { uuid: playerUuid, name: playerName, ready: false }
      ];
    }
  }
  
  applyBackendSnapshot(data) {
    if (!data) return;
    
    // Core identifiers
    this.gameUuid.value = data.uuid ?? data.gameUuid ?? this.gameUuid.value;
    this.language.value = data.language ?? null;
    this.gameStatus.value = data.gameStatus ?? this.gameStatus.value;
    this.maxPlayers.value = data.maxPlayers ?? null;
    this.private.value = data.private ?? false;
    
    // Viewer / player
    if (data.viewer) {
      this.initPlayer({
        playerUuid: data.viewer.playerUuid,
        playerName: data.viewer.playerName
      });
    }
    
    // if (data.playersList) {
    //   this.playersList.value = data.playersList;
    // }
    
    if (data.playersList) {
      this.playersList.value = data.playersList.map(p => {
        const local = this.playersList.value.find(lp => lp.uuid === p.uuid);
        
        // Preserve local optimistic ready state
        const ready = local?.isReadyToStart ?? p.isReadyToStart ?? false;
        
        return {
          ...p,
          isReadyToStart: ready
        };
      });
    }
    
    if (data.activePlayerUuid) this.activePlayerUuid.value = data.activePlayerUuid;
    
    // Round details
    if (data.roundDetails) {
      const r = data.roundDetails;
      this.roundUuid.value = r.uuid;
      this.roundNumber.value = r.roundNumber;
      this.roundStatus.value = r.roundStatus;
      this.activePlayerUuid.value = r.activePlayerUuid;
      this.winningPlayerUuid.value = r.winningPlayerUuid;
      this.maxTurns.value = r.maxTurns;
      this.targetWordUuid.value = r.targetWordUuid;
      this.maskedWord.value = r.maskedWord;
      this.turnsList.value = r.turnsList;
    }
    
    console.debug('[GameSession] Snapshot applied', {
      gameStatus: this.gameStatus.value,
      players: this.playersList.value,
      activePlayer: this.activePlayerUuid.value
    });
  }
  
  handleMessage(msg) {
    try {
      let payload = msg;
      if (typeof msg === 'string') payload = JSON.parse(msg);
      else if (msg.body && typeof msg.body === 'string') payload = JSON.parse(msg.body);
      
      const data = payload.data ?? payload;
      
      if (data.type === 'GAME_UPDATE') {
        this.applyBackendSnapshot(data);
      }
    } catch (err) {
      console.error('[GameSession] handleMessage failed', err, msg);
    }
  }
}
export const sharedGameSession = new GameSession();