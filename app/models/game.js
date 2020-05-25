class Game {
    currentRound = 0;
    constructor(noOfRounds, timeToGuess) {
        this.noOfRounds = noOfRounds;
        this.timeToGuess = timeToGuess;
    }
}

module.exports = Game