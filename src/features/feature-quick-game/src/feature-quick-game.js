import { LitElement, html, css } from 'lit';
import { QuickGameViewModel } from './view-model/quick-game-view-model.js';


if (!customElements.get('feature-quick-game')) {
    customElements.define('feature-quick-game', class FeatureQuickGame extends LitElement {
        static styles = css`
            :host {
                display: block;
                width: 100%;
            }
            .game-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
            }
            button {
                padding: 0.7rem 1.5rem;
                font-size: 1.1rem;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
            }
            button:hover {
                background: #218838;
            }
            .error {
                color: red;
            }
        `;

        static properties = {
            vm: { type: Object },
            message: { type: String }
        };

        constructor() {
            super();
            this.vm = new QuickGameViewModel();
            this.message = 'Click start to play!';
        }

        async startGame() {
            // Example static player data
            const player = {
                name: "A",
                language: "dutch",
                email: "email@email.email"
            };

            this.message = 'Starting game...';
            await this.vm.startGame(player);
            this.message = this.vm.error
                ? '❌ Error starting game.'
                : '🎯 Game started! Guess the word!';
            this.requestUpdate();
        }

        render() {
            return html`
                <h3>Quick Game</h3>
                <div class="game-container">
                    <button @click=${this.startGame}>Start Game</button>

                    ${this.vm.loading ? html`<p>Loading...</p>` : ''}
                    ${this.vm.error ? html`<p class="error">${this.vm.error}</p>` : ''}
                    ${this.vm.game
                            ? html`<p>Game started: ${JSON.stringify(this.vm.game)}</p>`
                            : ''}
                    <div class="message">${this.message}</div>
                </div>
            `;
        }
    });
}

if (!customElements.get('feature-quick-game')) {
    customElements.define('feature-quick-game', FeatureQuickGame);
}

export function mount(container, props = {}) {
    const el = document.createElement('feature-quick-game');
    Object.assign(el, props);
    container.innerHTML = '';
    container.appendChild(el);
}

export function unmount(container) {
    container.innerHTML = '';
}