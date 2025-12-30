import { apiPost } from '@letter-limbo/common';

export class FeatureGameService {
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