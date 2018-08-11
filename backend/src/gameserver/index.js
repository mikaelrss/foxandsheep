import sillyname from 'sillyname';

import { rooms, roomToNameMapper } from '../index';

const remove = (array, element) => {
  const index = array.indexOf(element);
  array.splice(index, 1);
};

export const createRoom = (socket, io) => {
  console.log('CREATE');
  rooms.push({
    name: sillyname(),
    player1: socket.id,
    player2: '',
  });
  socket.join('test-room');
  io.emit('roomsUpdated', { roomNames: rooms.map(roomToNameMapper) });
};

export const joinRoom = (socket, io) => {
  console.log('JOIN');
};

export const disconnect = (socket, io) => {
  const currentRoom = rooms.find(room => room.player1 === socket.id || room.player2 === socket.id);
  if (!currentRoom) return;
  if (currentRoom.player1 === socket.id) currentRoom.player1 = null;
  else if (currentRoom.player2 === socket.id) currentRoom.player2 = null;

  if (!currentRoom.player1 && !currentRoom.player2) {
    remove(rooms, currentRoom);
    io.emit('roomsUpdated', { roomNames: rooms.map(roomToNameMapper) });
  }
};
