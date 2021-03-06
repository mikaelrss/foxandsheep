// @flow

import React, { Component } from 'react';
import { Spring, config } from 'react-spring';
import classNames from 'classnames';

import type { CharacterType, PositionType } from '../../../../types';

import css from './Character.css';

type Props = {
  position: PositionType,
  cellSize: number,
  character: CharacterType,
};

type State = {
  position: PositionType,
  moveHandler: (y: number, x: number) => void,
};

class Character extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      position: { x: props.position.x, y: props.position.y },
    };
  }

  render() {
    const { cellSize, position, character } = this.props;

    return (
      <Spring
        config={config.stiff}
        from={{
          top: this.state.position.y,
          left: this.state.position.x,
        }}
        to={{
          top: position.y,
          left: position.x,
        }}
      >
        {({ top, left }) => {
          return (
            <div
              className={classNames(css.character, character)}
              onClick={this.props.moveHandler.bind(this, position.y, position.x)}
              style={{
                top: `${top * cellSize}px`,
                left: `${left * cellSize}px`,
                height: `${cellSize - 1}px`,
                width: `${cellSize - 1}px`,
              }}
            />
          );
        }}
      </Spring>
    );
  }
}

export default Character;
