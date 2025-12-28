import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FeatureReadyToStartViewModel } from './feature-ready-to-start-view-model.js';

export class FeatureReadyToStartView extends ScopedElementsMixin(LitElement) {
  static properties = {
    session: { type: Object },
    wsService: { type: Object }
  };
  
  static styles = [ ];
  
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
    console.log('[feature-ready-to-start-view] this.vm', this.vm);
    
    if (!this.session || !this.wsService || !this.vm) {
      return html`<div>Loading ready to start…</div>`;
    }
    const me = this.vm.me.value;
    const opponent = this.vm.opponent.value;
    console.log('[feature-ready-to-start-view] me: ', me);
    console.log('[feature-ready-to-start-view] me.name: ', me.name);
    console.log('[feature-ready-to-start-view] opponent: ', opponent);
    console.log('[feature-ready-to-start-view] opponent.name: ', opponent.name);
    
    
    console.debug('[feature-waiting-for-players-view] me: ', me);
    
    if (!this.vm || !this.session) {
      return html`<div>Loading ready to start…</div>`;
    }
    
    return html`
      <section>
        <h3>Ready to Start</h3>
        <p class="hint">
          The game will start automatically when both players are ready.
        </p>
          ${!me
            ? html`<p>Loading player…</p>`
            : html`<p>You: ${me.name}</p>`}

        ${!opponent
          ? html`
              <p class="muted">Loading opponent…</p>
            `
          : html`
              <p>Opponent: ${opponent.name}</p>
            `}
          <p>All players ready? ${this.session.allPlayersReady.value ? '✅' : '⏳'}</p>
          <p>Starting player: ${this.vm.activePlayerName.value}</p>
        <div class="actions">
          <button
            @click=${() => this.vm.markReady()}
            ?disabled=${this.vm.thisPlayerIsReady.value}
          >
            Ready
          </button>
          <button
            class="btn btn-secondary"
            @click=${() => this.vm.leaveGame()}
            disabled=${this.vm.leavingGame.value}
          >
          Leave Game
          </button>
        </div>
      </section>
    `;
  }
}

customElements.define('feature-ready-to-start-view', FeatureReadyToStartView);