import { computed, signal } from '@preact/signals';
import { GlobalStore } from '../../../../../packages/common';
import { navigateTo } from '../../../../app-shell/routing/current-route.js';

export class FeatureReadyToStartViewModel {
    constructor() {
        const game = GlobalStore.game.currentGame;

        this.game = computed(() => game.value);
        this.playerReady = signal({});

        this.allReady = computed(() => {
            const g = this.game.value;
            if (!g?.players) return false;
            return g.players.every(p => this.playerReady.value[p.uuid]);
        });
    }

    setReady(uuid) {
        this.playerReady.value = { ...this.playerReady.value, [uuid]: true };

        // reactive navigation
        if (this.allReady.value) {
            console.log('navigate')
            navigateTo('/quick-game/playing');
        }
    }
}