import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { EmailInputFieldViewStyles } from './email-input-field-view.styles.js';

export class EmailInputFieldView extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.value = '';
    this.error = '';
    this.placeholder = '';
    this.disabled = false;
  }
  
  static properties = {
    value: { type: String },
    error: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean }
  };
  
  static styles = [ EmailInputFieldViewStyles ];
  
  _onInput(e) {
    this.dispatchEvent(new CustomEvent('email-input', {
      detail: e.target.value,
      bubbles: true,
      composed: true
    }));
  }
  
  _onBlur() {
    this.dispatchEvent(new CustomEvent('email-blur', {
      bubbles: true,
      composed: true
    }));
  }
  
  render() {
    return html`
      <div class="email-input">
        <input
          type="email"
          .value=${this.value}
          placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          @input=${this._onInput}
          @blur=${this._onBlur}
        />
        ${this.error
          ? html`<div class="error">${this.error}</div>`
          : null}
      </div>
    `;
  }
}

customElements.define('email-input-field-view', EmailInputFieldView);