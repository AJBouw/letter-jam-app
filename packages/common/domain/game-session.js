import { signal } from '@preact/signals';
import { GameStatus } from './game-status.js';

export const GameSession = {
  // Identity
  gameUuid: signal(null),
  language: signal(null),
  
  playerUuid: signal(
    sessionStorage.getItem('playerUuid') ??
    (() => {
      const id = crypto.randomUUID();
      sessionStorage.setItem('playerUuid', id);
      return id;
    })()
  ),
  playerName: signal(sessionStorage.getItem('playerName') ?? null),
  maxPlayers: signal(null),
  
  // Game state
  gameStatus: signal('FORM'),
  playersList: signal([]),
  currentPlayer: signal(null),
  opponents: signal([]),
  private: signal(false),
  blocks: signal([]),
  
  reset() {
    this.gameUuid.value = null;
    this.language.value = null;
    this.gameStatus.value = 'FORM';
    this.playersList.value = [];
    this.maxPlayers.value = null;
    this.private.value = false;
    this.currentPlayer.value = null;
    this.opponents.value = [];
    this.blocks.value = [];
  },
  
  applyBackendSnapshot(data) {
    this.gameUuid.value = data.uuid ?? data.gameUuid;
    this.language.value = data.language ?? null;
    this.gameStatus.value = data.gameStatus;
    
    // Update players list and ready states
    this.playersList.value = data.players ?? data.playersList ?? [];
    this.maxPlayers.value = data.maxPlayers ?? null;
    this.private.value = data.private ?? false;
    
    // Update currentPlayer and opponents automatically
    this.updateMeAndOpponents();
  },
  
  // Single entry point for WS messages
  handleMessage(msg) {
    try {
      const data = typeof msg === 'string' ? JSON.parse(msg) : msg;
      
      switch (data.type) {
        case 'PLAYER_JOINED':
          this.playersList.value = [...this.playersList.value, data.player];
          this.updateMeAndOpponents();
          break;
        
        case 'PLAYER_LEFT':
          this.playersList.value = this.playersList.value.filter(p => p.uuid !== data.player.uuid);
          this.updateMeAndOpponents();
          break;
        
        case 'GAME_STATUS_UPDATE':
          console.debug('[GameSession] Status update', data.gameStatus);
          this.gameStatus.value = data.gameStatus;
          break;
        
        case 'PLAYER_READY_UPDATE':
          this.playersList.value = this.playersList.value.map(p =>
            p.uuid === data.playerUuid ? { ...p, readyToStart: data.readyToStart } : p
          );
          this.updateMeAndOpponents();
          break;
        
        case 'GAME_SNAPSHOT':
          this.applyBackendSnapshot(data.game);
          break;
          
        default:
          console.warn('[GameSession] Unhandled WS message:', data);
      }
    } catch (err) {
      console.error('[GameSession] WS handling failed:', msg, err);
    }
  },
  
  // Helper to compute current player and opponents
  updateMeAndOpponents() {
    const me = this.playersList.value.find(p => p.uuid === this.playerUuid.value);
    this.currentPlayer.value = me ?? null;
    this.opponents.value = this.playersList.value.filter(p => p.uuid !== this.playerUuid.value);
  },
  
  // Derived helpers
  get me() {
    return this.currentPlayer.value;
  },
  
  get opponent() {
    // Return first opponent (if any)
    return this.opponents.value.length > 0 ? this.opponents.value[0] : null;
  }
};