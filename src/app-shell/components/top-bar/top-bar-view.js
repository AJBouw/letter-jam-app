import { LitElement, html, css } from 'lit';
import {ScopedElementsMixin} from '@open-wc/scoped-elements/lit-element.js';
import logo from '../../../assets/letter-limbo.png';
// import { TopBarStyles } from './../styles/op-bar.styles.js';

export class TopBarView extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
        return {

        };
    }

    static get styles() {
        return [
            // TopBarStyles
        ];
    }

    static properties = {

    };

    render() {
        return html`
            <header>
                <div class="left">
                    <img src=${logo} alt="Letter Limbo logo" class="logo-img" />
                    <slot name="logo"></slot>
                </div>

                <div class="right">
                    <slot name="actions"></slot>
                </div>
            </header>
        `;
    }
}

customElements.define('top-bar', TopBarView);