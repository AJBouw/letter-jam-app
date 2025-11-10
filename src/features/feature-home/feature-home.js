import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FeatureHomeStyles } from './feature-home.styles.js';

export class FeatureHome extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
        return {
        };
    }

    static get styles() {
        return [
            FeatureHomeStyles
        ];
    }

    render() {
        return html`
      <h2>Welcome to Letter Jam!</h2>
      <p>This is the home feature.</p>
    `;
    }
}

customElements.define('feature-home', FeatureHome);