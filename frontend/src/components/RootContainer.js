// @flow

import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Version from './version/Version';
import io from 'socket.io-client';

import style from './RootContainer.css';
import Lobby from './lobby/Lobby';
import Game from './game/Game';

class RootContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(),
    };
  }
  render() {
    return (
      <div className={style.container}>
        <div className={style.content}>
          <Switch>
            <Route path="/version" component={Version} />
            <Route path="/lobby" render={() => <Lobby socket={this.state.socket} />} />
            <Route path="/game/:roomId" render={() => <Game cellSize={40} socket={this.state.socket} />} />
            <Redirect to="/lobby" />
          </Switch>
        </div>
      </div>
    );
  }
}

export default RootContainer;
