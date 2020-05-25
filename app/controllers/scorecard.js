
scoreCard = {};

const updateScoreCard = function (round, roomName) {
    let currentScore = scoreCard[roomName];
    if (typeof (currentScore) == "undefined") {
        currentScore = [];
        scoreCard[roomName] = currentScore;
    }
    currentScore.push(round);
}

module.exports = { updateScoreCard }