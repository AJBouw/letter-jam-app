import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FeatureWaitingForPlayersViewModel } from './feature-waiting-for-players-view-model.js';
import { SignalController } from './../../../../../packages/common/lit/signal-controller.js'
import { FeatureWaitingForPlayersViewStyles } from './feature-waiting-for-players-view.styles.js';

export class FeatureWaitingForPlayersView extends ScopedElementsMixin(LitElement) {
  static properties = { uuid: { type: String }}
  
  constructor() {
    super();
    // this.uuid = '';
    // this.vm = null;
  }
  
  static scopedElements = {};
  static styles = [ FeatureWaitingForPlayersViewStyles ];
  
  connectedCallback() {
    super.connectedCallback();
    console.log('Game UUID from route:', this.uuid);
    
    if (!this.vm && this.uuid) {
      this.vm = new FeatureWaitingForPlayersViewModel(this.uuid);
      
      this._signals = new SignalController(this, [
        this.vm.playersList,
        this.vm.maxPlayers,
        this.vm.gameStatus,
        this.vm.canStart
      ]);
    }
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this.vm.disconnect();
  }
  
  createRenderRoot() {
    return this; // light DOM
  }
  
  render() {
    const { playersList, maxPlayers, gameStatus, canStart } = this.vm;
    
    return html`
      <section class="waiting-players">
        <h2>Game Status: ${gameStatus.value}</h2>

        <p>Waiting for players... (${playersList.value.length} / ${maxPlayers.value})</p>

        <ul>
          ${playersList.value.map(p => html`<li>${p.playerNumber}. ${p.name} (Score: ${p.score})</li>`)}
        </ul>

        <button ?disabled=${!canStart.value}>Start Game</button>
        <button @click=${() => this.vm.cancelWaiting()}>Cancel</button>
      </section>
    `;
  }
}

customElements.define('feature-waiting-for-players-view', FeatureWaitingForPlayersView);