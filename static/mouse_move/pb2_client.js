'use strict';
/* global io */
// event dispatching
// from https://stackoverflow.com/questions/22186467/how-to-use-javascript-eventtarget
// implements EventTarget https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
/*
class Emitter {

  constructor() {
    const delegate = document.createDocumentFragment();
    [
      'addEventListener',
      'dispatchEvent',
      'removeEventListener',
    ].forEach((f) =>
      this[f] = (...xs) => delegate[f](...xs)
    );
  }
}
*/

class PB2 {

    constructor(serverURL, appName) {
        this.appName = appName;
        this.socket = io(serverURL);
        this.connect(this.appName, this.socket);
    }

    connect(appName, socket) {
      this.socket.on('connect', function() {
        this.sessionid = socket.io.engine.id;
        this.socket.emit('app_id', appName);
        console.log('socket.io connected!');
      }.bind(this));
    }

    setReceiver(receiverFunction) {
      this.socket.on('message', function(msg) {
        console.log('on message');
        if(msg.socketid === this.sessionid) {
          msg.me = true;
        } else {
          msg.me = false;
        }
        receiverFunction(msg);
      }.bind(this));
    }

    sendJson(json) {
      console.log('send json');
      let msg = {};
      msg.app_id = this.appName;
      msg.time = Date.now();
      msg.json = json;
      this.socket.json.emit('message', msg);
    }
}
