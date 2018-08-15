import uuid from 'uuid/v4';
import { createGameState } from './BoardCreator';
import { randomIntFromInterval } from '../utils/Math';

export const initializeRoom = (socket, name) => {
  const playerIsCather = randomIntFromInterval(0, 1) === 1;
  return {
    name,
    player1: playerIsCather ? socket.id : null,
    player2: !playerIsCather ? socket.id : null,
    roomId: uuid(),
    gameState: createGameState(10, playerIsCather),
  };
};
