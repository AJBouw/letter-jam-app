import { effect, signal } from '@preact/signals';
import { userSession } from '@letter-limbo/common';

export class TopBarViewModel {
  constructor(gameContext, wsService, connectivityService, themeService, authService) {
    // === Services and context ===
    this.gameContext = gameContext;
    this.wsService = wsService;
    this.connectivityService = connectivityService;
    this.themeService = themeService;
    this.authService = authService;
    
    // === UI state ===
    this.loading = signal(false);
    this.backendOk = signal(false);
    this.wsServerOk = signal(false);
    
    // === Effects ===
    effect(() => {
      this.backendOk.value = connectivityService.backendOk.value;
      this.wsServerOk.value = connectivityService.wsServerOk.value;
    });
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDark = prefersDark;
  }
  
  setAuthService(service) {
    this.authService = service;
    console.debug('[top-bar-view-model] authService injected:', service);
    
    // Optional: check auth immediately on injection
    if (service) this._checkAuth();
  }
  
  async _checkAuth() {
    if (!this.authService) return;
    try {
      const loggedIn = await this.authService.checkAuth();
      console.debug('[top-bar-view-model] User logged in?', loggedIn);
      userSession.isAuthenticated.value = loggedIn;
    } catch (err) {
      console.warn('[top-bar-view-model] Auth check failed', err);
      userSession.isAuthenticated.value = false;
    }
  }
  
  async handleAuthToggle() {
    if (!this.authService) {
      console.warn('[top-bar-view-model] Auth service not ready yet');
      return;
    }
    
    try {
      if (userSession.isAuthenticated.value) {
        await this.authService.logout();
        userSession.isAuthenticated.value = false;
      }
    } catch (err) {
      console.error('[top-bar-view-model] Auth error:', err);
    }
  }
  
  handleToggleTheme() {
    console.debug('[top-bar-view-model] Toggle theme button clicked');
    this.themeService.toggleTheme();
    
    console.debug('[top-bar-view-model] After toggle → isDark:', this.themeService.isDark, 'currentTheme:', this.themeService.currentTheme);
    console.debug('[top-bar-view-model] Logo now →', this.themeService.getLogo());
  }
}