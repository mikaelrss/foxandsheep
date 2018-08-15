import { rooms } from '../index';

export const OPPONENT_NOT_FOUND = 'OPPONENT_NOT_FOUND';

export const findCurrentRoom = socket => rooms.find(room => room.player1 === socket.id || room.player2 === socket.id);

export const findCurrentOpponent = socket => {
  const room = rooms.find(room => room.player1 === socket.id || room.player2 === socket.id);
  if (room.player1 !== socket.id) return room.player1;
  if (room.player2 !== socket.id) return room.player2;
  return OPPONENT_NOT_FOUND;
};

export const createClientInformation = room => ({
  roomName: room.name,
  roomId: room.roomId,
  gameState: room.gameState,
  catcher: room.player1,
  runner: room.player2,
});
