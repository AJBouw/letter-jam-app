import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { navigateTo } from '../../../app-shell/routing/current-route.js';
import { FeatureHomeViewStyles } from './feature-home-view.styles.js';
import { featureHomeService } from './feature-home-service.js'
import { SignalController} from './../../../../packages/common/lit/signal-controller.js';

export class FeatureHomeView extends ScopedElementsMixin(LitElement) {
  static scopedElements = {};
  static styles = [FeatureHomeViewStyles];
  
  constructor() {
    super();
    this.service = featureHomeService; // use singleton
    
    // Create reactive controller
    this._signals = new SignalController(this, [
      this.service.welcomeMessage,
      this.service.featuredGames,
      this.service.loading,
      this.service.backendError
    ]);
  }
  
  startGame(gameId) {
    switch(gameId) {
      case 1:
        navigateTo('/quick-game');
        break;
      case 2:
        navigateTo('/challenge-mode');
        break;
      case 3:
        navigateTo('/multiplayer-tournament');
        break;
      default:
        console.warn('Unknown game id', gameId);
    }
  }
  
  connectedCallback() {
    super.connectedCallback();
    // Fetch data only when component is mounted
    (async () => {
      await this.service.fetchLandingData();
    })();  }
  
  createRenderRoot() {
    return this; // render in light DOM
  }
  
  render() {
    const { welcomeMessage, featuredGames, loading, backendError } = this.service;
    
    return html`
      <section class="home-landing">
        <h2>${welcomeMessage.value}</h2>

        ${loading.value ? html`<p>Loading...</p>` : null}
        ${backendError.value ? html`<div class="error">${backendError.value}</div>` : null}

        <ul>
          ${featuredGames.value.map(game => html`
            <li @click=${() => this.startGame(game.id)} style="cursor:pointer;">
              ${game.name}
            </li>
          `)}
        </ul>
      </section>
    `;
  }
}

customElements.define('feature-home-view', FeatureHomeView);