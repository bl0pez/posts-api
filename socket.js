const sockets = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('message-to-server', data => {
            console.log(data);
            io.emit('message-to-client', data);
        })
        
    });
}

module.exports = sockets;