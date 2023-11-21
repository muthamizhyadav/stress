

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
        console.log('A user connected', socket.name, socket.mobileNumber);
        socket.on('chat message', (msg) => {
            io.emit('chat message', msg);
        });
        socket.on('user_jion', (msg) => {
            console.log(msg, 87675654367)
        });
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });


    return io;
}

module.exports = initSocketService;