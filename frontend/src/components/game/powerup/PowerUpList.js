// @flow

import React, { Component } from 'react';
import type { Socket } from 'socket.io-client';
import Button from '../../shared/button/Button';

type Props = {
  socket: Socket,
};

type State = {
  socket: Socket,
};

class PowerUpList extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      socket: props.socket,
    };
  }

  handlePowerUpActivate = type => {
    console.log('HANDLE', type);
    this.state.socket.emit('activatePowerUp', { type });
  };

  render() {
    console.log(this.props);
    const { powerUps } = this.props;
    const visiblePowerUps = powerUps && powerUps.filter(powerUp => powerUp.coolDown <= powerUp.turnsSinceUse);
    return (
      <div>
        These are my power upssss
        {visiblePowerUps &&
          visiblePowerUps.map(powerUp => (
            <Button key={powerUp.type} onClick={this.handlePowerUpActivate.bind(this, powerUp.type)} text={powerUp.type} />
          ))}
      </div>
    );
  }
}

export default PowerUpList;
