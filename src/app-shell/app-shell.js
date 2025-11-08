import { LitElement, html, css } from 'lit';
import { mount as mountBootstrap } from './bootstrap.js';

// Define <app-shell> as root component
if (!customElements.get('app-shell')) {
    customElements.define('app-shell', class AppShell extends LitElement {
        static styles = css`
      :host {
        display: block;
        font-family: Arial, sans-serif;
      }
      #app {
        padding: 1rem;
      }
    `;

        render() {
            return html`<div id="app"></div>`;
        }

        firstUpdated() {
            // Mount bootstrap.js logic into #app container
            // bootstrap.js itself already handles routing, container creation, and rendering
            mountBootstrap(document.getElementById('app'));
        }
    });
}

// TODO: check when needed
// export function mount(container, props = {}) {
//     const el = document.createElement('app-shell');
//     Object.assign(el, props);
//     container.innerHTML = '';
//     container.appendChild(el);
// }
//
// export function unmount(container) {
//     container.innerHTML = '';
// }