export const AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  wsEndpoint: import.meta.env.VITE_WS_ENDPOINT,
  
  get apiBase() {
    if (!this.apiBaseUrl) {
      console.warn('[AppConfig] apiBaseUrl not defined');
      return '';
    }
    return this.apiBaseUrl;
  },
  
  get wsUrl() {
    if (!this.apiBaseUrl || !this.wsEndpoint) {
      console.warn('[AppConfig] apiBaseUrl or wsEndpoint not defined');
      return '';
    }
    return `${this.apiBaseUrl}${this.wsEndpoint}`;
  }
};