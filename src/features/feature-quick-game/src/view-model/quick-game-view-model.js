import { startQuickGame } from "../api/quick-game-api.js";

export class QuickGameViewModel {
    constructor() {
        this.player = { name: 'A', language: 'dutch', email: 'email@email.email' };
        this.loading = false;
        this.error = null;
        this.game = null;
    }

    async startGame() {
        this.loading = true;
        this.error = null;

        try {
            this.game = await startQuickGame(this.player);
        } catch (err) {
            this.error = err.message;
            this.game = null;
        } finally {
            this.loading = false;
        }
    }
}