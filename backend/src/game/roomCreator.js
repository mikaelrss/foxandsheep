import uuid from 'uuid/v4';
import { createGameState } from './boardCreator';
import { randomIntFromInterval } from '../utils/Math';

export const initializeRoom = (socket, name) => {
  const playerIsCather = randomIntFromInterval(0, 1) === 1;
  return {
    name,
    catcher: {
      id: playerIsCather ? socket.id : null,
    },
    runner: {
      id: !playerIsCather ? socket.id : null,
    },
    roomId: uuid(),
    gameState: createGameState(15, playerIsCather),
  };
};
