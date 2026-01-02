import { signal, computed, effect } from '@preact/signals'
import { emailValidatorSignal, GameStatus, nameValidatorSignal } from '@letter-limbo/common';
import { FeatureQuickGameService } from './FeatureQuickGameService.js';
import { navigateTo } from "../../../app-shell/routing/current-route.js";

/**
 * Observe GameSession
 * Expose derived UI state
 * Handle navigation side-effects
 */
export class FeatureQuickGameViewModel {
  constructor(sharedGameSession, webSocketService, connectivityService) {
    this.sharedGameSession = sharedGameSession;
    this.wsService = webSocketService;
    this.connectivityService = connectivityService;
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
    
    this.canSubmit = computed(() =>
      this.nameTouched.value &&
      this.emailTouched.value &&
      this.nameValidation.value.valid &&
      this.emailValidation.value.valid &&
      this.connectivityService.backendOk.value &&
      this.connectivityService.wsServerOk.value &&
      !this.loading.value
    
    );
    
    // Auto-reset loading once backend + WS are up
    effect(() => {
      const nameTouched = this.nameTouched.value;
      const emailTouched = this.emailTouched.value;
      const nameValid = this.nameValidation.value.valid;
      const emailValid = this.emailValidation.value.valid;
      const backendOk = this.connectivityService.backendOk.value;
      const wsOk = this.connectivityService.wsServerOk.value;
      const loading = this.loading.value;
      
      const canSubmit = nameTouched && emailTouched && nameValid && emailValid && backendOk && wsOk && !loading;
      
      console.log('[feature-quick-game-view-model] canSubmit debug', {
        nameTouched,
        emailTouched,
        nameValid,
        emailValid,
        backendOk,
        wsOk,
        loading,
        canSubmit
      });
      
      if (this.connectivityService.backendOk.value && this.connectivityService.wsServerOk.value) this.loading.value = false;
      
    });
  }
  
  start() {
    this.loading.value = true;
    
    // Persistent backend and WS heartbeat
    this.connectivityService.start();
  }
  
  stop() {
    this.connectivityService.stop();
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
      
      console.debug('[FeatureQuickGameView] response.data:', JSON.stringify(gameData, null, 2));
      
      // Apply full backend snapshot after viewer is set
      this.sharedGameSession.applyBackendSnapshot(gameData);
      
      // Connect to WS
      const me = this.sharedGameSession.playersList.value.find(
        p => p.uuid === this.sharedGameSession.playerUuid.value
      );
      if (me) {
        await this.wsService.connectToGame(
          this.sharedGameSession.gameUuid.value,
          msg => this.sharedGameSession.handleMessage(msg),
          me.uuid,
          me.name
        );
      }
      
      navigateTo(`/games/${response.data.gameUuid}`);
      
      // Reset form
      this.name.value = '';
      this.email.value = '';
      this.language.value = 'nl';
      this.nameTouched.value = false;
      this.emailTouched.value = false;
    } catch (err) {
      console.error('[feature-quick-game-view-model] Failed to start', err);
    } finally {
      this.loading.value = false;
    }
  }
}