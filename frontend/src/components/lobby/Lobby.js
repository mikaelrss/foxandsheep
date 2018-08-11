// @flow

import React, { Component } from 'react';
import { withRouter, Switch, Route, Link } from 'react-router-dom';

import type { Socket } from 'socket.io-client';

import Game from '../game/Game';
import socketClient from 'socket.io-client';
import style from './Game.css';

type Props = {};

type State = {
  socket: Socket,
  roomNames: Array<string>,
};

class Lobby extends Component<Props, State> {
  constructor(props) {
    super(props);
    const socket = socketClient('http://localhost:4000');

    socket.on('roomNames', this.initRoomNames);
    socket.on('roomsUpdated', this.updateRoomNames);

    this.state = {
      socket,
      roomNames: [],
    };
  }

  initRoomNames = payload => {
    console.log('TESTESSSs', payload);
    this.setState({
      roomNames: payload.roomNames,
    });
  };

  updateRoomNames = payload => {
    this.setState({
      roomNames: payload.roomNames,
    });
  };

  createRoom = () => {
    this.state.socket.emit('createRoom');
    this.props.history.push({ pathname: '/game/', state: { createRoom: true } });
  };

  render() {
    console.log(this.state);
    const joinedRoom = this.props.location.pathname.includes('game');
    return (
      <div>
        <Switch>
          <Route path="/game" render={() => <Game cellSize={50} socket={this.state.socket} />} />
        </Switch>
        {!joinedRoom && (
          <div>
            <h3>Rooms</h3>
            <div className={style.roomList}>
              {this.state.roomNames.map(roomName => (
                <div key={roomName}>
                  <Link to="/game">{roomName}</Link>
                </div>
              ))}
            </div>
            <button onClick={this.createRoom}>Create room</button>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Lobby);
