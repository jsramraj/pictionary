let roomManager = require('./room-manager')

let io;
const initiateSocketConnection = function (server) {
    io = require('socket.io')(server);
    io.on('connection', (socket) => {
        socket.on('draw', function (data) {
            // console.log(data.type + ' at ' + data.x + ', ' + data.y);
            if (data.drawingData.type == 'mousedown') {
                console.log(data.userData.playerName + ' is drawing at ' + data.userData.roomName + ' socket id ' + socket.id);
            }
            io.sockets.in(data.userData.roomName).emit('draw', data.drawingData);
        });

        socket.on('join', function (room) {
            handleJoin(room, socket);
        });

        socket.on('message', function (data) {
            onMessage(data);
        });

        socket.on('disconnect', () => {
            console.log(socket.id + ' disconnected');
            let playerData = roomManager.getPlayerForSocket(socket.id);
            if (typeof (playerData) != "undefined") {
                roomManager.removePlayerFromRoom(playerData.roomName, playerData.playerName);
                io.sockets.in(playerData.roomName).emit('event', playerData.playerName + " has left");
            }
        });
    });
}

function handleJoin(room, socket) {
    let roomJson = JSON.parse(room);
    let roomName = roomJson.roomName;
    let playerName = roomJson.playerName;

    roomManager.setSocketId(roomName, playerName, socket.id);

    socket.join(roomName);
    io.sockets.in(roomName).emit('connectToRoom', playerName + " has joined");
    io.sockets.in(roomName).emit('event', playerName + " has joined");
    console.log(playerName + ' has joined ' + roomName + ' socket id ' + socket.id);
}

function onMessage(messageData) {
    let playerData = messageData.playerData;
    let player = roomManager.getPlayer(playerData.roomName, playerData.playerName);
    let data = {
        player: player,
        message: messageData.message
    }
    console.log(data);
    io.sockets.in(playerData.roomName).emit('message', JSON.stringify(data));
    console.log(playerData.playerName + ': ' + messageData.message);
}

module.exports = { initiateSocketConnection };