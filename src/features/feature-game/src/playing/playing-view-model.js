import { computed } from '@preact/signals';
import { GlobalStore } from '../../../../../packages/common';

export class PlayingViewModel {
    constructor() {
        // Full reactive reference to the current game
        this.game = computed(() => GlobalStore.game.currentGame.value);

        // Players with default score = 0
        this.players = computed(() =>
            this.game.value?.players?.map(p => ({ ...p, score: p.score ?? 0 })) || []
        );

        // Current player (optional)
        this.currentPlayer = computed(() => {
            const gameVal = this.game.value;
            if (!gameVal || !gameVal.players) return null;
            return gameVal.players.find(p => p.uuid === gameVal.currentPlayerUuid) || null;
        });

        // Reactive "waiting for opponent" status
        this.waitingForOpponent = computed(() => {
            const gameVal = this.game.value;
            if (!gameVal || !gameVal.players) return true;
            return gameVal.players.some(p => !p.ready);
        });

        // Button enabled only when all players are ready
        this.canStart = computed(() => !this.waitingForOpponent.value);

    }
}