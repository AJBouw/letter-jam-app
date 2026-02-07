import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { FormInputFieldViewStyles } from './form-input-field-view.styles.js';

export class FormInputField extends ScopedElementsMixin(LitElement) {
  constructor() {
    super();
    this.value = '';
    this.error = '';
    this.placeholder = '';
    this.label = '';
    this.type = 'text';
    this.disabled = false;
  }
  
  static properties = {
    value: { type: String },
    error: { type: String },
    placeholder: { type: String },
    label: { type: String },
    type: { type: String }, // 'text', 'email', 'password', etc.
    disabled: { type: Boolean }
  };
  
  static styles = [ FormInputFieldViewStyles ]
  
  _onInput(e) {
    this.value = e.target.value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: e.target.value,
      bubbles: true,
      composed: true
    }));
  }
  
  _onBlur() {
    this.dispatchEvent(new CustomEvent('blurred', {
      bubbles: true,
      composed: true
    }));
  }
  
  connectedCallback() {
    super.connectedCallback();
    if (!this._stylesInjected) {
      const styleEl = document.createElement('style');
      styleEl.textContent = FormInputFieldViewStyles.cssText;
      this.prepend(styleEl);
      this._stylesInjected = true;
    }
  }
  
  updated(changedProps) {
    if (changedProps.has('error')) {
      // force re-render if needed
      this.requestUpdate();
    }
  }
  
  createRenderRoot() {
    return this;
  }
  
  render() {
    return html`
      <div class="form-input">
        ${this.label ? html`<label>${this.label}</label>` : null}
        <input
          .type=${this.type}
          .value=${this.value}
          .placeholder=${this.placeholder}
          ?disabled=${this.disabled}
          @input=${this._onInput}
          @blur=${this._onBlur}
        />
        ${this.error ? html`<div class="error">${this.error}</div>` : null}
      </div>
    `;
  }
}

customElements.define('form-input-field', FormInputField);