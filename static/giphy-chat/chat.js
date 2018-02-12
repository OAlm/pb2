'use strict';
/* global io $ document window */

/**
 * @param {string} app_id the application identifier send to the server
 */
function initSocket(app_id) {
	console.log('using hostname: '+window.location.hostname);
	const socket = io(window.location.hostname);
	let sessionid;
	// register room to the server
	socket.on('connect', function() {
		console.log('socket.io connected!');
		sessionid = socket.io.engine.id;
		socket.emit('app_id', app_id);
	});

	// on response
	socket.on('message', function(data) {
		let sender = data.socketid;
		if(data.socketid === sessionid) {
			sender = 'you';
		}
		console.log('message from '+sender+': '+JSON.stringify(data));

		const LIMIT = 10;

		$.ajax({
            dataType: 'json',
            url: 'http://api.giphy.com/v1/gifs/search',
            data: {
                'api_key': 'dc6zaTOxFJmzC',
                'q': data.str,
				'limit': LIMIT,
            },
            success: function(result) {
				console.log(result);
				let image = $('<img>');
				image.attr('src', result.data[Math.floor((Math.random() * LIMIT))].images.fixed_height.url);
				$('#messages').append(image);
			},
		});
		let paragraph = $('<p>');
		paragraph.html(data.client_name+' says "'+data.str+'"');
		$('#messages').append(paragraph);
	});

	// sending messages
	$('#message').bind('keypress', function(e) {
		const code = (e.keyCode ? e.keyCode : e.which);
		if (code == 13 && socket) { // keyboard Enter
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
	initNameCheck();
	initSocket('chat_app_giphy');
});
