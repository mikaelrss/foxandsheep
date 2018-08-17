// @flow

import React, { Component, Fragment } from 'react';
import type { PositionWithKey } from '../../../types';

import style from './GrassList.css';

const Grass = ({ position, cellSize }) => (
  <div
    style={{
      left: `${position.x * cellSize}px`,
      top: `${position.y * cellSize}px`,
      width: `${cellSize - 3}px`,
      height: `${cellSize - 3}px`,
    }}
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
        {this.props.grassPositions.map(pos => (
          <Grass position={pos} key={pos.key} cellSize={this.props.cellSize} />
        ))}
      </Fragment>
    );
  }
}

export default GrassList;
