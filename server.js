'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
const moment = require('moment');

app.use(express.static('static'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true,
}));

app.use(function(req, res, next) {
    console.log('Time:', moment(Date.now()));
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 2, 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


function initRequestHandlers() {
    app.get('/', function(req, res) {
        console.log('-> index.html');
        res.sendFile(__dirname + '/index.html');
    });
}

function initSockets() {
    io.on('connection', function(socket) {
        const socketid = socket.id;
        console.log('a user connected with session id '+socket.id);
        socket.on('disconnect', function() {
            console.log('user disconnected');
        });

        // This event is triggered when the user disconnect but before the socket leave its rooms
        socket.on('disconnecting', function () {
            for(let room in socket.rooms){
                // We send a message to all the user of the rooms
                if(socket.rooms.hasOwnProperty(room) && room != socket.id){
                    io.in(room).emit('user:disconnect', {id: socket.id});
                }
            }
        });
        
        // dynamic room, from https://gist.github.com/crtr0/2896891
        socket.on('app_id', function(app_id) {
            console.log('joining room "'+app_id+'"');
            // We inform all the other user of the room that a new socket has connected
            io.sockets.in(app_id).emit('user:connect', {id: socket.id});
            socket.join(app_id);
        });

        socket.on('message', function(jsonMsg) {
            console.log('msg : '+jsonMsg.str);
            console.log('room: '+jsonMsg.app_id);
            jsonMsg.socketid = socketid; // pad client id to response
            io.sockets.in(jsonMsg.app_id).emit('message', jsonMsg);
        });
    });
}

function startServer() {
    initRequestHandlers();
    initSockets();

    http.listen(3000, function() {
        console.log('Server started (3000)');
    });
}

startServer();
