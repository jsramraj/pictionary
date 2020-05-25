'use strict';

class Room {
    players = [];
    game;

    constructor(roomName, game) {
        this.roomName = roomName;
        this.game;
    }

    addPlayerToRoom = function (player) {
       this.players.push(player);
    }

    print() {
        console.log(this.players.length);
    }
    
}

module.exports = Room