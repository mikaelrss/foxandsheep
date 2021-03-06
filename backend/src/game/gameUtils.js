import { rooms, roomToNameAndIdMapper } from '../index';

export const OPPONENT_NOT_FOUND = 'OPPONENT_NOT_FOUND';

const removeElementFromArray = (array, element) => {
  array.splice(array.indexOf(element), 1);
};

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
  if (!room || !opponent) return;

  return opponent !== room.catcher.id;
};

export const turnFinished = room => room.gameState.catcher.done && room.gameState.runner.done;

export const resetTurn = room => {
  room.gameState.catcher.done = false;
  room.gameState.runner.done = false;
};

export const emitIfRunnerFoundGrass = (socket, io, { gameState }, runnerPosition) => {
  const foundPosition = gameState.grassPositions.find(
    grassPos => runnerPosition.x === grassPos.x && runnerPosition.y === grassPos.y
  );
  if (foundPosition) {
    removeElementFromArray(gameState.grassPositions, foundPosition);
    io.to(findCurrentOpponent(socket)).emit('opponentFoundGrass');
  }
};

export const emitWinAndLossIfGameIsOver = (socket, io, room) => {
  const { grassPositions } = room.gameState;
  const { position: catcherPosition } = room.gameState.catcher;
  const { position: runnerPosition } = room.gameState.runner;

  if (catcherPosition.x === runnerPosition.x && catcherPosition.y === runnerPosition.y) {
    io.to(room.catcher.id).emit('gameWon');
    io.to(room.runner.id).emit('gameLost');

    removeElementFromArray(rooms, room);
    io.emit('roomsUpdated', { rooms: rooms.map(roomToNameAndIdMapper) });
    return;
  }

  if (grassPositions.length === 0) {
    io.to(room.catcher.id).emit('gameLost');
    io.to(room.runner.id).emit('gameWon');

    removeElementFromArray(rooms, room);
    io.emit('roomsUpdated', { rooms: rooms.map(roomToNameAndIdMapper) });
  }
};

const findCurrentPosition = (socket, room) => {
  if (playerIsCatcher(socket)) return room.gameState.catcher.position;
  return room.gameState.runner.position;
};

const findCurrentStepSize = (socket, room) => {
  if (playerIsCatcher(socket)) return room.gameState.catcher.stepSize;
  return room.gameState.runner.stepSize;
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

export const createClientInformationWithoutOpponent = (socket, room) => {
  let clientInformation = createClientInformation(room);
  if (playerIsCatcher(socket)) {
    return {
      ...clientInformation,
      gameState: {
        ...clientInformation.gameState,
        runner: { position: null },
      },
    };
  }

  return {
    ...clientInformation,
    gameState: {
      ...clientInformation.gameState,
      catcher: { position: null },
    },
  };
};
