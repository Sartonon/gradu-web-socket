const express = require('express');
const app = express();
const http = require('http').Server(app);
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({
  port: 8080
});

var messages = [];

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/messages', function(req, res) {
  res.send(messages);
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

wss.on('connection', function(ws) {
  ws.on('message', function(msg) {
    const data = JSON.parse(msg);
    if (data.message) {
      messages = messages.concat({ name: data.name, message: data.message });
      wss.broadcast(
        JSON.stringify({ name: data.name, message: data.message })
      );
    }
  });
});

ws.on('error', function() {
  console.log('errored');
});

http.listen(3001, function() {
  console.log('listening on port 3001');
});
