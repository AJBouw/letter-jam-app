import { startQuickGame } from '../api/game-api.js';

export class GameViewModel {
    async startGame() {
        // example static player data
        const player = {
            name: "A",
            language: "dutch",
            email: "email@email.email"
        };

        try {
            const result = await startQuickGame(player);
            console.log('Game started:', result);
            alert('Quick game started!');
        } catch (err) {
            console.error(err);
            alert('Error starting game');
        }
    }
}