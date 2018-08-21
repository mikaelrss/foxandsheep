// @flow

import React, { Component } from 'react';
import type { Socket } from 'socket.io-client';

type Props = {
  socket: Socket,
};

type State = {};

class PowerUpList extends Component<Props, State> {
  render() {
    return <div>These are my power upssss</div>;
  }
}

export default PowerUpList;
