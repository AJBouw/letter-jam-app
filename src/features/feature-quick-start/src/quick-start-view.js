import { html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LitElement } from 'lit';
import { QuickStartViewModel } from './quick-start-view-model.js';
import { QuickStartViewStyles } from './quick-start-view.styles.js';

export class QuickStartView extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
        return {

        };
    }

    static get styles() {
        return [
            QuickStartViewStyles
        ];
    }

    static properties = {

    };

    constructor() {
        super();
        this.vm = new QuickStartViewModel();
    }

    connectedCallback() {
        super.connectedCallback();
        // Re-render whenever any relevant signal changes
        this._unsubscribe = [
            this.vm.name.subscribe(() => this.requestUpdate()),
            this.vm.email.subscribe(() => this.requestUpdate()),
            this.vm.language.subscribe(() => this.requestUpdate()),
            this.vm.nameTouched.subscribe(() => this.requestUpdate()),
            this.vm.emailTouched.subscribe(() => this.requestUpdate()),
            this.vm.nameValidator.subscribe(() => this.requestUpdate()),
            this.vm.emailValidator.subscribe(() => this.requestUpdate()),
            this.vm.canSubmit.subscribe(() => this.requestUpdate()),
            this.vm.loading.subscribe(() => this.requestUpdate()),
            this.vm.backendError.subscribe(() => this.requestUpdate()),
        ];
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._unsubscribe.forEach(fn => fn());
    }

    async handleSubmit(e) {
        e.preventDefault();
        await this.vm.quickStart();
    }

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