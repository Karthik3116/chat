const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors'); 
const app = express();


app.use(cors());

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(socket);
  console.log('New client connected');


  socket.on('chatMessage', (data) => {
    console.log("message received from client :- ", data)
    io.emit('chatMessage', { name: data.name, message: data.message });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
