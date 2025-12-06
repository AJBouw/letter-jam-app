import { html } from 'lit';

export function resolveRoute(path) {
  switch(path) {
    case '/':
    case '/home':
      return html`<landing-page-view></landing-page-view>`;
    case '/login':
      return html`<feature-login-view></feature-login-view>`;
    case '/games/quick-game':
      return html`<feature-quick-game-view></feature-quick-game-view>`;
    default:
      return html`<h2>404 – Page Not Found</h2>`;
  }
}