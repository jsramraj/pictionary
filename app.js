const app = require('express')();
const server = require('http').Server(app);
let ejs = require('ejs');

const path = require('path');
var bodyParser = require('body-parser');
var url = require('url');

const Player = require('./app/models/player')

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
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
});

app.get('/board', (req, res) => {
    // res.sendFile(__dirname + '/public/views/board.html');
    res.render('board', { url: '/', players: [] });
});

app.post('/createRoom', function (req, res) {
    let room = roomManager.createRoom(req.body.noOfRounds, req.body.timeToGuess);
    let player = playerManager.createPlayer(req.body.playerName, true);
    roomManager.addPlayerToRoom(room.roomName, player);

    var data = {
        playerName: req.body.playerName,
        isAdmin: true,
        roomName: room.roomName,
    };
    res.send(data);
});

app.post('/joinRoom', function (req, res) {
    console.log(req.body);
    let player = playerManager.createPlayer(req.body.playerName, false);
    let status = roomManager.addPlayerToRoom(req.body.roomName, player);
    console.log(status);
    let data = { status: status };
    res.status(status);
    res.send(JSON.stringify(data));
});

app.get('/getPlayers', function (req, res) {
    var roomName = req.query.roomName;
    let players = roomManager.getPlayers(roomName);
    res.send(JSON.stringify(players));
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

