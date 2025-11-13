import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { QuickStartViewModel } from './quick-start-view-model.js';
import { QuickStartViewStyles } from './quick-start-view.styles.js';

export class QuickStartView extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
        return {

        };
    }

    static styles = [
        QuickStartViewStyles
    ];

    static properties = {
        vm: { type: Object }
    };

    constructor() {
        super();
        this.vm = new QuickStartViewModel();
    }

    async handleSubmit(e) {
        e.preventDefault();
        await this.vm.quickStart();
    }

    render() {
        return html`
            <form @submit="${this.handleSubmit}">
                <input
                    type="text"
                    placeholder="Name"
                    .value="${this.vm.name}"
                    @input="${e => this.vm.name = e.target.value}"
                />
                <input
                    type="email"
                    placeholder="Email"
                    .value="${this.vm.email}"
                    @input="${e => this.vm.email = e.target.value}"
                />
                <select @change="${e => this.vm.language = e.target.value}">
                    <option value="en">English</option>
                    <option value="fr">French</option>
                </select>
                <button type="submit" ?disabled="${this.vm.loading}">
                    ${this.vm.loading ? 'Loading...' : 'Quick Start'}
                </button>
            </form>

            ${this.vm.error
            ? html`<div class="error">${this.vm.error}</div>`
            : null
        }
        `;
    }
}