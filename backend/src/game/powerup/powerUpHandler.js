import {
  createClientInformation,
  createClientInformationWithoutOpponent,
  findCurrentRoom,
  playerIsCatcher,
} from '../gameUtils';
import {
  CATCHER_STEP_SIZE,
  CATCHER_STEP_SIZE_INCREASE,
  RUNNER_STEP_SIZE,
  RUNNER_STEP_SIZE_INCREASE,
} from '../constants';
import { INVISIBILITY_POWERUP, STEP_SIZE_POWERUP, TRAP_POWERUP } from './powerUpTypes';

const handleIncreaseStepSize = (socket, io) => {
  const room = findCurrentRoom(socket);
  if (playerIsCatcher(socket)) {
    const { powerUps } = room.gameState.catcher;
    room.gameState.catcher.stepSize += CATCHER_STEP_SIZE_INCREASE;
    const index = powerUps.findIndex(powerUp => (powerUp.type = STEP_SIZE_POWERUP));
    room.gameState.catcher.powerUps = [
      ...powerUps.slice(0, index),
      { ...powerUps[index], turnsSinceUse: 0 },
      ...powerUps.slice(index + 1),
    ];
  } else {
    const { powerUps } = room.gameState.runner;
    room.gameState.runner.stepSize += RUNNER_STEP_SIZE_INCREASE;
    const index = powerUps.findIndex(powerUp => (powerUp.type = STEP_SIZE_POWERUP));
    room.gameState.runner.powerUps = [
      ...powerUps.slice(0, index),
      { ...powerUps[index], turnsSinceUse: 0 },
      ...powerUps.slice(index + 1),
    ];
  }
  io.to(socket.id).emit('serverStateChange', createClientInformationWithoutOpponent(socket, room));
};

export const tickAndResetPowerUps = room => {
  room.gameState.catcher = {
    ...room.gameState.catcher,
    stepSize: CATCHER_STEP_SIZE,
    powerUps: room.gameState.catcher.powerUps.map(powerUp => ({
      ...powerUp,
      turnsSinceUse: powerUp.turnsSinceUse + 1,
    })),
  };
  room.gameState.runner = {
    ...room.gameState.runner,
    stepSize: RUNNER_STEP_SIZE,
    powerUps: room.gameState.runner.powerUps.map(powerUp => ({
      ...powerUp,
      turnsSinceUse: powerUp.turnsSinceUse + 1,
    })),
  };
};

export const handlePowerUp = (socket, io, data) => {
  console.log(data);
  switch (data.type) {
    case STEP_SIZE_POWERUP:
      console.log('Increase stepsize');
      handleIncreaseStepSize(socket, io);
      break;
    case INVISIBILITY_POWERUP:
      console.log('invisible');
      break;
    case TRAP_POWERUP:
      console.log('Trop');
      break;
    default:
      console.log('Could not find powerp');
  }
};
