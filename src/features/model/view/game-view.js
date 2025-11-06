import { LitElement, html } from 'lit';

class GameView extends LitElement {
    render() {
        return html`
            <div class="">
                hello
            </div>
        `;
    }
}

customElements.define('game-view', GameView);