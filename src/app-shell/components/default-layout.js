import { LitElement, html } from 'lit';
import { DefaultLayoutStyles } from '../styles/default-layout.styles.js';
import { TopBarView } from './top-bar/top-bar-view.js'

export class DefaultLayout extends LitElement {
    static get scopedElements() {
        return {
            'top-bar': TopBarView
        };
    }

    static get styles() {
        return [
            DefaultLayoutStyles
        ];
    }

    static properties = {

    };

    render() {
        return html`
            <top-bar>
                <span slot="logo">LetterLimbo</span>
                <button slot="actions">Profile</button>
                <button slot="actions">Logout</button>
            </top-bar>
            <nav class="site-nav">
                <slot name="nav"></slot>
            </nav>
            <main class="site-content">
                <slot></slot>
            </main>
        `;
    }
}

customElements.define('default-layout', DefaultLayout);