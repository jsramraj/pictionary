const app = require('express')();
const server = require('http').Server(app);
let ejs = require('ejs');
var favicon = require('serve-favicon')

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
app.use(favicon(path.join(__dirname, 'public', 'assets', 'images', 'favicon.ico')))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index.html');
});

app.get('/board', (req, res) => {
    // res.sendFile(__dirname + '/public/views/board.html');
    res.render('board', { url: '/', players: [] });
});

app.post('/createRoom', function (req, res) {
    var playerData = req.body.player;
    player = playerManager.createPlayer(playerData.name);
    player.isAdmin = true;
    playerManager.addPlayer(player);

    let room = roomManager.createRoom(req.body.room.noOfRounds, req.body.room.timeToGuess);
    roomManager.addPlayerToRoom(room.name, player.id);

    var data = {
        player: player,
        room: room,
    };
    console.log(JSON.stringify(data));
    res.send(data);
});

app.post('/joinRoom', function (req, res) {
    console.log(req.body);
    let player = playerManager.createPlayer(req.body.playerName);
    playerManager.addPlayer(player);
    let status = roomManager.addPlayerToRoom(req.body.roomName, player.id);
    let room = roomManager.getRoom(req.body.roomName);
    console.log(status);
    var data = {
        player: player,
        room: room,
    };
    res.status(status);
    res.send(data);
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

