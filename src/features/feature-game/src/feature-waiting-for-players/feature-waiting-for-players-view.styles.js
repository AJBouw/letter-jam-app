import { css } from 'lit';

export const FeatureWaitingForPlayersViewStyles = [
  css`
    .waiting-for-players {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1.5rem;
      border-radius: 8px;
      background-color: #f5f5f5;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      font-family: sans-serif;
      text-align: center;
    }

    .waiting-for-players h2 {
      margin-bottom: 1rem;
      color: #333;
    }

    .waiting-for-players p {
      margin: 0.5rem 0;
      font-size: 1rem;
      color: #555;
    }

    .waiting-for-players ul {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
      max-height: 200px;
      overflow-y: auto;
    }

    .waiting-for-players li {
      background-color: #fff;
      padding: 0.5rem 1rem;
      margin-bottom: 0.5rem;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .waiting-for-players button {
      padding: 0.6rem 1.2rem;
      margin: 0.5rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .waiting-for-players button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .waiting-for-players button:not(:disabled) {
      background-color: #007bff;
      color: #fff;
    }

    .waiting-for-players button:not(:disabled):hover {
      background-color: #0056b3;
    }

    .spinner {
      margin: 1rem auto;
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .error {
      color: #c0392b;
      margin: 1rem 0;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
];