import { html, LitElement } from 'lit';
import './routing/router-outlet.js';
import './components/default-layout.js';
import { GlobalStyles } from "../../global.styles.js";

export class AppShell extends LitElement {
  static styles = [ GlobalStyles ];
  
  createRenderRoot() { return this; } // Render in light DOM
  
  render() {
    return html`
      <default-layout></default-layout>
    `;
  }
}

customElements.define('app-shell', AppShell);