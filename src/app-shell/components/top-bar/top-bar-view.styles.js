import { css } from 'lit';

export const TopBarViewStyles = [
  css`
    :host {
      display: block;
      background-color: var(--color-surface);
      height: 60px;
      //color: var(--color-text);
      //border: 1px solid var(--shadow-misty);
      box-shadow: 5px var(--shadow-misty);
      //font-family: "Inter", "Roboto", sans-serif;
    }
  
    .top-bar-container {
      max-width: 1200px;
      height: 100%;
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