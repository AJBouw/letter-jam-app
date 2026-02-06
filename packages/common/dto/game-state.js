import { signal } from '@preact/signals';
import { GameStatus } from '../domain/game-status.js';

export class GameState {
  constructor() {
    // ============ //
    // Game related //
    // ============ //
    this.gameUuid = signal(null);
    this.language = signal(null);
    this.gameStatus = signal(GameStatus.FORM);
    this.maxPlayers = signal(null);
    this.winningGamePlayerUuid = signal(null);
    this.players = signal([]);
    
    // ============== //
    // Player related //
    // ============== //
    this.playerUuid = signal(null);
    this.userUuid = signal(null);
    this.playerNickname = signal(null);
    
    // ============= //
    // Round related //
    // ============= //
    this.roundDetails = signal(null);
    this.roundUuid = signal(null);
    this.roundStatus = signal(null);
    this.activePlayerUuid = signal(null);
    // this.targetWordUuid = signal(null);
    this.maskedWord = signal('');
    this.guesses = signal([]);
    this.winningRoundPlayerUuid = signal(null);
    
    // Flags
    this.hasEnteredGameFlow = signal(false);
    this.viewerResolved = signal(false);
    this.rematchStarted = signal(false);
    this.waitingForNewGameUuid = signal(false);
    
    // Snapshot
    this.latestSnapshot = signal(null);
    this.viewerResolvedForGameUuid = signal(null);
  }
}