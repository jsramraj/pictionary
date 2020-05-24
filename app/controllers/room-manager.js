var Room = require('../models/room')
const Player = require('../models/player')

var roomNo = 1;
var rooms = [];

const getRoomName = function () {
    roomNo++;
    return 'room' + roomNo;
}

const createRoom = function (noOfRounds, timeToGuess) {
    console.log(noOfRounds + ' ' + timeToGuess);
    let roomName = getRoomName();
    let room = new Room(roomName, noOfRounds, timeToGuess);
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

const getPlayer = function (roomName, playerName) {
    var room = rooms.find(room => room.roomName == roomName);
    var player = room.players.find(player => player.playerName == playerName);
    return player;
}

const getPlayers = function (roomName) {
    var room = rooms.find(room => room.roomName == roomName);
    if (typeof (room) != "undefined") {
        return room.players;
    }
    return [];
}

module.exports = { createRoom, addPlayerToRoom, getPlayer, getPlayers }