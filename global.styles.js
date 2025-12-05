import { css } from 'lit';
import { colorTokens } from './packages/common/src/ui/color-tokens.js';

export const GlobalStyles =
  css`
    html, body, #app {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }
    header {
      background: var(--color-surface);
      padding: 1rem 200px;     /* your "not padding but spacing" request */
      box-shadow: var(--shadow-default);
    }

    nav {
      display: flex;
      gap: 1.5rem;
    }

    nav a {
      text-decoration: none;
      color: var(--color-primary);
      font-weight: 500;
    }

    nav a.active {
      border-bottom: 2px solid var(--color-primary);
    }

    main {
      padding: 2rem 200px;   /* same spacing as header */
    }
`;