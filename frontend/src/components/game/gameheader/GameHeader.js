// @flow

import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import type { Socket } from 'socket.io-client';

import style from './GameHeader.css';

const WaitingForPlayer = () => {
  return <div>Waitin for player...</div>;
};

const WaitingForPlayerMove = () => {
  return <div>Waiting for move...</div>;
};

type Props = {
  gameState: {
    roomName: string,
    hasOpponentConnected: boolean,
    hasOpponentMadeMove: boolean,
  },
  socket: Socket,
};

const Msg = ({ closeToast }) => (
  <div>
    Lorem ipsum dolor
    <button>Retry</button>
    <button onClick={closeToast}>Close</button>
  </div>
)

class GameHeader extends Component<Props> {
  constructor(props) {
    super(props);
    props.socket.on('opponentFoundGrass', this.handleOpponentFoundGrass);
  }

  handleOpponentFoundGrass = () => {
    return toast(<Msg/>);
  };

  render() {
    const { gameState } = this.props;
    return (
      <div className={style.header}>
        <div>{gameState.socket.id}</div>
        <div>{gameState.roomName}</div>
        <div className="opponentStatus">
          {!gameState.hasOpponentConnected && <WaitingForPlayer />}
          {gameState.hasOpponentConnected && !gameState.hasOpponentMadeMove && <WaitingForPlayerMove />}
        </div>
        <div>There are {gameState.grassPositions.length} pieces left for runner to find</div>
        <ToastContainer />
      </div>
    );
  }
}

export default GameHeader;
