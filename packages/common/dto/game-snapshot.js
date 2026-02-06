export class GameSnapshot {
  constructor(gameState, gameSession) {
    this.gameState = gameState;
    this.gameSession = gameSession;
    
    this.snapshots = new Map();
  }
  
  applyBackendSnapshot(data) {
    if (!data) return;
    
    console.debug('[game-snapshot] apply backend snapshot', {
      gameUuid: data.gameUuid,
      viewerResolvedFor: this.gameState.viewerResolvedForGameUuid.value
    });
    
    // Enter game flow
    if (!this.gameState.hasEnteredGameFlow.value) this.gameSession.enterGameFlow();
    
    // Resolve the local player
    if (this.gameState.userUuid.value) {
      const me = data.players?.find(p => p.userUuid === this.gameState.userUuid.value);
      if (me) {
        this.gameState.playerUuid.value = me.uuid;
        this.gameState.playerNickname.value = me.nickname;
      }
    }
    
    // Set the rest of the snapshot as before
    this.gameState.gameUuid.value = data.gameUuid ?? null;
    this.gameState.language.value = data.language ?? 'NL';
    this.gameState.gameStatus.value = data.gameStatus ?? 'WAITING_FOR_PLAYERS';
    this.gameState.maxPlayers.value = data.maxPlayers ?? 0;
    this.gameState.players.value = data.players ?? [];
    this.gameState.winningGamePlayerUuid.value = data.winningGamePlayerUuid ?? null;
    
    const round = data.roundDetails ?? null;
    this.gameState.roundDetails.value = round;
    this.gameState.roundUuid.value = round?.uuid ?? null;
    this.gameState.roundStatus.value = round?.roundStatus ?? null;
    this.gameState.activePlayerUuid.value = round?.activePlayerUuid ?? null;
    this.gameState.maskedWord.value = round?.maskedWord ?? null;
    this.gameState.winningRoundPlayerUuid.value = round?.winningRoundPlayerUuid ?? null;
    
    this.gameSession.resolveViewerFromSnapshot(data.players ?? [], data.viewer ?? null);
  }
  
  resetAfterGameIsFinished() {
    console.debug('[game-snapshot] Resetting for rematch');
    
    if (!this.gameState.userUuid.value) {
      console.error(
        '[game-snapshot] resetAfterGameIsFinished called WITHOUT userUuid',
        {
          userUuid: this.gameState.userUuid.value,
          viewerResolved: this.gameState.viewerResolved.value
        }
      );
    }
    
    // Preserve stable identity
    const userUuid = this.gameState.userUuid.value;
    console.debug('[game-snapshot] Preserve stable identity userUuid: ', userUuid);
    const playerNickname = this.gameState.playerNickname.value;
    
    // Reset game state
    this.gameState.latestSnapshot.value = null;
    this.gameState.gameUuid.value = null;
    this.gameState.gameStatus.value = null;
    this.gameState.maxPlayers.value = null;
    this.gameState.language.value = null;
    this.gameState.winningGamePlayerUuid.value = null;
    
    this.gameState.players.value = [];
    
    this.gameState.roundDetails.value = null;
    this.gameState.roundUuid.value = null;
    this.gameState.roundStatus.value = null;
    this.gameState.maskedWord.value = '';
    this.gameState.guesses.value = [];
    this.gameState.winningRoundPlayerUuid.value = null;
    
    // Flags
    this.gameState.hasEnteredGameFlow.value = false;
    
    // Reset viewerResolvedForGameUuid so new snapshot can resolve
    this.gameState.viewerResolvedForGameUuid.value = null;
    
    // Restore the stable identity for rematch
    this.gameState.userUuid.value = userUuid;
    this.gameState.playerNickname.value = playerNickname;
    this.gameState.playerUuid.value = null;
  }
  
  storeSnapshot(gameUuid, snapshot) {
    if (!gameUuid || !snapshot) {
      console.warn('[game-snapshot] storeSnapshot called with missing data', { gameUuid, snapshot });
      return;
    }
    
    // Clone to avoid mutation later
    const clonedSnapshot = structuredClone(snapshot);
    this.snapshots.set(gameUuid, clonedSnapshot);
    
    console.debug('[game-snapshot] Stored snapshot', { gameUuid, snapshot: clonedSnapshot });
  }
}