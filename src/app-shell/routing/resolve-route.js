import { html } from 'lit';
import { AppRoutes } from './routes.js';

export function resolveRoute(path) {
  switch(path) {
    case '/':
    case '/home':
      return html`<feature-home-view></feature-home-view>`;
    case '/login':
      return html`<feature-login-view></feature-login-view>`;
    case '/quick-game':
      return html`<feature-quick-game-view></feature-quick-game-view>`;
    default:
      return html`<h2>404 – Page Not Found</h2>`;
  }
}