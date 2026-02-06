/**
 * GameContext
 *
 * Responsibilities:
 * - Hold authoritative frontend game state
 * - Restore lightweight session identifiers
 * - Apply backend snapshots
 * - Derive board rows + letter feedback (LINGO rules)
 *
 * NOT responsible for:
 * - WebSocket connections
 * - Message routing
 * - Navigation
 */
import { GameState } from './game-state.js';
import { GameDerived } from './game-derived.js';
import { GameSession } from './game-session.js';
import { GameSnapshot } from './game-snapshot.js';

const gameState = new GameState();
const gameDerived = new GameDerived(gameState);
const gameSession = new GameSession(gameState);
const gameSnapshot = new GameSnapshot(gameState, gameSession);

const _mutable = { onRematchStarted: null };

export const gameContext = Object.freeze({
  state: gameState,
  derived: gameDerived,
  session: gameSession,
  snapshot: gameSnapshot,
  
  setRematchCallback(cb) {
    _mutable.onRematchStarted = cb;
  },
  
  callRematchStarted(newGameUuid) {
    if (typeof _mutable.onRematchStarted === 'function') {
      _mutable.onRematchStarted(newGameUuid);
    }
  },
});