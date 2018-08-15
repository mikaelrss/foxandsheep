// @flow

import React from 'react';
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
};

const GameHeader = ({ gameState }: Props) => {
  console.log(gameState);
  return (
    <div className={style.header}>
      <div>{gameState.socket.id}</div>
      <div>{gameState.roomName}</div>
      {!gameState.hasOpponentConnected && <WaitingForPlayer />}
      {gameState.hasOpponentConnected && !gameState.hasOpponentMadeMove && <WaitingForPlayerMove />}
    </div>
  );
};

export default GameHeader;
