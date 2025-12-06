import { signal } from '@preact/signals';

export class ApiService {
  constructor() {
    // Reactive state
    this.welcomeMessage = signal("Welcome to Letter Limbo!");
    this.featuredGames = signal([
      { id: 1, name: "Quick Game" },
      { id: 2, name: "Challenge Mode" }
    ]);
    this.loading = signal(false);
    this.backendError = signal(null);
  }
  
  /** Fetch landing page data */
  async fetchLandingData() {
    this.loading.value = true;
    this.backendError.value = null;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update signals
      this.welcomeMessage.value = "Welcome to Letter Limbo! Start your first game below.";
      this.featuredGames.value = [
        { id: 1, name: "Quick Game" },
        { id: 2, name: "Challenge Mode" },
        { id: 3, name: "Multiplayer Tournament" }
      ];
      
    } catch (err) {
      this.backendError.value = err.message || "Failed to load landing data";
    } finally {
      this.loading.value = false;
    }
  }
}

// Export singleton instance
export const featureHomeService = new ApiService();