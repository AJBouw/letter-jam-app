import { signal } from '@preact/signals';

export class BackendService {
  constructor(healthUrl = '/api/health', pollInterval = 5000) {
    this.healthUrl = healthUrl;
    this.pollInterval = pollInterval;
    
    // reactive signal for view
    this.status = signal(null); // null | 'UP' | 'DOWN'
    this.error = signal(null);
    
    this._intervalId = null;
  }
  
  async checkHealth() {
    try {
      const res = await fetch(this.healthUrl);
      if (!res.ok) throw new Error(`Backend returned ${res.status}`);
      const data = await res.json();
      if (data.status !== 'UP') throw new Error('Backend unhealthy');
      
      this.status.value = 'UP';
      this.error.value = null;
    } catch (err) {
      this.status.value = 'DOWN';
      this.error.value = 'Backend server is not running. Please start it to continue.';
      console.error('[BackendService]', err.message);
    }
  }
  
  startPolling() {
    this.checkHealth();
    if (!this._intervalId) {
      this._intervalId = setInterval(() => this.checkHealth(), this.pollInterval);
    }
  }
  
  stopPolling() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }
  
  subscribeStatus(callback) {
    return this.status.subscribe(callback);
  }
}