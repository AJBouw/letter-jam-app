import { LitElement, html } from 'lit';
import { navigateTo, currentRoute } from "../routing/current-route.js";
import { DefaultLayoutStyles } from './default-layout.styles.js';
import { TopBarView } from './top-bar/top-bar-view.js'
import { appService } from './app-service.js';

export class DefaultLayout extends LitElement {
  static properties = {
    currentRoute: { state: true }
  };
  
  static scopedElements = { 'top-bar': TopBarView };
  static styles = [ DefaultLayoutStyles ];
  
  constructor() {
    super();
    this.currentRoute = currentRoute.value;
    currentRoute.subscribe(r => this.currentRoute = r);
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    // Subscribe to route changes
    currentRoute.subscribe(r => this.currentRoute = r);
    
    // Ping backend immediately
    (async () => {
      await appService.checkBackend();
    })();
  }
  
  createRenderRoot() { return this; } // Render in light DOM
  
  _renderNavItem(path, label) {
    console.log('renderNavItem');
    const isActive = this.currentRoute === path;
    return html`
      <a href="${path}" class="${isActive ? 'active' : ''}"
         @click=${e => this._onClickNavigation(e, path)}>${label}</a>
    `;
  }
  
  _onClickNavigation(e, path) {
    e.preventDefault();
    navigateTo(path);
  }
  
  render() {
    return html`
        <header>
            <top-bar></top-bar>
        </header>

        <nav>
            ${this._renderNavItem('/', 'Home')}
            ${this._renderNavItem('/login', 'Login')}
            ${this._renderNavItem('/games/quick-start', 'Quick Start')}
            ${this._renderNavItem('/test', 'Test WS Subscribe')}
            ${this._renderNavItem('/test/send', 'Test WS Publish')}
        </nav>

        <main>
            <router-outlet></router-outlet>
        </main>
    `;
  }
}

customElements.define('default-layout', DefaultLayout);