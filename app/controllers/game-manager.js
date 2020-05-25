const Game = require('../models/game')
const Round = require('../models/round')
const ScoreCard = require('./scorecard')
const wordGenerator = require('./random-word-generator')

roundData = {};
gameData = {};
var players = {};

gameStartCallback = function () { };
gameEndCallback = function () { };

roundStartCallback = function () { };
roundEndCallback = function () { };

const setCallbacks = function (onGameStart, onGameEnd, onRoundStart, onRoundEnd) {
    gameStartCallback = onGameStart;
    gameEndCallback = onGameEnd;

    roundStartCallback = onRoundStart;
    roundEndCallback = onRoundEnd;
}

const createGame = function (roomName, noOfRounds, timeToGuess) {
    let game = new Game(noOfRounds, timeToGuess);
    gameData[roomName] = game;
    return game;
}

const getGame = function (roomName) {
    return gameData[roomName];
}

const startGame = function (roomName) {
    let game = getGame(roomName);
    gameStartCallback(game, roomName);
    setAsActivePlayer(roomName, 0);
    let round = createRound(roomName, true);
    startRound(round, roomName);
    return round;
}

const createRound = function (roomName, newRound) {
    let game = gameData[roomName];
    if (game.currentRound <= game.noOfRounds) {
        if (newRound === true)
            game.currentRound++;
        let word = wordGenerator.getRandomWord(roomName, 'medium');
        console.log('random word ' + word);
        let round = new Round(game.currentRound, game.timeToGuess, word);
        roundData[roomName] = round;
        round.players = players[roomName];

        return round;
    }
    return undefined;
}

const setPlayers = function (roomName, _players) {
    players[roomName] = _players;
}

const setAsActivePlayer = function (roomName, index) {
    let currentPlayers = players[roomName];
    currentPlayers.forEach((player, _index) => {
        player.active = (index == _index);
    });
}

const startRound = function (round, roomName) {
    roundStartCallback(getGame(roomName), round, roomName);
    console.log('setting time out: ' + round.timeToGuess);
    setTimeout(endTurn, round.timeToGuess * 1000, roomName);
}

const startTurn = function (roomName) {
    let round = roundData[roomName];
    let indexOfActivePlayer = round.players.findIndex(player => player.active === true);
    console.log('indexOfActivePlayer ' + indexOfActivePlayer);
    if (indexOfActivePlayer + 1 < round.players.length) {
        setAsActivePlayer(roomName, indexOfActivePlayer + 1);
        let nextRound = createRound(roomName, false);
        startRound(round, roomName);
    } else {
        setAsActivePlayer(roomName, 0);
        let nextRound = createRound(roomName, true);
        startRound(round, roomName);
        if (typeof (nextRound) == "undefined") {
            let game = getGame(roomName);
            gameEndCallback(game, roomName);
        }
    }
}

const endTurn = function (roomName) {
    let round = roundData[roomName];
    roundEndCallback(getGame(roomName), round, roomName);
    saveScore(roomName);

    setTimeout(startTurn, 5 * 1000, roomName);
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

module.exports = { setCallbacks, createGame, startGame, getGame, createRound, validateGuess, updateScore, saveScore, setPlayers, setAsActivePlayer }