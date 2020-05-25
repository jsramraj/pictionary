var Room = require('../models/room')
const Player = require('../models/player')
const GameManager = require('./game-manager')

var roomNo = 1;
var rooms = [];

const getRoomName = function () {
    roomNo++;
    return 'room' + roomNo;
}

const createRoom = function (noOfRounds, timeToGuess) {
    console.log(noOfRounds + ' ' + timeToGuess);

    let roomName = getRoomName();
    let game = GameManager.createGame(roomName, noOfRounds, timeToGuess);

    let room = new Room(roomName, game);
    rooms.push(room);

    return room;
}

const addPlayerToRoom = function (roomName, player) {
    var room = rooms.find(room => room.roomName == roomName);
    if (typeof (room) != "undefined") {
        room.addPlayerToRoom(player);
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