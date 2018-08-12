import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import socket from 'socket.io';
import http from 'http';

import typeDefs from './schema/typeDefinitions';
import resolvers from './schema/resolvers';
import { createRoom, disconnect, joinRoom } from "./socketadapter/index";

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

io.on('connection', socket => {
  io.to(socket.id).emit('roomNames', { rooms: rooms.map(roomToNameAndIdMapper) });
  console.log('Connected', socket.id);

  socket.on('createRoom', (payload) => createRoom(socket, io, payload));
  socket.on('joinRoom', (payload) => joinRoom(socket, io, payload));

  socket.on('disconnect', () => {
    disconnect(socket, io);
  });
});

setInterval(() => {
  console.log(rooms);
}, 20000);

httpServer.listen(process.env.PORT || DEFAULT_PORT, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
