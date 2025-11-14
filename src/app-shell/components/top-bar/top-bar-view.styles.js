import { css } from 'lit';

export const TopBarViewStyles = [
    css`
        :host {
            display: block;
            border-bottom: 1px solid #ededed;
            box-shadow: 2px 2px #3b3b3b;
            font-family: "Inter", "Roboto", sans-serif;
        }

        .top-bar-container {
            max-width: 1200px;
            margin: 0 auto;
            
            display: flex;
            align-items: center;
        }

        .logo {
            font-size: 1.5rem;
        }

        .top-bar-left,
        .top-bar-right {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo-img {
            height: 40px;
            width: auto;
        }
    `
]