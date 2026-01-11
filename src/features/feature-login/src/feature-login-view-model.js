import { signal, computed } from '@preact/signals';
import { LoginService } from './feature-login-service.js';
import { usernameValidatorSignal } from '@letter-limbo/common';
import { passwordValidatorSignal } from '@letter-limbo/common';
import { navigateTo } from '../../../app-shell/routing/current-route.js';

export class FeatureLoginViewModel {
  constructor() {
    this.username = signal('');
    this.password = signal('');
    
    this.usernameTouched = signal(false);
    this.passwordTouched = signal(false);
    
    this.usernameValidator = computed(() =>
      this.usernameTouched.value
        ? usernameValidatorSignal(this.username).value
        : { valid: false, reason: null }
    );
    
    this.passwordValidator = computed(() =>
      this.passwordTouched.value
        ? passwordValidatorSignal(this.password).value
        : { valid: false, reason: null }
    );
    
    this.canSubmit = computed(() =>
      this.usernameTouched.value &&
      this.passwordTouched.value &&
      this.usernameValidator.value.valid &&
      this.passwordValidator.value.valid
    );
    
    this.loading = signal(false);
    this.backendError = signal(null);
  }
  
  markUsernameTouched() { this.usernameTouched.value = true; }
  markPasswordTouched() { this.passwordTouched.value = true; }
  
  async login() {
    if (!this.canSubmit.value) return;
    
    this.loading.value = true;
    this.backendError.value = null;
    
    try {
      const response = await LoginService.login({
        username: this.username.value,
        password: this.password.value
      });
      
      // Handle successful login (e.g., store token, redirect)
      navigateTo('/dashboard');
      
    } catch (err) {
      this.backendError.value = err.message || 'Login failed';
    } finally {
      this.loading.value = false;
    }
  }
}