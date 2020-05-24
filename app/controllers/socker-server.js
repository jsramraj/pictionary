
let io;
const initiateSocketConnection = function (server) {
    io = require('socket.io')(server);
    io.on('connection', (socket) => {
        socket.on('draw', function (data) {
            // console.log(data.type + ' at ' + data.x + ', ' + data.y);
            if(data.drawingData.type == 'mousedown') {
                console.log(data.userData.playerName + ' is drawing at ' + data.userData.roomName + ' socket id ' + socket.id);            
            }
            io.sockets.in(data.userData.roomName).emit('draw', data.drawingData);
        });

        socket.on('join', function (room) {
            handleJoin(room, socket);
        });
    });
}

function handleJoin(room, socket) {
    let roomJson = JSON.parse(room);
    let roomName = roomJson.roomName;
    let playerName = roomJson.playerName;
    socket.join(roomName);
    io.sockets.in(roomName).emit('connectToRoom', playerName + " has joined");    
    console.log(playerName + ' has joined ' + roomName + ' socket id ' + socket.id);
}

module.exports = { initiateSocketConnection };