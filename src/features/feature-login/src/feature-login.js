import { LitElement, html, css } from 'lit';

class FeatureLogin extends LitElement {
    static styles = css`
        :host { display: block; width: 100%; }
        form { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; }
        input { padding: 0.5rem; font-size: 1rem; }
        button { padding: 0.5rem 1rem; background: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .message { color: #007bff; text-align: center; }
    `;

    static properties = {
        message: { type: String }
    };

    constructor() {
        super();
        this.message = '';
    }

    handleLogin(e) {
        e.preventDefault();
        const email = this.shadowRoot.getElementById('email').value;
        const password = this.shadowRoot.getElementById('password').value;
        if (email && password) this.message = `Welcome back, ${email}!`;
        else this.message = 'Please enter email and password.';
    }

    render() {
        return html`
            <h3>Login</h3>
            <form @submit=${this.handleLogin}>
                <input type="email" id="email" placeholder="Email" />
                <input type="password" id="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
            <div class="message">${this.message}</div>
        `;
    }
}

if (!customElements.get('feature-login')) {
    customElements.define('feature-login', FeatureLogin);
}

// TODO: check when needed
// export function mount(container, props = {}) {
//     if (!container) return;
//     const el = document.createElement('feature-login');
//     Object.assign(el, props);
//     container.innerHTML = '';
//     container.appendChild(el);
// }
//
// export function unmount(container) {
//     container.innerHTML = '';
// }