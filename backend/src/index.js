import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import socket from 'socket.io';
import http from 'http';
import 'babel-polyfill';
import path from 'path';

import typeDefs from './schema/typeDefinitions';
import resolvers from './schema/resolvers';
import { createRoom, disconnect, joinRoom } from './socketadapter/room';
import { commitPosition, hidePosition, showPosition } from './socketadapter/playeractions';

const DEFAULT_PORT = 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();

app.use(express.static(path.join(__dirname, '../../frontend/build')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});

server.applyMiddleware({ app });
const httpServer = http.createServer(app);
const io = socket(httpServer);

export const rooms = [];
export const roomToNameAndIdMapper = room => ({ name: room.name, id: room.roomId });

const cleanRooms = () => {
  for (let i = rooms.length - 1; i >= 0; --i) {
    const secondsWithoutPlayers = (new Date().getTime() - rooms[i].timeWithoutPlayers) / 1000;
    if (rooms[i].timeWithoutPlayers && secondsWithoutPlayers > 3) {
      rooms.splice(i, 1);
      io.emit('roomNames', { rooms: rooms.map(roomToNameAndIdMapper) });
    }
  }
};

io.on('connection', socket => {
  cleanRooms(rooms);
  io.to(socket.id).emit('roomNames', { rooms: rooms.map(roomToNameAndIdMapper) });

  socket.on('createRoom', payload => createRoom(socket, io, payload));
  socket.on('joinRoom', payload => joinRoom(socket, io, payload));

  socket.on('showPosition', payload => showPosition(socket, io, payload));
  socket.on('hidePosition', () => hidePosition(socket, io));

  socket.on('commitMove', payload => commitPosition(socket, io, payload));

  socket.on('disconnect', () => {
    disconnect(socket, io);
  });
  socket.on('leftGame', () => {
    disconnect(socket, io);
  });
});

setInterval(() => {
  cleanRooms();
}, 3000);

httpServer.listen(process.env.PORT || DEFAULT_PORT, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
