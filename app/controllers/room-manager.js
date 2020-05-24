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

const addPlayerToRoom = function (room, player) {
    room.addPlayerToRoom(player);
}

const getPlayer = function (roomName, playerName) {
    var room = rooms.find(room => room.roomName == roomName);
    var player = room.players.find(player => player.playerName == playerName);
    return player;
}

module.exports = { createRoom }