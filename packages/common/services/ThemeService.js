export class ThemeService {
  constructor() {
    this.currentTheme = null;
    this.onThemeChange = null;
  }
  
  /**
   * Apply a theme globally via CSS variables
   * @param themeObject
   */
  applyTheme(themeObject) {
    this.currentTheme = themeObject;
    Object.entries(themeObject).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    
    if (typeof this.onThemeChange === 'function') {
      this.onThemeChange(this.currentTheme);
    }
  }
  
  setLightTheme(lightTheme) {
    this.applyTheme(lightTheme);
  }
  
  setDarkTheme(darkTheme) {
    this.applyTheme(darkTheme);
  }
  
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  onChange(callback) {
    if (typeof callback === 'function') {
      this.onThemeChange = callback;
    }
  }
  
  /**
   * Toggle between light and dark mode manually
   * @param lightTheme
   * @param darkTheme
   */
  toggle(lightTheme, darkTheme) {
    if (!this.currentTheme) {
      this.setLightTheme(lightTheme);
    } else if (this.currentTheme === lightTheme) {
      this.setDarkTheme(darkTheme);
    } else {
      this.setLightTheme(lightTheme);
    }
  }
}