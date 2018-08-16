// @flow

import React, { Component } from 'react';
import { Spring } from 'react-spring';
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
              style={{
                top: `${top * cellSize}px`,
                left: `${left * cellSize}px`,
                height: `${cellSize - 2}px`,
                width: `${cellSize - 2}px`,
              }}
            />
          );
        }}
      </Spring>
    );
  }
}

export default Character;
