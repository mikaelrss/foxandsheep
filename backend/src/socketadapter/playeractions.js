import {
  OPPONENT_NOT_FOUND,
  createClientInformation,
  findCurrentOpponent,
  findCurrentRoom,
  playerIsCatcher,
  resetTurn,
  turnFinished,
  moveIsValid,
  emitIfRunnerFoundGrass,
  emitWinAndLossIfGameIsOver,
} from '../game/gameUtils';

export const showPosition = (socket, io, payload) => {
  const opponent = findCurrentOpponent(socket);
  if (opponent === OPPONENT_NOT_FOUND) return;
  io.to(opponent).emit('opponentShowPosition', { position: payload.position });
};

export const hidePosition = (socket, io) => {
  const opponent = findCurrentOpponent(socket);
  if (opponent === OPPONENT_NOT_FOUND) return;
  io.to(opponent).emit('opponentHidePosition');
};

export const commitPosition = (socket, io, payload) => {
  if (!moveIsValid(socket, io, payload)) return;
  const room = findCurrentRoom(socket);
  if (playerIsCatcher(socket)) {
    room.gameState.catcherPosition = payload.position;
    room.gameState.turn.catcherDone = true;
  } else {
    room.gameState.runnerPosition = payload.position;
    room.gameState.turn.runnerDone = true;
    emitIfRunnerFoundGrass(socket, io, room, payload.position);
  }

  io.to(findCurrentOpponent(socket)).emit('opponentReady');
  if (turnFinished(room)) {
    io.to(room.id).emit('turnFinished', createClientInformation(room));
    emitWinAndLossIfGameIsOver(socket, io, room);
    resetTurn(room);
  }
};
