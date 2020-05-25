'use strict';

const fs = require('fs');
const path = require('path');

var words = {};

const initializeData = function () {
    let filePath = path.join(__dirname, "../assets/data/words.json");
    let data = fs.readFileSync(filePath);
    words = JSON.parse(data);
}

const getRandomWord = function (roomName, difficulty) {
    if (Object.keys(words).length === 0) {
        initializeData();
    }
    var wordsByDifficulty = words[difficulty];
    let randomNo = Math.floor(Math.random() * wordsByDifficulty.length - 1) + 1;
    return wordsByDifficulty[randomNo];
}

module.exports = { getRandomWord }