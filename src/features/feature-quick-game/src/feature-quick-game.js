import { LitElement, html, css } from 'lit';

class FeatureQuickGame extends LitElement {
    static styles = css`
        :host { display: block; padding: 1rem; border: 1px solid #ccc; border-radius: 8px; }
        button { margin-top: 1rem; padding: 0.5rem 1rem; font-size: 1rem; }
    `;

    static properties = {
        message: { type: String }
    };

    constructor() {
        super();
        this.message = 'Try the quick game!';
    }

    handleClick() {
        this.message = 'You clicked the quick game button!';
    }

    render() {
        return html`
            <h3>Quick Game</h3>
            <p>${this.message}</p>
            <button @click=${this.handleClick}>Play</button>
        `;
    }
}

if (!customElements.get('feature-quick-game')) {
    customElements.define('feature-quick-game', FeatureQuickGame);
}

// Public API
export function mount(container, props = {}) {
    if (!container) return;
    const el = document.createElement('feature-quick-game');
    Object.assign(el, props);
    container.innerHTML = '';
    container.appendChild(el);
}

export function unmount(container) {
    container.innerHTML = '';
}