'use strict';
/* global $ PB2 */

function initPB() {
    const pb2 = new PB2(window.location.hostname, 'chat-demo');
    pb2.setReceiver(onMessage);

    // sending messages
    $('#message').bind('keypress', function(e) {
        const code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) { // keyboard Enter
            const msg = {};
            msg.client_name = $('#name').val();
            msg.str = $('#message').val();
            pb2.sendJson(msg);
            $('#message').val('');
        }
    });
}

function onMessage(data) {
    let sender = data.json.client_name;
    if (data.me) {
        sender = 'you';
    }
    $('#messages').append(sender + ' says "' + data.json.str + '"</br>');
}

function initNameCheck() {
    $('#message').prop('disabled', true);
    $('#message').css({
        'background-color': 'grey',
    });

    $('#name').on('change paste keyup', function() {
        if ($('#name').val()) {
            $('#message').prop('disabled', false);
            $('#message').css({
                'background-color': 'white',
            });
        } else {
            $('#message').prop('disabled', true);
            $('#message').css({
                'background-color': 'grey',
            });
        }
    });
}

$(document).ready(function() {
    initNameCheck();
    initPB();
});
