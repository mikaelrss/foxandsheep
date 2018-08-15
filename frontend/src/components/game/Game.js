// @flow

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import type { CellType, CharacterType, ClientInformationType, PositionType, RowType } from '../../types';

import Row from './row/Row';
import Character from './characters/fox/Character';
import GameHeader from './gameheader/GameHeader';

import style from './Game.css';

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
  opponentVisible: boolean,
  hasOpponentMadeMove: boolean,
  hasOpponentConnected: boolean,
  cellSize: number,
  stepSize: number,
  playerIsCatcher: boolean,
  character: CharacterType,
};

type GameProps = {
  rowNumber: number,
  cellSize: number,
};

class Game extends Component<GameProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      character: 'fox',
      gameBoard: [],
      socket: props.socket,
      hasOpponentMadeMove: false,
      hasOpponentConnected: false,
      opponentVisible: false,
    };

    // Init
    props.socket.on('serverStateChange', this.handleServerStateChange);
    props.socket.on('roomNotFound', this.handleRoomNotFound);

    // Moves
    props.socket.on('opponentReady', this.handleOpponentReady);
    props.socket.on('opponentShowPosition', this.handleOpponentShowPosition);
    props.socket.on('opponentHidePosition', this.handleOpponentHidePosition);
    props.socket.on('movesCommited', this.handleMovesCommited);

    if (props.match.params && this.props.match.params.roomId) {
      props.socket.emit('joinRoom', { roomId: props.match.params.roomId });
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handlePlayerMovement);
    document.addEventListener('keyup', this.handlePlayerActions);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handlePlayerMovement);
    document.removeEventListener('keyup', this.handlePlayerActions);
  }

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
      case 's':
      case 'S':
        if (event.repeat) return;
        this.state.socket.emit('showPosition', { position: this.state.playerPosition });
        break;
      default:
        return;
    }
  };

  handlePlayerActions = (event: SyntheticInputEvent<KeyboardEvent>) => {
    switch (event.key) {
      case 's':
      case 'S':
        this.state.socket.emit('hidePosition');
        break;
      default:
        return;
    }
  };

  handleOpponentReady = () => {
    this.setState({
      hasOpponentMadeMove: true,
    });
  };

  handleOpponentShowPosition = (payload: { position: PositionType }) => {
    this.setState({
      opponentVisible: true,
      opponentPosition: payload.position,
    });
  };

  handleOpponentHidePosition = () => {
    this.setState({
      opponentVisible: false,
    });
  };

  handleRoomNotFound = () => {
    console.log('Room could not be found');
  };

  handleServerStateChange = (payload: ClientInformationType) => {
    const { catcherPosition, runnerPosition, catcherStepSize, runnerStepSize, gameBoard } = payload.gameState;

    const playerIsCatcher = payload.catcher === this.state.socket.id;
    const playerPosition = playerIsCatcher ? catcherPosition : runnerPosition;
    const opponentPosition = playerIsCatcher ? runnerPosition : catcherPosition;
    const stepSize = playerIsCatcher ? catcherStepSize : runnerStepSize;

    requestAnimationFrame(() => {
      this.setState({
        roomName: payload.roomName,
        originalPosition: playerPosition,
        playerPosition,
        opponentPosition,
        stepSize,
        hasOpponentConnected: playerIsCatcher ? payload.runner !== null : payload.catcher !== null,
        playerIsCatcher,
        gameBoard: highlightLegalSquares(gameBoard, playerPosition, stepSize),
      });
    });
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
    const { playerIsCatcher, playerPosition, opponentPosition, opponentVisible } = this.state;
    const { cellSize } = this.props;

    return (
      <div className={style.gameContainer}>
        <h3>This is game</h3>
        <GameHeader gameState={this.state} />
        <div className={style.board}>
          {this.state.gameBoard &&
            this.state.gameBoard.length &&
            this.state.gameBoard.map(row => {
              return <Row playerIsCatcher={playerIsCatcher} cells={row.row} cellSize={cellSize} key={row.key} />;
            })}
          {playerPosition && (
            <Character position={playerPosition} cellSize={cellSize} character={playerIsCatcher ? 'fox' : 'sheep'} />
          )}
          {opponentVisible && (
            <Character
              position={opponentPosition}
              cellSize={cellSize}
              character={!playerIsCatcher ? 'fox' : 'sheep'}
            />
          )}
        </div>
      </div>
    );
  }
}

export default compose(withRouter)(Game);
