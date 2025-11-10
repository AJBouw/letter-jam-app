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

    render() {
        return html`
            <h2>Quick Game</h2>
            <input placeholder="Name" @input=${e => this.vm.name = e.target.value} />
            <input placeholder="Email" @input=${e => this.vm.email = e.target.value} />
            <select @change=${e => this.vm.language = e.target.value}>
                <option value="en">English</option>
                <option value="nl">Dutch</option>
            </select>

            <button @click=${() => this.vm.quickStart()}>Start</button>

            ${this.vm.loading ? html`<p>Starting...</p>` : ''}
            ${this.vm.error ? html`<p>Error: ${this.vm.error}</p>` : ''}
        `;
    }
}