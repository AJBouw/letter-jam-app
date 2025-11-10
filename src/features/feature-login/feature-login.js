import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { LoginViewModel } from './src/login-view-model.js';
import { LoginViewStyles } from './src/login-view.styles.js';

export class FeatureLogin extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
        return {

        };
    }

    static styles = [
        LoginViewStyles
    ];

    constructor() {
        super();
        this.vm = new LoginViewModel();
    }

    async handleLogin() {
        const result = await this.vm.login({ username: 'test', password: 'test' });
    }

    render() {
        return html`
            <h2>Login</h2>s
        `;
    }
}

customElements.define('feature-login', FeatureLogin);