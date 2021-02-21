const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// Set the default templating engine to ejs

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {

    res.render('index');
});


io.sockets.on('connection', function(socket) {


    socket.on('chat_message', function(message) {


        io.emit('chat_message', message);
    });

});

const server = http.listen(3001, function() {

    console.log('listening on *:3001');

});




