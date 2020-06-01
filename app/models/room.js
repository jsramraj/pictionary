'use strict';

class Room {
    playerIDs = [];
    game;
    activePlayerId;

    constructor(name, game) {
        this.name = name;
        this.game = game;
    }

    addPlayerToRoom = function (playerID) {
       this.playerIDs.push(playerID);
    }
}

module.exports = Room