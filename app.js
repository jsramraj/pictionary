const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const { port } = require('./config');

server.listen(port, () => {
    console.log(`Server running at port:${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    socket.on('draw', function (data) {
        console.log(data.type + ' at ' + data.x + ', ' + data.y);
        socket.broadcast.emit('draw', data);
    });
    // socket.emit('news', { hello: 'world' });
    // socket.on('my other event', (data) => {
    //   console.log(data);
    // });

});