import { css } from 'lit';

export const EmailInputFieldViewStyles = [
  css`
    :host {
      display: block;
      width: 100%;
    }

    .email-input {
      width: 100%;
      box-sizing: border-box;
    }

    input {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;

      padding: 0.5rem;
      font-size: 1rem;
      border-radius: 4px;
      border: 1px solid #ccc;
    }

    .error {
      color: #d32f2f;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  `
];