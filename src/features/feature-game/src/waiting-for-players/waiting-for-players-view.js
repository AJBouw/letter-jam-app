import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { WaitingForPlayersViewModel } from './waiting-for-players-view-model.js';

export class WaitingForPlayersView extends ScopedElementsMixin(LitElement) {
    constructor() {
        super();
        this.vm = new WaitingForPlayersViewModel();
    }

    connectedCallback() {
        super.connectedCallback();
        // Subscribe to the computed signals
        this._unsubscribe = this.vm.allPlayersJoined.subscribe(() => this.requestUpdate());
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._unsubscribe?.();
    }

    render() {
        return html`
            <h2>Waiting for players...</h2>
            <ul>
                ${this.vm.players.value.map(p => html`<li>${p.name}</li>`)}
            </ul>
            ${!this.vm.isFull.value
            ? html`<p>Waiting for opponent...</p>`
            : html`<p>All players joined!</p>`}
        `;
    }
}

customElements.define('waiting-for-players-view', WaitingForPlayersView);