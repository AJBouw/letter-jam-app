export class FeatureGameWsService {
  constructor(sharedGameSession, wsService) {
    this.sharedGameSession = sharedGameSession;
    this.wsService = wsService;
    
    this.gameUuid = null;
  }
  
  // ========= //
  // Subscribe //
  // ========= //
  // TODO: playerUuid and playerName can be removed?
  connect(gameUuid, playerUuid, playerName) {
    if (!gameUuid || !playerUuid || !playerName) return;
    
    const topic = `/topic/games/${gameUuid}`;
    
    if (!this.wsService?.stompClient?.connected) {
      console.warn('[FeatureGameWsService] WS not connected, delaying subscribe');
      return;
    }
    
    this.wsService.subscribe(topic, msg => this.handleMessage(msg));
  }
  
  // ================= //
  // Incoming messages //
  // ================= //
  handleMessage(msg) {
    try {
      let payload = msg;
      
      if (typeof msg === 'string') {
        payload = JSON.parse(msg);
      } else if (msg.body) {
        payload = JSON.parse(msg.body);
      }
      
      switch (payload.type) {
        case 'GAME_UPDATE':
          console.debug('[FeatureGameWsService] received GAME_UPDATE message: ', payload.data)
          this.sharedGameSession.applyBackendSnapshot(payload.data);
          break;
        case 'GUESS_RESULT':
          console.debug('FeatureGameWsService] received GUESS_RESULT message: ', payload.data)
          // append guess result to GameSession
          const guesses = [...this.sharedGameSession.guesses.value, payload.data];
          this.sharedGameSession.guesses.value = guesses;
          
          // TODO:
          // UX-only: animations, sounds, toasts can be triggered from ViewModel
          break;
        case 'ROUND_END':
          this.sharedGameSession.roundStatus.value = 'ENDED';
          break;
        default:
          console.warn('[FeatureGameWsService] Unknown WS message', payload.data);
      }
    } catch (err) {
      console.error('[FeatureGameWsService] Failed to handle incoming message: ', err, msg);
    }
  }
  
  // ======= //
  // Publish //
  // ======= //
  submitGuess({ gameUuid, roundUuid, playerUuid, guess }) {
    this.wsService.send(`/app/games/${gameUuid}/guess`, {
      type: 'PLAYER_GUESS',
      gameUuid,
      roundUuid,
      playerUuid,
      guess
    });
    console.debug('[FeatureGameWsService] Send player guess');
  }
  
  leaveGame({ gameUuid, playerUuid }) {
    this.wsService.send(`/app/games/${gameUuid}/leave`, {
      type: 'LEAVE_GAME',
      gameUuid,
      playerUuid,
    });
    console.debug('[FeatureGameWsService] Game left by player: ', playerUuid);
  }
}