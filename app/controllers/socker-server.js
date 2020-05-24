
let io;
const initiateSocketConnection = function (server) {
    io = require('socket.io')(server);
    io.on('connection', (socket) => {
        socket.on('draw', function (data) {
            // console.log(data.type + ' at ' + data.x + ', ' + data.y);
            io.sockets.in(data.userData.roomName).emit('draw', data.drawingData);
        });

        socket.on('join', function (room) {
            handleJoin(room, socket);
        });
    });
}

function handleJoin(room, socket) {
    console.log(room);
    let roomJson = JSON.parse(room);
    let roomName = roomJson.roomName;
    let playerName = roomJson.playerName;
    socket.join(roomName);
    io.sockets.in(roomName).emit('connectToRoom', playerName + " has joined");
}

module.exports = { initiateSocketConnection };