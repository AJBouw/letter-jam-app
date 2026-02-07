import { LitElement, html } from 'lit';
import { connectivityService, gameContext, themeService, userSession, wsService } from '@letter-limbo/common';
import { signal } from '@preact/signals';
import { currentRoute, navigateTo } from '../routing/current-route.js';
import { appService } from './app-service.js';
import { TopBarView } from './top-bar/top-bar-view.js'
import { NavBarView } from './nav-bar/nav-bar-view.js';
import { DefaultLayoutStyles } from './default-layout.styles.js';
import { authService } from './../bootstrap.js';

export class DefaultLayout extends LitElement {
  constructor() {
    super();
    // ==== Services and context ===
    this.gameContext = gameContext;
    this.wsService = wsService;
    this.connectivityService = connectivityService;
    this.themeService = themeService;
    this.authService = authService;
    
    this.currentRoute = currentRoute.value;
    this.previousRouteBeforeLogin = '/';
    
    this.loginVisible = signal(false);
    
    currentRoute.subscribe(route => {
      this.currentRoute = route;
      
      // Direct URL access to /login (refresh-safe)
      if (route === '/login' && !this.loginVisible.value) {
        this.previousRouteBeforeLogin = '/';
        this.loginVisible.value = true;
      }
    });
  }
  
  static properties = {
    currentRoute: { state: true },
    authService: { attribute : false}
  };
  
  static scopedElements = {
    'top-bar-view': TopBarView,
    'nav-bar-view': NavBarView
  };
  
  static styles = [ DefaultLayoutStyles ];
  
  set authService(service) {
    this._authService = service;
    console.debug('[default-layout] authService injected:', service);
    if (service) this._initAuth();
  }
  
  get authService() {
    return this._authService;
  }
  
  async _initAuth() {
    try {
      const loggedIn = await this.authService.checkAuth();
      console.debug('[default-layout] User logged in?', loggedIn);
    } catch (err) {
      console.warn('[default-layout] Auth check failed', err);
      userSession.isAuthenticated.value = false;
    }
  }
  
  openLogin() {
    if (this.loginVisible.value) return;
    
    this.previousRouteBeforeLogin = this.currentRoute;
    this.loginVisible.value = true;
    navigateTo('/login');
  }
  
  closeLogin() {
    this.loginVisible.value = false;
    navigateTo(this.previousRouteBeforeLogin || '/');
    this.previousRouteBeforeLogin = '/';
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // Subscribe to route changes
    currentRoute.subscribe(callbackRoute => this.currentRoute = callbackRoute);
    
    this._onPopState = () => {
      if (this.loginVisible.value) {
        this.closeLogin();
      }
    };
    
    window.addEventListener('popstate', this._onPopState);
    
    
    this._onKeyDown = (e) => {
      if (e.key === 'Escape' && this.loginVisible.value) {
        this.closeLogin();
      }
    };
    
    window.addEventListener('keydown', this._onKeyDown);
    
    this.addEventListener('open-login', () => this.openLogin());
    
    // Ping backend immediately
    (async () => {
      await appService.checkBackend();
    })();
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('popstate', this._onPopState);
  }
  
  // Render in light DOM (Bootstrap style)
  createRenderRoot() { return this; }
  
  render() {
    const isDark = this.themeService?.isDark;
    
    return html`
      <header style="background-color: ${isDark ? 'var(--color-background)' : 'var(--color-surface)'};">
        <div class="container py-2">
          <top-bar-view
            .gameContext=${this.gameContext}
            .wsService=${this.wsService}
            .connectivityService=${this.connectivityService}
            .themeService=${this.themeService}
            .authService=${this.authService}
          ></top-bar-view>
        </div>
      </header>

      <!-- Nav without Bootstrap bg classes -->
      <nav class="navbar navbar-expand-lg mb-3">
        <div class="container py-2">
          <nav-bar-view .themeService=${this.themeService}></nav-bar-view>
        </div>
      </nav>

      <main class="container py-4 d-flex flex-column">
        <router-outlet
          .gameContext=${this.gameContext}
          .wsService=${this.wsService}
          .connectivityService=${this.connectivityService}
        ></router-outlet>
      </main>

      ${this.loginVisible.value
        ? html`<feature-login-view
           .gameContext=${this.gameContext}
           .wsService=${this.wsService}
           .authService=${this.authService}
           .onClose=${() => this.closeLogin()}
         ></feature-login-view>`
        : ''}
    `;
  }
}

customElements.define('default-layout', DefaultLayout);