'use strict';
const randomWordGenerator = require('../utils/random-string-generator');

class Player {
    sockerId;
    active;
    score;
    isAdmin;
    constructor(name) {
        this.id = randomWordGenerator.getRandomString(6);
        this.name = name;
    }
}

module.exports = Player