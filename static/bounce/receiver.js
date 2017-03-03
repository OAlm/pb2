'use strict';
/* $ global context orientation */
(window.requestAnimationFrame) ||
    (window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame);
const RAD = 0.0174532925;
const COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

function randomItem(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function Ball(color) {
	this.color = color;
	this.bounce = .5 + (Math.random() * .5);
	this.vx = Math.random() * 50 - 25;
	this.vy = Math.random() * 50 - 25;
	this.size = 35 - (this.bounce * 25);
	this.x = Math.random() * width;
	this.y = Math.random() * height;
}

function FixedBall(color, bounce, vx, vy, size, x, y) {
	this.color = color;
	this.bounce = bounce;
	this.vx = vx;
	this.vy = vy;
	this.size = size;
	this.x = x;
	this.y = y;
}

const pb2 = new PB2(window.location.hostname, 'mouse-move-demo');
pb2.setReceiver(onGenerateBalls);

function onGenerateBalls(data) {
	console.log('generate');
	let user = data.json.user;
	let color = data.json.color;
	let ballCount = data.json.count;
	for (let i = 0; i < ballCount; i++) {
		balls[balls.length] = new Ball(color);
	}
}

function update(ball) {
	collisionCheck();

	let gravity = 2;
	let drag = .98;

	ball.x += ball.vx;
	ball.y += ball.vy;

	if ((ball.x + ball.size) > width) {
		ball.x = width - ball.size;
		ball.vx = -ball.vx * ball.bounce;
	} else if ((ball.x - ball.size) < 0) {
		ball.x = 0 + ball.size;
		ball.vx = -ball.vx * ball.bounce;
	}

	if ((ball.y + ball.size) > height) {
		ball.y = height - ball.size;
		ball.vy = -ball.vy * ball.bounce;
	} else if ((ball.y - ball.size) < 0) {
		ball.y = 0 + ball.size;
		ball.vy = -ball.vy * ball.bounce;
	}
	let rot = (orientation === -90 || orientation === 180) ?
           90 + tiltLR : 90 - tiltLR;
	ball.vx = ball.vx * drag + Math.cos(rot * RAD);
	ball.vy = ball.vy * drag + gravity + tiltY;
}

function collisionCheck() {
	let spring = .5;

	for (let i = 0; i < (ballCount - 1); ++i) {
		let ball0 = balls[i];

		for (let j = i + 1; j < ballCount; ++j) {
			let ball1 = balls[j];
			let dx = ball1.x - ball0.x;
			let dy = ball1.y - ball0.y;
			let dist = Math.sqrt(dx * dx + dy * dy);
			let minDist = ball0.size + ball1.size;

			if (dist < minDist) {
				// let angle = Math.atan2(dy, dx);
				let tx = ball0.x + dx / dist * minDist;
				let ty = ball0.y + dy / dist * minDist;
				let ax = (tx - ball1.x);
				let ay = (ty - ball1.y);


				ball0.x -= ax;
				ball0.y -= ay;

				ball1.x += ax;
				ball1.y += ay;


				ball0.vx -= (ax * spring);
				ball0.vy -= (ay * spring);
				ball1.vx += (ax * spring);
				ball1.vy += (ay * spring);
			}
		}
	}
}

function render() {
	let isChange = (browserX != window.screenX || browserY != window.screenY);
	// TODO null values
	let diffX = null;
	let diffY = null;

	if (isChange) {
		diffX = browserX - window.screenX;
		browserX = window.screenX;

		diffY = browserY - window.screenY;
		browserY = window.screenY;
	}

	let j = balls.length;
	while (--j > -1) {
		update(balls[j]);

		if (isChange) {
			balls[j].vx += (diffX * .05);
			balls[j].vy += (diffY * .1);
		}
	}

	draw();
}

function draw() {
	context.clearRect(0, 0, width, height);
	let i = balls.length;
	while (--i > -1) {
      context.fillStyle = balls[i].color;
      context.beginPath();
      context.arc(balls[i].x, balls[i].y, balls[i].size, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
	}
}

let canvas = document.getElementById('canvas');
console.log('canvas');
let	stage = document.createElement('canvas');
let	ctx = canvas.getContext('2d');
let	sctx = stage.getContext('2d');
let	width = document.body.offsetWidth;
let	height = document.body.offsetHeight;
canvas.width = width;
canvas.height = height;
stage.width = width;
stage.height = height;
let	startTime = null;

let browserX = window.screenX;
let browserY = window.screenY;
let balls = [];
let ballCount = 10;
let tiltX = 0;
let tiltY = 0;
let tiltLR = 0;
let tiltXSpan = document.getElementById('tiltX');
let tiltYSpan = document.getElementById('tiltY');
let tiltLRSpan = document.getElementById('tiltGamma');
let tiltFBSpan = document.getElementById('tiltBeta');
let tiltDir = document.getElementById('tiltAlpha');
let orientationSpan = document.getElementById('orientation');
generate();
/*
let m = 10;
let	M = 90;
let	G = 9.8;
let	g = 0;
let	y = 0;
let	Y = height;
let	a = 0;
*/

function draw(t) {
	startTime = startTime || t;
	sctx.save();
	sctx.clearRect(0, 0, stage.width, stage.height);
	sctx.save();
	let i = balls.length;
	while (--i > -1) {
		sctx.fillStyle = balls[i].color;
		sctx.beginPath();
		sctx.arc(balls[i].x, balls[i].y, balls[i].size, 0, Math.PI * 2, true);
		sctx.closePath();
		sctx.fill();
	}
	sctx.restore();
	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(stage, 0, 0, canvas.width, canvas.height);
	ctx.restore();
	// console.log(star.position);
	window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);

// 'ondevicemotion'
window.addEventListener('deviceorientation', function() {
	if (Math.abs(orientation) === 90) {
		tiltLR = event.beta;
	} else {
		tiltLR = event.gamma;
	}
	tiltLRSpan.innerText = tiltLR;
	tiltFBSpan.innerText = event.beta;
	tiltDir.innerText = event.alpha;
	orientationSpan.innerText = window.orientation;
}, true);

window.addEventListener('devicemotion', function() {
	tiltX = event.acceleration.x;
	tiltY = event.acceleration.y;
	tiltXSpan.innerText = tiltX;
	tiltYSpan.innerText = tiltY;
}, true);
