import { signal } from '@preact/signals';

class AppService {
  constructor() {
    this.backendError = signal(null);
  }
  
  async checkBackend() {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error(`Backend returned ${res.status}`);
      const data = await res.json();
      if (data.gameStatus !== 'UP') throw new Error('Backend unhealthy');
      this.backendError.value = null; // backend is up
    } catch (err) {
      this.backendError.value =
        'Backend server is not running. Please start it to continue.';
      console.error('[Startup] Backend not reachable:', err.message);
    }
  }
}

export const appService = new AppService();