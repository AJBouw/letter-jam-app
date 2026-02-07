import { LitElement, html } from 'lit';
import { navigateTo, currentRoute } from './../../routing/current-route.js';

export class NavBarView extends LitElement {
  constructor() {
    super();
    this.currentRoute = currentRoute.value;
    this.themeService = null;
    
    this._subscription = currentRoute.subscribe((r) => {
      this.currentRoute = r;
    });
  }
  
  static properties = {
    themeService: { type: Object },
    currentRoute: { state: true }
  };
  
  // Render in light DOM (Bootstrap style)
  createRenderRoot() { return this; }
  
  _onNavigate(e, path) {
    e.preventDefault();
    navigateTo(path);
    this.currentRoute = path;
  }
  
  _navItem(path, label, color) {
    const isActive = this.currentRoute === path; // will now update properly
    return html`
      <li class="nav-item">
        <a
          href=${path}
          class="nav-link ${isActive ? 'active' : ''}"
          style="
            color: ${color};
            border-bottom: ${isActive ? '2px solid var(--bs-body-color)' : '2px solid transparent'};
            padding-bottom: 0.25rem;
          "
          @click=${e => this._onNavigate(e, path)}
          >
            ${label}
          </a>
      </li>
    `;
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribe?.();
  }
  
  render() {
    const isDark = this.themeService?.isDark;
    const linkColor = isDark ? 'var(--color-on-surface)' : 'var(--color-on-background)';
    
    return html`
      <div class="container py-2">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          ${this._navItem('/', 'Home', linkColor)}
          
          ${this._navItem('/games/quick-start', 'Quick Start', linkColor)}
          ${this._navItem('/test', 'Test WS Subscribe', linkColor)}
          ${this._navItem('/test/send', 'Test WS Publish', linkColor)}
        </ul>
      </div>
    `;
  }
}

customElements.define('nav-bar-view', NavBarView);