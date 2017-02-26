'use strict';
/* global document $ window io */
$(function() {
  const ball = document.querySelector('.ball');
  const garden = document.querySelector('.garden');
  const output = document.querySelector('.output');

  const maxX = garden.clientWidth - ball.clientWidth;
  const maxY = garden.clientHeight - ball.clientHeight;

  let app_id = 'orientation-demo';
  const socket = io('localhost:3000');
  let sessionid;
  // register room to the server
  socket.on('connect', function() {
    console.log('socket.io connected!');
    sessionid = socket.io.engine.id;
    socket.emit('app_id', app_id);
  });

  function handleOrientation(event) {
    let x = event.beta;  // In degree in the range [-180,180]
    let y = event.gamma; // In degree in the range [-90,90]

    output.innerHTML = 'beta : ' + x + '\n';
    output.innerHTML += 'gamma: ' + y + '\n';

    // Because we don't want to have the device upside down
    // We constrain the x value to the range [-90,90]
    if (x > 90) {
      x = 90;
    }
    if (x < -90) {
      x = -90;
    }

    // To make computation easier we shift the range of
    // x and y to [0,180]
    x += 90;
    y += 90;

    // 10 is half the size of the ball
    // It center the positioning point to the center of the ball
    ball.style.top = (maxX*x/180 - 10) + 'px';
    ball.style.left = (maxY*y/180 - 10) + 'px';

    const msg = {};
    msg.app_id = app_id;
    msg.time = Date.now();
    msg.beta = event.beta;
    msg.gamma = event.gamma;
    socket.json.emit('message', msg);
  }

  window.addEventListener('deviceorientation', handleOrientation);
});
