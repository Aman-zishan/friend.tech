const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');
const socketio = require('socket.io');
const {
  addUser, removeUser, getUser, getUsersInRoom,
} = require('./users');

// configure socket.io to allow cross-origin requests
const io = socketio(server, { cors: { origin: '*' } });

// set up our PORT
const MY_PREFERRED_PORT = 5999;
const PORT = process.env.PORT || MY_PREFERRED_PORT;

// allow cors
app.use(cors());

// on socket connection
io.on('connection', (socket) => {
  // get active or connected socket

  // eslint-disable-next-line consistent-return
  socket.on('joinRoom', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return error;

    socket.join(user.room);
    console.log('USER', socket.id);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  // get socket id of connected socket
  socket.emit('getId', socket.id);

  // when a chat event is fired
  socket.on('sendMessage', (message, callback) => {
    console.log('USER', socket.id);
    const user = getUser(socket.id);
    console.log('USER ROOM', user);

    io.to(user.room).emit('message', { user: user.name, text: message });
    callback();
  });

  // when a socket gets disconnected
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Application running successfully on port: ${PORT}`);
});
