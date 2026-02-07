import { css } from 'lit';

export const DefaultLayoutStyles = [
  css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    header {
      background: var(--color-surface);
      padding: 1rem 200px;
      box-shadow: var(--shadow-default);
      z-index: 10;
    }

    nav {
      background-color: var(--color-background);
      color: var(--color-on-background);
    }
    
    nav a {
      color: var(--color-on-background);
    }

    nav a.active {
      border-bottom: 2px solid var(--color-primary);
    }

    /* Optional: nav link colors adapt to theme */
    nav a {
      color: var(--color-on-background);
    }

    nav a.active {
      border-bottom: 2px solid var(--color-primary);
    }

    main {
      flex: 1;
      background-color: var(--color-background);
      overflow-y: auto;
    }
  `
];