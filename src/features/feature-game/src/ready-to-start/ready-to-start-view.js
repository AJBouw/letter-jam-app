import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { ReadyToStartViewModel } from './ready-to-start-view-model.js';

export class ReadyToStartView extends ScopedElementsMixin(LitElement) {
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
        this.vm = new ReadyToStartViewModel();
    }

    connectedCallback() {
        super.connectedCallback();
        this._unsubscribe = this.vm.allReady.subscribe(() => this.requestUpdate());
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._unsubscribe?.();
    }

    render() {
        return html`
            <h2>Game in progress</h2>
            <ul>
                ${this.vm.game.value?.players.map(p => html`
                <li>
                    <span>${p.name}</span>
                    <button 
                        ?disabled=${this.vm.playerReady.value[p.uuid]}
                        @click=${() => this.vm.setReady(p.uuid)}
                    >
                        ${this.vm.playerReady.value[p.uuid] ? 'Ready' : 'Start'}
                    </button>
                </li>
            `)}
            </ul>
        `;
    }
}

customElements.define('in-progress-view', ReadyToStartView);