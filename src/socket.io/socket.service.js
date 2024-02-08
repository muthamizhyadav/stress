

const authcheck = require("./authcheck.service.io");

function initSocketService(server, io) {

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        // console.log(token)
        if (token) {
            await authcheck.auth_details_counsellor(socket, token, next)
        }
        else {
            next();
        }
    })
    io.on('connection', (socket) => {

        console.log('A user connected', socket.name, socket.mobileNumber, socket.id);
        socket.on('chat message', (msg) => {
            io.emit('chat message', msg);
        });
        socket.on('user_jion', (msg) => {
        });
        socket.on('disconnect', async () => {
            console.log('User disconnected', socket.name, socket.mobileNumber, socket.id,socket.userId);
            await authcheck.user_disconnect_stream(socket, io)
        });
    });
    return io;
}

module.exports = initSocketService;