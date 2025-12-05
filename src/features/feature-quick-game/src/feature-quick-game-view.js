import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FeatureQuickGameViewModel } from './feature-quick-game-view-model.js';
import { FeatureQuickGameViewStyles } from './feature-quick-game-view.styles.js';
import { SignalController } from './../../../../packages/common/lit/signal-controller.js'

export class FeatureQuickGameView extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.vm = new FeatureQuickGameViewModel();
  }
  
  static styles = [ FeatureQuickGameViewStyles ];

  connectedCallback() {
    super.connectedCallback();
    // Watch all relevant signals
    this._signalController = new SignalController(this, [
      this.vm.name,
      this.vm.email,
      this.vm.language,
      this.vm.nameTouched,
      this.vm.emailTouched,
      this.vm.nameValidator,
      this.vm.emailValidator,
      this.vm.canSubmit,
      this.vm.loading,
      this.vm.backendError
    ]);
  }
  
  disconnectedCallback() {
    super.disconnectedCallback();
    this._signalController.disconnect();
  }
  
  async handleSubmit(e) {
    e.preventDefault();
    await this.vm.quickStart();
  }
  
  createRenderRoot() { return this; }
  
  render() {
      const vm = this.vm;

      return html`
    <form @submit=${this.handleSubmit} novalidate>
      <input
        type="text"
        placeholder="Name"
        .value=${vm.name.value}
        @input=${e => vm.name.value = e.target.value}
        @blur=${() => vm.markNameTouched()}
      />
      ${!vm.nameValidator.value.valid && vm.nameTouched.value
          ? html`<div class="error">${vm.nameValidator.value.reason}</div>`
          : null
      }

      <input
        type="email"
        placeholder="Email"
        .value=${vm.email.value}
        @input=${e => vm.email.value = e.target.value}
        @blur=${() => vm.markEmailTouched()}
      />
      ${!vm.emailValidator.value.valid && vm.emailTouched.value
          ? html`<div class="error">${vm.emailValidator.value.reason}</div>`
          : null
      }

      <select
        .value=${vm.language.value}
        @change=${e => vm.language.value = e.target.value}
      >
        <option value="en">English</option>
        <option value="nl">Nederlands</option>
      </select>

      <button type="submit" ?disabled=${!vm.canSubmit.value || vm.loading.value}>
        ${vm.loading.value ? 'Loading…' : 'Quick Start'}
      </button>

      ${vm.backendError.value
        ? html`<div class="backend-error">${vm.backendError.value}</div>`
        : null
      }
    </form>
  `;
  }
}

customElements.define('feature-quick-game-view', FeatureQuickGameView)