
scoreCard = {};

const updateScoreCard = function (room, players) {
    let round = room.game.round;

    players.forEach((player, index) => {
        player.score = player.score || 0;
        player.score += round.scores[player.id];
    })
}

const getRoundScores = function (round, players) {
    var scores = [];
    players.forEach((player, index) => {
        var score = {};
        score["name"] = player.name;
        score["score"] = round.scores[player.id] || 0;
        scores.push(score);
    });
    return scores;
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

module.exports = { updateScoreCard, getRoundScores, getScoreCard, sumOfScore }