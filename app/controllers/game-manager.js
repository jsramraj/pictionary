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
    if (typeof (game) == "undefined") {
        return undefined;
    }
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
    if (typeof (currentPlayers) == "undefined") {
        return;
    }
    currentPlayers.forEach((player, _index) => {
        player.active = (index == _index);
    });
}

const updateFullScore = function (roomName, score) {
    let currentPlayers = players[roomName];
    currentPlayers.forEach((player, _index) => {
        var sumScore = score[player.playerName];
        if (typeof (sumScore) == "undefined") {
            sumScore = 0;
        }
        player.score = sumScore;
        console.log('overall round score for ' + player.playerName + ': ' + player.score);
    });
}

var guessTimer;
var timerToNextRound;
const startRound = function (round, roomName) {
    if (typeof (round) == "undefined") {
        return;
    }
    roundStartCallback(getGame(roomName), round, roomName);
    console.log('setting time out: ' + round.timeToGuess);
    guessTimer = setTimeout(endTurn, round.timeToGuess * 1000, roomName);
}

const startTurn = function (roomName) {
    clearInterval(timerToNextRound);
    let round = roundData[roomName];
    let indexOfActivePlayer = round.players.findIndex(player => player.active === true);
    console.log('indexOfActivePlayer ' + indexOfActivePlayer);
    if (indexOfActivePlayer + 1 < round.players.length) {
        setAsActivePlayer(roomName, indexOfActivePlayer + 1);
        let nextRound = createRound(roomName, false);
        if (typeof (nextRound) == "undefined") {
            // let game = getGame(roomName);
            let score = ScoreCard.getScoreCard(roomName);
            gameEndCallback(score, roomName);
        } else {
            startRound(round, roomName);
        }
    } else {
        setAsActivePlayer(roomName, 0);
        let nextRound = createRound(roomName, true);
        if (typeof (nextRound) == "undefined") {
            let game = getGame(roomName);
            gameEndCallback(game, roomName);
        } else {
            startRound(round, roomName);
        }
    }
}

const endTurn = function (roomName) {
    clearInterval(guessTimer);

    let round = roundData[roomName];
    saveScore(roomName);
    roundEndCallback(getGame(roomName), round, roomName);

    timerToNextRound = setTimeout(startTurn, 5 * 1000, roomName);
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
    let overAllScoresData = ScoreCard.sumOfScore(roomName);
    updateFullScore(roomName, overAllScoresData);
}

module.exports = { setCallbacks, createGame, startGame, getGame, createRound, validateGuess, updateScore, saveScore, setPlayers, setAsActivePlayer }