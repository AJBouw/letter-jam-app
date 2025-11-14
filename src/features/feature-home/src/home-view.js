import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

export class HomeView extends ScopedElementsMixin(LitElement) {

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
}

customElements.define('home-view', HomeView);