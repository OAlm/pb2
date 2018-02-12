'use strict';
/* global io */

class PB2 {
    constructor(serverURL, appName) {
        this.appName = appName;
        if (serverURL === 'localhost') {
          this.socket = io();
        } else {
          this.socket = io(serverURL);
        }
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
        if (msg.socketid === this.sessionid) {
          msg.me = true;
        } else {
          msg.me = false;
        }
        receiverFunction(msg);
      }.bind(this));
    }

    sendJson(json) {
      let msg = {};
      msg.app_id = this.appName;
      msg.time = Date.now();
      msg.json = json;
      this.socket.json.emit('message', msg);
    }
}
