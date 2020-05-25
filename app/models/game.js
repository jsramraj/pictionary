class Game {
    currentRound = 1;
    constructor(noOfRounds, timeToGuess) {
        this.noOfRounds = noOfRounds;
        this.timeToGuess = timeToGuess;
    }
}

module.exports = Game