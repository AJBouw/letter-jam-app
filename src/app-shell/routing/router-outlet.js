import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { currentRoute } from './current-route.js';
import { FeatureGameRootView } from '../../features/feature-game/src/feature-game-root-view.js';
import { FeatureQuickGameView } from '../../features/feature-quick-game/src/feature-quick-game-view.js';
import { FeatureLoginView } from '../../features/feature-login/src/feature-login-view.js';
import { LandingPageView } from '../components/landing-page/landing-page-view.js';
import { WsTestView } from '../components/ws-test-view.js';
import { WsSendTestView } from '../components/ws-send-test-view.js';

export class RouterOutlet extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.currentRoute = currentRoute.value;
    currentRoute.subscribe((route) => {
      console.log('[RouterOutlet] Route changed:', route);
      this.currentRoute = route;
    });
  }
  
  static properties = { currentRoute: { state: true } };
  
  static scopedElements = {
    'feature-game-root-view': FeatureGameRootView,
    'feature-quick-game-view': FeatureQuickGameView,
    'feature-login-view': FeatureLoginView,
    'landing-page-view': LandingPageView,
    'ws-test-view': WsTestView,
    'ws-send-test-view': WsSendTestView
  };
  
  createRenderRoot() { return this; } // Render in light DOM
  
  _renderRoute() {
    console.log('[RouterOutlet] Rendering route for path:', this.currentRoute);
    const path = this.currentRoute.split('?')[0]; // strip query
    
    // Quick Start
    if (path === '/games/quick-start') return html`<feature-quick-game-view></feature-quick-game-view>`;
    
    // Waiting-for-Players dynamic route: /games/:uuid/waiting-for-players
    const waitingMatch = path.match(/^\/games\/([0-9a-fA-F-]{36})\/waiting-for-players$/);
    if (waitingMatch) {
      const uuid = waitingMatch[1];
      return html`<feature-waiting-for-players-view .uuid="${uuid}"></feature-waiting-for-players-view>`;
    }
    
    const gameMatch = path.match(/^\/games\/([0-9a-fA-F-]{36})(\/.*)?$/);
    if (gameMatch) {
      return html`
        <feature-game-root-view
          .gameUuid=${gameMatch[1]}
          .subRoute=${gameMatch[2] ?? ''}
        ></feature-game-root-view>
      `;
    }
    
    // Fallback / static routes
    switch (path) {
      case '/': case '/home': return html`<landing-page-view></landing-page-view>`;
      case '/login': return html`<feature-login-view></feature-login-view>`;
      case '/test': return html`<ws-test-view></ws-test-view>`;
      case '/test/send': return html`<ws-send-test-view></ws-send-test-view>`;
      default: return html`<h2>404 – Page Not Found</h2>`;
    }
  }
  
  render() {
    return html`${this._renderRoute()}`;
  }
}

customElements.define('router-outlet', RouterOutlet);