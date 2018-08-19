// @flow

import React, { Component, Fragment } from 'react';
import type { PositionWithKey } from '../../../types';

import style from './GrassList.css';

const Grass = ({ position, cellSize, moveHandler }) => (
  <div
    style={{
      left: `${position.x * cellSize}px`,
      top: `${position.y * cellSize}px`,
      width: `${cellSize - 1}px`,
      height: `${cellSize - 1}px`,
    }}
    onClick={moveHandler}
    className={style.grass}
  />
);

type Props = {
  grassPositions: Array<PositionWithKey>,
  cellSize: number,
};

type State = {};

class GrassList extends Component<Props, State> {
  render() {
    return (
      <Fragment>
        {this.props.grassPositions.map((pos: PositionWithKey) => (
          <Grass
            position={pos}
            key={pos.key}
            cellSize={this.props.cellSize}
            moveHandler={this.props.moveHandler.bind(this, pos.y, pos.x)}
          />
        ))}
      </Fragment>
    );
  }
}

export default GrassList;
