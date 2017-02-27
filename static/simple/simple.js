'use strict';

let app_id = 'simple-demo';
const socket = io('localhost:3000');
let sessionid;
// register room to the server
socket.on('connect', function() {
  console.log('socket.io connected!');
  sessionid = socket.io.engine.id;
  socket.emit('app_id', app_id);
});

$('#button').click(function() {
 const msg = {};
 msg.app_id = app_id;
 msg.time = Date.now();
 msg.hello = 'Hello';
 socket.json.emit('message', msg);
});

socket.on('message', function(msg) {
  let sender = msg.socketid;
  if(msg.socketid === sessionid) {
      console.log('Received "'+msg.hello+'" from yourself!');
  } else {
      console.log('Received "'+msg.hello+'" from '+sender);
  }
});
