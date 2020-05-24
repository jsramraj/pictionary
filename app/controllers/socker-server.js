
const initiateSocketConnection = function (server) {
    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
        socket.on('draw', function (data) {
            console.log(data.type + ' at ' + data.x + ', ' + data.y);
            socket.broadcast.emit('draw', data);
        });

        client.on('create', handleCreate)

        client.on('join', handleJoin)

    });
}

function handleJoin(data) {
    console.log(data);
}

module.exports = { initiateSocketConnection };