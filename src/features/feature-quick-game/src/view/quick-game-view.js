import { LitElement, html, css } from 'lit';
import { QuickGameViewModel } from './../view-model/quick-game-view-model.js';

export class FeatureQuickGame extends LitElement {
    static styles = css`
        :host { display: block; padding: 1rem; }
        .error { color: red; }
    `;

    static properties = {
        vm: { type: Object }
    };

    constructor() {
        super();
        this.vm = new QuickGameViewModel();
    }

    async handleStart() {
        await this.vm.startGame();
        this.requestUpdate(); // re-render after API result
    }

    render() {
        return html`
            <h3>Quick Game</h3>
            <button @click=${this.handleStart}>Start Quick Game</button>

            ${this.vm.loading ? html`<p>Loading...</p>` : ''}
            ${this.vm.error ? html`<p class="error">${this.vm.error}</p>` : ''}
            ${this.vm.game ? html`
                <p>🎮 Game started with UUID: ${this.vm.game.gameUuid}</p>
            ` : ''}
        `;
    }
}

if (!customElements.get('feature-quick-game')) {
    customElements.define('feature-quick-game', FeatureQuickGame);
}