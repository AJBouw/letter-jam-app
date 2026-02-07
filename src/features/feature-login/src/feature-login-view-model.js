import { signal, computed } from '@preact/signals';
import { passwordValidator, validateUsernameOrEmail } from '@letter-limbo/common';
import { navigateTo } from '../../../app-shell/routing/current-route.js';
import { ValidationTextEn } from '../../../app-shell/i18n/validation-text.en.js';

export class FeatureLoginViewModel {
  constructor(gameContext, wsService, authService) {
    // === Services and context ===
    this.gameContext = gameContext;
    this.wsService = wsService;
    this.authService = authService;
    
    
    // === Form state ===
    this.identifierInput = signal('');
    this.passwordInput = signal('');
    
    this.identifierTouched = signal(false);
    this.passwordTouched = signal(false);
    
    this.loading = signal(false);
    this.backendError = signal(null);
    
    this.identifierValidator = computed(() =>
      validateUsernameOrEmail(this.identifierInput.value, {
        phase: this.identifierTouched.value ? 'submit' : 'typing'
      })
    );
    
    this.identifierErrorText = computed(() => {
      const { valid, reason } = this.identifierValidator.value;
      if (valid || !reason) return null;
      return ValidationTextEn.usernameOrEmail[reason];
    });
    
    this.passwordValidator = computed(() =>
      passwordValidator(this.passwordInput.value, {
        mode: 'login',
        phase: this.passwordTouched.value ? 'submit' : 'typing'
      })
    );
    
    this.passwordErrorText = computed(() => {
      const { valid, reason } = this.passwordValidator.value;
      if (valid || !reason) return null;
      return ValidationTextEn.password.login[reason];
    });
    
    // Computed for UI enable/disable only
    this.canSubmit = computed(() =>
      this.identifierTouched.value &&
      this.passwordTouched.value &&
      this.identifierValidator.value.valid &&
      this.passwordValidator.value.valid &&
      !this.loading.value
    );
  }
  
  markUsernameTouched() { this.identifierTouched.value = true; }
  markPasswordTouched() { this.passwordTouched.value = true; }
  
  goToRegister() {
    navigateTo('/register');
  }
  
  goToResetCredentials() {
    navigateTo('/reset-credentials');
  }
  
  async handleLogin() {
    this.markUsernameTouched();
    this.markPasswordTouched();
    
    if (!this.canSubmit.value) {
      console.debug('[LoginVM] Submit blocked', {
        identifier: this.identifierInput.value,
        password: this.passwordInput.value,
        canSubmit: this.canSubmit.value,
        loading: this.loading.value
      });
      return;
    }
    
    this.loading.value = true;
    this.backendError.value = null;
    
    try {
      // Use AuthService
      await this.authService.login({
        identifier: this.identifierInput.value,
        password: this.passwordInput.value
      });
      
      // After login, userSession will be updated with userUuid & authenticated
      navigateTo('/dashboard');
      
    } catch (err) {
      if (err.code === 'NETWORK_ERROR') {
        this.backendError.value = 'Cannot reach server. Please try again later.';
      } else if (err.code === 'INVALID_CREDENTIALS') {
        this.backendError.value = 'Invalid credentials';
      } else if (err.code === 'SERVER_ERROR') {
        this.backendError.value = 'Server error. Please try again later or contact support.';
      } else {
        this.backendError.value = err.message || 'Login failed';
      }
      
      // Clear only password on failure
      this.passwordInput.value = '';
      
    } finally {
      this.loading.value = false;
      this.passwordTouched.value = false;
      // Keep identifier input so user can correct
    }
  }
}