import { signal, computed, effect } from '@preact/signals'
import { emailValidatorSignal, GameStatus, nameValidatorSignal } from '@letter-limbo/common';
import { FeatureQuickGameService } from './FeatureQuickGameService.js';

/**
 * Observe GameSession
 * Expose derived UI state
 * Handle navigation side-effects
 */
export class FeatureQuickGameViewModel {
  constructor(gameSession, connectivityService, webSocketService) {
    this.session = gameSession;
    this.connectivity = connectivityService;
    this.wsService = webSocketService;
    this.service = new FeatureQuickGameService();
    
    // Form state
    this.name = signal('');
    this.email = signal('');
    this.language = signal('nl');
    
    this.nameTouched = signal(false);
    this.emailTouched = signal(false);
    
    // validation
    this.nameValidation = nameValidatorSignal(this.name);
    this.emailValidation = emailValidatorSignal(this.email);
    
    // UI state
    this.loading = signal(true);
    this.screen = signal('FORM');
    
    // Derived screen
    this.screen = computed(() => {
      if (!this.session.gameUuid.value) return 'FORM';
      switch (this.session.gameStatus.value) {
        case GameStatus.WAITING_FOR_PLAYERS:
          return 'WAITING';
        case GameStatus.READY_TO_START:
          return 'READY';
        case GameStatus.PLAYING:
          return 'PLAYING';
        case GameStatus.FINISHED:
          return 'FINISHED';
        default:
          return 'FORM';
      }
    });
    
    // Navigation
    this.nextRoute = signal(null);
    effect(() => {
      switch (this.screen.value) {
        case 'WAITING':
          console.debug('[feature-quick-game-view-model] screen waiting');
          this.nextRoute.value = `/games/${this.session.gameUuid.value}/waiting`;
          break;
        case 'READY':
          console.debug('[feature-quick-game-view-model] screen ready');
          this.nextRoute.value = `/games/${this.session.gameUuid.value}/ready-to-start`;
          break;
        case 'PLAYING':
          console.debug('[feature-quick-game-view-model] screen playing');
          this.nextRoute.value = `/games/${this.session.gameUuid.value}/playing`;
          break;
      }
    });
    
    this.canSubmit = computed(() =>
      this.nameTouched.value &&
      this.emailTouched.value &&
      this.nameValidation.value.valid &&
      this.emailValidation.value.valid &&
      this.connectivity.canSubmit.value &&
      !this.loading.value
    );
    
    // Auto-reset loading once backend + WS are up
    effect(() => {
      if (this.connectivity.backendOk.value && this.connectivity.wsOk.value) {
        this.loading.value = false;
      }
    });
  }
  
  start() {
    this.loading.value = true;
    this.connectivity.start('quick-game-lobby');
  }
  
  stop() {
    this.connectivity.stop();
  }
  
  markNameTouched() {
    this.nameTouched.value = true;
  }
  
  markEmailTouched() {
    this.emailTouched.value = true;
  }
  
  async startQuickGame() {
    if (!this.canSubmit.value) return;
    
    this.loading.value = true;
    
    try {
      const response = await this.service.requestQuickGame({
        name: this.name.value,
        email: this.email.value,
        language: this.language.value
      });
      
      const gameData = response.data;
      
      // Apply full backend snapshot after viewer is set
      this.session.applyBackendSnapshot(gameData);
      
      // Connect to WS
      const me = this.session.playersList.value.find(
        p => p.uuid === this.session.playerUuid.value
      );
      if (me) {
        this.wsService.connect(
          this.session.gameUuid.value,
          msg => this.session.handleMessage(msg),
          me.uuid,
          me.name
        );
      }
      
      // Reset form
      this.name.value = '';
      this.email.value = '';
      this.language.value = 'nl';
      this.nameTouched.value = false;
      this.emailTouched.value = false;
    } finally {
      this.loading.value = false;
    }
  }
}