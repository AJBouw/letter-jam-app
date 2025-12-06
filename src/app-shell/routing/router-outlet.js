import { LitElement, html } from 'lit';
import { currentRoute } from './current-route.js';
import { FeatureQuickGameView } from '../../features/feature-quick-game/src/feature-quick-game-view.js';
import { FeatureLoginView } from '../../features/feature-login/src/feature-login-view.js';
import { LandingPageView } from '../components/landing-page/landing-page-view.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

export class RouterOutlet extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'feature-quick-game-view': FeatureQuickGameView,
    'feature-login-view': FeatureLoginView,
    'landing-page-view': LandingPageView,
  };
  
  static properties = { currentRoute: { state: true } };
  
  constructor() {
    super();
    this.currentRoute = currentRoute.value;
    currentRoute.subscribe((route) => {
      console.log('[RouterOutlet] Route changed:', route);
      this.currentRoute = route;
    });
  }
  
  createRenderRoot() { return this; }
  
  _renderRoute() {
    console.log('[RouterOutlet] Rendering route for path:', this.currentRoute);
    const path = this.currentRoute.split('?')[0]; // strip query
    switch (true) {
      case path === '/':
      case path === '/home':
        return html`<landing-page-view></landing-page-view>`;
      case path === '/login':
        return html`<feature-login-view></feature-login-view>`;
      case path.startsWith('/games/quick-game'):
        return html`<feature-quick-game-view></feature-quick-game-view>`;
      default:
        return html`<h2>404 – Page Not Found</h2>`;
    }
  }
  
  render() {
    return html`${this._renderRoute()}`;
  }
}

customElements.define('router-outlet', RouterOutlet);