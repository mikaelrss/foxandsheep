// @flow

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import type {
  CellType,
  CharacterType,
  ClientInformationType,
  PositionType,
  PositionWithKey,
  RowType,
} from '../../types';

import Row from './row/Row';
import Character from './characters/fox/Character';
import GameHeader from './gameheader/GameHeader';

import style from './Game.css';
import MoveReadyCounter from './movereadycounter/MoveReadyCounter';
import GrassList from './grasslist/GrassList';

const applyHighlight = (cell: CellType, originalPosition: PositionType, cellPosition: PositionType, step: number) => {
  const insideX = cellPosition.x >= originalPosition.x - step && cellPosition.x <= originalPosition.x + step;
  const insideY = cellPosition.y >= originalPosition.y - step && cellPosition.y <= originalPosition.y + step;
  return { ...cell, highlighted: insideX && insideY };
};

const highlightLegalSquares = (state: Array<RowType>, originalPosition: PositionType, stepSize: number) =>
  state.map((row, i) => ({
    row: row.row.map((cell, u) => applyHighlight(cell, originalPosition, { y: i, x: u }, stepSize)),
    key: row.key,
  }));

type State = {
  gameBoard: Array<RowType>,
  cellSize: number,

  playerPosition: PositionType,
  originalPlayerPosition: PositionType,
  opponentPosition: PositionType,

  hasOpponentMadeMove: boolean,
  hasPlayerMadeMove: boolean,
  hasOpponentConnected: boolean,
  opponentVisible: boolean,

  playerIsCatcher: boolean,
  stepSize: number,
  character: CharacterType,
  movesMade: number,
  readyToShowMoves: boolean,
  grassPositions: Array<PositionWithKey>,
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
      hasPlayerMadeMove: false,
      hasOpponentConnected: false,
      opponentVisible: true,
      movesMade: 0,
      readyToShowMoves: false,
      grassPositions: [],
    };

    // Init
    props.socket.on('serverStateChange', this.handleServerStateChange);
    props.socket.on('roomNotFound', this.handleRoomNotFound);

    // Moves
    props.socket.on('opponentReady', this.handleOpponentReady);
    props.socket.on('opponentShowPosition', this.handleOpponentShowPosition);
    props.socket.on('opponentHidePosition', this.handleOpponentHidePosition);
    props.socket.on('turnFinished', this.handleTurnFinished);

    props.socket.on('gameLost', this.handleGameLost);
    props.socket.on('gameWon', this.handleGameWon);

    props.socket.on('illegalMove', this.handleIllegalMove);

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
    switch (event.code) {
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
      case 'KeyS':
        if (event.repeat) return;
        this.state.socket.emit('showPosition', { position: this.state.playerPosition });
        break;
      default:
        return;
    }
  };

  handlePlayerActions = (event: SyntheticInputEvent<KeyboardEvent>) => {
    switch (event.code) {
      case 'KeyS':
        this.state.socket.emit('hidePosition');
        break;
      case 'Space':
        this.handleCommit();
        break;
      default:
        return;
    }
  };

  handleGameLost = () => {
    console.log('You lost the game!');
  };

  handleGameWon = () => {
    console.log('You won the game!');
  };

  handleRoomNotFound = () => {
    console.log('Room could not be found');
    this.props.history.push('/');
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

  handleCommit = () => {
    this.setState({
      hasPlayerMadeMove: true,
    });
    this.state.socket.emit('commitMove', { position: this.state.playerPosition });
  };

  handleTurnFinished = payload => {
    this.setState({ readyToShowMoves: true });
    setTimeout(() => {
      this.setState({
        hasOpponentMadeMove: false,
        hasPlayerMadeMove: false,
        readyToShowMoves: false,
        movesMade: this.state.movesMade + 1,
      });
      this.handleServerStateChange(payload);
    }, 3000);
  };

  handleIllegalMove = originalPlayerPosition => {
    this.setState({
      hasPlayerMadeMove: false,
      playerPosition: originalPlayerPosition,
    });
  };

  handleServerStateChange = (payload: ClientInformationType) => {
    const {
      catcherPosition,
      runnerPosition,
      catcherStepSize,
      runnerStepSize,
      gameBoard,
      grassPositions,
    } = payload.gameState;

    const playerIsCatcher = payload.catcher === this.state.socket.id;
    const playerPosition = playerIsCatcher ? catcherPosition : runnerPosition;
    const opponentPosition = playerIsCatcher ? runnerPosition : catcherPosition;
    const stepSize = playerIsCatcher ? catcherStepSize : runnerStepSize;

    requestAnimationFrame(() => {
      this.setState({
        roomName: payload.roomName,
        originalPlayerPosition: playerPosition,
        playerPosition,
        opponentPosition,
        stepSize,
        hasOpponentConnected: playerIsCatcher ? payload.runner !== null : payload.catcher !== null,
        playerIsCatcher,
        gameBoard: highlightLegalSquares(gameBoard, playerPosition, stepSize),
        grassPositions,
      });
    });
  };

  moveUp = () => {
    if (this.state.hasPlayerMadeMove) return;
    const { playerPosition, originalPlayerPosition } = this.state;
    if (playerPosition.y <= 0) {
      return;
    }
    if (playerPosition.y <= originalPlayerPosition.y - this.state.stepSize) {
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
    if (this.state.hasPlayerMadeMove) return;

    const { playerPosition, originalPlayerPosition } = this.state;
    if (playerPosition.y >= this.state.gameBoard[0].row.length - 1) {
      return;
    }
    if (playerPosition.y >= originalPlayerPosition.y + this.state.stepSize) {
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
    if (this.state.hasPlayerMadeMove) return;

    const { playerPosition, originalPlayerPosition } = this.state;
    if (playerPosition.x <= 0) {
      return;
    }
    if (playerPosition.x <= originalPlayerPosition.x - this.state.stepSize) {
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
    if (this.state.hasPlayerMadeMove) return;

    const { playerPosition, originalPlayerPosition } = this.state;
    if (playerPosition.x >= this.state.gameBoard[0].row.length - 1) {
      return;
    }
    if (playerPosition.x >= originalPlayerPosition.x + this.state.stepSize) {
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
    const { playerIsCatcher, playerPosition, opponentPosition, opponentVisible, grassPositions } = this.state;
    const { cellSize } = this.props;

    return (
      <div className={style.gameContainer}>
        <h3>This is game</h3>
        <GameHeader gameState={this.state} socket={this.state.socket} />
        <div className={style.board}>
          {this.state.readyToShowMoves && <MoveReadyCounter />}
          {this.state.gameBoard &&
            this.state.gameBoard.length &&
            this.state.gameBoard.map(row => {
              return <Row playerIsCatcher={playerIsCatcher} cells={row.row} cellSize={cellSize} key={row.key} />;
            })}
          {playerPosition && (
            <Character position={playerPosition} cellSize={cellSize} character={playerIsCatcher ? 'fox' : 'sheep'} />
          )}
          {opponentPosition &&
            opponentVisible && (
              <Character
                position={opponentPosition}
                cellSize={cellSize}
                character={!playerIsCatcher ? 'fox' : 'sheep'}
              />
            )}
          {!playerIsCatcher && <GrassList grassPositions={grassPositions} cellSize={cellSize} />}
        </div>
      </div>
    );
  }
}

export default compose(withRouter)(Game);
