import { LitElement, html } from 'lit';
import { computed, effect, signal } from '@preact/signals';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { navigateTo } from '../../../app-shell/routing/current-route.js';
import { FeatureWaitingForPlayersView } from './feature-waiting-for-players/feature-waiting-for-players-view.js';
import { FeatureReadyToStartView } from './feature-ready-to-start/feature-ready-to-start-view.js';
import { FeaturePlayingView } from './feature-playing/feature-playing-view.js';
import { FeatureGameService } from './FeatureGameService.js';
import { FeatureGameRootViewStyles } from './feature-game-root-view.styles.js';

export class FeatureGameRootView extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.snapshotLoaded = signal(false);
    
    // Authoritative derived backend game state
    this.screen = computed(() => {
      const status = this.sharedGameSession?.gameStatus?.value;
      console.debug('[feature-game-root-view] root game status', status);
      
      switch (status) {
        case 'WAITING_FOR_PLAYERS':
          return 'WAITING';
        case 'READY_TO_START':
          return 'READY';
        case 'PLAYING':
          return 'PLAYING';
        default:
          return null;
      }
    });
    
    // Central routing
    this.nextRoute = computed(() => {
      if (!this.snapshotLoaded.value) return null;
      
      const gameUuid = this.sharedGameSession.gameUuid.value;
      if (!gameUuid) return null;
      
      switch (this.screen.value) {
        case 'WAITING':
          return `/games/${gameUuid}/waiting`;
        case 'READY':
          return `/games/${gameUuid}/ready-to-start`;
        case 'PLAYING':
          return `/games/${gameUuid}/playing`;
        default:
          return null;
      }
    });
    
    // Routing effect
    effect(() => {
      const route = this.nextRoute.value;
      if (route) {
        console.debug('[FeatureGameRootView] navigating to', route);
        navigateTo(route);
      }
    });
  }
  
  static properties = {
    gameUuid: { type: String },
    subRoute: { type: String },
    sharedGameSession: { state: true },
    wsService: { state: true },
    connectivityService: { state: true }
  };
  
  static scopedElements = {
    'feature-waiting-for-players-view': FeatureWaitingForPlayersView,
    'feature-ready-to-start-view': FeatureReadyToStartView,
    'feature-playing-view': FeaturePlayingView
  };
  
  static styles = [ FeatureGameRootViewStyles ];
  
  connectedCallback() {
    super.connectedCallback();
    
    if (!this.sharedGameSession) {
      console.error('[FeatureGameRootView] sharedGameSession not provided!');
      return;
    }
    
    // Restore player identity from session storage
    this._initPlayer();
    
    // Connect WS for live updates
    this._connectWebSocket();
    
    // Fetch backend snapshot (refresh / deep link support)
    this._fetchGameSnapshot()
      .finally(() =>
        this.snapshotLoaded.value = true
      );
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  
  _initPlayer() {
    this.sharedGameSession.restoreViewerFromSession?.();
  }
  
  _connectWebSocket() {
    if (!this.wsService.isConnected) this.wsService.connectForStatus();
    
    if (this.gameUuid && this.sharedGameSession.playerUuid.value && this.sharedGameSession.playerName.value) {
      this.wsService.connectToGame(
        this.gameUuid,
        msg => this.sharedGameSession.handleMessage(msg),
        this.sharedGameSession.playerUuid.value,
        this.sharedGameSession.playerName.value
      );
    }
  }
  
  async _fetchGameSnapshot() {
    if (!this.gameUuid) return;
    
    try {
      const viewerUuid = sessionStorage.getItem('playerUuid');
      const response = await new FeatureGameService().fetchGameSnapshot(this.gameUuid, viewerUuid);
      
      this.sharedGameSession.applyBackendSnapshot(response.data);
      
      console.debug('[FeatureGameRootView] Snapshot applied', this.sharedGameSession);
      
    } catch (err) {
      console.error('[FeatureGameRootView] Failed to fetch game snapshot', err);
    }
  }
  
  createRenderRoot() { return this; } // Render in light DOM
  
  render() {
    const status = this.sharedGameSession.gameStatus?.value;
    console.debug('[feature-game-root-view] root game status ', status);
    
    if (!this.snapshotLoaded.value) {
      return html`
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Loading game…</p>
      </div>
    `;
    }
    
    switch (status) {
      case 'WAITING_FOR_PLAYERS':
        return html`
            <feature-waiting-for-players-view
              .sharedGameSession=${this.sharedGameSession}
              .wsService=${this.wsService}
              .connectivityService=${this.connectivityService}
            ></feature-waiting-for-players-view>
        `;
      
      case 'READY_TO_START':
        return html`
            <feature-ready-to-start-view
              .sharedGameSession=${this.sharedGameSession}
              .wsService=${this.wsService}
            ></feature-ready-to-start-view>
        `;
      
      case 'PLAYING':
        return html`
            <feature-playing-view
              .sharedGameSession=${this.sharedGameSession}
              .wsService=${this.wsService}
            ></feature-playing-view>
        `;
      
      default:
        return html`<h3>Unknown game state</h3>`;
    }
  }
}
customElements.define('feature-game-root-view', FeatureGameRootView);