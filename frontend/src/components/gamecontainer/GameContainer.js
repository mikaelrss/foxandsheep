// @flow

import React, { Component } from 'react';

import type { Socket } from 'socket.io-client';

import Game from '../game/Game';

type Props = {};

type State = {
  socket: Socket,
};

class GameContainer extends Component<Props, State> {


  render() {
    return <Game cellSize={50} />;
  }
}

export default GameContainer;
