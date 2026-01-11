import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { effect } from "@preact/signals";
import { FeaturePlayingViewModel } from './feature-playing-view-model.js';
import { FeaturePlayingViewStyles } from './feature-playing-view.styles.js';

export class FeaturePlayingView extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.vm = undefined;
    this._signalEffect = undefined;
  }
  
  static properties = {
    sharedGameSession: { type: Object },
    wsService: { type: Object },
    connectivityService: { type: Object}
  };
  
  static styles = [ FeaturePlayingViewStyles ];
  
  disconnectedCallback() {
    console.debug('[FeaturePlayingView] disconnected');
    
    this._signalEffect?.();
    this._readyCheckEffect?.();
    super.disconnectedCallback();
  }
  
  firstUpdated() {
    console.debug('[FeatureReadyToStartView] firstUpdated called:', {
      sharedGameSession: this.sharedGameSession,
      wsService: this.wsService,
      connectivityService: this.connectivityService
    });
    
    // Ensure all mandatory props exist
    if (!this.sharedGameSession || !this.wsService || !this.connectivityService) {
      console.error('[FeaturePlayingView] Missing required dependencies!');
      return;
    }
    
    if (!this.vm) {
      this.vm = new FeaturePlayingViewModel(
        this.sharedGameSession,
        this.wsService,
        this.connectivityService);
      console.debug('[feature-playing-view] VM initialized: ', this.vm);
      
      this._readyCheckEffect = effect(() => {
        console.debug('[READY CHECK]', {
          gameUuid: this.sharedGameSession.gameUuid.value,
          roundUuid: this.sharedGameSession.roundUuid.value,
          playerUuid: this.sharedGameSession.playerUuid.value
        });
      });
      
      
      // Defer effect setup to next microtask
      Promise.resolve().then(() => {
        this._signalEffect = effect(() => {
          if (!this.vm) return;
          
          // Access signals to subscribe for reactivity
          this.vm.me.value;
          this.vm.opponent.value;
          this.vm.boardRows.value;
          this.vm.isActivePlayer.value;
          this.vm.roundNumber.value;
          this.vm.guessInput.value;
          
          // Request Lit re-render in a safe async cycle
          this.requestUpdate();
        });
      });
    }
  }
  
  render() {
    if (!this.vm) {
      return html`<div>Loading…</div>`;
    }
    
    const me = this.vm.me.value;
    const opponent = this.vm.opponent.value;
    
    if (!me || !opponent) {
      return html`<div>Waiting for players…</div>`;
    }
    
    const rows = this.vm.boardRows.value ?? [];
    const columns = rows[0]?.length ?? 0;
    const isActive = this.vm.isActivePlayer.value;
    const canSubmit = this.vm.canSubmitGuess.value;
    const isRoundFinished = this.vm.isRoundFinished.value;
    
    return html`
      <div class="playing-container">
        <!-- Left player -->
        <div class="player-info left">
          <div class="player-name">${me.name}</div>
          <div class="player-score">Score: ${me.score}</div>
        </div>
      
        <!-- Board -->
        <div class="board">
          <div class="round-indicator">Round ${this.vm.roundNumber.value ?? '…'}</div>
    
          <!-- Grid: 5 rows *N columns -->
          <div class="grid"
           style="
            grid-template-rows: repeat(${rows.length}, 50px);
            grid-template-columns: repeat(${columns}, 50px);
          ">
              ${rows.map(row =>
                      row.map(cell => html`
                          <div class="cell ${cell.status !== 'EMPTY' ? 'revealed' : ''}">
                              ${cell.letter}
                          </div>
                      `)
              )}
          </div>
    
          <!-- Input + button -->
          <div class="guess-container">
            <input
              class="guess-input"
              type="text"
              maxlength="${columns}"
              .value=${this.vm.guessInput.value}
              ?disabled=${!isActive}
              @input=${e => this.vm.updateGuess(e.target.value)}
              @keydown=${e => e.key === 'Enter' && this.vm.submitGuess()}
              placeholder="Type your guess"
            />
            <button
              class="btn btn-primary"
              ?disabled=${!isActive}
              @click=${() => this.vm.submitGuess()}
              style="padding:6px 12px;"
            >
              Guess
            </button>
          </div>
          
          <!-- Message feedback -->
          <div class="submit-message">
              ${this.vm.submitMessage.value}
          </div>

          <!-- Winner message -->
          ${isRoundFinished ? html`
            <div class="winner-message">
              Winner: ${this.vm.winningPlayerUuid.value === me.uuid ? 'You!' : opponent.name}
            </div>
          ` : ''}
        </div>
      
        <!-- Right player -->
        <div class="player-info right">
            <div class="player-name">${opponent.name}</div>
            <div class="player-score">Score: ${opponent.score}</div>
        </div>
      </div>
    `;
  }
}

customElements.define('feature-playing-view', FeaturePlayingView);