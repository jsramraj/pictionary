let roomManager = require('./room-manager')
let gameManager = require('./game-manager')
let scoreCard = require('./scorecard')

let io;
const initiateSocketConnection = function (server) {

    gameManager.setCallbacks(onGameStarted, onGameEnded, onRoundStarted, onRoundEnded);

    io = require('socket.io')(server);
    io.on('connection', (socket) => {
        socket.on('draw', function (data) {
            // console.log(data.type + ' at ' + data.x + ', ' + data.y);
            if (data.drawingData.type == 'mousedown') {
                console.log(data.userData.playerName + ' is drawing at ' + data.userData.roomName + ' socket id ' + socket.id);
            }
            io.sockets.in(data.userData.roomName).emit('draw', data.drawingData);
        });

        socket.on('clear', function (roomName) {
            io.sockets.in(roomName).emit('clear', {});
        });

        socket.on('brush-size', function (data) {
            io.sockets.in(data.roomName).emit('brush-size', data.brushSize);
        });

        socket.on('join', function (room) {
            handleJoin(room, socket);
        });

        socket.on('message', function (data) {
            onMessage(data);
        });

        socket.on('play', function (roomName) {
            console.log('creating round for room ' + roomName);
            let round = gameManager.startGame(roomName);
            let game = gameManager.getGame(roomName);
        });

        socket.on('disconnect', () => {
            console.log(socket.id + ' disconnected');
            let playerData = roomManager.getPlayerForSocket(socket.id);
            if (typeof (playerData) != "undefined") {
                roomManager.removePlayerFromRoom(playerData.roomName, playerData.playerName);
                io.sockets.in(playerData.roomName).emit('event', playerData.playerName + " has left");
            }
        });
    });
}

function handleJoin(room, socket) {
    let roomJson = JSON.parse(room);
    let roomName = roomJson.roomName;
    let playerName = roomJson.playerName;

    roomManager.setSocketId(roomName, playerName, socket.id);

    socket.join(roomName);
    io.sockets.in(roomName).emit('connectToRoom', playerName + " has joined");
    io.sockets.in(roomName).emit('event', playerName + " has joined");
    console.log(playerName + ' has joined ' + roomName + ' socket id ' + socket.id);
}

function onMessage(messageData) {
    let playerData = messageData.playerData;
    let player = roomManager.getPlayer(playerData.roomName, playerData.playerName);
    let data = {
        player: player,
        message: messageData.message
    }
    let guessed = gameManager.validateGuess(messageData.message, playerData.roomName);
    if (guessed === true) {
        let room = roomManager.getRoom(playerData.roomName);
        gameManager.updateScore(room, playerData.playerName);
        io.sockets.in(playerData.roomName).emit('event', playerData.playerName + ' guessed the word');
        console.log(playerData.playerName + ' guessed the word');
    } else {
        io.sockets.in(playerData.roomName).emit('message', JSON.stringify(data));
        console.log(playerData.playerName + ': ' + messageData.message);
    }
}


function onGameStarted(game, roomName) {
    console.log('Game started for room: ' + roomName);
    io.sockets.in(roomName).emit('gameStart', {});
}

function onGameEnded(game, roomName) {
    console.log('Game ended for room: ' + roomName);
    io.sockets.in(roomName).emit('gameEnd', {});
}

function onRoundStarted(game, round, roomName) {
    console.log('Round ' + round.roundNo + ' has started for room: ' + roomName + ', word: ' + round.word);
    io.sockets.in(roomName).emit('roundStart', {
        noOfRounds: game.noOfRounds,
        round: round
    });
}

function onRoundEnded(game, round, roomName) {
    console.log('Round ' + round.roundNo + ' has ended for room: ' + roomName);
    let scores = {};
    let room = roomManager.getRoom(roomName);

    room.players.forEach(player => {
        var score = round.scores[player.playerName];
        if (typeof (score) == "undefined") {
            score = 0;
        }
        scores[player.playerName] = score;
        console.log('current round score for ' + player.playerName + ': ' + scores[player.playerName]);
    });

    io.sockets.in(roomName).emit('roundEnd', {
        roundNo: round.roundNo,
        noOfRounds: game.noOfRounds,
        timeToGuess: round.timeToGuess,
        scores: scores,
    });
}

module.exports = { initiateSocketConnection };