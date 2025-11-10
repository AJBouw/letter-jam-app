import { html, LitElement } from 'lit';
import { LoginViewModel } from './src/login-view-model.js';
import { LoginViewStyles } from './src/login-view.styles.js';

export class FeatureLogin extends LitElement {
    static get scopedElements() {
        return {
            'login-form': LoginForm
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
        console.log(result);
    }

    render() {
        return html`
            <h2>Login</h2>
            <login-form></login-form>
        `;
    }
}

// customElements.define('feature-login', FeatureLogin);