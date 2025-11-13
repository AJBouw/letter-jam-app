import { css } from 'lit';

export const TopBarStyles = [
    css`
        :host {
            display: block;
            background: #fff;
            border-bottom: 1px solid #e5e5e5;
            font-family: "Inter", "Roboto", sans-serif;
        }

        .bar {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0.5rem 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
        }

        ::slotted([slot="actions"]) {
            display: flex;
            gap: 0.5rem;
        }

        ::slotted(button) {
            border: none;
            border-radius: 4px;
            background: #0078d4;
            color: white;
            padding: 0.5rem 1rem;
            cursor: pointer;
        }

        ::slotted(button:hover) {
            background: #005a9e;
        }:host {
             display: block;
             background: #ffffff;
             border-bottom: 1px solid #e5e5e5;
             font-family: 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
             color: #333;
         }

        header {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0.75rem 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .left,
        .right {
            display: flex;
            align-items: center;
        }

        ::slotted([slot='logo']) {
            font-weight: 700;
            font-size: 1.5rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            cursor: pointer;
        }

        ::slotted([slot='actions']) {
            display: flex;
            gap: 0.75rem;
        }

        ::slotted(button) {
            border: none;
            border-radius: 4px;
            background-color: #0078d4;
            color: #fff;
            padding: 0.5rem 1rem;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background 0.2s;
        }

        ::slotted(button:hover) {
            background-color: #005a9e;
        }:host {
             display: block;
             background: #fff;
             border-bottom: 1px solid #e5e5e5;
             font-family: 'Inter', 'Roboto', sans-serif;
         }

        header {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0.75rem 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .left {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .logo-img {
            height: 40px;
            width: auto;
        }

        .right ::slotted(button) {
            border: none;
            border-radius: 4px;
            background: #0078d4;
            color: white;
            padding: 0.5rem 1rem;
            cursor: pointer;
        }
    `
]