import { findCurrentOpponent, OPPONENT_NOT_FOUND } from '../game/gameUtils';

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
