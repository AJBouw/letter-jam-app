import { apiGet, apiPost } from '@letter-limbo/common';

export class FeatureGameService {
  async getGame(gameUuid, playerUuid) {
    const response = await apiGet(
      'get-game',
      `/games/${gameUuid}?playerUuid=${playerUuid}`
    );
    
    console.debug('[getGame] Backend payload:', JSON.stringify(response.data, null, 2));
    
    return response;
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