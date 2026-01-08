export class FeatureGameWsService {
  constructor(wsService) {
    this.wsService = wsService;
  }
  
  submitGuess({ gameUuid, roundUuid, playerUuid, guess }) {
    if (!guess?.length) return;
    
    this.wsService.send(`/app/games/${gameUuid}/guess`, {
      type: 'PLAYER_GUESS',
      gameUuid,
      roundUuid,
      playerUuid,
      guess
    });
  }
}