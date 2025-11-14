import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { TopBarViewStyles } from './top-bar-view.styles.js';
import logo from '../../../assets/letter-limbo.png';

export class TopBarView extends ScopedElementsMixin(LitElement) {
    static get scopedElements() {
        return {

        };
    }

    static get styles() {
        return [
            TopBarViewStyles
        ];
    }

    static properties = {

    };

    render() {
        return html`
            <header>
                <div class="top-bar-container">
                    <div class="top-bar-left">
                        <img src=${logo} alt="Letter Limbo logo" class="logo-img" />
                        <h1>Letter Limbo</h1>
                    </div>

                    <div class="top-bar-right">
                        <button>Profile</button>
                        <button>Logout</button>
                    </div>
                </div>
            </header>
        `;
    }
}

customElements.define('top-bar', TopBarView);