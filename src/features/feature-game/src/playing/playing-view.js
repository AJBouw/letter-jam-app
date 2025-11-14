import { html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LitElement } from 'lit';
import { PlayingViewModel } from './playing-view-model';

export class PlayingView extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
        return {

        };
    }

    static get styles() {
        return [

        ];
    }

    static properties = {

    };

    constructor() {
        super();
        this.vm = new PlayingViewModel();
    }

    render() {
        const game = this.vm.game.value;
        const players = this.vm.players.value;

        if (!game) return html`<p>Waiting for game data...</p>`;

        return html`
            <h2>Playing</h2>

            ${this.vm.waitingForOpponent.value
                    ? html`<p>Waiting for opponent...</p>`
                    : html`<ul>
                    ${players.map(p => html`<li>${p.name} - Score: ${p.score}</li>`)}
                  </ul>`
            }

            <p>Status: ${game.gameStatus}</p>
        `;
    }
}

customElements.define('playing-view', PlayingView);