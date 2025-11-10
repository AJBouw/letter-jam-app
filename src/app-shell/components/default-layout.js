import { LitElement, html, css } from 'lit';
import { DefaultLayoutStyles } from './default-layout.styles.js';

export class DefaultLayout extends LitElement {
    static get styles() {
        return [
            DefaultLayoutStyles
        ];
    }

    render() {
        return html`
            <header>
                <h1>Letter Jam</h1>
            </header>
            <nav>
                <slot name="nav"></slot>
            </nav>
            <main>
                <slot></slot>
            </main>
        `;
    }
}

customElements.define('default-layout', DefaultLayout);