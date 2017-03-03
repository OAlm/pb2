'use strict';
/* global $ PB2 */
const pb2 = new PB2(localhost:3000, 'throughoutput');
pb2.setReceiver(onMessage);

let timer;

function onMessage(data) {
    $('#status').text('Status: sending');
    const end = +new Date();
    const diff = end - data.json.timeStart;
    console.log(diff);
    $('#output').text(JSON.stringify(data.json));
}

$('#start').click(function(event) {
  timer = setInterval(myTimer, 1000);
  function myTimer() {
    const start = +new Date();
    pb2.sendJson({timeStart: start});
  }
});

$('#stop').click(function(event) {
  clearInterval(timer);
  $('#status').text('Status: not sending');
  $('#output').text('Roundtrip: -');
});
