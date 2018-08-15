import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import socket from 'socket.io';
import http from 'http';

import typeDefs from './schema/typeDefinitions';
import resolvers from './schema/resolvers';
import { createRoom, disconnect, joinRoom } from './socketadapter/index';

const DEFAULT_PORT = 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();
server.applyMiddleware({ app });
const httpServer = http.createServer(app);
const io = socket(httpServer);

export const rooms = [];
export const roomToNameAndIdMapper = room => ({ name: room.name, id: room.roomId });

const cleanRooms = () => {
  for (let i = rooms.length - 1; i >= 0; --i) {
    const secondsWithoutPlayers = (new Date().getTime() - rooms[i].timeWithoutPlayers) / 1000;
    if (rooms[i].timeWithoutPlayers && secondsWithoutPlayers > 10) {
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

  socket.on('disconnect', () => {
    disconnect(socket, io);
  });
});

setInterval(() => {
  cleanRooms();
  console.log(rooms);
}, 2000);

httpServer.listen(process.env.PORT || DEFAULT_PORT, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
