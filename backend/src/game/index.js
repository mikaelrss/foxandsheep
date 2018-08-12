import sillyname from 'sillyname';
import uuid from 'uuid/v4';

import { rooms, roomToNameAndIdMapper } from '../index';
import { createGameState } from './BoardCreator';

const remove = (array, element) => {
  const index = array.indexOf(element);
  array.splice(index, 1);
};

export const createRoom = (socket, io) => {
  console.log('CREATE');
  const roomName = sillyname();
  const room = {
    name: roomName,
    player1: socket.id,
    player2: null,
    roomId: uuid(),
    gameState: createGameState(10),
  };
  rooms.push(room);
  socket.join(roomName);
  io.to(roomName).emit('serverStateChange', { gameState: room.gameState });
  io.emit('roomsUpdated', { rooms: rooms.map(roomToNameAndIdMapper) });
};

export const joinRoom = (socket, io, payload) => {
  console.log('JOIN', payload);
  const requestedRoom = rooms.find(room => room.roomId === payload.roomId);
  if (!requestedRoom) return;
  if (!requestedRoom.player1) requestedRoom.player1 = socket.id;
  else if (!requestedRoom.player2) requestedRoom.player2 = socket.id;
  else {
    socket.emit('roomFull');
    return;
  }
  socket.join(requestedRoom.name);
  io.to(requestedRoom.name).emit('serverStateChange', { gameState: requestedRoom.gameState });
  io.to(requestedRoom.name).emit('startGame', { board: ['test-board'] });
};

export const disconnect = (socket, io) => {
  const currentRoom = rooms.find(room => room.player1 === socket.id || room.player2 === socket.id);
  if (!currentRoom) return;
  if (currentRoom.player1 === socket.id) currentRoom.player1 = null;
  else if (currentRoom.player2 === socket.id) currentRoom.player2 = null;

  if (!currentRoom.player1 && !currentRoom.player2) {
    remove(rooms, currentRoom);
    io.emit('roomsUpdated', { rooms: rooms.map(roomToNameAndIdMapper) });
  }
};
