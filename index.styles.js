import { css } from 'lit';
import { colorTokens } from './packages/common/src/ui/color-tokens.js';

export const GlobalStyles = css`
  ${colorTokens}

  /* Body & Main */
  body {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: var(--color-background);
    color: var(--color-text);
  }

  main {
    background-color: var(--color-surface);
    padding: 16px;
  }
`;