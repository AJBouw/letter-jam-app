import { LitElement, html } from 'lit';
import { currentRoute } from './current-route.js';
import { resolveRoute } from './resolve-route.js';

/**
 * Eliminates the need for .key=${path} hacks in AppShell
 */
class RouterOutlet extends LitElement {
  static properties = {
    currentRoute: { state: true }
  };
  
  constructor() {
    super();
    this.currentRoute = currentRoute.value;
  }
  
  connectedCallback() {
    super.connectedCallback();
    currentRoute.subscribe(route => {
      this.currentRoute = route; // triggers re-render
    });
  }
  
  createRenderRoot() {
    return this; // Render in light DOM so layout styles work
  }
  
  // This is the "renderRoute" function
  _renderRoute() {
    if (!this.currentRoute) return html`Loading...`;
    return html`${resolveRoute(this.currentRoute)}`;
  }
  
  render() {
    return html`
      <main>
        ${this._renderRoute()}
      </main>
    `;
  }
}


customElements.define('router-outlet', RouterOutlet);