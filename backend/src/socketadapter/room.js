import { rooms, roomToNameAndIdMapper } from '../index';
import { initializeRoom } from '../game/roomCreator';
import { createClientInformation, findCurrentRoom } from "../game/gameUtils";

export const createRoom = (socket, io, payload) => {
  const room = initializeRoom(socket, payload.roomName);
  rooms.push(room);
  socket.join(room.id);
  io.to(socket.id).emit('roomCreated', createClientInformation(room));
  io.emit('roomsUpdated', { rooms: rooms.map(roomToNameAndIdMapper) });
};

export const joinRoom = (socket, io, payload) => {
  const requestedRoom = rooms.find(room => room.roomId === payload.roomId);
  if (!requestedRoom) {
    socket.emit('roomNotFound');
    return;
  }
  if (requestedRoom.catcher.id === socket.id || requestedRoom.runner.id === socket.id) {
    socket.emit('serverStateChange', createClientInformation(requestedRoom));
    return;
  }
  if (!requestedRoom.catcher.id) requestedRoom.catcher.id = socket.id;
  else if (!requestedRoom.runner.id) requestedRoom.runner.id = socket.id;
  else {
    socket.emit('roomFull');
    return;
  }
  requestedRoom.timeWithoutPlayers = undefined;
  socket.join(requestedRoom.id);
  io.to(requestedRoom.id).emit('serverStateChange', createClientInformation(requestedRoom));
  if (requestedRoom.catcher.id != null && requestedRoom.runner.id != null) {
    io.to(requestedRoom.id).emit('startGame', { board: ['test-board'] });
  }
};

export const disconnect = (socket, io) => {
  console.log("Disconnect");
  const currentRoom = findCurrentRoom(socket);
  if (!currentRoom) return;
  if (currentRoom.catcher.id === socket.id) currentRoom.catcher.id = null;
  else if (currentRoom.runner.id === socket.id) currentRoom.runner.id = null;

  if (!currentRoom.catcher.id && !currentRoom.runner.id) {
    currentRoom.timeWithoutPlayers = new Date().getTime()
    io.emit('roomsUpdated', { rooms: rooms.map(roomToNameAndIdMapper) });
  }
};
