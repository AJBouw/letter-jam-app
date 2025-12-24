import { LitElement, html } from 'lit';
import { effect } from '@preact/signals';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { GameSession,  webSocketService } from '@letter-limbo/common';
import { navigateTo } from '../../../app-shell/routing/current-route.js';
import { FeatureWaitingForPlayersView } from './feature-waiting-for-players/feature-waiting-for-players-view.js';
import { FeatureReadyToStartView } from './feature-ready-to-start/feature-ready-to-start-view.js';
import { FeaturePlayingView } from './feature-playing/feature-playing-view.js';

export class FeatureGameRootView extends ScopedElementsMixin(LitElement) {
  static properties = {
    gameUuid: { type: String },
    subRoute: { type: String }
  };
  
  static scopedElements = {
    'feature-waiting-for-players-view': FeatureWaitingForPlayersView,
    'feature-ready-to-start-view': FeatureReadyToStartView,
    'feature-playing-view': FeaturePlayingView
  };
  
  connectedCallback() {
    super.connectedCallback();
    
    // Restore session from URL + storage
    GameSession.gameUuid.value = this.gameUuid;
    GameSession.playerUuid.value = sessionStorage.getItem('playerUuid');
    GameSession.playerName.value = sessionStorage.getItem('playerName');
    
    // Reconnect WebSocket after refresh
    if (!webSocketService.isConnected) {
      webSocketService.connect(
        this.gameUuid,
        msg => GameSession.handleMessage(msg),
        GameSession.playerUuid.value,
        GameSession.playerName.value
      );
    }
    
    // Navigation effect
    this._navEffect = effect(() => {
      const status = GameSession.gameStatus.value;
      if (!status) return;
      
      if (status === 'WAITING_FOR_PLAYERS') {
        navigateTo(`/games/${GameSession.gameUuid.value}/waiting`);
      } else if (status === 'READY_TO_START') {
        navigateTo(`/games/${GameSession.gameUuid.value}/ready-to-start`);
      } else if (status === 'PLAYING') {
        navigateTo(`/games/${GameSession.gameUuid.value}/playing`);
      }
    });
  }
  
  disconnectedCallback() {
    this._navEffect?.();
    super.disconnectedCallback();
  }
  
  createRenderRoot() { return this; } // Render in light DOM
  
  render() {
    const status = GameSession.gameStatus?.value;
    console.debug('root game status ', status);
    if (!status) {
      return html`<h3>Loading game…</h3>`;
    }
    
    switch (status) {
      case 'WAITING_FOR_PLAYERS':
        return html`
            <feature-waiting-for-players-view
                    .session=${GameSession}
                    .wsService=${webSocketService}
            ></feature-waiting-for-players-view>
        `;
      
      case 'READY_TO_START':
        return html`
            <feature-ready-to-start-view
                    .session=${GameSession}
                    .wsService=${webSocketService}
            ></feature-ready-to-start-view>
        `;
      
      case 'PLAYING':
        return html`
            <feature-playing-view
                    .session=${GameSession}
                    .wsService=${webSocketService}
            ></feature-playing-view>
        `;
      
      default:
        return html`<h3>Unknown game state</h3>`;
    }
  }
}

customElements.define('feature-game-root-view', FeatureGameRootView);