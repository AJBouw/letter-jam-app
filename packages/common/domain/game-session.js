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
    this.players = signal([]);
    
    // Round / gameplay
    this.roundUuid = signal(null);
    this.roundNumber = signal(null);
    this.roundStatus = signal(null);
    this.maxTurns = signal(null);
    this.targetWordUuid = signal(null);
    this.maskedWord = signal(null);
    this.guesses = signal([]);
    this.activePlayerUuid = signal(null);
    this.winningPlayerUuid = signal(null);
    this.blocks = computed(() => this.maskedWord.value.split(''));
    
    // Computed / derived
    this.me = computed(() =>
      this.players.value.find(p => p.uuid === this.playerUuid.value) ?? null
    );
    this.opponents = computed(() =>
      this.players.value.filter(p => p.uuid !== this.playerUuid.value)
    );
    
    this.opponent = computed(() => {
      const me = this.me.value;
      if (!me) return null;
      
      return (
        this.players.value.find(p => p.uuid !== me.uuid) ?? null
      );
    });
    
    this.thisPlayerIsReady = computed(() =>
      this.players.value.find(p => p.uuid === this.playerUuid.value)?.readyToStart ?? false
    );
    this.allPlayersReady = computed(() =>
      this.players.value.length > 0 &&
      this.players.value.every(p => p.readyToStart)
    );
    this.activePlayer = computed(() =>
      this.players.value.find(p => p.uuid === this.activePlayerUuid.value) ?? null
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
    
    console.debug('[game-session] Viewer initialized', { playerUuid, playerName });
    
    // Add "me" to players if not already present
    const existing = this.players.value.find(p => p.uuid === playerUuid);
    if (!existing) {
      this.players.value = [
        ...this.players.value,
        { uuid: playerUuid, name: playerName, readyToStart: false }
      ];
    }
  }
  
  restoreViewerFromSession() {
    if (this.playerUuid.value) return;
    
    const storedUuid = sessionStorage.getItem('playerUuid');
    const storedName = sessionStorage.getItem('playerName');
    
    if (!storedUuid || !storedName) return;
    
    this.playerUuid.value = storedUuid;
    this.playerName.value = storedName;
    
    console.debug('[game-session] Viewer restored from sessionStorage', {
      playerUuid: storedUuid,
      playerName: storedName
    });
    
    // Add 'me' to players if not present
    const existing = this.players.value.find(p => p.uuid === storedUuid);
    if (!existing) {
      this.players.value = [
        ...this.players.value,
        { uuid: storedUuid, name: storedName, readyToStart: false }
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
    
    if (Array.isArray(data.players)) {
      this.players.value = data.players.map(p => {
        const isMe = p.uuid === this.playerUuid.value;
        const local = this.players.value.find(lp => lp.uuid === p.uuid);
        
        return {
          ...p,
          readyToStart: isMe
            ? local?.readyToStart ?? p.readyToStart ?? false // preserve optimistic ready
            : p.readyToStart ?? false                         // backend is source of truth
        };
      });
    }
    
    // Round details
    const roundDetails = data.roundDetails;
    if (roundDetails) {
      this.roundUuid.value = roundDetails.uuid;
      this.roundNumber.value = roundDetails.roundNumber;
      this.roundStatus.value = roundDetails.roundStatus;
      this.activePlayerUuid.value = roundDetails.activePlayerUuid;
      this.winningPlayerUuid.value = roundDetails.winningPlayerUuid;
      this.maxTurns.value = roundDetails.maxTurns;
      this.targetWordUuid.value = roundDetails.targetWordUuid;
      this.maskedWord.value = roundDetails.maskedWord;
      this.guesses.value = roundDetails.guesses;
    }
    
    console.debug('[game-session] Snapshot applied', {
      gameStatus: this.gameStatus.value,
      players: this.players.value,
      roundDetails: data.roundDetails
    });
  }
  
  handleMessage(msg) {
    console.debug('[game-session] msg: ', msg);
    try {
      let payload = msg;
      if (typeof msg === 'string') payload = JSON.parse(msg);
      else if (msg.body && typeof msg.body === 'string') payload = JSON.parse(msg.body);
      
      // payload = { type: 'GAME_UPDATE', data: {...snapshot...} }
      if (payload.type === 'GAME_UPDATE') {
        console.debug('[game-session] apply backend snapshot');
        this.applyBackendSnapshot(payload.data); // <-- payload.data is your snapshot
        console.log('[game-session] Payload pretty:', JSON.stringify(payload.data, null, 2));
      }
    } catch (err) {
      console.error('[game-session] handleMessage failed', err, msg);
    }
  }
}

// Singleton instance
export const sharedGameSession = new GameSession();