'use strict';

class Round {
    scores = {};
    constructor(roundNo, word) {
        this.word = word;
        this.roundNo = roundNo;
    }
}

module.exports = Round