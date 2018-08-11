import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import socket from 'socket.io';
import http from 'http';

import typeDefs from './schema/typeDefinitions';
import resolvers from './schema/resolvers';
import { createRoom, disconnect } from './gameserver';

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

export const roomToNameMapper = room => room.name;

io.on('connection', socket => {
  io.to(socket.id).emit('roomNames', { roomNames: rooms.map(roomToNameMapper) });
  console.log('Connected', socket.id);

  socket.on('createRoom', () => createRoom(socket, io));
  socket.on('joinRoom', () => joinRoom(socket, io));

  socket.on('disconnect', () => {
    disconnect(socket, io);
  });
});

setInterval(() => {
  console.log(rooms);
}, 2000);

httpServer.listen(process.env.PORT || DEFAULT_PORT, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
