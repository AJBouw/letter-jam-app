import { html, LitElement } from 'lit';
import { currentRoute, navigateTo } from './routing/current-route.js';
import './routing/router-outlet.js';
import './components/default-layout.js';

export class AppShell extends LitElement {
    render() {
        const path = currentRoute.value;

        return html`
            <default-layout>
                <div slot="nav">
                    <a href="/" class="${path === '/' ? 'active' : ''}" @click=${e => this._onNav(e, '/')}>Home</a>
                    <a href="/login" class="${path === '/login' ? 'active' : ''}" @click=${e => this._onNav(e, '/login')}>Login</a>
                    <a href="/quick-game" class="${path === '/quick-game' ? 'active' : ''}" @click=${e => this._onNav(e, '/quick-game')}>Quick Game</a>
                </div>

                <router-outlet></router-outlet>
            </default-layout>
        `;
    }

    _onNav(event, path) {
        event.preventDefault();
        navigateTo(path);
    }
}

customElements.define('app-shell', AppShell);