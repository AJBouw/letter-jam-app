import { LitElement, html, css } from 'lit';


export class DefaultLayout extends LitElement {
    // ✅ Disable shadow DOM so slots are rendered in the light DOM
    createRenderRoot() {
        return this;
    }

    static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      font-family: system-ui, sans-serif;
    }

    header {
      background: #6200ee;
      color: white;
      padding: 1rem;
      text-align: center;
    }

    nav {
      display: flex;
      gap: 1rem;
      background: #eee;
      padding: 0.5rem 1rem;
    }

    nav a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
    }

    nav a.active {
      text-decoration: underline;
      color: #6200ee;
    }

    main {
      flex: 1;
      padding: 1.5rem;
      background: #fafafa;
    }
  `;

    render() {
        return html`
      <header>
        <h1>Letter Jam</h1>
      </header>

      <nav>
        <slot name="nav"></slot>
      </nav>

      <main>
        <slot></slot>
      </main>
    `;
    }
}

customElements.define('default-layout', DefaultLayout);