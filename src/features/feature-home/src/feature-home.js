import { LitElement, html, css } from 'lit';
import { mount as mountQuickGame } from '../../feature-quick-game/dist/feature-quick-game.js';
import { mount as mountLogin } from '../../feature-login/dist/feature-login.js';

if (!customElements.get('feature-home')) {
    customElements.define('feature-home', class FeatureHome extends LitElement {
        static styles = css`
      :host {
        display: block;
        padding: 2rem;
      }

      h1 {
        text-align: center;
        margin-bottom: 1.5rem;
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

        // 🧩 Mount nested features after rendering
        firstUpdated() {
            const quickEl = this.shadowRoot.getElementById('quick-game-container');
            const loginEl = this.shadowRoot.getElementById('login-container');

            // Mount Quick Game on left
            try {
                mountQuickGame(quickEl);
            } catch (e) {
                console.error('Failed to mount Quick Game:', e);
            }

            // Mount Login on right
            try {
                mountLogin(loginEl);
            } catch (e) {
                console.error('Failed to mount Login:', e);
            }
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
    });
}

// Public API for micro-frontend bootstrap
export function mount(container, props = {}) {
    const el = document.createElement('feature-home');

    // Assign optional properties (for MVVM data binding later)
    Object.assign(el, props);

    // Clear existing content (important for remounts)
    container.innerHTML = '';
    container.appendChild(el);
}

// Optional cleanup for route changes / hot reload
export function unmount(container) {
    container.innerHTML = '';
}