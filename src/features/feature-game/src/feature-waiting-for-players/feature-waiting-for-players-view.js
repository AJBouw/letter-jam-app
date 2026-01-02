import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FeatureWaitingForPlayersViewModel } from './feature-waiting-for-players-view-model.js';
import { FeatureWaitingForPlayersViewStyles } from './feature-waiting-for-players-view.styles.js';
import { effect } from "@preact/signals";

export class FeatureWaitingForPlayersView extends ScopedElementsMixin(LitElement) {
  static properties = {
    sharedGameSession: { type: Object },
    wsService: { type: Object },
    connectivityService: { type: Object}
  };
  
  static styles = [ FeatureWaitingForPlayersViewStyles ];
  
  disconnectedCallback() {
    this._signalEffect?.();
    this.vm?.dispose?.();
    super.disconnectedCallback();
  }
  
  createRenderRoot() { return this; } // Render in light DOM
  
  // updated(changedProps) {
  //   if (!this.vm && this.sharedGameSession && this.wsService) {
  //     this.vm = new FeatureWaitingForPlayersViewModel(this.sharedGameSession, this.wsService, this.connectivityService);
  //     this.requestUpdate();
  //   }
  // }
  
  firstUpdated() {
    if (!this.vm && this.sharedGameSession && this.wsService) {
      // Assign VM first
      this.vm = new FeatureWaitingForPlayersViewModel(
        this.sharedGameSession,
        this.wsService,
        this.connectivityService
      );
      
      // Defer effect setup to next microtask
      Promise.resolve().then(() => {
        this._signalEffect = effect(() => {
          if (!this.vm) return;
          
          // Read signals to subscribe
          this.vm.playersList.value;
          this.vm.me.value;
          this.vm.markingReady?.value;
          this.vm.cancelling?.value;
          
          // Request re-render, but Lit will now consider it a new cycle
          this.requestUpdate();
        });
      });
    }
  }
  
  render() {
    console.debug('[feature-waiting-for-players-view] this.vm', this.vm);
    
    if (!this.sharedGameSession || !this.wsService || !this.vm) {
      return html`<div>Loading waiting for players…</div>`;
    }
    
    const session = this.vm?.sharedGameSession;
    
    const me = this.vm.me.value;
    console.debug('[feature-waiting-for-players-view] me: ', me);
    
    return html`
        <h3>Waiting for players</h3>

        <div>Game: ${session.gameUuid.value}</div>
        <div>
            Me: ${me.name} (${me.uuid})
        </div>
        <div>Language: ${session.language.value}</div>
        <div>Max players: ${session.maxPlayers.value}</div>
        <div>Private: ${session.private.value ? 'Yes' : 'No'}</div>
        <button
          class="btn btn-secondary"
          @click=${() => this.vm.cancelWaiting()}
          disabled=${this.vm.cancelling.value}
        >
            Cancel
        </button>
    `;
  }
}

customElements.define('feature-waiting-for-players-view', FeatureWaitingForPlayersView);