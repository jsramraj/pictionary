var Room = require('../models/room')
const Player = require('../models/player')
const GameManager = require('./game-manager')
const randomWordGenerator = require('../utils/random-string-generator')

var rooms = [];

const createRoom = function (noOfRounds, timeToGuess) {
    console.log(noOfRounds + ' ' + timeToGuess);

    let roomName = randomWordGenerator.getRandomString(6);
    let game = GameManager.createGame(noOfRounds, timeToGuess);

    let room = new Room(roomName, game);
    rooms.push(room);

    return room;
}

const addPlayerToRoom = function (roomName, playerId) {
    var room = rooms.find(room => room.name == roomName);
    if (typeof (room) != "undefined") {
        room.addPlayerToRoom(playerId);
        // GameManager.setPlayers(roomName, room.players);
        return 200;
    }
    //no room found with that name
    return 404;
}

const removePlayerFromRoom = function (roomName, playerName) {
    var room = rooms.find(room => room.roomName == roomName);
    var player = room.players.find(player => player.playerName == playerName);
    if (typeof (player) != "undefined") {
        const index = room.players.indexOf(player);
        if (index > -1) {
            room.players.splice(index, 1);
            GameManager.setPlayers(roomName, room.players);
        }
    }
}

const getPlayer = function (roomName, playerName) {
    var room = rooms.find(room => room.roomName == roomName);
    if (typeof (room) != "undefined") {
        var player = room.players.find(player => player.playerName == playerName);
        return player;
    }
    return undefined;
}

const getPlayerForSocket = function (socketId) {
    let playerData;
    rooms.forEach(room => {
        var player = room.players.find(player => player.sockerId == socketId);
        if (typeof (player) != "undefined") {
            playerData = { playerName: player.playerName, roomName: room.roomName };
        }
    })
    return playerData;
}

const getRoom = function (roomName) {
    var room = rooms.find(room => room.roomName == roomName);
    return room;
}

const getPlayers = function (roomName) {
    var room = rooms.find(room => room.roomName == roomName);
    if (typeof (room) != "undefined") {
        return room.players;
    }
    return [];
}

const setSocketId = function (roomName, playerName, socketId) {
    let player = getPlayer(roomName, playerName);
    if (typeof (player) != "undefined") {
        player.sockerId = socketId;
    }
}

module.exports = { createRoom, addPlayerToRoom, removePlayerFromRoom, getPlayer, getPlayerForSocket, getPlayers, getRoom, setSocketId }