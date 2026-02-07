import { css } from 'lit';

export const FormInputFieldViewStyles = css`
    :host {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
        width: 100%;
    }

    label {
        margin-bottom: 0.25rem;
        font-weight: 500;
        color: var(--text-secondary);
    }

    input {
        padding: 0.75rem 1rem;
        font-size: 1rem;
        border-radius: 6px;
        border: 1px solid var(--ui-border);
        outline: none;
        transition: all 0.2s;
        width: 100%;
        box-sizing: border-box;
        background-color: var(--bg-card);
        color: var(--text-primary);
    }

    input:focus {
        border-color: var(--brand-strong);
        box-shadow: 0 0 0 3px rgba(118, 224, 0, 0.25);
    }

    input::placeholder {
        color: var(--text-secondary);
    }

    .error {
      color: var(--status-danger-text);
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    /* === Dark mode support === */
    body.dark-mode input {
        background-color: var(--bg-card-dark, #2b3035);
        color: var(--text-primary-dark, #f8f9fa);
        border-color: var(--ui-border-dark, #495057);
    }

    body.dark-mode input::placeholder {
        color: var(--text-secondary-dark, #ced4da);
    }

    body.dark-mode .error {
        color: var(--status-danger-text);
    }
`;