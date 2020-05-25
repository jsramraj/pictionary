
scoreCard = {};

const updateScoreCard = function (round, roomName) {
    let currentScore = scoreCard[roomName];
    currentScore.push(round);
}

module.exports = { updateScoreCard }