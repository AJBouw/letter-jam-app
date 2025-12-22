import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { SignalController } from '@letter-limbo/common';
import { LandingPageViewModel } from './landing-page-view-model.js';
import { LandingPageViewStyles } from './landing-page-view.styles.js';

export class LandingPageView extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.vm = new LandingPageViewModel();
    this._signals = null;
  }
  
  static styles = [ LandingPageViewStyles ];
  
  connectedCallback() {
    super.connectedCallback();
    
    this._signals = new SignalController(this, [
      this.vm.welcomeMessage,
      this.vm.featuredGames,
      this.vm.backendStatus,
      this.vm.backendError,
      this.vm.wsStatus
    ]);
    
    this.vm.start();
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this.vm.stop();
  }
  
  createRenderRoot() { return this; } // Render in light DOM
  
  render() {
    const { welcomeMessage, featuredGames, backendError } = this.vm;
    
    return html`
      <section class="high-lights">
        <h3>High Lights</h3>
        <p>
          Backend status:
          ${backendError.value
      ? html`<span class="error">❌ ${backendError.value}</span>`
      : html`<span class="ok">✅ Running</span>`}
        </p>
          <p>
            Realtime WS:
            ${this.vm.wsStatus.value === 'CONNECTED'
              ? html`<span class="ok">✅ Available</span>`
              : html`<span class="error">❌ Unavailable</span>`}
          </p>
      </section>

      <section class="home-landing">
        <h2>${welcomeMessage.value}</h2>

        <ul>
          ${featuredGames.value.map(game => html`
            <li @click=${() => this.vm.startGame(game.id)}>
              ${game.name}
            </li>
          `)}
        </ul>
      </section>
    `;
  }
}

customElements.define('landing-page-view', LandingPageView);