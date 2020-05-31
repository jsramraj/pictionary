const Player = require('../models/player')

var players = [];
const createPlayer = function (playerName) {
    let player = new Player(playerName);
    return player;
}

const addPlayer = function (player) {
    players.push(player);
}

const getAllPlayers = function () {
    return players;
}

const getPlayer = function (id) {
    return players.find(player => player.id === id);
}

const getPlayerForSocket = function (socketid) {
    return players.find(player => player.socketid === socketid);
}

const removePlayer = function (id) {
    let index = players.findIndex(player => player.id === id);
    if (index != -1) {
        players.splice(index, 1);
        return true;
    } else {
        return false;
    }
}


module.exports = { createPlayer, addPlayer, removePlayer, getAllPlayers, getPlayer, getPlayerForSocket }