import { html, LitElement } from 'lit';

export class ErrorMessageView extends LitElement {
  static properties = {
    message: { type: String }
  };
  
  render() {
    if (!this.message) return null;
    return html`<div class="error backend-error">${this.message}</div>`;
  }
}

customElements.define('error-message-view', ErrorMessageView);