import { rooms, roomToNameAndIdMapper } from '../index';
import { initializeRoom } from './roomCreator';

const remove = (array, element) => {
  const index = array.indexOf(element);
  array.splice(index, 1);
};

const createClientInformation = room => ({
  roomName: room.name,
  roomId: room.roomId,
  gameState: room.gameState,
  catcher: room.player1,
  runner: room.player2,
});

const findCurrentRoom = socket => rooms.find(room => room.player1 === socket.id || room.player2 === socket.id);

export const createRoom = (socket, io, payload) => {

  const room = initializeRoom(socket, payload.roomName);
  rooms.push(room);
  socket.join(room.name);
  io.to(socket.id).emit('roomCreated', createClientInformation(room));
  io.emit('roomsUpdated', { rooms: rooms.map(roomToNameAndIdMapper) });
};

export const joinRoom = (socket, io, payload) => {
  const requestedRoom = rooms.find(room => room.roomId === payload.roomId);
  if (!requestedRoom) {
    socket.emit('roomNotFound');
    return;
  }
  if (requestedRoom.player1 === socket.id || requestedRoom.player2 === socket.id) {
    socket.emit('serverStateChange', createClientInformation(requestedRoom));
    return;
  }
  if (!requestedRoom.player1) requestedRoom.player1 = socket.id;
  else if (!requestedRoom.player2) requestedRoom.player2 = socket.id;
  else {
    socket.emit('roomFull');
    return;
  }
  requestedRoom.timeWithoutPlayers = undefined;
  socket.join(requestedRoom.name);
  io.to(requestedRoom.name).emit('serverStateChange', createClientInformation(requestedRoom));
  if (requestedRoom.player1 != null && requestedRoom.player2 != null) {
    io.to(requestedRoom.name).emit('startGame', { board: ['test-board'] });
  }
};

export const disconnect = (socket, io) => {
  console.log("Disconnect");
  const currentRoom = findCurrentRoom(socket);
  if (!currentRoom) return;
  if (currentRoom.player1 === socket.id) currentRoom.player1 = null;
  else if (currentRoom.player2 === socket.id) currentRoom.player2 = null;

  if (!currentRoom.player1 && !currentRoom.player2) {
    currentRoom.timeWithoutPlayers = new Date().getTime()
    io.emit('roomsUpdated', { rooms: rooms.map(roomToNameAndIdMapper) });
  }
};
