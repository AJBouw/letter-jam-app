import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { QuickStartViewModel } from './src/quick-start-view-model.js';
import { QuickStartViewStyles } from './src/quick-start-view.styles.js';

export class FeatureQuickStart extends LitElement {
    static styles = [
        QuickStartViewStyles
    ];

    constructor() {
        super();
        this.vm = new QuickStartViewModel();
    }

    async handleStart() {
        const result = await this.vm.startGame({ name: 'Player A' });
        console.log(result);
    }

    render() {
        return html`
      <h3>Quick Start</h3>
      <button @click=${this.handleStart}>Start Game</button>
    `;
    }
}

// customElements.define('feature-quick-start', FeatureQuickStart);