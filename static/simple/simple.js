'use strict';
/* global $ PB2 */
const pb2 = new PB2(window.location.hostname, 'simple-demo');

$('#button').click(function() {
  pb2.sendJson({msg: 'Hello'});
});

pb2.setReceiver(function(response) {
  const msg = response.json.msg;
  if (response.me) {
      console.log('Received "'+msg+'" from yourself!');
  } else {
      console.log('Received "'+msg+'" from '+response.socketid);
  }
});
