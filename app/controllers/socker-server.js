let roomManager = require('./room-manager')
let gameManager = require('./game-manager')
let playerManager = require('./player-manager')
let scoreCard = require('./scorecard')

let io;
const initiateSocketConnection = function (server) {

    gameManager.setCallbacks(onGameStarted, onGameEnded, onRoundStarted, onRoundEnded);

    io = require('socket.io')(server);
    io.on('connection', (socket) => {
        socket.on('draw', function (data) {
            io.sockets.in(data.userData.roomName).emit('draw', data.drawingData);
        });

        socket.on('clear', function (roomName) {
            io.sockets.in(roomName).emit('clear', {});
        });

        socket.on('brush-size', function (data) {
            io.sockets.in(data.roomName).emit('brush-size', data.brushSize);
        });

        socket.on('join', function (data) {
            handleJoin(data, socket);
        });

        socket.on('message', function (data) {
            onMessage(data);
        });

        socket.on('play', function (roomData) {
            let room = roomManager.getRoom(roomData.name);
            console.log('creating round for room ' + room.name);
            roomManager.startGame(room);
        });

        socket.on('disconnect', () => {
            console.log(socket.id + ' disconnected');

            let player = playerManager.getPlayerForSocket(socket.id);
            if (typeof (playerData) != "undefined") {
                let room = roomManager.getRoomForPlayerWithId(player.id)
                roomManager.removePlayerFromRoom(room.name, player.id);
                io.sockets.in(room.name).emit('event', player.name + " has left");
            }
        });
    });
}

function handleJoin(data, socket) {
    let roomName = data.roomName;
    var player = playerManager.getPlayer(data.player.id);
    player.sockerId = socket.id;

    socket.join(roomName);
    io.sockets.in(roomName).emit('connectToRoom', player.name + " has joined");
    io.sockets.in(roomName).emit('event', player.name + " has joined");
    console.log(player.name + ' has joined ' + roomName + ' socket id ' + socket.id);
}

function onMessage(messageData) {
    let playerData = messageData.playerData;
    let room = roomManager.getRoom(playerData.roomName);

    let player = playerManager.getPlayer(playerData.playerId);
     let data = {
        player: player,
        message: messageData.message
    }
    let guessed = gameManager.validateGuess(messageData.message, room);
    if (guessed === true) {
        gameManager.updateScore(room, player.id);
        io.sockets.in(playerData.roomName).emit('event', player.name + ' guessed the word');
        console.log(player.name + ' guessed the word');
    } else {
        io.sockets.in(playerData.roomName).emit('message', JSON.stringify(data));
        console.log(player.name + ': ' + messageData.message);
    }
}


function onGameStarted(room) {
    console.log('Game started for room: ' + room.name);
    io.sockets.in(room.name).emit('gameStart', {});
}

function onGameEnded(room) {
    let players = roomManager.getPlayers(room.name);
    console.log('Game ended for room: ' + room.name);
    io.sockets.in(room.name).emit('gameEnd', players);
}

function onRoundStarted(room, round) {
    console.log('Round ' + round.roundNo + ' has started for room: ' + room.name + ', word: ' + round.word);
    io.sockets.in(room.name).emit('roundStart', {
        room: room,
        round: round,        
    });
}

function onRoundEnded(room, round) {
    console.log('Round ' + round.roundNo + ' has ended for room: ' + room.name);

    let players = roomManager.getPlayers(room.name);
    let scores = gameManager.saveScore(room, players);

    io.sockets.in(room.name).emit('roundEnd', {
        roundNo: round.roundNo,
        noOfRounds: room.game.noOfRounds,
        timeToGuess: round.timeToGuess,
        scores: scores,
    });
}

module.exports = { initiateSocketConnection };