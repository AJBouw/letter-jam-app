import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

export class HomeView extends ScopedElementsMixin(LitElement) {

}

customElements.define('home-view', HomeView);