import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FeatureLoginViewModel } from './feature-login-view-model.js';
import { FeatureLoginViewStyles } from './feature-login-view.styles.js';
import { SignalController } from "../../../../packages/common/lit/signal-controller.js";

export class FeatureLoginView extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.vm = new FeatureLoginViewModel();
  }
  
  static styles = [ FeatureLoginViewStyles ];
  
  connectedCallback() {
    super.connectedCallback();
    this._signalController = new SignalController(this, [
      this.vm.username,
      this.vm.password,
      this.vm.usernameTouched,
      this.vm.passwordTouched,
      this.vm.usernameValidator,
      this.vm.passwordValidator,
      this.vm.canSubmit,
      this.vm.loading,
      this.vm.backendError
    ]);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this._signalController.disconnect();
  }
  
  async handleLogin(e) {
    e.preventDefault();
    await this.vm.login();
  }
  
  createRenderRoot() {
    return this;
  }
  
  render() {
    const vm = this.vm;
    return html`
      <h1>Login</h1>
      <form @submit=${this.handleLogin} novalidate>
        <input
          type="text"
          placeholder="Username"
          .value=${vm.username.value}
          @input=${e => vm.username.value = e.target.value}
          @blur=${() => vm.usernameTouched.value = true}
        />
        ${!vm.usernameValidator.value.valid && vm.usernameTouched.value
          ? html`
              <div class="error">${vm.usernameValidator.value.reason}</div>`
          : null
        }

        <input
          type="password"
          placeholder="Password"
          .value=${vm.password.value}
          @input=${e => vm.password.value = e.target.value}
          @blur=${() => vm.passwordTouched.value = true}
        />
        ${!vm.passwordValidator.value.valid && vm.passwordTouched.value
          ? html`
              <div class="error">${vm.passwordValidator.value.reason}</div>`
          : null
        }

        <button type="submit" ?disabled=${!vm.canSubmit.value || vm.loading.value}>
          ${vm.loading.value ? 'Loading…' : 'Login'}
        </button>

        ${vm.backendError.value
          ? html`
              <div class="backend-error">${vm.backendError.value}</div>`
          : null
        }
      </form>
    `;
  }
}

customElements.define('feature-login-view', FeatureLoginView);