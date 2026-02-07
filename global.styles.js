import { css } from 'lit';

export const GlobalStyles = css`
    :root {
      --brand-accent: initial;
      --brand-strong: initial;
      --brand-hover: initial;
      --brand-active: initial;
      
      --text-primary: initial;
      --text-secondary: initial;
      
      --bg-page: initial;
      --bg-card: initial;
      
      --ui-border: initial;
      --ui-disabled: initial;

      --status-danger-text: #dc3545;
    }

    body.dark-mode {
        --status-danger-text: #ff6b6b;
    }

    /* ======================================================
       Base page styles
       ====================================================== */
    html, body, #app {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      background-color: var(--bs-body-bg);
      color: var(--bs-body-color);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    /* ======================================================
       Header & nav
       ====================================================== */
    header {
      background-color: var(--bs-card-bg);
      padding: 1rem 0;
      box-shadow: var(--shadow-default);
    }

    .logo-img {
      height: 4rem;
      width: auto;
    }

    nav {
      display: flex;
      gap: 1.5rem;
    }

    nav a {
      text-decoration: none;
      color: var(--text-primary);
      font-weight: 500;
    }

    nav a.active {
      border-bottom: 2px solid var(--brand-strong);
    }

    main {
      padding: 1rem 0;
    }

    .custom-card-title,
    .section-title {
      color: var(--brand-strong);
      font-weight: 600;
      margin-bottom: 1rem;
    }
    
    /* ======================================================
       Decorative elements
       ====================================================== */
    .spinner-green {
      color: var(--brand-accent);
    }

    /* ======================================================
       Buttons
       ====================================================== */
    .btn-block {
      display: block;
      width: 100%;
    }

    .btn-success {
      background-color: var(--brand-strong);
      border-color: var(--brand-strong);
      color: #ffffff;
      transition: background-color 0.2s ease, transform 0.1s ease-in-out;
    }

    .btn-success:hover {
      background-color: var(--brand-hover);
      border-color: var(--brand-hover);
      transform: scale(1.05);
    }

    .btn-cta {
      background-color: var(--brand-strong);
      color: #ffffff;
      font-weight: 500;
      border: none;
      border-radius: 0.25rem;
      padding: 0.375rem 0.75rem;
      transition: background-color 0.2s ease, transform 0.1s ease-in-out;
    }

    .btn-cta:hover {
      background-color: var(--brand-hover);
      transform: scale(1.05);
    }

    .btn-cta:active {
      background-color: var(--brand-active);
    }

    .btn-close {
      font-size: 1.35rem;
      color: var(--text-primary);
      background-color: var(--bg-card);
      border: 2px solid var(--text-primary);
      border-radius: 4px;
      width: 1.5rem;
      height: 1.5rem;
      padding: 2px;
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.1s ease-in-out, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
    }

    .btn-close:hover {
      transform: scale(1.1);
      background-color: var(--brand-accent);
      color: #fff;
      border-color: var(--brand-strong);
    }

    body.dark-mode .login-card .btn-close {
      color: #ffffff;
      border-color: #ffffff;
      background-color: #33353A;
    }

    body.dark-mode .login-card .btn-close:hover {
      background-color: var(--brand-accent);
      color: #fff;
      border-color: var(--brand-strong);
    }

    /* ======================================================
       Dropdown meta info
       ====================================================== */
    .dropdown-menu .meta-info {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.2;
      white-space: nowrap;
      overflow-x: auto;
    }

    .backend-error {
      min-height: 1.5em;
    }

    /* ======================================================
       Theme toggle
       ====================================================== */
    .btn-theme-toggle {
      border-radius: 0.25rem;
      padding: 0.375rem 1rem;
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      min-width: 130px;
      transition: background-color 0.2s, transform 0.1s;
    }

    .btn-theme-toggle:hover {
      transform: scale(1.05);
    }

    .btn-theme-toggle.light {
      background-color: var(--bg-card);
      color: var(--text-primary);
      border: 1px solid var(--ui-border);
    }

    .btn-theme-toggle.dark {
      background-color: var(--bs-body-bg);
      color: var(--text-primary);
      border: 1px solid var(--ui-border);
    }

    .btn-theme-toggle:active {
      transform: scale(0.97);
    }

    /* ======================================================
       Login overlay & card
       ====================================================== */
    .login-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1050;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .login-card {
      max-width: 500px;
      width: 100%;
      background-color: var(--bs-card-bg);
      color: var(--bs-card-color);
      border: 1px solid var(--ui-border);
      border-radius: 12px;
      box-shadow: var(--shadow-elevated);
      padding: 2rem 2.5rem;
    }

    .login-card input.form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      border-radius: 6px;
      border: 1px solid var(--ui-border);
      background-color: var(--bs-card-bg);
      color: var(--bs-card-color);
      transition: all 0.2s;
    }

    .login-card input.form-control:focus {
      border-color: var(--brand-strong);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-accent), transparent 75%);
      outline: none;
    }

    .login-card input::placeholder {
      color: var(--text-secondary);
    }

    .login-card .btn-login-card {
      background-color: var(--brand-strong);
      color: #fff;
      font-weight: 600;
      border: none;
      border-radius: 0.375rem;
      padding: 0.75rem 1rem; /* matches input height */
      font-size: 1rem;
      transition: background-color 0.2s, transform 0.1s;
    }

    /* Cancel button: secondary style */
    .login-card .btn-cancel {
      background-color: var(--bg-card);
      color: var(--text-primary);
      border: 1px solid var(--brand-accent);
      border-radius: 0.375rem;
      padding: 0.75rem 1rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s, transform 0.1s;
    }

    .login-card .btn-cancel:hover {
      cursor: pointer
      transform: scale(1.03);
    }
    
    .non-link-text, .login-links .non-link-text {
      color: var(--text-primary);
      font-size: 0.95rem;
    }

    .link-text {
      text-decoration: underline;
      cursor: pointer;
      color: var(--brand-accent);
      font-size: 0.95rem;
      transition: background-color 0.2s ease, transform 0.1s ease-in-out;
    }
`;