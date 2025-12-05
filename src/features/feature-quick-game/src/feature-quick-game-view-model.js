import { signal, computed } from '@preact/signals'
import { navigateTo } from '../../../app-shell/routing/current-route.js';
import { GlobalStore } from '../../../../packages/common/index.js';
import { FeatureQuickGameService } from './feature-quick-game-service.js'
import { emailValidatorSignal } from '../../../../packages/common/src/utils/validation/email-validator.js';
import { nameValidatorSignal } from '../../../../packages/common/src/utils/validation/name-validator.js';

export class FeatureQuickGameViewModel {
  constructor() {
    this.name = signal('');
    this.email = signal('');
    this.language = signal('nl');

    this.nameTouched = signal(false);
    this.emailTouched = signal(false);

    this.loading = signal(false);
    this.backendError = signal(null);

    // Validator signals that only show errors if field is touched
    this.nameValidator = computed(() =>
      this.nameTouched.value
        ? nameValidatorSignal(this.name).value
        : { valid: false, reason: null }
    );

    this.emailValidator = computed(() =>
      this.emailTouched.value
        ? emailValidatorSignal(this.email).value
        : { valid: false, reason: null } // <--- treat untouched as invalid
    );

    // Can submit only if fields are touched and valid
    this.canSubmit = computed(() =>
      this.nameTouched.value &&
      this.emailTouched.value &&
      this.nameValidator.value.valid &&
      this.emailValidator.value.valid
    );
  }

  markNameTouched() { this.nameTouched.value = true; }
  markEmailTouched() { this.emailTouched.value = true; }

  async quickStart() {
    if (!this.canSubmit.value) return;

    this.loading.value = true;
    this.backendError.value = null;

    try {
      const response = await FeatureQuickGameService.startQuickGame({
        name: this.name.value,
        email: this.email.value,
        language: this.language.value
      });

      const gameData = response.data;
      GlobalStore.game.setGame(gameData);

      // Reset form
      this.name.value = '';
      this.email.value = '';
      this.language.value = 'nl';
      this.nameTouched.value = false;
      this.emailTouched.value = false;

      // Navigate based on game status
      switch (gameData.gameStatus) {
        case 'WAITING_FOR_PLAYERS':
          navigateTo('/quick-game/waiting-for-players');
          break;
        case 'READY_TO_START':
          navigateTo('/quick-game/ready-to-start');
          break;
        case 'PLAYING':
          navigateTo('/quick-game/playing');
        default:
          console.warn('Unhandled game status:', gameData.gameStatus);
      }

    } catch (err) {
      this.backendError.value = err.message || 'Unknown error';
    } finally {
      this.loading.value = false;
    }
  }
}