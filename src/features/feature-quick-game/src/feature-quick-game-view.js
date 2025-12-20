import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { signal } from '@preact/signals';
import { currentRoute } from '../../../app-shell/routing/current-route.js';
import { createGameWebSocket, sendGameMessage } from '@letter-limbo/common';
import { fromUrlSegment } from '../../converters/url-segment-converter.js';
import { FeatureQuickGameViewModel } from './feature-quick-game-view-model.js';
import { FeatureQuickGameViewStyles } from './feature-quick-game-view.styles.js';
import { SignalController } from '@letter-limbo/common'
import { FeatureWaitingForPlayersView } from './../../feature-game/src/feature-waiting-for-players/feature-waiting-for-players-view.js';
import { FeatureReadyToStartView } from './../../feature-game/src/feature-ready-to-start/feature-ready-to-start-view.js';
import { FeaturePlayingView } from './../../feature-game/src/feature-playing/feature-playing-view.js';

export class FeatureQuickGameView extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.vm = new FeatureQuickGameViewModel();
    
    this.blocks = [];
    this.currentGuess = '';
    this.currentPlayer = null;
    this.gameUuid = 'hardcoded-uuid-for-test';
    this.playerUuid = crypto.randomUUID();
    this.players = [];
    
    this.client = null;
    
    // Track route + params via signals
    this.routeParams = signal({
      uuid: null,
      gameStatus: null,
      urlSegment: null
    });
  }
  
  static properties = {
    blocks: { state: true },
    currentGuess: { state: true },
    currentPlayer: { state: true },
    gameUuid: { state: true },
    playerUuid: { state: true },
    players: { state: true },
    
    routePath: { type: String }
  };
  
  static scopedElements = {
    'feature-waiting-for-players-view': FeatureWaitingForPlayersView,
    'feature-ready-to-start-view': FeatureReadyToStartView,
    'feature-playing-view': FeaturePlayingView
  }
  
  static styles = [ FeatureQuickGameViewStyles ];
  
  connectedCallback() {
    super.connectedCallback();
    
    currentRoute.subscribe(path => {
      this.routePath = path; // triggers updated()
    });
    
    // Watch all relevant signals
    this._signalController = new SignalController(this, [
      this.vm.name,
      this.vm.email,
      this.vm.language,
      this.vm.nameTouched,
      this.vm.emailTouched,
      this.vm.nameValidator,
      this.vm.emailValidator,
      this.vm.canSubmit,
      this.vm.loading,
      this.vm.backendError,
      this.routeParams
    ]);
    
    this._parseRouteParams();
    
    // Connect WS
    this.client = createGameWebSocket(this.gameUuid, this._onGameMessage.bind(this));
    
    // Second player joins the game
    sendGameMessage(this.client, '/app/game/join', {
      gameUuid: this.gameUuid,
      playerUuid: this.playerUuid,
      playerName: 'Player-' + this.playerUuid.slice(0, 4)
    });
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this._signalController.disconnect();
  }
  
  updated(changedProps) {
    if (changedProps.has('routePath')) {
      console.log('[FeatureQuickGameView] routePath changed:', this.routePath);
      this._parseRouteParams();
    }
  }
  
  _onGameMessage(msg) {
    console.log('Received from backend:', msg);
    if (msg.players) this.players = msg.players;
    if (msg.gameStatus) this.routeParams.value.urlSegment = msg.gameStatus;
    if (msg.currentPlayer) this.currentPlayer = msg.currentPlayer;
    if (msg.blocks) this.blocks = msg.blocks;
  }
  
  _parseRouteParams() {
    if (!this.routePath) return;
    
    const parts = this.routePath.split('/').filter(Boolean);
    const uuid = parts[2] || null;
    const urlSegment = parts[3] || null;
    const gameStatus = urlSegment ? fromUrlSegment(urlSegment) : null;
    
    // Update the signal's value instead of replacing the signal
    this.routeParams.value = { uuid, gameStatus, urlSegment };
    console.log('[FeatureQuickGameView] routeParams.value set:', this.routeParams.value);
  }
  
  _renderForm() {
    const vm = this.vm;
    
    return html`
        <form @submit=${async e => { e.preventDefault(); await vm.quickStart(); }} novalidate>
            <input type="text" placeholder="Name" .value=${vm.name.value}
                   @input=${e => vm.name.value = e.target.value}
                   @blur=${() => vm.markNameTouched()} />
            ${!vm.nameValidator.value.valid && vm.nameTouched.value
                    ? html`<div class="error">${vm.nameValidator.value.reason}</div>` : null
            }

            <input type="email" placeholder="Email" .value=${vm.email.value}
                   @input=${e => vm.email.value = e.target.value}
                   @blur=${() => vm.markEmailTouched()} />
            ${!vm.emailValidator.value.valid && vm.emailTouched.value
                    ? html`<div class="error">${vm.emailValidator.value.reason}</div>` : null
            }

            <select .value=${vm.language.value} @change=${e => vm.language.value = e.target.value}>
                <option value="en">English</option>
                <option value="nl">Nederlands</option>
            </select>

            <button type="submit" ?disabled=${!vm.canSubmit.value || vm.loading.value}>
                ${vm.loading.value ? 'Loading…' : 'Quick Start'}
            </button>

            ${vm.backendError.value
                    ? html`<div class="backend-error">${vm.backendError.value}</div>` : null
            }
        </form>
    `;
  }
  /** For testing purpose */
  _renderNested() {
    const { uuid, urlSegment } = this.routeParams.value;
    
    if (!uuid) return this._renderForm();
    
    // 🔹 Fixed mock data
    const mockPlayers = [
      { playerUuid: 'p1', playerName: 'Alice' },
      { playerUuid: 'p2', playerName: 'Bob' }
    ];
    
    const mockCurrentPlayer = 'Alice';
    
    const mockBlocks = ['L', '_', '_', '_', '_'];
    
    switch (urlSegment) {
      case 'waiting-for-players':
        return html`
        <feature-waiting-for-players-view
          .uuid=${uuid}
          .players=${mockPlayers}
        ></feature-waiting-for-players-view>
      `;
      
      case 'ready-to-start':
        return html`
        <feature-ready-to-start-view
          .uuid=${uuid}
          .players=${mockPlayers}
        ></feature-ready-to-start-view>
      `;
      
      case 'playing':
        return html`
        <feature-playing-view
          .uuid=${uuid}
          .players=${mockPlayers}
          .currentPlayer=${mockCurrentPlayer}
          .blocks=${mockBlocks}
        ></feature-playing-view>
      `;
      
      default:
        return html`<h2>Invalid game state</h2>`;
    }
  }
  
  // Replace for full UI <-> API interaction
  // _renderNested() {
  //   const { uuid, gameStatus, urlSegment } = this.routeParams.value;
  //   console.info('renderNested uuid: {}', uuid);
  //   console.debug('renderNested urlSegment', urlSegment);
  //
  //   if (!uuid) return this._renderForm();
  //
  //   switch (urlSegment) {
  //     case 'waiting-for-players':
  //       return html`<feature-waiting-for-players-view .uuid=${uuid}></feature-waiting-for-players-view>`;
  //     case 'ready-to-start':
  //       return html`<feature-ready-to-start-view .uuid=${uuid}></feature-ready-to-start-view>`;
  //     case 'playing':
  //       return html`<feature-playing-view .uuid=${uuid}></feature-playing-view>`;
  //     default:
  //       return html`<h2>Invalid game state</h2>`;
  //   }
  // }
  
  render() {
    return html`${this._renderNested()}`;
  }
}


customElements.define('feature-quick-game-view', FeatureQuickGameView)