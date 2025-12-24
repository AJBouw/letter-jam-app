import { apiPost } from '@letter-limbo/common';

export class FeatureQuickGameService {
  async requestQuickGame(data) {
    return apiPost('quick-start', '/games/quick-start', data);
  }
}