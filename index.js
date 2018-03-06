const express = require('express');
const app = express();
const http = require('http').Server(app);
const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({
        port: 8080
    });
 
app.use(express.static('public'));
 
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
 
wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};
 
wss.on('connection', function(ws) {
    ws.on('message', function(msg) {
        const data = JSON.parse(msg);
        if (data.message) wss.broadcast(JSON.stringify({ name: data.name, message: data.message }));
    });
});
