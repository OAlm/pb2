'use strict';
/* global $ document window PB2 */

function onMessage(data) {
    let sender = data.json.client_name;
    if (data.me) {
        sender = 'you';
    }
    const LIMIT = 10;
    $.ajax({
        dataType: 'json',
        url: 'https://api.giphy.com/v1/gifs/search',
        data: {
            'api_key': 'dc6zaTOxFJmzC',
            'q': data.json.str,
            'limit': LIMIT,
        },
        success: function(result) {
            console.log(result);
            let image = $('<img>');
            image.attr('src', result.
              data[Math.floor((Math.random() * LIMIT))].
                  images.fixed_height.url);
            $('#messages').append(image);
        },
    });

    let paragraph = $('<p>');
    paragraph.html(sender+' says "'+data.json.str+'"');
    $('#messages').append(paragraph);
}

function initPB() {
    const pb2 = new PB2(window.location.hostname, 'giphy-chat-demo');
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

/** @function */
function initNameCheck() {
    $('#message').prop('disabled', true);
    $('#message').css({'background-color': 'grey'});

    $('#name').on('change paste keyup', function() {
        if ($('#name').val()) {
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
    initPB();
});
