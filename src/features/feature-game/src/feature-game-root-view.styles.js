import { css } from 'lit';

export const FeatureGameRootViewStyles =[
  css`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px; /* adjust to fit your layout */
      font-family: sans-serif;
      color: #333;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 5px solid #ccc;
      border-top-color: #007bff; /* blue spinner */
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 10px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-container p {
      font-size: 1rem;
      margin: 0;
    }
  `
];