import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { connectivityService, gameContext, userSession, wsService } from '@letter-limbo/common';
import { currentRoute } from './current-route.js';
import { FeatureGameRootView } from '../../features/feature-game/src/feature-game-root-view.js';
import { FeatureQuickStartView } from '../../features/feature-quick-start/src/components/feature-quick-start-view.js';
import { FeatureLoginView } from '../../features/feature-login/src/feature-login-view.js';
import { LandingPageView } from '../components/landing-page/landing-page-view.js';
import { WsTestView } from '../components/ws-test/ws-test-view.js';
import { WsSendTestView } from '../components/ws-test/ws-send-test-view.js';
import { isProtectedRoute } from './protected-routes.js';

export class RouterOutlet extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.currentRoute = currentRoute.value;
    this.lastNonLoginRoute = this.currentRoute;
    
    currentRoute.subscribe((route) => {
      console.debug('[router-outlet] Route changed:', route);
      this.currentRoute = route;
      
      // Only update background route if NOT login
      if (route !== '/login') {
        this.lastNonLoginRoute = route;
      }
    });
  }
  
  static properties =
    {
      currentRoute: { state: true },
      lastNonLoginRoute: { state: true }
    };
  
  static scopedElements = {
    'feature-game-root-view': FeatureGameRootView,
    'feature-quick-start-view': FeatureQuickStartView,
    'feature-login-view': FeatureLoginView,
    'landing-page-view': LandingPageView,
    'ws-test-view': WsTestView,
    'ws-send-test-view': WsSendTestView
  };
  
  // Render in light DOM (Bootstrap style)
  createRenderRoot() { return this; }
  
  _renderRoute() {
    const routeToRender =
      this.currentRoute === '/login'
        ? this.lastNonLoginRoute
        : this.currentRoute;
    
    const path = routeToRender.split('?')[0];
    
    const isProtected = path.startsWith('/games');
    
    // If not authenticated not allowed to instantiate feature-game-root-view
    if (isProtectedRoute(path) && !userSession.isAuthenticated.value) {
      this.dispatchEvent(
        new CustomEvent('open-login', { bubbles: true, composed: true })
      );
      return html``;
    }
    
    // Game route
    const gameMatch = path.match(/^\/games\/([0-9a-fA-F-]{36})(\/.*)?$/);
    if (gameMatch) {
      return html`
        <feature-game-root-view
          .gameUuid=${gameMatch[1]}
          .subRoute=${gameMatch[2] ?? ''}
          .gameContext=${gameContext}
          .wsService=${wsService}
          .connectivityService=${connectivityService}
        ></feature-game-root-view>
      `;
    }
    
    switch (path) {
      case '/':
      case '/home':
        return html`<landing-page-view></landing-page-view>`;
      
      case '/games/quick-start':
        return html`
          <feature-quick-start-view
            .gameContext=${gameContext}
            .wsService=${wsService}
            .connectivityService=${connectivityService}
          ></feature-quick-start-view>
        `;
      
      default:
        return html`<h2>404 – Page Not Found</h2>`;
    }
  }
  
  render() {
    return html`${this._renderRoute()}`;
  }
}

customElements.define('router-outlet', RouterOutlet);