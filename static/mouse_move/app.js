'use strict';
/* global $ PB2 */
const pb2 = new PB2('localhost:3000', 'mouse-move-demo');
pb2.setReceiver(onMessage);

function onMessage(data) {
    $('#coords').text(data.json.coords);
}

$('#mousecanvas').mousemove(function(event) {
  let pageCoords = '( ' + event.pageX + ', ' + event.pageY + ' )';
  pb2.sendJson({coords: pageCoords});
});
