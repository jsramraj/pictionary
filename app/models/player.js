class Player {
    sockerId;
    constructor(playerName, isAdmin) {
        this.playerName = playerName;
        this.isAdmin = isAdmin;
    }
}

module.exports = Player