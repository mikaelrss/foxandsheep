import shortId from 'shortid';

import { randomIntFromInterval } from '../utils/Math';

const createGameRow = cellNumber => {
  const gameRow = [];
  for (let i = 0; i < cellNumber; i++) {
    gameRow.push({
      grass: false,
      fox: false,
      sheep: false,
      key: shortId.generate(),
    });
  }

  return gameRow;
};

const createGameBoard = rowNumber => {
  const gameBoard = [];
  for (let i = 0; i < rowNumber; i++) {
    gameBoard.push({ row: createGameRow(rowNumber), key: shortId.generate() });
  }

  return gameBoard;
};

const generateGrassPositions = (gameBoard, numberOfGrass) => {
  const positions = [];

  const upperBoardBound = gameBoard.length;
  while (positions.length < numberOfGrass) {
    const positionCandidate = {
      x: randomIntFromInterval(0, upperBoardBound - 1),
      y: randomIntFromInterval(0, upperBoardBound - 1),
      key: shortId.generate(),
    };
    if (!positions.some(position => position.x === positionCandidate.x && position.y === positionCandidate.y)) {
      positions.push(positionCandidate);
    }
  }

  return positions;
};

const checkIfInsideCatcherRange = (position, positionCandidate, catcherRange) => {
  const distanceX = positionCandidate.x - position.x;
  const distanceY = positionCandidate.y - position.y;

  const insideX = distanceX <= catcherRange && distanceX >= -catcherRange;
  const insideY = distanceY <= catcherRange && distanceY >= -catcherRange;
  return insideX && insideY;
};

const createPlayerPositions = (gameBoard, catcherRange) => {
  const positions = [];

  const upperBoardBound = gameBoard.length;

  while (positions.length < 2) {
    const positionCandidate = {
      x: randomIntFromInterval(0, upperBoardBound - 1),
      y: randomIntFromInterval(0, upperBoardBound - 1),
    };
    if (!positions.some(position => checkIfInsideCatcherRange(position, positionCandidate, catcherRange))) {
      positions.push(positionCandidate);
    }
  }
  return positions;
};

const placePlayersOnBoard = (gameBoard, positions) => {
  const populatedBoard = [...gameBoard];
  populatedBoard[positions[0].x].row[positions[0].y].fox = true;
  populatedBoard[positions[1].x].row[positions[1].y].sheep = true;
  return populatedBoard;
};

export const createGameState = (rowNumber, playerIsCatcher) => {
  if (!rowNumber) throw new Error('No number of row was specified');
  const gameBoard = createGameBoard(rowNumber);

  const playerPositions = createPlayerPositions(gameBoard, 1);

  const grassPositions = generateGrassPositions(gameBoard, 10);
  placePlayersOnBoard(gameBoard, playerPositions);

  return {
    gameBoard,
    grassPositions,
    catcherStepSize: 3,
    runnerStepSize: 2,
    catcherPosition: playerPositions[0],
    runnerPosition: playerPositions[1],
    playerIsCatcher,
    turn: {
      catcherDone: false,
      runnerDone: false,
    },
  };
};
