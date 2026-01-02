import { apiGet, apiPost } from '@letter-limbo/common';

export class FeatureGameService {
  async fetchGameSnapshot(gameUuid, viewerUuid) {
    if (!gameUuid) throw new Error('gameUuid is required');
    
    let path = `/games/${gameUuid}/snapshot`;
    if (viewerUuid) {
      path += `?viewerUuid=${viewerUuid}`;
    }
    
    return apiGet('fetchGameSnapshot', path);
  }
  
  async markPlayerReady(gameUuid, playerUuid) {
    return apiPost(
      'mark-ready',
      `/games/${gameUuid}/players/${playerUuid}/ready`,
      {});
  }
  
  async cancelGame(gameUuid, playerUuid) {
    return apiPost(
      'cancel-game',
      `/games/${gameUuid}/players/${playerUuid}/cancel`,
      { }
    );
  }
}