import { rooms } from '../index';

export const OPPONENT_NOT_FOUND = 'OPPONENT_NOT_FOUND';

export const findCurrentRoom = socket =>
  rooms.find(room => room.catcher.id === socket.id || room.runner.id === socket.id);

export const findCurrentOpponent = socket => {
  const room = findCurrentRoom(socket);
  if (room.catcher.id !== socket.id) return room.catcher.id;
  if (room.runner.id !== socket.id) return room.runner.id;
  return OPPONENT_NOT_FOUND;
};

export const playerIsCatcher = socket => {
  const room = findCurrentRoom(socket);
  const opponent = findCurrentOpponent(socket);

  return opponent !== room.catcher.id;
};

export const turnFinished = room => {
  console.log(room);
  return room.gameState.turn.catcherDone && room.gameState.turn.runnerDone;
};

export const resetTurn = room => {
  room.gameState.turn = {
    runnerDone: false,
    catcherDone: false,
  };
};

export const createClientInformation = room => ({
  roomName: room.name,
  roomId: room.roomId,
  gameState: room.gameState,
  catcher: room.catcher.id,
  runner: room.runner.id,
});
