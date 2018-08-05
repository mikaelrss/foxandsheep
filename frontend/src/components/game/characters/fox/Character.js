// @flow

import React, { Component } from 'react';
import { Spring } from 'react-spring';
import classNames from 'classnames';

import type { PositionType } from '../../../../types';

import css from './Character.css';

type Props = {
  position: PositionType,
  cellSize: number,
  character: 'fox' | 'sheep',
};

type State = {
  position: PositionType,
  rotation: boolean,
};

class Character extends Component<Props, State> {
  state = {
    position: { x: 0, y: 0 },
    rotation: 0,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.position.x !== this.props.position.x || prevProps.position.y !== this.props.position.y) {
      this.setState({
        rotation: (this.state.rotation + 90) % 360,
      });
    }
  }

  render() {
    const { cellSize } = this.props;
    return (
      <Spring
        from={{
          top: this.state.position.y,
          left: this.state.position.x,
        }}
        to={{
          top: this.props.position.y,
          left: this.props.position.x,
          rotation: this.state.rotation,
        }}
      >
        {({ top, left, rotation }) => {
          return (
            <div
              className={classNames(css.character, this.props.character)}
              style={{
                top: `${top * cellSize + cellSize / 2}px`,
                left: `${left * cellSize + cellSize / 2}px`,
                transform: `translateX(-50%) translateY(-50%) rotate(${rotation}deg)`,
              }}
            />
          );
        }}
      </Spring>
    );
  }
}

export default Character;
