import '@webcomponents/scoped-custom-element-registry';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './app-shell.js';
import { AppConfig, AuthService, connectivityService, themeService, userSession } from '@letter-limbo/common';
import { GlobalStyles } from '../../global.styles.js';
import darkLogo from '../assets/letter-limbo-dark.png';
import lightLogo from '../assets/letter-limbo-light.png';

console.debug('[bootstrap] Dark logo:', darkLogo);
console.debug('[bootstrap] Light logo:', lightLogo);

// Initialise session
userSession.initSession();

// Initialise backend polling
connectivityService.start();

// Initialise auth service
export const authService = new AuthService(AppConfig.apiBase);
console.debug('[bootstrap] authService created:', authService);

(async () => {
  try {
    const loggedIn = await authService.checkAuth();
    console.debug('[bootstrap] authService checkAuth result:', loggedIn);
  } catch (err) {
    console.warn('[bootstrap] authService checkAuth failed', err);
  }
})();

// Inject global styles
const style = document.createElement('style');
style.textContent = GlobalStyles.cssText;
document.head.appendChild(style);

themeService.setLogos(lightLogo, darkLogo);

// Detect system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
themeService.applyTheme(prefersDark ? 'dark' : 'light');

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  themeService.applyTheme(e.matches ? 'dark' : 'light');
});

// Debug or UI hook
themeService.onChange(theme => {
  console.log('[bootstrap] Theme applied:', theme);
});

// Mount app shell
const root = document.getElementById('app');
const app = document.createElement('app-shell');
app.themeService = themeService;
app.auth = authService;
console.debug('[bootstrap] authService injected into app-shell:', app.auth);
root.appendChild(app);