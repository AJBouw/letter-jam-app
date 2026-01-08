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
      
      // Defer effect setup to next microtask
      Promise.resolve().then(() => {
        this._signalEffect = effect(() => {
          if (!this.vm) return;
          
          // Access signals to subscribe for reactivity
          this.vm.players.value;
          this.vm.blocks.value;
          this.vm.guessInput.value;
          this.vm.isActivePlayer.value;
          
          // Request Lit re-render in a safe async cycle
          this.requestUpdate();
        });
      });
    }
  }
  
  render() {
    if (!this.vm) return html`<div>Loading…</div>`;
    
    const me = this.vm.me.value;
    const opponent = this.vm.opponent.value;
    if (!me || !opponent) return html`<div>Waiting for players…</div>`;
    
    const wordLength = this.vm.blocks.value.length;
    const maxGuesses = 5;
    const guesses = this.vm.guesses.value;
    const currentInput = this.vm.guessInput.value;
    
    const isActive = this.vm.isActivePlayer.value;
    
    // Prepare 5 rows
    const rows = Array.from({ length: maxGuesses }, (_, rowIndex) => {
      if (rowIndex < guesses.length) {
        // Completed guess: show only guessed letters
        const guess = guesses[rowIndex];
        return Array.from({ length: wordLength }, (_, i) => guess[i] ?? '_');
      } else if (rowIndex === guesses.length) {
        // Active row: show typed letters + underscores
        return Array.from({ length: wordLength }, (_, i) => {
          if (rowIndex === 0 && i === 0) {
            // First row, first letter is always revealed
            return this.vm.blocks.value[0] ?? '_';
          }
          return currentInput[i] ?? '_';
        });
      } else {
        // Future rows: empty
        return Array.from({ length: wordLength }, () => '');
      }
    });
    
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
          <div class="grid" style="
            grid-template-rows: repeat(${maxGuesses}, 50px);
            grid-template-columns: repeat(${wordLength}, 50px);
          ">
            ${rows.map((row, rowIndex) => row.map(letter => html`
              <div class="cell ${letter !== '_' && letter !== '' ? 'revealed' : ''}">
                ${letter || ''}
              </div>
            `))}
          </div>

            <!-- Input + button -->
            <div class="guess-container" style="margin-top: 10px; display: flex; gap: 5px;">
              <input
                class="guess-input"
                type="text"
                maxlength="${wordLength}"
                .value=${currentInput}
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