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

export const turnFinished = room => room.gameState.turn.catcherDone && room.gameState.turn.runnerDone;

export const resetTurn = room => {
  room.gameState.turn = {
    runnerDone: false,
    catcherDone: false,
  };
};

const findCurrentPosition = (socket, room) => {
  if (playerIsCatcher(socket)) return room.gameState.catcherPosition;
  return room.gameState.runnerPosition;
};

const findCurrentStepSize = (socket, room) => {
  if (playerIsCatcher(socket)) return room.gameState.catcherStepSize;
  return room.gameState.runnerStepSize;
};

export const moveIsValid = (socket, io, { position }) => {
  const room = findCurrentRoom(socket);
  const myPosition = findCurrentPosition(socket, room);
  const stepSize = findCurrentStepSize(socket, room);

  const outsideLegalMovesX = position.x > myPosition.x + stepSize || position.x < myPosition.x - stepSize;
  const outsideLegalMovesY = position.y > myPosition.y + stepSize || position.y < myPosition.y - stepSize;
  const outsideBoardX = position.x < 0 || position.x > room.gameState.gameBoard.length - 1;
  const outsideBoardY = position.y < 0 || position.y > room.gameState.gameBoard.length - 1;

  if (outsideBoardX || outsideBoardY || outsideLegalMovesX || outsideLegalMovesY) {
    io.to(socket.id).emit('illegalMove', myPosition);
    return false;
  }
  return true;
};

export const createClientInformation = room => ({
  roomName: room.name,
  roomId: room.roomId,
  gameState: room.gameState,
  catcher: room.catcher.id,
  runner: room.runner.id,
});