'use strict';
/* global io document window $ */

let canvas = $('#canvas');
let ctx = canvas[0].getContext('2d');

function drawLine(fromX, fromY, toX, toY, color) {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    ctx.stroke();
}

const COLORS = ['white', 'orange', 'yellow', 'green', 'blue', 'gold', 'cyan'];

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function initSocket(app_id) {
    let serverURL = window.location.hostname;
    let socket;
    if (serverURL === 'localhost') {
        socket = io();
    } else {
        socket = io(serverURL);
    }   
    let sessionId;
    socket.on('connect', function() {
        console.log('socket.io connected with id ' + app_id);
        sessionId = socket.io.engine.id;
        socket.emit('app_id', app_id);
    });

    // on response
    let users = {};
    socket.on('message', function(data) {
        if (data.socketid !== sessionId) {
            // not you, but somebody else
            let user = data.socketid;
            if (!(data.socketid in users)) {
                // new user, set random color
                users[user] = { color: randomItem(COLORS) };
            }

            // console.log('message from ' + sender + ': ' + JSON.stringify(data));
            if (data.event == 'mousedown') {
                // add starting coordinates
                users[user]['prevX'] = data.x;
                users[user]['prevY'] = data.y;
            }
            // console.log(users);

            if (data.event == 'mousemove') {
                // previous mouse move of the specific user!
                let userPrevX = users[user]['prevX'];
                let userPrevY = users[user]['prevY'];
                let userColor = users[user]['color'];
                drawLine(userPrevX, userPrevY, data.x, data.y, userColor);
            }

            users[user]['prevX'] = data.x;
            users[user]['prevY'] = data.y;

            // clients[data.sessionId] = data;
            // clients[data.sessionId].updated = $.now();
        }
    });

    if (!('getContext' in document.createElement('canvas'))) {
        alert('Sorry, it looks like your browser does not support canvas!');
        return false;
    }

    // let clients = {};
    
    let doc = $(document);
    let drawing = true;
    let prev = {};

    drawing = false;
    canvas.on('mousedown', function(e) {
        e.preventDefault();
        drawing = true;
        prev.x = e.pageX;
        prev.y = e.pageY;

        if (drawing) {
            const msg = {};
            msg.client_name = $('name').val();
            msg.app_id = app_id;
            msg.time = Date.now();
            msg.x = e.pageX,
                msg.y = e.pageY,
                socket.json.emit('message', msg);
            msg.event = 'mousedown';
            lastEmit = msg.time;
        }
    })
    
    doc.bind('mouseup mouseleave', function() {
        drawing = false;
    });
    

    let lastEmit = $.now();

    doc.on('mousemove', function(e) {
        if ($.now() - lastEmit > 30 && drawing) {
            const msg = {};
            msg.client_name = $('name').val();
            msg.app_id = app_id;
            msg.time = Date.now();
            msg.x = e.pageX,
                msg.y = e.pageY,
                msg.event = 'mousemove';
            socket.json.emit('message', msg);
            lastEmit = msg.time;
        }

        // Draw a line for the current user's movement, as it is

        if (drawing) {
            drawLine(prev.x, prev.y, e.pageX, e.pageY, 'black');
            prev.x = e.pageX;
            prev.y = e.pageY;
        }
    });
}

$(document).ready(function() {
    initSocket('raine_drawing_app');
});

