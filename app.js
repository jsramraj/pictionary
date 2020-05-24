const app = require('express')();
const server = require('http').Server(app);

const path = require('path');
var bodyParser = require('body-parser');

const { port } = require('./config');
let socket = require('./app/controllers/socker-server')
let roomManager = require('./app/controllers/room-manager')
let playerManager = require('./app/controllers/player-manager')

app.use(bodyParser.urlencoded({ extended: true }));

server.listen(port, () => {
    console.log(`Server running at port:${port}`);
    socket.initiateSocketConnection(server);
});

app.use(require('express').static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
});

app.post('/createRoom', function (req, res) {
    console.log(req.body);
    // console.log(req.body['no-of-rounds']);
    // var data = JSON.parse('{"result":true, "count":42}');
    var data = req.body;
    console.log(data);

    let room = roomManager.createRoom(req.body.noOfRounds, req.body.timeToGuess);
    let player = playerManager.createPlayer(req.body.playerName, true);
    room.addPlayerToRoom(player);

    res.send(room);
    // res.sendFile(__dirname + '/public/views/board.html');
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

