import { signal } from '@preact/signals';
import { apiCall } from '@letter-limbo/common';

export class FeatureGameService {
  constructor() {
    this.currentGame = signal(null);
    this.loading = signal(false);
    this.backendError = signal(null);
  }
  
  async fetchGame(uuid) {
    return apiCall('fetchGame', async () => {
      const res = await fetch(`/games/quick-game/${uuid}`);
      const data = await res.json();
      if (!res.ok) throw data;
      this.currentGame.value = data.data;
      return data.data;
    });
  }
  
  async startGame(uuid) {
    return apiCall('startGame', async () => {
      const res = await fetch(`/games/quick-game/${uuid}/start`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw data;
      this.currentGame.value = data.data;
      return data.data;
    });
  }
  
  async cancelWaiting(uuid) {
    return apiCall('cancelWaiting', async () => {
      const res = await fetch(`/games/quick-game/${uuid}/cancel`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw data;
      this.currentGame.value = null;
    });
  }
  
  /**
   * Poll game state every 2 seconds
   * @param uuid
   * @param interval
   */
  startPolling(uuid, interval = 2000) {
    this._pollInterval = setInterval(() => this.fetchGame(uuid), interval);
  }
  
  stopPolling() {
    if (this._pollInterval) clearInterval(this._pollInterval);
  }
}

export const featureGameService = new FeatureGameService();