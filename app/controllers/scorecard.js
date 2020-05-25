
scoreCard = {};

const updateScoreCard = function (round, roomName) {
    let currentScore = scoreCard[roomName];
    if (typeof (currentScore) == "undefined") {
        currentScore = [];
        scoreCard[roomName] = currentScore;
    }
    currentScore.push(round);
    console.log('score ' + currentScore);
}

const getScoreCard = function (roomName) {
    let scoreboard = scoreCard[roomName];
    return scoreboard;
}

const sumOfScore = function (roomName) {
    let scoreboard = getScoreCard(roomName);
    let scores = {};
    if (typeof (scoreboard) == "undefined") {
        return scores;
    }
    scoreboard.forEach(roundScore => {
        for (var playerName in roundScore.scores) {
            let currentScore = scores[playerName];
            if (typeof (currentScore) == "undefined") {
                currentScore = 0;
            }
            currentScore += roundScore.scores[playerName];
            scores[playerName] = currentScore;
        }
    });
    return scores;
}

module.exports = { updateScoreCard, getScoreCard, sumOfScore }