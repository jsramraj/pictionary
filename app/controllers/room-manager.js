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

module.exports = { createRoom }