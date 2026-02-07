import { html, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { ConnectivityStatusViewStyles } from "./connectivity-status-view.styles.js";

export class ConnectivityStatusView extends ScopedElementsMixin(LitElement) {
  static properties = {
    backendOk: { type: Boolean },
    wsServerOk: { type: Boolean }
  };
  
  static styles = [ ConnectivityStatusViewStyles ];
  
  
  // Render in light DOM (Bootstrap style)
  createRenderRoot() { return this; }
  
  render() {
    return html`
      <div class="d-flex gap-3 align-items-center">
        <div class="d-flex align-items-center gap-1">
          <span class="status-circle ${this.backendOk ? 'bg-success' : 'bg-danger'}"></span>
          <strong class=${this.backendOk ? 'text-success' : 'text-danger'}>
              ${this.backendOk ? 'OK' : 'DOWN'}
          </strong>          <span>Backend</span>
        </div>
        <div class="d-flex align-items-center gap-1">
          <span class="status-circle ${this.wsServerOk ? 'bg-success' : 'bg-danger'}"></span>

          <strong class=${this.wsServerOk ? 'text-success' : 'text-danger'}>
            ${this.wsServerOk ? 'CONNECTED' : 'DISCONNECTED'}
          </strong>          <span>WS Server</span>
        </div>
      </div>
    `;
  }
}

customElements.define('connectivity-status-view', ConnectivityStatusView);