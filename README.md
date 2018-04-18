
## PB2 

PB2 is a serverless framework (node.js server + client library) for building collaborative apps. 

In this context, serverless means 
* building an application without doing any coding on the server side and 
* using the same server instance for different client applications (as a service)

*PB2* is based on [socket.io](http://socket.io) and to communicate, you have to use certain kind of
messages (see below).

With *PB2*, you can do two things:
1. Send JSON messages to the server
2. Receive JSON messages from the server

**(1) Connecting to the server**

First, include *socket.io* and pb2_client.js into your HTML:
```html
<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
<script src="pb2_client.js"></script>
```

PB2 Client is available here: https://raw.githubusercontent.com/OAlm/pb2/master/static/pb2_client.js

In javascript, you have to give an unique ```app_id``` for your app and **connect to the server**. 

In below, we connect to a server ```https://pb2.mydomain.com``` with *app_id* ```my_first_app_123```:

```js
const pb2 = new PB2('https://pb2.mydomain.com/', 'my_first_app_123');
```
(in Socket.io terms, your app will connect to a (room)[http://socket.io/docs/rooms-and-namespaces/] my_first_app_123)

**(2) Sending messages**

With current *PB2* setup, you can send only JSON messages. To send messages, construct a javascript object,
with the value you want. In the below example, we will generate the following JSON object and send it to the server.
```js
{
  hello: 'world'
}
```

```js
const msg = {};
msg.hello = 'world';
pb2.sendJson(msg);
```
**(3) Receiving messages**

In order to receive messages, the following javascript code can be used:
```js
pb2.setReceiver(function(data) {
		console.log('socket.on message received: '+data);
});
```
The socket will receive any messages send to the server with the app_id.
Full chat client example is available here: https://github.com/OAlm/pb2/tree/master/static/chat

The first version of the PB was originally a student project for monitoring autonomous vehicle data in [Sohjoa-project](http://www.sohjoa.fi), later extended to serve as a general purpose server framework.

**References**

* https://github.com/OAlm/pb2/tree/master/static/chat
* http://socket.io/
* https://github.com/OAlm/pb2
* http://www.sohjoa.fi




