import { LitElement, html } from 'lit';

export class EmptyLayout extends LitElement {
  createRenderRoot() { return this; }
  
  render() {
    return html`
      <slot name="main"></slot>
    `;
  }
}

customElements.define('empty-layout', EmptyLayout);