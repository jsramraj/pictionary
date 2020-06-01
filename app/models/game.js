class Game {
    currentRound = 0;
    round;
    constructor(noOfRounds, timeToGuess) {
        this.noOfRounds = noOfRounds;
        this.timeToGuess = timeToGuess;
    }
}

module.exports = Game