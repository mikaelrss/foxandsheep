// @flow

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Row from './row/Row';

import style from './Game.css';
import type { CellType, CharacterType, PositionType } from '../../types';
import Character from './characters/fox/Character';

type GameProps = {
  rowNumber: number,
  cellSize: number,
};

const applyHighlight = (cell: CellType, originalPosition: PositionType, cellPosition: PositionType, step: number) => {
  const insideX = cellPosition.x >= originalPosition.x - step && cellPosition.x <= originalPosition.x + step;
  const insideY = cellPosition.y >= originalPosition.y - step && cellPosition.y <= originalPosition.y + step;
  return {
    ...cell,
    highlighted: insideX && insideY,
  };
};

const highlightLegalSquares = (state: Array<Array<CellType>>, originalPosition: PositionType, stepSize: number) => {
  return state.map((row, i) => row.map((cell, u) => applyHighlight(cell, originalPosition, { y: i, x: u }, stepSize)));
};

const serverState = [
  [{}, { grass: true }, {}, { fox: true }, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, { grass: true }, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  [{ grass: true }, {}, {}, { grass: true }, {}, {}, {}, {}, {}, {}],
  [{}, {}, { grass: true }, {}, {}, {}, {}, {}, {}, {}],
  [{}, { sheep: true }, {}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  [{}, { highlighted: true }, {}, {}, {}, {}, {}, {}, {}, {}],
];

type State = {
  serverState: Array<Array<CellType>>,
  gameBoard: Array<Array<CellType>>,
  playerPosition: PositionType,
  originalPosition: PositionType,
  opponentPosition: PositionType,
  cellSize: number,
  stepSize: number,
  catcher: boolean,
  character: CharacterType,
};

class Game extends Component<GameProps, State> {
  constructor(props) {
    super(props);

    const socket = props.socket;
    socket.on('serverStateChange', this.handleServerStateChange);

    this.state = {
      catcher: true,
      character: 'fox',
      gameBoard: [],
      socket,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handlePlayerMovement);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handlePlayerMovement);
  }

  handleServerStateChange = payload => {
    console.log('SERVRE CHANGE', payload);
    const { catcherPosition, runnerPosition, catcherStepSize, gameBoard } = payload.gameState;
    this.setState({
      originalPosition: catcherPosition,
      playerPosition: catcherPosition,
      opponentPosition: runnerPosition,
      stepSize: catcherStepSize,
      gameBoard: highlightLegalSquares(gameBoard, catcherPosition, catcherStepSize),
    });
  };

  handlePlayerMovement = (event: SyntheticInputEvent<KeyboardEvent>) => {
    switch (event.key) {
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      default:
        return;
    }
  };

  moveUp = () => {
    const { playerPosition, originalPosition } = this.state;
    if (playerPosition.y === 0) {
      return;
    }
    if (playerPosition.y <= originalPosition.y - this.state.stepSize) {
      return;
    }

    this.setState({
      playerPosition: {
        ...playerPosition,
        y: playerPosition.y - 1,
      },
    });
  };
  moveDown = () => {
    const { playerPosition, originalPosition } = this.state;
    if (playerPosition.y === this.state.gameBoard[0].length - 1) {
      return;
    }
    if (playerPosition.y >= originalPosition.y + this.state.stepSize) {
      return;
    }

    this.setState({
      playerPosition: {
        ...playerPosition,
        y: playerPosition.y + 1,
      },
    });
  };
  moveLeft = () => {
    const { playerPosition, originalPosition } = this.state;
    if (playerPosition.x === 0) {
      return;
    }
    if (playerPosition.x <= originalPosition.x - this.state.stepSize) {
      return;
    }

    this.setState({
      playerPosition: {
        ...playerPosition,
        x: playerPosition.x - 1,
      },
    });
  };
  moveRight = () => {
    const { playerPosition, originalPosition } = this.state;
    if (playerPosition.x === this.state.gameBoard[0].length - 1) {
      return;
    }
    if (playerPosition.x >= originalPosition.x + this.state.stepSize) {
      return;
    }

    this.setState({
      playerPosition: {
        ...playerPosition,
        x: playerPosition.x + 1,
      },
    });
  };

  render() {
    const { cellSize } = this.props;
    return (
      <div className={style.gameContainer}>
        <h3>This is game</h3>
        <div className={style.board}>
          {this.state.gameBoard.length && this.state.gameBoard.map(row => <Row cells={row} cellSize={cellSize} />)}
          {this.state.playerPosition && (
            <Character position={this.state.playerPosition} cellSize={cellSize} character="fox" />
          )}
          {this.state.opponentPosition && (
            <Character position={this.state.opponentPosition} cellSize={cellSize} character="sheep" />
          )}
        </div>
      </div>
    );
  }
}

export default withRouter(Game);
