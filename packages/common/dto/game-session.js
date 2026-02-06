import { signal } from "@preact/signals";

export class GameSession {
  constructor(gameState) {
    this.gameState = gameState;
    const storedUserUuid = sessionStorage.getItem('userUuid');
    if (storedUserUuid) {
      this.gameState.userUuid.value = storedUserUuid;
    }
    
    this.playerUuid = signal(null);
    this.playerNickname = signal(null);
    this.playerNumber = signal(null);
    
    // Game flow state
    this.currentGameUuid = signal(null);
    this.inGameFlow = signal(false);
  }
  
  initPlayer({ playerUuid, playerNickname, playerNumber }) {
    this.playerUuid.value = playerUuid;
    this.playerNickname.value = playerNickname;
    this.playerNumber.value = playerNumber;
    
    console.debug('[GameSession] Player initialised', {
      playerUuid,
      playerNickname,
      playerNumber
    });
  }
  
  setCurrentGameUuid(gameUuid) {
    this.currentGameUuid.value = gameUuid;
    console.debug('[GameSession] Current game set', gameUuid);
  }
  
  
  // ================================= //
  // Viewer resolution (authoritative) //
  // ================================= //
  resolveViewerFromSnapshot(players = [], viewer = null) {
    const currentGameUuid = this.gameState.gameUuid.value;
    if (!currentGameUuid) return;
    
    if (this.gameState.viewerResolvedForGameUuid.value === currentGameUuid) {
      console.debug('[game-session] Already resolved for this game', currentGameUuid);
      return;
    }
    
    // if (this.gameState.viewerResolved?.value) return;
    
    let me = null;
    
    // Use authoritative viewer first
    if (viewer?.userUuid) {
      me = players.find(p => p.uuid === viewer.playerUuid) ?? {
        uuid: viewer.playerUuid,
        nickname: viewer.playerNickname,
        userUuid: viewer.userUuid
      };
    }
    
    if (!me) {
      console.debug('[game-session] Viewer not resolved yet');
      return;
    }
    
    // Apply authoritative identity
    this.gameState.playerUuid.value = me.uuid;
    this.gameState.playerNickname.value = me.nickname;
    this.gameState.userUuid.value = me.userUuid;
    
    // this.gameState.viewerResolved.value = true;
    this.gameState.viewerResolvedForGameUuid.value = currentGameUuid;
    
    console.debug('[game-session] Viewer resolved from snapshot', {
      userUuid: me.userUuid,
      playerUuid: me.uuid,
      nickname: me.nickname
    });
    
    this.persistSession();
  }
  
  // ============================ //
  // Restore from session storage //
  // ============================ //
  restoreViewerFromSession() {
    // if (this.gameState.playerUuid.value) return;
    
    console.debug('[game-session] restoreViewerFromSession ENTER', {
      stateUserUuid: this.gameState.userUuid.value,
      storedUserUuid: sessionStorage.getItem('userUuid'),
      // viewerResolved: this.gameState.viewerResolved.value
    });
    
    const storedUserUuid = sessionStorage.getItem('userUuid');
    
    if (storedUserUuid) {
      this.gameState.userUuid.value = storedUserUuid;
      console.debug('[game-session] userUuid restored from session', {
        userUuid: storedUserUuid
      });
    } else {
      console.debug('[game-session] No userUuid to restore');
      return;
    }
    
    console.debug('[game-session] Viewer restored from session', {
      userUuid: storedUserUuid
    });
  }
  
  restoreGameFromSession() {
    const gameUuid = sessionStorage.getItem('gameUuid');
    if (!gameUuid) {
      console.debug('[game-session] No gameUuid in session');
      return false;
    }
    
    this.gameState.gameUuid.value = gameUuid;
    console.debug('[game-session] Game restored from session', gameUuid);
    return true;
  }
  
  restoreEntryFlag() {
    this.gameState.hasEnteredGameFlow.value = sessionStorage.getItem('enteredGameFlow') === 'true';
  }
  
  // ============================== //
  // Initialisation (authoritative) //
  // ============================== //
  enterGameFlow() {
    if (this.gameState.hasEnteredGameFlow.value) return;
    
    this.gameState.hasEnteredGameFlow.value = true;
    sessionStorage.setItem('enteredGameFlow', 'true');
    
    console.debug('[game-session] Entered game flow');
  }
  
  leaveGameFlow() {
    this.inGameFlow.value = false;
    this.currentGameUuid.value = null;
    console.debug('[GameSession] Left game flow');
  }
  
  // =========== //
  // Persistence //
  // =========== //
  persistSession() {
    if (this.gameState.gameUuid.value) sessionStorage.setItem('gameUuid', this.gameState.gameUuid.value);
    if (this.gameState.userUuid.value) sessionStorage.setItem('userUuid', this.gameState.userUuid.value);
  }
}