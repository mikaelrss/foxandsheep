// @flow

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';

import type { CellType, CharacterType, ClientInformationType, PositionType, RowType } from '../../types';

import Row from './row/Row';
import Character from './characters/fox/Character';
import GameHeader from './gameheader/GameHeader';
import { setGameState } from './GameActions';

import style from './Game.css';
import selector from './GameSelector';

const applyHighlight = (cell: CellType, originalPosition: PositionType, cellPosition: PositionType, step: number) => {
  const insideX = cellPosition.x >= originalPosition.x - step && cellPosition.x <= originalPosition.x + step;
  const insideY = cellPosition.y >= originalPosition.y - step && cellPosition.y <= originalPosition.y + step;
  return {
    ...cell,
    highlighted: insideX && insideY,
  };
};

const highlightLegalSquares = (state: Array<RowType>, originalPosition: PositionType, stepSize: number) => {
  return state.map((row, i) => ({
    row: row.row.map((cell, u) => applyHighlight(cell, originalPosition, { y: i, x: u }, stepSize)),
    key: row.key,
  }));
};

type State = {
  gameBoard: Array<RowType>,
  playerPosition: PositionType,
  originalPosition: PositionType,
  opponentPosition: PositionType,
  cellSize: number,
  stepSize: number,
  playerIsCatcher: boolean,
  character: CharacterType,
};

type GameProps = {
  rowNumber: number,
  cellSize: number,
  setGameState: () => void,
  gameBoard: Array<RowType>,
  playerPosition: PositionType,
  originalPosition: PositionType,
  opponentPosition: PositionType,
  cellSize: number,
  stepSize: number,
  playerIsCatcher: boolean,
  character: CharacterType,
  roomName: string,
};

class Game extends Component<GameProps, State> {
  constructor(props) {
    super(props);

    props.socket.on('serverStateChange', this.handleServerStateChange);

    this.state = {
      character: 'fox',
      gameBoard: [],
      socket: props.socket,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handlePlayerMovement);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handlePlayerMovement);
  }

  handleServerStateChange = (payload: ClientInformationType) => {
    const { catcherPosition, runnerPosition, catcherStepSize, runnerStepSize, gameBoard } = payload.gameState;

    const playerIsCatcher = payload.catcher === this.state.socket.id;
    const playerPosition = playerIsCatcher ? catcherPosition : runnerPosition;
    const opponentPosition = playerIsCatcher ? runnerPosition : catcherPosition;
    const stepSize = playerIsCatcher ? catcherStepSize : runnerStepSize;

    this.props.setGameState(
      {
        roomName: payload.roomName,
        originalPosition: playerPosition,
        playerPosition,
        opponentPosition,
        stepSize,
        playerIsCatcher,
        gameBoard: highlightLegalSquares(gameBoard, playerPosition, stepSize),
      },
      this.props.roomName
    );
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
    const { playerPosition, originalPosition } = this.props;
    if (playerPosition.y === 0) return;
    if (playerPosition.y <= originalPosition.y - this.props.stepSize) return;

    this.setState({
      playerPosition: {
        ...playerPosition,
        y: playerPosition.y - 1,
      },
    });
  };
  moveDown = () => {
    const { playerPosition, originalPosition } = this.props;
    if (playerPosition.y === this.props.gameBoard[0].length - 1) return;
    if (playerPosition.y >= originalPosition.y + this.props.stepSize) return;

    this.setState({
      playerPosition: {
        ...playerPosition,
        y: playerPosition.y + 1,
      },
    });
  };
  moveLeft = () => {
    const { playerPosition, originalPosition } = this.props;
    if (playerPosition.x === 0) return;
    if (playerPosition.x <= originalPosition.x - this.props.stepSize) return;

    this.setState({
      playerPosition: {
        ...playerPosition,
        x: playerPosition.x - 1,
      },
    });
  };
  moveRight = () => {
    this.props.setGameState({ stepSize: 7 });

    const { playerPosition, originalPosition } = this.props;
    if (playerPosition.x === this.props.gameBoard[0].length - 1) return;
    if (playerPosition.x >= originalPosition.x + this.props.stepSize) return;

    this.setState({
      playerPosition: {
        ...playerPosition,
        x: playerPosition.x + 1,
      },
    });
  };

  render() {
    const { cellSize, playerIsCatcher, playerPosition, opponentPosition } = this.props;

    console.log(this.props);

    return (
      <div className={style.gameContainer}>
        <h3>This is game</h3>
        <GameHeader gameState={this.state} />
        <div className={style.board}>
          {this.props.gameBoard &&
            this.props.gameBoard.length &&
            this.props.gameBoard.map(row => {
              return <Row playerIsCatcher={playerIsCatcher} cells={row.row} cellSize={cellSize} key={row.key} />;
            })}
          {playerPosition && (
            <Character position={playerPosition} cellSize={cellSize} character={playerIsCatcher ? 'fox' : 'sheep'} />
          )}
          {opponentPosition && (
            <Character position={opponentPosition} cellSize={cellSize} character={!playerIsCatcher ? 'fox' : 'sheep'} />
          )}
        </div>
      </div>
    );
  }
}

const withRedux = connect(
  selector,
  {
    setGameState,
  }
);

export default compose(
  withRedux,
  withRouter
)(Game);
