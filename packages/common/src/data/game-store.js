import { signal } from '@preact/signals';

/**
 * Global reactive error state
 */
export const gameStore = {
  game: signal(null),
  
  setGame(game) {
    this.game.value = game;
  },
  
  reset() {
    this.game.value = null;
  }
};