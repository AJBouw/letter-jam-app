import { signal } from '@preact/signals';

/**
 * Global reactive error state
 */
export const gameStore = {
    currentGame: signal(null),
    rounds: signal([]),
    players: signal([]),

    setGame(game) {
        if (!game) return;
        // default to empty array to avoid undefined errors
        game.players = game.players || [];
        this.currentGame.value = game;
        this.players.value = game.players;
    },

    setRounds(rounds) {
        this.rounds.value = rounds || [];
    },

    setPlayers(players) {
        this.players.value = players || [];
    },

    reset() {
        this.currentGame.value = null;
        this.rounds.value = [];
        this.players.value = [];
    }
};