const Player = require('../models/player')

const createPlayer = function (playerName, isAdmin) {
    let player = new Player(playerName, isAdmin);
    return player;
}

module.exports = { createPlayer }