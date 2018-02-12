'use strict';
/* global $ PB2 */
const pb2 = new PB2(window.location.hostname, 'mouse-move-demo');

pb2.setReceiver(onMessage);

function onMessage(data) {
  let x = data.json.coords[0];
  let y = data.json.coords[1];
  $('#coords').text('('+x+', '+y+')');
}

$('#mousecanvas').mousemove(function(event) {
  let pageCoords = [event.pageX, event.pageY];
  pb2.sendJson({coords: pageCoords});
});
