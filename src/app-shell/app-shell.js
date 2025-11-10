import { html, LitElement } from 'lit';
import { Router } from '@lit-labs/router';
import './components/default-layout.js';
import { FeatureHome } from './../features/feature-home/feature-home.js';
import { FeatureLogin } from "../features/feature-login/feature-login.js";
import { FeatureQuickStart } from "../features/feature-quick-start/feature-quick-start.js";

export class AppShell extends LitElement {
    constructor() {
        super();
        this.router = new Router(this, [
            { path: '/', render: () => html`<feature-home></feature-home>` },
            { path: '/login', render: () => html`<feature-login></feature-login>` },
            { path: '/quick-game', render: () => html`<feature-quick-start></feature-quick-start>` }
        ]);
    }

    render() {
        return html`
      <default-layout>
        <div slot="nav">
          <a href="/" @click="${e => this._onNav(e, '/')}">Home</a>
          <a href="/login" @click="${e => this._onNav(e, '/login')}">Login</a>
          <a href="/quick-game" @click="${e => this._onNav(e, '/quick-game')}">Quick Game</a>
        </div>

        <!-- Router outlet -->
        ${this.router.outlet()}
      </default-layout>
    `;
    }

    _onNav(event, path) {
        event.preventDefault();
        this.router.goto(path);
    }
}

customElements.define('app-shell', AppShell);