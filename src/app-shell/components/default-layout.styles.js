import { css } from 'lit';

export const DefaultLayoutStyles = [
    css`
        header {
            background: #333;
            color: #fff;
            padding: 1rem;
        }
        nav a {
            margin-right: 1rem;
            color: #fff;
            text-decoration: none;
        }
        nav a.active {
            text-decoration: underline;
        }
        main {
            padding: 1rem;
        }
    `
];