import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FeatureReadyToStartViewModel } from './feature-ready-to-start-view-model.js';
import { effect } from "@preact/signals";

export class FeatureReadyToStartView extends ScopedElementsMixin(LitElement) {
  static properties = {
    sharedGameSession: { type: Object },
    wsService: { type: Object },
    connectivityService: { type: Object}
  };
  
  static styles = [ ];
  
  disconnectedCallback() {
    this._signalEffect?.()
    super.disconnectedCallback();
  }
  
  createRenderRoot() { return this; } // Render in light DOM
  
  updated(changedProps) {
    if (!this.vm && this.sharedGameSession && this.wsService) {
      this.vm = new FeatureReadyToStartViewModel(
        this.sharedGameSession,
        this.wsService,
        this.connectivityService
      );
      
      // Create effect ONCE
      this._signalEffect = effect(() => {
        this.vm.playersList.value;
        this.vm.thisPlayerIsReady.value;
        this.vm.markingReady.value;
        this.vm.activePlayerName.value;
        this.vm.leavingGame.value;
        
        // Trigger Lit re-render
        this.requestUpdate();
      });
    }
  }
  
  render() {
    if (!this.vm || !this.vm.playersList.value.length) {
      console.debug('[feature-ready-to-start-view] No vm or player list');
      return html`<div>Loading…</div>`;
    }
    
    const me = this.vm.me.value;
    const opponent = this.vm.opponent.value;
    const disabled =
      this.vm.thisPlayerIsReady.value ||
      this.vm.markingReady.value ||
      this.connectivityService?.wsServerOk?.value === false;
    
    return html`
      <section>
        <h3>Ready to Start</h3>
        <p>The game will start automatically when both players are ready.</p>

        <div>
          <p>You: ${me.name} ${me.isReadyToStart ? '✅ Ready' : '⏳'}</p>
          <p>Opponent: ${opponent.name} ${opponent.isReadyToStart ? '✅' : '⏳'}</p>
            <ul>
              ${this.vm.playersList.value.map(p => html`
                <li>
                  ${p.name}
                  ${p.isReadyToStart ? '✅ Ready' : '⏳ Waiting'}
                </li>
              `)}
            </ul>
          <p>Starting player: ${this.vm.activePlayerName.value}</p>
        </div>

          <button
            @click=${() => this.vm.markReady()}
            ?disabled=${disabled}
          >
            ${this.vm.thisPlayerIsReady.value
              ? 'Waiting for opponent…'
              : this.vm.markingReady.value
                ? 'Setting ready…'
                : 'Ready'}
          </button>
        <button
          class="btn btn-secondary"
          @click=${() => this.vm.leaveGame()}
          ?disabled=${this.vm.leavingGame.value}>
          Leave Game
        </button>
      </section>
    `;
  }
}
customElements.define('feature-ready-to-start-view', FeatureReadyToStartView);