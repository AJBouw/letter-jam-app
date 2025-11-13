import { css } from 'lit';

export const DefaultLayoutStyles = [
    css`
        .site-nav {
            background: #f8f8f8;
            border-bottom: 1px solid #e5e5e5;
        }

        .site-nav ul {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 16px;
            display: flex;
            list-style: none;
        }

        .site-nav li + li {
            margin-left: 20px;
        }

        .site-nav a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            padding: 0.75rem 0;
            display: block;
        }

        .site-nav a:hover {
            color: #0078d4;
        }

        .site-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 16px;
    `
];