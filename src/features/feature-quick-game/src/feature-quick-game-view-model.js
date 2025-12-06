import { signal, computed } from '@preact/signals'
import { navigateTo } from '../../../app-shell/routing/current-route.js';
import { GlobalStore } from '../../../../packages/common/index.js';
import { FeatureQuickGameService } from './feature-quick-game-service.js'
import { emailValidatorSignal } from '../../../../packages/common/src/utils/validation/email-validator.js';
import { nameValidatorSignal } from '../../../../packages/common/src/utils/validation/name-validator.js';
import { toUrlSegment } from '../../converters/url-segment-converter.js';

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
        : { valid: false, reason: null }
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
    if (!this.canSubmit.value) {
      console.log('Cannot submit, invalid fields');
      return;
    }
    
    this.loading.value = true;
    this.backendError.value = null;
    
    try {
      console.log('Sending quick game request with:', {
        name: this.name.value,
        email: this.email.value,
        language: this.language.value
      });
      
      const response = await FeatureQuickGameService.requestQuickGame({
        name: this.name.value,
        email: this.email.value,
        language: this.language.value
      });
      
      console.log('Response received:', response);
      
      const gameData = response.data;
      console.log('Game data extracted:', gameData);
      
      GlobalStore.game.setGame(gameData);
      console.log('Game stored in GlobalStore:', GlobalStore.game.game.value);
      
      // Reset form
      this.name.value = '';
      this.email.value = '';
      this.language.value = 'nl';
      this.nameTouched.value = false;
      this.emailTouched.value = false;
      
      const statusSegment = toUrlSegment(gameData.gameStatus);
      const url = `/games/quick-game/${gameData.uuid}/${statusSegment}`;
      console.log(`[VM] Navigating to ${url}`);
      navigateTo(url);
    } catch (err) {
      console.error('Quick game request failed:', err);
      this.backendError.value = err.message || 'Unknown error';
    } finally {
      this.loading.value = false;
    }
  }
}