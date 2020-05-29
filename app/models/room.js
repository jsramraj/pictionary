'use strict';

class Room {
    playerIDs = [];
    game;

    constructor(name, game) {
        this.name = name;
        this.game = game;
    }

    addPlayerToRoom = function (playerID) {
       this.playerIDs.push(playerID);
    }
}

module.exports = Room