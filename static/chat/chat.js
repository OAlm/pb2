'use strict';
/* global io $ document */

/**
 * @param {string} app_id the application identifier send to the server
 */
function initSocket(app_id) {
	const socket = io().connect('http://localhost:3000');

	// register room to the server
	socket.on('connect', function() {
		socket.emit('app_id', app_id);
	});

	// on response
	socket.on('message', function(data) {
		console.log('socket.on message received: '+data);
		$('#messages').append(data.client_name+' says "'+data.str+'"</br>');
	});

	// sending messages
	$('#message').bind('keypress', function(e) {
		const code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13 && socket) { // keyboard Enter
			console.log('sending '+$('#message').val());
			const msg = {};
			msg.client_name = $('#name').val();
			msg.app_id = app_id;
			msg.time = Date.now();
			msg.str = $('#message').val();
			socket.json.emit('message', msg);
			$('#message').val('');
        }
	});
}

/** @function */
function initNameCheck() {
	$('#message').prop('disabled', true);
	$('#message').css({'background-color': 'grey'});

	$('#name').on('change paste keyup', function() {
		console.log('name change');
		if($('#name').val()) {
			$('#message').prop('disabled', false);
			$('#message').css({'background-color': 'white'});
		} else {
			$('#message').prop('disabled', true);
			$('#message').css({'background-color': 'grey'});
		}
	});
}

$(document).ready(function() {
	console.log('doc ready');
	initNameCheck();
	initSocket('chat_app');
});
