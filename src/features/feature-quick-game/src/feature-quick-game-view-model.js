import { signal, computed, effect } from '@preact/signals'
import { emailValidatorSignal, nameValidatorSignal } from '@letter-limbo/common';
import { navigateTo } from "../../../app-shell/routing/current-route.js";
import { FeatureQuickGameService } from './FeatureQuickGameService.js';
import { FeatureGameWsService } from "../../feature-game/src/FeatureGameWsService.js";

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
    this.featureQuickGameService = new FeatureQuickGameService();
    this.featureGameWsService = new FeatureGameWsService(this.sharedGameSession, this.wsService);

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

      if (this.connectivityService.backendOk.value && this.connectivityService.wsServerOk.value) {
        this.loading.value = false;
      }
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
      const response = await this.featureQuickGameService.requestQuickGame({
        name: this.name.value,
        email: this.email.value,
        language: this.language.value
      });

      const gameData = response.data;
      console.debug('[FeatureQuickGameView] response.data:', JSON.stringify(gameData, null, 2));

      // Persist session for current player
      const meData = gameData.players.find(p => p.name === this.name.value);
      this.sharedGameSession.initPlayer({
        playerUuid: meData.uuid,
        playerName: meData.name
      });

      // Mark valid entry
      this.sharedGameSession.enterGameFlow();

      // Apply full backend snapshot after player is initialized
      this.sharedGameSession.applyBackendSnapshot(gameData);

      // Connect to WS after snapshot and player init
      this.featureGameWsService.connect(
        this.sharedGameSession.gameUuid.value,
        this.sharedGameSession.playerUuid.value,
        this.sharedGameSession.playerName.value
      );

      navigateTo(`/games/${this.sharedGameSession.gameUuid.value}`);

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