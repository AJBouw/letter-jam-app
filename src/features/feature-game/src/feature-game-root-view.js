import { LitElement, html } from 'lit';
import { computed, effect, signal } from '@preact/signals';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { currentRoute, navigateTo } from '../../../app-shell/routing/current-route.js';
import { connectivityService } from '@letter-limbo/common';
import { FeatureWaitingForPlayersView } from './feature-waiting-for-players/feature-waiting-for-players-view.js';
import { FeatureReadyToStartView } from './feature-ready-to-start/feature-ready-to-start-view.js';
import { FeaturePlayingView } from './feature-playing/feature-playing-view.js';
import { FeatureGameService } from './FeatureGameService.js';
import { FeatureGameWsService } from './FeatureGameWsService.js';
import { FeatureGameRootViewStyles } from './feature-game-root-view.styles.js';

export class FeatureGameRootView extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.snapshotLoaded = signal(false);
    
    // Authoritative derived backend game state
    this.screen = computed(() => {
      if (!this.snapshotLoaded.value) return null;
      
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
      console.debug('[feature-game-root-view] central routing screen value: ', this.screen.value);
      
      const gameUuid = this.sharedGameSession?.gameUuid?.value;
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
  
  static styles = [FeatureGameRootViewStyles];
  
  connectedCallback() {
    super.connectedCallback();
    
    if (!this.sharedGameSession) {
      console.error('[FeatureGameRootView] sharedGameSession not provided!');
      return;
    }
    
    // Make available for children
    this.connectivityService = connectivityService;
    
    // Restore viewer + entry flag
    this.sharedGameSession.restoreViewerFromSession();
    this.sharedGameSession.restoreEntryFlag();
    
    this._routeEffect = effect(() => {
      
      const route = this.nextRoute.value;
      const current = currentRoute.value;
      
      if (!route || route === current) return;
      
      console.debug('[feature-game-root-view] navigating to', route);
      navigateTo(route);
    });
    
    this._initializeGameFlow();
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this._routeEffect?.();
  }
  
  async _initializeGameFlow() {
    try {
      // Restore identifiers
      this.sharedGameSession.restoreViewerFromSession();
      const hasGame = this.sharedGameSession.restoreGameFromSession();
      this.sharedGameSession.restoreEntryFlag();
      
      if (!hasGame) {
        console.warn('[feature-game-root-view] No game to restore');
        this.snapshotLoaded.value = true;
        return;
      }
      
      // Fetch authoritative game snapshot
      const response = await new FeatureGameService().getGame(
        this.sharedGameSession.gameUuid.value,
        this.sharedGameSession.playerUuid.value
      );
      
      console.log(
        '[feature-game-root-view] Backend snapshot:',
        JSON.stringify(response.data, null, 2)
      );
      
      // Apply game snapshot
      this.sharedGameSession.enterGameFlow();
      this.sharedGameSession.applyBackendSnapshot(response.data);
      this.sharedGameSession.persistSession();
      
      // Allow rendering
      this.snapshotLoaded.value = true;
      
      // Connect WS
      this._connectWebSocket();
    } catch (err) {
      console.error('[feature-game-root-view] Initialization failed', err);
      this.snapshotLoaded.value = true;
    }
  }
  
  _connectWebSocket() {
    if (!this.wsService) {
      console.error('[feature-game-root-view] WS Service not provided');
      return;
    }
    
    if (!this.sharedGameSession || !this.sharedGameSession.gameUuid?.value) {
      console.error('[feature-game-root-view] No game UUID to connect WS to');
    }
    
    // Create WS Service once per game session
    if(!this.featureGameWsService) {
      this.featureGameWsService = new FeatureGameWsService(
        this.sharedGameSession,
        this.wsService
      );
    }
    
    const gameUuid = this.sharedGameSession.gameUuid.value;
    const playerUuid = this.sharedGameSession.playerUuid.value;
    const playerName = this.sharedGameSession.playerName.value;
    
    if (!playerUuid || !playerName) {
      console.warn('[feature-game-root-view] Cannot connect WS: missing player info');
      return
    }
    
    // Connect WS (subscribe to game topic and handle messages)
    this.featureGameWsService.connect(gameUuid, playerUuid, playerName);
    
    // Fallback: if WS is not connected yet, trigger general status connection
    if (!this.wsService.isConnected) {
      this.wsService.connectForStatus();
    }
    
    console.debug('[feature-game-root-view] WS connected for game: ', gameUuid);
  }
  
  createRenderRoot() {
    return this;
  } // Render in light DOM
  
  render() {
    console.debug('[FeatureGameRootView] render() snapshotLoaded:', this.snapshotLoaded.value,
      'gameStatus:', this.sharedGameSession.gameStatus.value);
    const status = this.sharedGameSession.gameStatus.value;
    if (!status || status === 'FORM') {
      return html`<p>Loading game…</p>`;
    }
    
    console.debug('[feature-game-root-view] has entered game flow: ', this.sharedGameSession.hasEnteredGameFlow.value);
    if (!this.sharedGameSession.hasEnteredGameFlow.value) {
      return html`
          <div class="invalid-entry">
              <p>Game session expired.</p>
              <button @click=${() => navigateTo('/quick-game')}>
                  Start new game
              </button>
          </div>
      `;
    }
    
    console.debug('[feature-game-root-view] game status value: ', this.sharedGameSession.gameStatus.value);
    
    switch (this.sharedGameSession.gameStatus.value) {
      case 'WAITING_FOR_PLAYERS':
        return html`
            <feature-waiting-for-players-view
                    .sharedGameSession=${this.sharedGameSession}
                    .wsService=${this.wsService}
                    .connectivityService=${this.connectivityService}
            />`;
      case 'READY_TO_START':
        return html`
            <feature-ready-to-start-view
                    .sharedGameSession=${this.sharedGameSession}
                    .wsService=${this.wsService}
                    .connectivityService=${this.connectivityService}
            />`;
      case 'PLAYING':
        return html`
            <feature-playing-view
                    .sharedGameSession=${this.sharedGameSession}
                    .wsService=${this.wsService}
                    .connectivityService=${this.connectivityService}
            />`;
      default:
        return html`<p>Invalid game state</p>`;
    }
  }
}

customElements.define('feature-game-root-view', FeatureGameRootView);