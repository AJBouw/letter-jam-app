import '@webcomponents/scoped-custom-element-registry';
import './app-shell.js';
import { ThemeService } from '../../packages/common/services/ThemeService.js';
import { lightTheme, darkTheme } from '../../packages/common/src/ui/themes.js';
import { GlobalStyles } from "../../global.styles.js";
import { Router } from "@lit-labs/router";
import { routes } from "./routing/routes.js";

// Inject global styles
const style = document.createElement('style');
style.textContent = GlobalStyles.cssText;
document.head.appendChild(style);

// Initialize theme service
export const themeService = new ThemeService();

// Detect system preference
const prefersDark = window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

// Apply system theme initially
if (prefersDark) {
  themeService.setDarkTheme(darkTheme);
} else {
  themeService.setLightTheme(lightTheme);
}

// Optional: listen for changes in system theme
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (e.matches) {
    themeService.setDarkTheme(darkTheme);
  } else {
    themeService.setLightTheme(lightTheme);
  }
});

// Debug or UI hook
themeService.onChange(theme => {
  console.log('Theme applied:', theme);
});

// Mount app shell
const root = document.getElementById('app');
const app = document.createElement('app-shell');
root.appendChild(app);