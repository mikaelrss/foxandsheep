// @flow

import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import sillyName from 'sillyname';

import type { Socket } from 'socket.io-client';

import style from './Lobby.css';
import Button from '../shared/button/Button';

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

    props.socket.on('roomNames', this.initRoomNames);
    props.socket.on('roomsUpdated', this.updateRoomNames);

    props.socket.on('roomCreated', this.enterRoom);

    props.socket.on('startGame', payload => {
      console.log('Start Game', payload);
    });

    props.socket.on('roomFull', payload => {
      console.log('Room is full. Sorry!', payload);
    });

    this.state = {
      socket: props.socket,
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
        {!joinedRoom && (
          <div>
            <h3>Active rooms</h3>
            <div>I DONT UNDERSTAND</div>
            <div className={style.roomList}>
              {this.state.rooms.map(room => (
                <div key={room.id}>
                  <Link to={`/game/${room.id}`}>{room.name}</Link>
                </div>
              ))}
            </div>
            <Button onClick={this.createRoom} text="Create room" />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Lobby);
