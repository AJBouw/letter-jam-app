import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { EmailInputFieldView, ErrorMessageView, FormInputField, SignalController, userSession } from '@letter-limbo/common';
import { FeatureLoginViewModel } from './feature-login-view-model.js';
import { AuthTextEn as authTextEn } from '../../../app-shell/i18n/auth-text.en.js';

export class FeatureLoginView extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
  }
  
  static properties = {
    gameContext: { type: Object },
    wsService: { type: Object },
    onClose: { type: Function }
  }
  
  static scopedElements = {
    'email-input-field-view': EmailInputFieldView,
    'error-message-view': ErrorMessageView,
    'form-input-field': FormInputField
  }
  
  connectedCallback() {
    super.connectedCallback();
    
    if (!this.vm) {
      this.vm = new FeatureLoginViewModel(
        this.gameContext,
        this.wsService,
        this.authService
      );
      console.debug('[feature-login-view] VM initialised: ', this.vm);
    }
    
    this._signalController = new SignalController(this, [
      this.vm.loading,
      this.vm.canSubmit,
      this.vm.identifierInput,
      this.vm.passwordInput,
      this.vm.identifierTouched,
      this.vm.passwordTouched,
      this.vm.identifierValidator,
      this.vm.passwordValidator,
      this.vm.identifierErrorText,
      this.vm.passwordErrorText,
      this.vm.backendError
    ]);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this._signalController.disconnect();
  }
  
  // Render in light DOM (Bootstrap style)
  createRenderRoot() {
    return this;
  }
  
  async handleLogin(e) {
    e.preventDefault();
    await this.vm.handleLogin();
    
    if (userSession.isAuthenticated.value && this.onClose) {
      this.onClose();
    }
  }
  
  handleCancel() {
    if (this.onClose) this.onClose();
  }
  
  render() {
    const vm = this.vm;
    
    return html`
      <div class="login-overlay d-flex align-items-center justify-content-center flex-fill">
        <div class="card login-card shadow-sm">
          
          <!-- Top-right X close button -->
          <button
            type="button"
            class="btn-close position-absolute top-0 end-0 m-2"
            aria-label="Close"
            @click=${this.handleCancel}
          >
          </button>
            
            <!-- Login card --->
          <div class="card-body p-4">
            <div class="card shadow-sm h-100">
              <h3 class="card-title custom-card-title">${authTextEn.title}</h3>
              <h5 class="card-subtitle mb-4">${authTextEn.subtitle}</h5>
                
                <form @submit=${this.handleLogin} novalidate>
                  <!-- Identifier -->
                  <div class="mb-3">
                    <label class="form-label" for="identifier">${authTextEn.formLabels.usernameOrEmail}</label>
                      <form-input-field
                        .value=${vm.identifierInput.value}
                        placeholder=${authTextEn.formPlaceholders.usernameOrEmail}
                        .error=${vm.identifierTouched.value && !vm.identifierValidator.value.valid
                          ? vm.identifierErrorText.value
                          : null}
                        @value-changed=${e => vm.identifierInput.value = e.detail}
                        @blurred=${() => vm.markUsernameTouched()}
                      ></form-input-field>
                  </div>
          
                  <!-- Password -->
                  <div class="mb-4">
                    <form-input-field
                      label=${authTextEn.formLabels.passwordLabel}
                      type="password"
                      .value=${vm.passwordInput.value}
                      placeholder=${authTextEn.formPlaceholders.password}
                      .error=${vm.passwordTouched.value && !vm.passwordValidator.value.valid
                        ? vm.passwordErrorText.value
                        : ''}
                      @value-changed=${e => vm.passwordInput.value = e.detail}
                      @blurred=${() => vm.markPasswordTouched()}
                    />
                  </div>
                  
                  <!-- Reset credentials link (start/left, one line) -->
                  <div class="login-links mb-3 d-flex align-items-center justify-content-start gap-1">
                    <span class="non-link-text">
                      ${authTextEn.linkText.resetCredentials}
                    </span>
                      <a href="#" class="link-text" @click=${() => this.vm.goToResetCredentials()}>
                        ${authTextEn.linkText.resetLink}
                      </a>
                  </div>
                  
                  <!-- Submit -->
                  <div class="d-flex justify-content-end gap-2 mb-3">
                    <!-- Cancel button (secondary) -->
                    <button
                      type="button"
                      class="btn btn-cancel"
                      @click=${this.handleCancel}
                    >
                      ${authTextEn.cancelButton || 'Cancel'}
                    </button>

                    <!-- Login button (primary) -->
                    <button
                      class="btn btn-login-card"
                      type="submit"
                      ?disabled=${!vm.canSubmit.value || vm.loading.value}
                    >
                      ${vm.loading.value ? 'Loading…' : `${authTextEn.loginButton}`}
                    </button>
                  </div>

                  <!-- Backend / global error -->
                  <div class="text-danger mb-3" style="min-height: 1.5em;">
                    ${vm.backendError.value ?? ''}
                   </div>
                </form>
                
                <!-- Secondary actions -->
                <div class="login-links">
                  <span>
                    <span class="non-link-text">${authTextEn.linkText.register}</span>
                    <a href="#" class="link-text" @click=${() => this.vm.goToRegister()}>
                      ${authTextEn.linkText.registerLink}
                    </a>
                  </span>
                </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('feature-login-view', FeatureLoginView);