import { css } from 'lit';

export const FeaturePlayingViewStyles = [
  css`
    .playing-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      gap: 20px;
      font-family: 'Arial', sans-serif;
      margin-top: 20px;
    }

    .player-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 120px;
    }

    .player-name {
      font-weight: bold;
      font-size: 1.2rem;
    }

    .player-score {
      margin-top: 4px;
      font-size: 1rem;
      color: #555;
    }

    .board {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .round-indicator {
      font-size: 1rem;
      margin-bottom: 12px;
      font-weight: bold;
    }

    .grid {
      display: grid;
      gap: 5px;
      margin-bottom: 10px;
    }

    .row {
      display: grid;
      grid-auto-flow: column;
      gap: 5px;
    }

    .cell {
      width: 50px;
      height: 50px;
      border: 2px solid #333;
      background-color: #4c6ef5;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 24px;
      color: white;
      text-transform: uppercase;
      border-radius: 4px;
      transition: background 0.2s, color 0.2s;
    }

    .cell.revealed {
      background-color: #4c6ef5;
    }

    .cell.correct-position {
      background-color: red;
      color: white;
    }

    .cell.wrong-position {
      background-color: yellow;
      border-radius: 50%; /* circle */
      color: black;
    }

    .cell.not-in-word {
      background-color: #4c6ef5;
      color: #888;
    }

    .guess-container {
      display: flex;
      gap: 6px;
      margin-top: 10px;
    }

    .guess-input {
      flex: 1;
      padding: 6px;
      font-size: 1rem;
      border: 2px solid #333;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .btn {
      padding: 6px 12px;
      font-size: 1rem;
      cursor: pointer;
      border: none;
      border-radius: 4px;
    }

    .btn-primary {
      background-color: #0d6efd;
      color: white;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }
    
    .submit-message {
      color: orange;
      margin-top: 4px;
    }
  `
];