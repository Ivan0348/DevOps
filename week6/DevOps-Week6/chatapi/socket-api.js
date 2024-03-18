const io = require('socket.io')();
const client = require('prom-client');
const gauge = new client.Gauge({name: 'number_of_clients', help: 'Some metrics about numer of connected chat users'});
const socketApi = {
    io: io
};

io.on('connection', function (socket) {
    console.log('A user is connected');
    gauge.inc(1);  // When a connection is established


    socket.on('disconnect', () => {
        console.log('User disconnected');
        gauge.dec(1); // When a user is disconnected.

    });

    socket.on('chat message', (msg) => {
        console.log('Message: ' + msg);
        io.emit('chat message', msg);
    });
});

module.exports = socketApi;