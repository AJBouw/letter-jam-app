import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { navigateTo } from '../../../app-shell/routing/current-route.js';
import { FeatureQuickGameViewModel } from './feature-quick-game-view-model.js';
import { FeatureQuickGameViewStyles } from './feature-quick-game-view.styles.js';
import { SignalController } from '@letter-limbo/common';
import { FeatureWaitingForPlayersView } from './../../feature-game/src/feature-waiting-for-players/feature-waiting-for-players-view.js';
import { FeatureReadyToStartView } from './../../feature-game/src/feature-ready-to-start/feature-ready-to-start-view.js';
import { FeaturePlayingView } from './../../feature-game/src/feature-playing/feature-playing-view.js';
import { effect } from "@preact/signals";

export class FeatureQuickGameView extends ScopedElementsMixin(LitElement) {
  static properties = {
    gameUuid: { type: String },
    subRoute: { type: String },
    sharedGameSession: { type: Object },
    wsService: { type: Object },
    connectivityService: { type: Object }
  }
  
  static scopedElements = {
    'feature-waiting-for-players-view': FeatureWaitingForPlayersView,
    'feature-ready-to-start-view': FeatureReadyToStartView,
    'feature-playing-view': FeaturePlayingView
  }
  
  static styles = [ FeatureQuickGameViewStyles ];
  
  connectedCallback() {
    super.connectedCallback();
    
    if (!this.sharedGameSession) {
      console.error('[FeatureQuickGameView] gameSession not provided!');
      return;
    }
    
    // Initialize VM with the shared session and imported wsService
    this.vm = new FeatureQuickGameViewModel(this.sharedGameSession, this.wsService, this.connectivityService);
    
    this.signals = new SignalController(this, [
      this.vm.loading,
      this.vm.screen,
      this.vm.canSubmit,
      this.vm.name,
      this.vm.email,
      this.vm.nameTouched,
      this.vm.emailTouched,
      this.vm.nameValidation,
      this.vm.emailValidation,
      this.vm.sharedGameSession.gameStatus,
      this.vm.sharedGameSession.playersList,
      this.vm.sharedGameSession.allPlayersReady,
      this.vm.sharedGameSession.thisPlayerIsReady,
      this.vm.sharedGameSession.activePlayerUuid,
      this.vm.sharedGameSession.activePlayerName,
      this.vm.sharedGameSession.opponents,
      this.vm.sharedGameSession.blocks
    ]);
    
    this.vm.start();
    
    // Reactive navigation
    effect(() => {
      if (this.vm.nextRoute.value) {
        navigateTo(this.vm.nextRoute.value);
        this.vm.nextRoute.value = null;
      }
    });
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this.vm.stop();
  }
  
  // createRenderRoot() { return this; } // Render in light DOM
  
  _renderForm() {
    console.debug('[feature-quick-game-view] this.vm: ', this.vm);
    console.log('canSubmit:', this.vm.canSubmit.value, 'loading:', this.vm.loading.value);
    return html`
      <div class="status-container">
        <div class="status-badge ${this.vm.connectivityService.backendOk.value ? 'ok' : 'error'}">
            Backend: ${this.vm.connectivityService.backendOk.value ? '✅ OK' : '❌ Down'}
        </div>
        <div class="status-badge ${this.vm.connectivityService.wsServerOk.value ? 'ok' : 'error'}">
            WS Server: ${this.vm.connectivityService.wsServerOk.value ? '✅ Connected' : '❌ Disconnected'}
        </div>
      </div>

      <form @submit=${async e => { e.preventDefault(); await this.vm.startQuickGame(); }} novalidate>
        <input type="text" placeholder="Name" .value=${this.vm.name.value}
         @input=${e => this.vm.name.value = e.target.value}
         @blur=${() => this.vm.markNameTouched()}/>
        ${!this.vm.nameValidation.value.valid && this.vm.nameTouched.value ? html`<div class="error">${this.vm.nameValidation.value.reason}</div>` : null}

        <input type="email" placeholder="Email" .value=${this.vm.email.value}
         @input=${e => this.vm.email.value = e.target.value}
         @blur=${() => this.vm.markEmailTouched()}/>
        ${!this.vm.emailValidation.value.valid && this.vm.emailTouched.value ? html`<div class="error">${this.vm.emailValidation.value.reason}</div>` : null}

        <select .value=${this.vm.language.value} @change=${e => this.vm.language.value = e.target.value}>
          <option value="en">English</option>
          <option value="nl">Nederlands</option>
        </select>

        <button type="submit" ?disabled=${!this.vm.canSubmit.value || this.vm.loading.value}>
          ${this.vm.loading.value ? 'Loading…' : 'Quick Start'}
        </button>
      </form>
    `;
  }
  
  _renderNested() {
    if (!this.vm || !this.vm.sharedGameSession || !this.vm.sharedGameSession.playersList.value) {
      return html`<div class="loading-spinner">Loading…</div>`;
    }
    
    console.debug('[feature-quick-game-view] screen: ', this.vm.screen.value);
    
    switch (this.vm.screen.value) {
      case 'FORM': return this._renderForm();
      case 'WAITING':
        console.debug('[feature-quick-game-view] screen: feature-waiting-for-players-view')
        return html`
          <feature-waiting-for-players-view
            .session=${this.vm.sharedGameSession}
            .wsService=${this.wsService}
          ></feature-waiting-for-players-view>
        `;
      case 'READY':
        console.debug('[feature-quick-game-view] screen: feature-ready-to-start-view')
        return html`
          <feature-ready-to-start-view
            .session=${this.vm.sharedGameSession}
          ></feature-ready-to-start-view>
        `;
      case 'PLAYING':
        console.debug('[feature-quick-game-view] screen: feature-playing-view')
        return html`
          <feature-playing-view
            .session=${this.vm.sharedGameSession}
          ></feature-playing-view>
        `;
      case 'FINISHED':
        console.debug('[feature-quick-game-view] screen: Finished')
        return html`
          <h2>Game Finished</h2>
        `;
      default:
        console.debug('[feature-quick-game-view] screen: default')
        return this._renderForm();
    }
  }
  
  render() {
    return html`${this._renderNested()}`;
  }
}

customElements.define('feature-quick-game-view', FeatureQuickGameView);