// @flow

import React, { Component } from 'react';
import Row from './row/Row';

import style from './Game.css';
import type { CellType, PositionType } from '../../types';
import Character from './characters/fox/Character';

type GameProps = {
  rowNumber: number,
  cellNumber: number,
};

const applyHighlight = (cell: CellType, originalPosition: PositionType, cellPosition: PositionType, step: number) => {
  const insideX = cellPosition.x >= originalPosition.x - step && cellPosition.x <= originalPosition.x + step;
  const insideY = cellPosition.y >= originalPosition.y - step && cellPosition.y <= originalPosition.y + step;
  return {
    ...cell,
    highlighted: insideX && insideY,
  };
};

const highlightLegalSquares = (state: Array<Array<CellType>>, originalPosition: PositionType, movementSize: number) => {
  return state.map((row, i) =>
    row.map((cell, u) => applyHighlight(cell, originalPosition, { y: i, x: u }, movementSize))
  );
};

const serverState = [
  // [{}, { grass: true }, {}, { fox: true }, {}, {}, {}, {}, {}, {}],
  // [{}, {}, {}, {}, { grass: true }, {}, {}, {}, {}, {}],
  // [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  // [{ grass: true }, {}, {}, { grass: true }, {}, {}, {}, {}, {}, {}],
  // [{}, {}, { grass: true }, {}, {}, {}, {}, {}, {}, {}],
  // [{}, { sheep: true }, {}, {}, {}, {}, {}, {}, {}, {}],
  // [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  // [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  // [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
  // [{}, { highlighted: true }, {}, {}, {}, {}, {}, {}, {}, {}],
];

type State = {
  serverState: Array<Array<CellType>>,
  playerPosition: PositionType,
  opponentPosition: PositionType,
  cellSize: number,
  movementSize: number,
};

class Game extends Component<GameProps, State> {
  state = {
    serverState: highlightLegalSquares(serverState, { x: 3, y: 6 }, 2),
    originalPosition: { x: 3, y: 6 },
    playerPosition: { x: 3, y: 6 },
    opponentPosition: { x: 7, y: 8 },
    cellSize: 25,
    movementSize: 2,
  };

  container: ?HTMLDivElement;

  componentDidMount() {
    document.addEventListener('keydown', this.handlePlayerMovement);
    if (this.container) {
      this.setState({
        cellSize:
          this.container.getBoundingClientRect().width / this.state.serverState[0] && this.state.serverState[0].length,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handlePlayerMovement);
  }

  handlePlayerMovement = event => {
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
    if (playerPosition.y === 0) return;
    if (playerPosition.y <= originalPosition.y - this.state.movementSize) return;

    this.setState({
      playerPosition: {
        ...playerPosition,
        y: playerPosition.y - 1,
      },
    });
  };
  moveDown = () => {
    const { playerPosition, originalPosition } = this.state;
    if (playerPosition.y === this.state.serverState[0].length - 1) return;
    if (playerPosition.y >= originalPosition.y + this.state.movementSize) return;

    this.setState({
      playerPosition: {
        ...playerPosition,
        y: playerPosition.y + 1,
      },
    });
  };
  moveLeft = () => {
    const { playerPosition, originalPosition } = this.state;
    if (playerPosition.x === 0) return;
    if (playerPosition.x <= originalPosition.x - this.state.movementSize) return;

    this.setState({
      playerPosition: {
        ...playerPosition,
        x: playerPosition.x - 1,
      },
    });
  };
  moveRight = () => {
    const { playerPosition, originalPosition } = this.state;
    if (playerPosition.x === this.state.serverState[0].length - 1) return;
    if (playerPosition.x >= originalPosition.x + this.state.movementSize) return;

    this.setState({
      playerPosition: {
        ...playerPosition,
        x: playerPosition.x + 1,
      },
    });
  };

  render() {
    const { cellSize } = this.state;
    return (
      <div className={style.gameContainer}>
        <h3>This is game</h3>
        <div
          className={style.board}
          ref={node => {
            this.container = node;
          }}
        >
          {this.state.serverState.map(row => (
            <Row cells={row} cellSize={cellSize} />
          ))}
          <Character position={this.state.playerPosition} cellSize={cellSize} character="fox" />
          <Character position={this.state.opponentPosition} cellSize={cellSize} character="sheep" />
        </div>
      </div>
    );
  }
}

export default Game;
