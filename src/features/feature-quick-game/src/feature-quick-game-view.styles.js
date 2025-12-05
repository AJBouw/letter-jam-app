import { css } from 'lit';

export const FeatureQuickGameViewStyles = [
    css`
        form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-width: 400px;
            margin: 2rem auto;
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #fafafa;
        }

        input, select, button {
            padding: 0.5rem;
            font-size: 1rem;
            border-radius: 4px;
            border: 1px solid #ccc;
        }

        input:focus, select:focus {
            outline: none;
            border-color: #3f51b5;
            box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
        }

        button {
            background-color: #3f51b5;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        button:disabled {
            background-color: #999;
            cursor: not-allowed;
        }

        .error {
            color: #d32f2f;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }

        .backend-error {
            background-color: #fdecea;
            color: #b71c1c;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            margin-top: 1rem;
            text-align: center;
            font-weight: bold;
        }
    `
];