import { css } from 'lit';

export const LandingPageViewStyles = [
    css`
        .high-lights {
            margin-bottom: 1rem;
        }

        .status-badge {
            display: inline-block;
            margin-right: 1rem;
            padding: 0.3rem 0.6rem;
            border-radius: 4px;
            font-weight: bold;
            color: white;
        }

        .status-badge.ok {
            background-color: #4caf50; /* green */
        }

        .status-badge.error {
            background-color: #f44336; /* red */
        }

        .home-landing ul {
            list-style: none;
            padding: 0;
        }

        .home-landing li {
            margin: 0.5rem 0;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            background-color: #2196f3;
            color: white;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        .home-landing li:hover {
            background-color: #1976d2;
        }

        .home-landing li.disabled {
            background-color: #b0bec5;
            cursor: not-allowed;
            pointer-events: none;
        }

        .loading-spinner {
            margin: 2rem 0;
            font-size: 1.2rem;
            font-weight: bold;
            color: #555;
            display: flex;
            align-items: center;
        }

        .loading-spinner::before {
            content: '';
            display: inline-block;
            margin-right: 0.5rem;
            width: 1rem;
            height: 1rem;
            border: 3px solid #ccc;
            border-top-color: #2196f3;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
    `
];