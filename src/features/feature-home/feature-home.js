import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FeatureHomeStyles } from './feature-home.styles.js';
import { FeatureLogin } from './../feature-login/feature-login.js';
import { FeatureQuickStart } from '../feature-quick-start/feature-quick-start.js';

export class FeatureHome extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
        return {
            'feature-login': FeatureLogin,
            'feature-quick-start': FeatureQuickStart
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