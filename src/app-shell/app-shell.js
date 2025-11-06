import { LitElement, html } from 'lit';
import { startQuickGame } from '../features/model/api/game-api.js';

export class AppShell extends LitElement {
    render() {
        return html`
      <h1>Letter Jam</h1>
      <button @click=${this.quickGame}>Start Quick Game</button>
      <div id="outlet"></div>
    `;
    }

    firstUpdated() {
        const outlet = this.shadowRoot.getElementById('outlet');
        // Initialize router here
    }

    async quickGame() {
        const player = {
            name: 'A',
            language: 'dutch',
            email: 'email@email.email'
        };

        try {
            const result = await startQuickGame(player);
            console.log('Game started:', result);
            alert('Quick game started!');
        } catch (err) {
            console.error(err);
            alert('Error starting game');
        }
    }
}

customElements.define('app-shell', AppShell);