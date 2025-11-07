export class QuickGameResponse {
    constructor({ gameUuid }) {
        this.gameUuid = gameUuid;
    }

    static fromJson(json) {
        return new QuickGameResponse({
            gameUuid: json.gameUuid
        });
    }
}