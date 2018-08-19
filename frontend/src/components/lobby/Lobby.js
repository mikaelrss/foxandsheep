// @flow

import React, { Component } from 'react';
import { withRouter, Switch, Route, Link } from 'react-router-dom';
import sillyName from 'sillyname';

import type { Socket } from 'socket.io-client';

import Game from '../game/Game';
import socketClient from 'socket.io-client';
import style from './Game.css';

type Props = {};

type SimpleRoomType = {
  name: string,
  id: string,
};

type State = {
  socket: Socket,
  rooms: Array<SimpleRoomType>,
};

class Lobby extends Component<Props, State> {
  constructor(props) {
    super(props);
    const socket = socketClient('http://localhost:4000');

    socket.on('roomNames', this.initRoomNames);
    socket.on('roomsUpdated', this.updateRoomNames);

    socket.on('roomCreated', this.enterRoom);

    socket.on('startGame', payload => {
      console.log('Start Game', payload);
    });

    socket.on('roomFull', payload => {
      console.log('Room is full. Sorry!', payload);
    });

    this.state = {
      socket,
      rooms: [],
    };
  }

  initRoomNames = payload => {
    this.setState({
      rooms: payload.rooms,
    });
  };

  updateRoomNames = payload => {
    this.setState({
      rooms: payload.rooms,
    });
  };

  createRoom = () => {
    const roomName = sillyName();
    this.state.socket.emit('createRoom', { roomName: roomName });
  };

  enterRoom = payload => {
    this.props.history.push({
      pathname: `/game/${payload.roomId}`,
    });
  };

  render() {
    const joinedRoom = this.props.location.pathname.includes('game');
    return (
      <div>
        <Switch>
          <Route path="/game/:roomId" render={() => <Game cellSize={40} socket={this.state.socket} />} />
        </Switch>
        {!joinedRoom && (
          <div>
            <h3>Rooms</h3>
            <div className={style.roomList}>
              {this.state.rooms.map(room => (
                <div key={room.id}>
                  <Link to={`/game/${room.id}`}>{room.name}</Link>
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
