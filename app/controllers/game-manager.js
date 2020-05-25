const Game = require('../models/game')
const Round = require('../models/round')
const ScoreCard = require('./scorecard')

roundData = {};
gameData = {};

const createGame = function (roomName, noOfRounds, timeToGuess) {
    let game = new Game(noOfRounds, timeToGuess);
    gameData[roomName] = game;
    return game;
}

const createRound = function (roomName) {
    let game = gameData[roomName];
    if (game.currentRound <= game.noOfRounds) {
        game.currentRound++
        let word = 'ball';
        let round = new Round(game.currentRound, word);
        roundData[roomName] = round;
        startRound(game.timeToGuess, roomName);
        return round;
    }
    return undefined;
}

const startRound = function (timeToGuess, roomName) {
    console.log('setting time out: ' + timeToGuess);
    setTimeout(saveScore, timeToGuess * 1000, roomName);
}

const validateGuess = function (guessedWord, roomName) {
    let round = roundData[roomName];
    if (typeof (round) != "undefined") {
        return round.word == guessedWord;
    }
    return false;
}

const updateScore = function (room, playerName) {
    let round = roundData[room.roomName];
    if (typeof (round) != "undefined") {
        let winners = Object.keys(round.scores).length;
        round.scores[playerName] = (room.players.length - winners) * 10;
        console.log(playerName + ' scored ' + round.scores[playerName] + ' points');
    }
}

const saveScore = function (roomName) {
    console.log('saving scores...');
    let round = roundData[roomName];
    for (var playerName in round.scores) {
        var score = round.scores[playerName];
        console.log(playerName + ': ' + score);
    }
    ScoreCard.updateScoreCard(round, roomName);
}

module.exports = { createGame, createRound, validateGuess, updateScore, saveScore }