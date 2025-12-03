import '@webcomponents/scoped-custom-element-registry'; // polyfill first
import './app-shell.js';
import { ThemeService } from '../../packages/common/services/ThemeService.js';
import { lightTheme } from '../../packages/common/src/ui/themes.js';
import { colorTokens } from '../../packages/common/src/ui/color-tokens.js';

const style = document.createElement('style')
style.textContent = colorTokens;
document.head.appendChild(style);

export const themeService = new ThemeService();
themeService.setLightTheme(lightTheme);
themeService.onChange((theme) => {
  console.log('Theme applied: ', theme);
});

const root = document.getElementById('app');
const app = document.createElement('app-shell');
root.appendChild(app);