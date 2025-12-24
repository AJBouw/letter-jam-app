import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FeatureReadyToStartViewModel } from './feature-ready-to-start-view-model.js';

export class FeatureReadyToStartView extends ScopedElementsMixin(LitElement) {
  static properties = {
    session: { type: Object },
    wsService: { type: Object }
  };
  
  disconnectedCallback() {
    this.vm?.dispose();
    super.disconnectedCallback();
  }
  
  createRenderRoot() { return this; } // Render in light DOM
  
  updated(changedProps) {
    if (!this.vm && this.session && this.wsService) {
      this.vm = new FeatureReadyToStartViewModel(this.session, this.wsService);
      this.requestUpdate();
    }
  }
  
  render() {
    if (!this.vm || !this.session?.currentPlayer?.value || !this.session?.playersList?.value) {
      return html`<div>Loading…</div>`;
    }
    
    const me = this.session.currentPlayer.value;
    const opponent = this.session.playersList.value.find(p => p.uuid !== me.uuid);
    const currentPlayer = this.session.currentPlayer.value;
    
    return html`
      <h3>Ready to start (Game: ${this.session.gameUuid.value})</h3>
      <div>Me: ${me.name ?? 'N/A'} (${me.uuid ?? 'N/A'})</div>
      <div>Opponent: ${opponent.name ?? 'N/A'} (${opponent.uuid ?? 'N/A'})</div>
      <div>Current Player: ${currentPlayer?.name || 'N/A'}</div>
      <button
        @click=${() => this.vm.markReady()}
        ?disabled=${me.readyToStart}>
        Ready to Start
      </button>
    `;
  }
}

customElements.define('feature-ready-to-start-view', FeatureReadyToStartView);