import { LitElement, html, css } from 'lit';
import { getFeatureURL, render } from '../../../app-shell/micro-front-end-renderer.js';

/**
 * FeatureHome LitElement class
 * Dynamically loads nested micro-frontends inside the component
 */
class FeatureHome extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 2rem;
        }
        h1, h2 {
            text-align: center;
        }
        .container {
            display: flex;
            gap: 20px;
            justify-content: space-between;
        }
        .half {
            flex: 1;
            border: 1px solid #ccc;
            padding: 20px;
            min-height: 300px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            border-radius: 8px;
        }
        .half h2 {
            text-align: center;
        }
    `;

    firstUpdated() {
        const quickGameContainer = this.shadowRoot.getElementById('quick-game-container');
        render(quickGameContainer, getFeatureURL('feature-quick-game', 'feature-quick-game.js'), {
            props: { message: 'Hello from Home!' }
        });

        const loginContainer = this.shadowRoot.getElementById('login-container');
        render(loginContainer, getFeatureURL('feature-login', 'feature-login.js'));
    }

    render() {
        return html`
      <h1>Welcome to Word Game</h1>
      <div class="container">
        <div id="quick-game-container" class="half">
          <h2>Play Quick Game</h2>
        </div>
        <div id="login-container" class="half">
          <h2>Login to Continue</h2>
        </div>
      </div>
    `;
    }
}

// Define custom element once
if (!customElements.get('feature-home')) {
    customElements.define('feature-home', FeatureHome);
}

// Public API for app-shell
export function mount(container, props = {}) {
    if (!container) return;
    const el = document.createElement('feature-home');
    Object.assign(el, props);
    container.innerHTML = '';
    container.appendChild(el);
}

export function unmount(container) {
    container.innerHTML = '';
}