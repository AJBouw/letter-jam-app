import { css } from 'lit';

export const DefaultLayoutStyles = [
  css`
      :host {
          display: flex;
          flex-direction: column;
          min-height: 100vh;  /* full viewport */
      }

      header {
          background: var(--color-surface);
          padding: 1rem 200px;
          box-shadow: var(--shadow-default);
          z-index: 10;
      }

      nav {
          display: flex;
          gap: 1.5rem;
          padding: 0 200px;
      }

      main {
          flex: 1;              /* fills remaining space */
          padding: 2rem 200px;
          background-color: var(--color-background);
          overflow-y: auto;
      }
  `
];