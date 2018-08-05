import React, { Component } from 'react';

import style from './Game.css';

class Game extends Component<Props, State> {
  render() {
    return <div className={style.gameContainer}> This is game</div>;
  }
}

export default Game;
