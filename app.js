const express = require('express')();
const server = require('http').Server(express);
const io = require('socket.io')(server);

const path = require('path');

const { port } = require('./config');


server.listen(port, () => {
    console.log(`Server running at port:${port}`);
});

// express.use(require('express').static('public'))
express.use(require('express').static(path.join(__dirname, 'public')));

express.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
});


/*
const app = express();
app.use(express.static('public'))
app.listen(port, () => {
    console.log(`listening on port ${port}`)   
});

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/views/board.html');
});
*/

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