import { randomIntFromInterval } from '../utils/Math';

const createGameRow = cellNumber => {
  const gameRow = [];
  for (let i = 0; i < cellNumber; i++) {
    gameRow.push({
      grass: false,
      fox: false,
      sheep: false,
    });
  }

  return gameRow;
};

const createGameBoard = rowNumber => {
  const gameBoard = [];
  for (let i = 0; i < rowNumber; i++) {
    gameBoard.push(createGameRow(rowNumber));
  }

  return gameBoard;
};

const populateBoardWithGrass = gameBoard => {
  const positions = [];

  const upperBoardBound = gameBoard.length;
  while (positions.length < upperBoardBound) {
    const positionCandidate = {
      x: randomIntFromInterval(0, upperBoardBound - 1),
      y: randomIntFromInterval(0, upperBoardBound - 1),
    };
    if (!positions.some(position => position.x === positionCandidate.x && position.y === positionCandidate.y)) {
      positions.push(positionCandidate);
    }
  }
  const populatedBoard = [...gameBoard];
  positions.forEach(position => {
    populatedBoard[position.x][position.y].grass = true;
  });
  return populatedBoard;
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
  populatedBoard[positions[0].x][positions[0].y].fox = true;
  populatedBoard[positions[1].x][positions[1].y].sheep = true;
  return populatedBoard;
};

export const createGameState = rowNumber => {
  if (!rowNumber) throw new Error('No number of rows was specified');
  const gameBoard = createGameBoard(rowNumber);

  const playerPositions = createPlayerPositions(gameBoard, 3);

  populateBoardWithGrass(gameBoard);
  placePlayersOnBoard(gameBoard, playerPositions);

  return {
    gameBoard,
    catcherStepSize: 3,
    runnerStepSize: 2,
    catcherPosition: playerPositions[0],
    runnerPosition: playerPositions[1],
  };
};
