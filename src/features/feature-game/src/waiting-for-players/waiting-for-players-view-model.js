import { computed } from '@preact/signals';
import { navigateTo } from '../../../../app-shell/routing/current-route.js';
import { GlobalStore } from '../../../../../packages/common';


export class WaitingForPlayersViewModel {
    constructor() {
        this.players = computed(() => GlobalStore.game.currentGame.value?.players || []);
        this.isFull = computed(() => {
            const game = GlobalStore.game.currentGame.value;
            return game?.players?.length >= game?.maxPlayers;
        });

        this.allPlayersJoined = computed(() => {
            if (this.isFull.value) {
                navigateTo('/quick-game/in-progress');
            }
            return this.isFull.value;
        });
    }
}