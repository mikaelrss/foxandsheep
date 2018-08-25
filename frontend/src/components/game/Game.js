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
import Button from '../shared/button/Button';
import PowerUpList from './powerup/PowerUpList';

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
  gameOver: boolean,
  winStatus: string,
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
    this.state.socket.emit('leftGame');
  }

  handleGameOver = status => {
    this.setState({
      winStatus: status,
      gameOver: true,
    });
  };

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
        if (event.repeat) {
          return;
        }
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
    const { gameBoard, grassPositions } = payload.gameState;

    const {
      position: catcherPosition,
      stepSize: catcherStepSize,
      powerUps: catcherPowerUps,
    } = payload.gameState.catcher;
    const { position: runnerPosition, stepSize: runnerStepSize, powerUps: runnerPowerUps } = payload.gameState.runner;

    const playerIsCatcher = payload.catcher === this.state.socket.id;
    const playerPosition = playerIsCatcher ? catcherPosition : runnerPosition;
    const playerPowerUps = playerIsCatcher ? catcherPowerUps : runnerPowerUps;
    const opponentPosition = playerIsCatcher ? runnerPosition : catcherPosition;
    const stepSize = playerIsCatcher ? catcherStepSize : runnerStepSize;

    requestAnimationFrame(() => {
      this.setState({
        roomName: payload.roomName,
        originalPlayerPosition: playerPosition,
        playerPosition,
        opponentPosition: opponentPosition || this.state.opponentPosition,
        stepSize,
        hasOpponentConnected: playerIsCatcher ? payload.runner !== null : payload.catcher !== null,
        playerIsCatcher,
        gameBoard: highlightLegalSquares(gameBoard, playerPosition, stepSize),
        grassPositions,
        playerPowerUps,
      });
    });
  };

  moveUp = () => {
    if (this.state.hasPlayerMadeMove) {
      return;
    }
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
    if (this.state.hasPlayerMadeMove) {
      return;
    }

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
    if (this.state.hasPlayerMadeMove) {
      return;
    }

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
    if (this.state.hasPlayerMadeMove) {
      return;
    }

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

  handleMoveByCoordinates = (y, x) => {
    const { playerPosition, stepSize } = this.state;
    if (x < playerPosition.x - stepSize || x > playerPosition.x + stepSize) return;
    if (y < playerPosition.y - stepSize || y > playerPosition.y + stepSize) return;
    this.setState({
      playerPosition: {
        x,
        y,
      },
    });
  };

  sendBackToLobby = () => {
    this.props.history.push('/lobby');
  };

  render() {
    const {
      playerIsCatcher,
      playerPosition,
      opponentPosition,
      opponentVisible,
      grassPositions,
      gameOver,
      socket,
    } = this.state;
    let { cellSize } = this.props;

    const boardWidth = cellSize * this.state.gameBoard.length;

    const screenWidth = document.documentElement.clientWidth;
    if (boardWidth + 30 > screenWidth && this.state.gameBoard.length) {
      cellSize = (screenWidth - 30 - 30) / this.state.gameBoard.length;
    }

    return (
      <div className={style.gameContainer}>
        <h3>This is game</h3>
        <GameHeader gameState={this.state} socket={socket} handleGameOver={this.handleGameOver} />
        {!gameOver && (
          <div className={style.board}>
            {this.state.readyToShowMoves && <MoveReadyCounter />}
            {this.state.gameBoard &&
              this.state.gameBoard.length &&
              this.state.gameBoard.map((row, index) => {
                return (
                  <Row
                    playerIsCatcher={playerIsCatcher}
                    cells={row.row}
                    cellSize={cellSize}
                    key={row.key}
                    moveHandler={this.handleMoveByCoordinates.bind(this, index)}
                  />
                );
              })}
            {opponentPosition &&
              opponentVisible && (
                <Character
                  position={opponentPosition}
                  cellSize={cellSize}
                  character={!playerIsCatcher ? 'fox' : 'sheep'}
                  moveHandler={this.handleMoveByCoordinates}
                />
              )}
            {playerPosition && (
              <Character
                position={playerPosition}
                cellSize={cellSize}
                character={playerIsCatcher ? 'fox' : 'sheep'}
                moveHandler={this.handleMoveByCoordinates}
              />
            )}
            {!playerIsCatcher && (
              <GrassList
                grassPositions={grassPositions}
                cellSize={cellSize}
                moveHandler={this.handleMoveByCoordinates}
              />
            )}
          </div>
        )}
        {gameOver && (
          <div
            className={style.dummyContainer}
            style={{
              height: `${cellSize * this.state.gameBoard.length}px`,
              width: `${cellSize * this.state.gameBoard.length}px`,
            }}
          >
            <div>Game over, you {this.state.winStatus}!</div>
          </div>
        )}
        <PowerUpList socket={socket} powerUps={this.state.playerPowerUps} />
        <Button
          onClick={!gameOver ? this.handleCommit : this.sendBackToLobby}
          className={style.commitButton}
          text={!gameOver ? 'Commit move' : 'Back to lobby'}
        />
      </div>
    );
  }
}

export default compose(withRouter)(Game);
