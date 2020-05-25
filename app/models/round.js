'use strict';

class Round {
    scores = {};
    players = [];
    constructor(roundNo, timeToGuess, word) {
        this.word = word;
        this.roundNo = roundNo;
        this.timeToGuess = timeToGuess;
    }
}

module.exports = Round