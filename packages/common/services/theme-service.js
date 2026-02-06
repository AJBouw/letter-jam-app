import { signal } from '@preact/signals';
import { darkTheme, lightTheme } from '../ui/themes.js';

/**
 * ThemeService manages themes and logos in a reactive way.
 */
export class ThemeService {
  constructor() {
    this.currentTheme = signal('dark');
    this.logo = signal('');
    
    this.onThemeChange = null;
    this.isDark = null;
    
    this.themes = {
      light: { vars: lightTheme, logo: '' },
      dark: { vars: darkTheme, logo: '' },
    };
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDark = prefersDark;
    
    console.debug('[theme-service] Initialised → prefersDark:', prefersDark, 'isDark:', this.isDark);
  }
  
  setLogos(lightLogoUrl, darkLogoUrl) {
    this.themes.light.logo = lightLogoUrl;
    this.themes.dark.logo = darkLogoUrl;
    
    // Update reactive signal based on current theme
    const themeName = this.isDark ? 'dark' : 'light';
    this.logo.value = this.themes[themeName].logo;
    
    console.debug('[ThemeService] Logos set → light:', lightLogoUrl, 'dark:', darkLogoUrl);
  }
  
  getLogo() {
    console.debug('[theme-service] getLogo: ', this.logo.value);
    return this.logo.value;
  }
  
  applyTheme(themeName) {
    const theme = this.themes[themeName];
    if (!theme) {
      console.warn('[theme-service] Unknown theme:', themeName);
      return;
    }
    
    // Update CSS variables
    Object.entries(theme.vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    
    // Add input-specific CSS variables
    if (themeName === 'dark') {
      document.documentElement.style.setProperty('--input-bg-color', '#2b2b2b');
      document.documentElement.style.setProperty('--input-text-color', '#e0e0e0');
      document.documentElement.style.setProperty('--input-bg-dark', '#2b2b2b'); // optional, for consistency
    } else {
      document.documentElement.style.setProperty('--input-bg-color', '#fff');
      document.documentElement.style.setProperty('--input-text-color', '#212529');
    }
    
    // Add or remove body class for dark mode
    if (themeName === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Update signals
    this.currentTheme.value = themeName;
    this.logo.value = theme.logo;
    this.isDark = themeName === 'dark';
    
    // Trigger optional callback
    if (typeof this.onThemeChange === 'function') {
      this.onThemeChange(themeName);
    }
    
    console.debug('[theme-service] Applied theme:', themeName, 'logo:', this.logo.value);
  }
  
  toggleTheme() {
    const nextTheme = this.isDark ? 'light' : 'dark';
    this.applyTheme(nextTheme);
  }
  
  onChange(callback) {
    if (typeof callback === 'function') {
      this.onThemeChange = callback;
      console.debug('[theme-service] onChange callback registered');
    }
  }
}

// Singleton instance
export const themeService = new ThemeService();