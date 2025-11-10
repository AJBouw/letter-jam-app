import { html, LitElement } from 'lit';
import './components/default-layout.js';
import { Renderer } from './renderer.js';
import { FeatureHome } from './../features/feature-home/feature-home.js';
import { FeatureLogin } from '../features/feature-login/feature-login.js';
import { FeatureQuickStart } from '../features/feature-quick-start/feature-quick-start.js';

export class AppShell extends LitElement {
    constructor() {
        super();
        this.currentRoute = '/';
        this.renderer = null;

        window.addEventListener('popstate', () => {
            this.currentRoute = window.location.pathname;
            this.requestUpdate();
        });
    }

    firstUpdated() {
        const container = this.renderRoot.querySelector('#feature-container');
        console.log('Feature container:', container);
        this.renderer = new Renderer(container);

        this._renderRoute(this.currentRoute);
    }

    updated(changedProps) {
        if (changedProps.has('currentRoute')) {
            this._renderRoute(this.currentRoute);
        }
    }

    navigate(path) {
        history.pushState(null, '', path);
        this.currentRoute = path;
        this.requestUpdate();
    }

    render() {
        return html`
          <default-layout>
            <div slot="nav">
              <a href="/" class="${this.currentRoute === '/' ? 'active' : ''}"
                 @click="${e => this._onNav(e, '/')}">Home</a>
              <a href="/login" class="${this.currentRoute === '/login' ? 'active' : ''}"
                 @click="${e => this._onNav(e, '/login')}">Login</a>
              <a href="/quick-game" class="${this.currentRoute === '/quick-game' ? 'active' : ''}"
                 @click="${e => this._onNav(e, '/quick-game')}">Quick Game</a>
            </div>
            <div id="feature-container"></div>
          </default-layout>
        `;
    }

    _onNav(event, path) {
        event.preventDefault();
        this.navigate(path);
    }

    async _renderRoute(route) {
        if (!this.renderer) return;

        console.log('Rendering route:', route);

        switch(route) {
            case '/login':
                await this.renderer.loadFeatures(['feature-login']);
                break;
            case '/quick-game':
                await this.renderer.loadFeatures(['feature-quick-start']);
                break;
            default: // '/'
                await this.renderer.loadFeatures(['feature-home', 'feature-quick-start']);
        }
    }
}

customElements.define('app-shell', AppShell);
customElements.define('feature-home', FeatureHome);
customElements.define('feature-quick-start', FeatureQuickStart);
customElements.define('feature-login', FeatureLogin);