const io = require('socket.io')();
const socketApi = {
    io: io
};

io.on('connection', function (socket) {
    console.log('A user is connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', (msg) => {
        console.log('Message: ' + msg);
        io.emit('chat message', msg);
    });
});

module.exports = socketApi;