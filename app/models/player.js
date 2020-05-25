class Player {
    sockerId;
    active;
    constructor(playerName, isAdmin) {
        this.playerName = playerName;
        this.isAdmin = isAdmin;
    }
}

module.exports = Player