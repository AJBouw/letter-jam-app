import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { backendService, GameSession, SignalController, wsService } from '@letter-limbo/common';
import { LandingPageViewModel } from './landing-page-view-model.js';
import { LandingPageViewStyles } from './landing-page-view.styles.js';

export class LandingPageView extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.vm = new LandingPageViewModel(backendService, GameSession, wsService);
    this._signals = null;
  }
  
  static styles = [ LandingPageViewStyles ];
  
  connectedCallback() {
    super.connectedCallback();
    this._signals = new SignalController(this, [
      this.vm.welcomeMessage,
      this.vm.loading,
      this.vm.canSubmit,
      this.vm.connectivityService.backendOk,
      this.vm.connectivityService.wsServerOk
    ]);
    this.vm.start();
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this.vm.stop();
  }
  
  createRenderRoot() { return this; } // Render in light DOM
  
  render() {
    return html`
      <section class="high-lights">
        <h3>High Lights</h3>
        <div class="status-badge ${this.vm.connectivityService.backendOk.value ? 'ok' : 'error'}">
            Backend: ${this.vm.connectivityService.backendOk.value ? '✅ OK' : '❌ Down'}
        </div>
        <div class="status-badge ${this.vm.connectivityService.wsServerOk.value ? 'ok' : 'error'}">
            WS Server: ${this.vm.connectivityService.wsServerOk.value ? '✅ Connected' : '❌ Disconnected'}
        </div>
      </section>

      <section class="home-landing">
        <h2>${this.vm.welcomeMessage.value}</h2>

        ${this.vm.loading.value
          ? html`<div class="loading-spinner">Loading…</div>`
          : html`
            <ul>
              ${this.vm.featuredGames.value.map(game => html`
                <li
                  class="${!this.vm.canSubmit.value ? 'disabled' : ''}"
                  @click=${() => this.vm.startGame(game.id)}>
                  ${game.name}
                </li>
              `)}
            </ul>
          `}
      </section>
    `;
  }
}

customElements.define('landing-page-view', LandingPageView);