import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { HomeView } from './src/home-view.js';
import { HomeViewModel } from './src/home-view-model.js';
import { HomeViewStyles } from './src/home-view.styles.js';
// import { FeatureLogin } from '../feature-login/src/login-view.js';
// import { QuickStartView } from '../feature-quick-start/src/quick-start-view.js';

export class FeatureHome extends LitElement {
    static get scopedElements() {
        return {
            // 'login-view': LoginView,
            // 'quic-start-view': QuickStartView
        };
    }

    static  styles = [
        HomeViewStyles
    ];

    constructor() {
        super();
        this.vm = new HomeViewModel();
    }

    render() {
        return html`
            <h2>Welcome to Letter Jam</h2>
        `;
    }
}
//
// customElements.define('feature-home', FeatureHome);

// TODO: remove before commit
console.log('feature-home.js loaded');