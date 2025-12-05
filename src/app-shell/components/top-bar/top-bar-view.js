import { LitElement, html } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { TopBarViewStyles } from './top-bar-view.styles.js';
import logo from '../../../assets/letter-limbo.png';
import { themeService } from "../../bootstrap.js";

export class TopBarView extends ScopedElementsMixin(LitElement) {
  static properties = {};
  
  constructor() {
    super();
  }
  
  static scopedElements = {}
  
  static styles = [ TopBarViewStyles ];
  
  /** Toggle between light and dark theme manually */
  _toggleTheme() {
    import('../../../../packages/common/src/ui/themes.js').then(({ lightTheme, darkTheme }) => {
      themeService.toggle(lightTheme, darkTheme);
    })
  }

    render() {
      return html`
          <div class="top-bar-container">
            <div class="top-bar-left">
              <img src=${logo} alt="Letter Limbo logo" class="logo-img" />
              <h1>Letter Limbo</h1>
            </div>

            <div class="top-bar-right">
              <button>Profile</button>
              <button @click=${this._toggleTheme}>Toggle Theme</button>
              <button>Logout</button>
            </div>
          </div>
      `;
    }
}

customElements.define('top-bar', TopBarView);