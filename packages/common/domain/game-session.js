import { computed, signal } from '@preact/signals';
import { GameStatus } from './game-status.js';

// export const GameSession = {
//   // Core game identifiers
//   gameUuid: signal(null),
//   gameStatus: signal(GameStatus.FORM),
//   language: signal(null),
//   maxPlayers: signal(null),
//   private: signal(false),
//
//   // Player identity
//   playerUuid: signal(null),
//   playerName: signal(null),
//
//   // Players
//   playersList: signal([]),
//
//   // Find the viewer
//   me: computed(() =>
//     GameSession.playersList.value.find(p => p.uuid === GameSession.playerUuid.value) ?? null
//   ),
//   opponents: computed(() =>
//     GameSession.playersList.value.filter(p => p.uuid !== GameSession.playerUuid.value)
//   ),
//
//   // Local player readiness
//   thisPlayerIsReady: signal(false),
//   // TODO: should this be needed instead of signal?
//   // thisPlayerIsReady: computed(() => GameSession.me.value?.readyToStart ?? false),
//
//   // Players readiness
//   allPlayersReady: signal(false),
//   // TODO: should this be needed instead of signal?
//   // allPlayersReady: computed(() =>
//   //   GameSession.playersList.value.length > 0 &&
//   //   GameSession.playersList.value.every(p => p.readyToStart)
//   // ),
//
//   // Derived state
//   activePlayerUuid: signal(null),
//   activePlayerName: computed(() => {
//     const active = GameSession.playersList.value.find(
//       p => p.uuid === GameSession.activePlayerUuid.value
//     );
//
//     if (!active) return null;
//
//     return active.uuid === GameSession.playerUuid.value
//       ? 'me'
//       : active.name;
//   }),
//
//   // Game playing
//   roundUuid: signal(null),
//   roundNumber: signal(null),
//   roundStatus: signal(null),
//   maskedWord: signal(null),
//   blocks: signal([]),
//
//   // Derived helpers
//   initPlayer({ playerUuid, playerName }) {
//     if (this.playerUuid.value) return;
//
//     this.playerUuid.value = playerUuid;
//     this.playerName.value = playerName;
//
//     sessionStorage.setItem('playerUuid', playerUuid);
//     sessionStorage.setItem('playerName', playerName);
//
//     console.debug('[game-session] sessionStorage playerUuid: ', this.playerUuid.value);
//     console.debug('[game-session] sessionStorage playerName: ', this.playerName.value);
//     this.updateThisPlayerReady();
//   },
//
//   updateThisPlayerReady() {
//     const me = this.playersList.value.find(
//       p => p.uuid === this.playerUuid.value
//     );
//     this.thisPlayerIsReady.value = me?.readyToStart ?? false;
//   },
//
//   updateAllPlayersReady() {
//     this.allPlayersReady.value = this.playersList.value.length > 0 &&
//       this.playersList.value.every(p => p.readyToStart);
//   },
//
//   updateActivePlayer(uuid) {
//     this.activePlayerUuid.value = uuid;
//   },
//
//   // TODO: check when this should be used
//   reset() {
//     this.gameUuid.value = null;
//     this.gameStatus.value = GameStatus.FORM;
//
//     this.playerUuid.value = null;
//     this.playerName.value = null;
//
//     this.playersList.value = [];
//     this.activePlayerUuid.value = null;
//     this.activePlayerName.value = null;
//
//     this.allPlayersReady.value = false;
//     this.thisPlayerIsReady.value = false;
//
//     this.language.value = null;
//     this.maxPlayers.value = null;
//     this.private.value = false;
//
//     this.roundUuid.value = null;
//     this.roundNumber.value = null;
//     this.roundStatus.value = null;
//     this.maskedWord.value = null;
//     this.blocks.value = [];
//   },
//
//   applyBackendSnapshot(data) {
//     if (!data) {
//       console.debug('[game-session] no data available');
//       return;
//     }
//
//     // Core game identifiers
//     this.gameUuid.value = data.uuid ?? data.gameUuid ?? this.gameUuid.value;
//     this.language.value = data.language ?? null;
//     this.gameStatus.value = data.gameStatus ?? this.gameStatus.value;
//     this.maxPlayers.value = data.maxPlayers ?? null;
//
//     this.private.value = data.private ?? false;
//
//     // Player identity: Viewer (me)
//     if (data.viewer) {
//       this.playerUuid.value = data.viewer.playerUuid;
//       this.playerName.value = data.viewer.playerName;
//       sessionStorage.setItem('playerUuid', this.playerUuid.value);
//       sessionStorage.setItem('playerName', this.playerName.value);
//     }
//
//     if (data.playersList) {
//       this.playersList.value = data.playersList;
//     }
//
//     // Data only available when the last player joins
//     if (data.roundDetails) {
//       this.roundUuid.value = data.roundDetails.uuid;
//       this.roundNumber.value = data.roundDetails.roundNumber;
//       this.roundStatus.value = data.roundDetails.roundStatus;
//
//       // Authoritative active player
//       this.activePlayerUuid.value = data.roundDetails.activePlayerUuid;
//
//       this.winningPlayerUuid.value = data.roundDetails.winningPlayerUuid;
//       this.maxTurns.value = data.roundDetails.maxTurns;
//       this.targetWordUuid.value = data.roundDetails.targetWordUuid;
//       this.maskedWord.value = data.roundDetails.maskedWord;
//       this.turnsList.value = data.roundDetails.turnsList;
//
//       // Convert maskedWord to blocks for UI
//       this.blocks.value = data.roundDetails.maskedWord ? data.roundDetails.maskedWord.split('') : [];
//
//     }
//
//     // Derived
//     this.thisPlayerIsReady.value = this.playersList.value.find(p => p.uuid === this.playerUuid.value)?.readyToStart ?? false;
//     this.allPlayersReady.value = this.playersList.value.length > 0 &&
//       this.playersList.value.every(p => p.readyToStart);
//
//     // if (data.viewer) {
//     //   this.initPlayer({
//     //     playerUuid: data.viewer.playerUuid,
//     //     playerName: data.viewer.playerName
//     //   });
//     // }
//
//     // Local player readiness
//     // this.updateThisPlayerReady();
//
//     // All players readiness
//     // this.updateAllPlayersReady();
//   },
//
//   // Single entry point for WS messages
//   handleMessage(msg) {
//     try {
//       let payload;
//
//       if (typeof msg === 'string') {
//         payload = JSON.parse(msg);
//       } else if (msg.body && typeof msg.body === 'string') {
//         payload = JSON.parse(msg.body);
//       } else {
//         payload = msg; // already an object
//       }
//
//       const data = payload.data ?? payload;
//       console.debug('[game-session] playersList: ', data.playersList);
//
//       if (payload.type === 'GAME_UPDATE') {
//         this.applyBackendSnapshot(data);
//         console.debug('[game-session] Updated from WS message:', data);
//       }
//
//     } catch (err) {
//       console.error('[game-session] Failed to handle WS message:', err, msg);
//     }
//   }
// };

export const GameSession = {
  // Core game identifiers
  gameUuid: signal(null),
  language: signal(null),
  gameStatus: signal(GameStatus.FORM),
  maxPlayers: signal(null),
  private: signal(false),
  
  // Player identity viewer / local player
  playerUuid: signal(null),
  playerName: signal(null),
  
  // Players
  playersList: signal([]),
  
  // Round
  roundUuid: signal(null),
  roundNumber: signal(null),
  roundStatus: signal(null),
  maxTurns: signal(null),
  targetWordUuid: signal(null),
  maskedWord: signal(null),
  turnsList: signal([]),
  activePlayerUuid: signal(null),
  winningPlayerUuid: signal(null),
  
  // Computed / derived
  me: computed(() =>
    GameSession.playersList.value.find(
      p => p.uuid === GameSession.playerUuid.value
    ) ?? null
  ),
  opponents: computed(() =>
    GameSession.playersList.value.filter(
      p => p.uuid !== GameSession.playerUuid.value
    )
  ),
  
  // Local player readiness
  thisPlayerIsReady: computed(() => GameSession.me.value?.readyToStart ?? false),
  
  // Players readiness
  allPlayersReady: computed(() =>
    GameSession.playersList.value.length > 0 &&
    GameSession.playersList.value.every(p => p.readyToStart)
  ),
  
  // Derived state
  activePlayer: computed(() => {
    const uuid = GameSession.activePlayerUuid.value;
    const list = GameSession.playersList.value;
    console.debug('[GameSession] computing activePlayer', { uuid, list });
    
    return list.find(p => p.uuid === uuid) ?? null;
  }),
  activePlayerName: computed(() => {
    const active = GameSession.activePlayer.value;
    if (!active) return null;
    return active.uuid === GameSession.playerUuid.value ? 'me' : active.name;
  }),
  
  blocks: computed(() =>
    GameSession.maskedWord.value ?
      GameSession.maskedWord.value.split('')
      : []
  ),
  
  // Derived helpers
  initPlayer({ playerUuid, playerName }) {
    if (this.playerUuid.value) return;
    
    this.playerUuid.value = playerUuid;
    this.playerName.value = playerName;
    
    sessionStorage.setItem('playerUuid', playerUuid);
    sessionStorage.setItem('playerName', playerName);
    
    console.debug('[game-session] sessionStorage playerUuid: ', this.playerUuid.value);
    console.debug('[game-session] sessionStorage playerName: ', this.playerName.value);
  },
  
  applyBackendSnapshot(data) {
    if (!data) {
      console.debug('[game-session] no data available');
      return;
    }
    
    // Core game identifiers
    this.gameUuid.value = data.uuid ?? data.gameUuid ?? this.gameUuid.value;
    this.language.value = data.language ?? null;
    this.gameStatus.value = data.gameStatus ?? this.gameStatus.value;
    this.maxPlayers.value = data.maxPlayers ?? null;
    this.private.value = data.private ?? false;
    
    // Player identity: Viewer (me)
    if (data.viewer) {
      this.initPlayer({
        playerUuid: data.viewer.playerUuid,
        playerName: data.viewer.playerName
      })
    }
    
    if (data.playersList) {
      this.playersList.value = data.playersList;
    }
    
    // Data only available when the last player joins
    if (data.roundDetails) {
      this.roundUuid.value = data.roundDetails.uuid;
      this.roundNumber.value = data.roundDetails.roundNumber;
      this.roundStatus.value = data.roundDetails.roundStatus;
      
      // Authoritative active player
      this.activePlayerUuid.value = data.roundDetails.activePlayerUuid;
      
      this.winningPlayerUuid.value = data.roundDetails.winningPlayerUuid;
      this.maxTurns.value = data.roundDetails.maxTurns;
      this.targetWordUuid.value = data.roundDetails.targetWordUuid;
      this.maskedWord.value = data.roundDetails.maskedWord;
      this.turnsList.value = data.roundDetails.turnsList;
    }
  },
  
  // Single entry point for WS messages
  handleMessage(msg) {
    try {
      let payload;
      
      if (typeof msg === 'string') {
        payload = JSON.parse(msg);
      } else if (msg.body && typeof msg.body === 'string') {
        payload = JSON.parse(msg.body);
      } else {
        payload = msg;
      }
      
      const data = payload.data ?? payload;
      console.debug('[game-session] playersList: ', data);
      
      console.debug('[game-session] playersList: ', data.playersList);
      
      // Handle different message types
      switch (payload.type) {
        case 'GAME_UPDATE':
          if (data.playersList) {
            this.playersList.value = data.playersList;
            console.debug('[game-session] playersList updated', this.playersList.value);
          }
          
          if (data.activePlayerUuid) {
            this.activePlayerUuid.value = data.activePlayerUuid;
            console.debug('[game-session] activePlayerUuid updated', this.activePlayerUuid.value);
          }
          
          if (data.gameStatus) {
            this.gameStatus.value = data.gameStatus;
          }
          console.debug('[game-session] Updated from WS message:', data);
          break;
        
        case 'PLAYER_READY':
          // Optional: update the ready status of a single player
          if (data.playerUuid && typeof data.readyToStart === 'boolean') {
            const player = this.playersList.value.find(p => p.uuid === data.playerUuid);
            if (player) player.readyToStart = data.readyToStart;
          }
          break;
        
        default:
          console.warn('[game-session] Unknown WS message type:', payload.type);
      }
      
    } catch (err) {
      console.error('[game-session] Failed to handle WS message:', err, msg);
    }
  }
};