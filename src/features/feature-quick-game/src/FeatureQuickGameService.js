import { apiPost } from '@letter-limbo/common';

export class FeatureQuickGameService {
  async requestQuickGame(data) {
    return apiPost(
      'quick-start',
      '/games/quick-start',
      data
    );
  }
  
  async cancelGame(gameUuid, playerUuid) {
    return apiPost(
      'cancel-game',
      `/games/${gameUuid}/players/${playerUuid}/cancel`,
      { }
    );
  }
}