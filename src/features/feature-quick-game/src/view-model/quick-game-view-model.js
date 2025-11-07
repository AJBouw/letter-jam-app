import { post } from "../../../../services/api/api.js";

export class QuickGameViewModel {
    constructor() {
        this.player = { name: 'A', language: 'dutch', email: 'email@email.email' }; // static demo
        this.loading = false;
        this.error = null;
        this.game = null;
    }

    async startGame() {
        console.log('[VM] startGame called');
        this.loading = true;
        this.error = null;
        try {
            this.game = await post('/game/quick-start', this.player);
        } catch (err) {
            this.error = err.message;
            this.game = null;
        } finally {
            this.loading = false;
        }
    }
}