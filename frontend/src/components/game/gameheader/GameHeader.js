// @flow

import React from 'react';
import style from './GameHeader.css';

type Props = {
  gameState: {
    roomName: string,
  },
};

const GameHeader = ({ gameState }) => {
  return <div className={style.header}>{gameState.roomName}</div>;
};

export default GameHeader;
