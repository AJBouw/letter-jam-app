import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FeatureWaitingForPlayersViewModel } from './feature-waiting-for-players-view-model.js';
import { FeatureWaitingForPlayersViewStyles } from './feature-waiting-for-players-view.styles.js';

export class FeatureWaitingForPlayersView extends ScopedElementsMixin(LitElement) {
  static properties = {
    session: { type: Object },
    wsService: { type: Object }
  };
  
  static styles = [ FeatureWaitingForPlayersViewStyles ];
  
  disconnectedCallback() {
    this.vm?.dispose();
    super.disconnectedCallback();
  }
  
  createRenderRoot() { return this; } // Render in light DOM
  
  updated(changedProps) {
    if (!this.vm && this.session && this.wsService) {
      this.vm = new FeatureWaitingForPlayersViewModel(this.session, this.wsService);
      this.requestUpdate();
    }
  }
  
  render() {
    if (!this.session || !this.wsService) {
      return html`<div>Loading…</div>`;
    }
    
    const { gameUuid, language, maxPlayers, private: isPrivate, playersList, currentPlayer } = this.session;
    
    if (!gameUuid?.value || !playersList?.value || !currentPlayer?.value) {
      return html`<div>Loading game…</div>`;
    }
    
    return html`
        <h3>Waiting for players</h3>

        <div>Game: ${gameUuid.value}</div>
        <div>
            Me: ${currentPlayer.value.name}
                (${currentPlayer.value.uuid})
        </div>
        <div>Language: ${language.value}</div>
        <div>Max players: ${maxPlayers.value}</div>
        <div>Private: ${isPrivate.value ? 'Yes' : 'No'}</div>

        <ul>
            ${playersList.value.map(p => html`
                <li>
                    ${p.name} (${p.uuid})
                    ${p.readyToStart ? '✅ Ready' : '⏳ Not Ready'}
                </li>
            `)}
        </ul>
    `;
  }
}

customElements.define('feature-waiting-for-players-view', FeatureWaitingForPlayersView);