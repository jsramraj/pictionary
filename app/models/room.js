'use strict';

class Room {
    players = [];

    constructor(roomName, noOfRounds, timeToGuess) {
        this.roomName = roomName;
        this.noOfRounds = noOfRounds;
        this.timeToGuess = timeToGuess;
    }

    addPlayerToRoom = function (player) {
       this.players.push(player);
    }

    print() {
        console.log(this.players.length);
    }
    
}

module.exports = Room