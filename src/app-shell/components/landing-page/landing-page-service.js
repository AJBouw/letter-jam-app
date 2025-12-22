import { signal } from '@preact/signals';

class LandingPageService {
  constructor() {
    this.welcomeMessage = signal('Welcome to Letter Limbo!');
    this.featuredGames = signal([
      { id: 1, name: 'Quick Start' },
      { id: 2, name: 'Challenge Mode' },
      { id: 3, name: 'Multiplayer Tournament' }
    ]);
    this.backendError = signal(null);
  }
  
  async checkBackend() {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error(`Backend returned ${res.status}`);
      const data = await res.json();
      if (data.status !== 'UP') throw new Error('Backend unhealthy');
      this.backendError.value = null;
    } catch (err) {
      this.backendError.value =
        'Backend server is not running. Please start it to continue.';
      console.error('[FeatureHomeService] Backend not reachable:', err.message);
    }
  }
}

export const landingPageService = new LandingPageService();