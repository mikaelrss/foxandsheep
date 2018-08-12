// @flow

import React from 'react';
import classNames from 'classnames';
import style from './Cell.css';

import type { CellType } from '../../../types';

const Grass = () => <div className={style.grass} />;

type CellProps = {
  cell: CellType,
  cellSize: number,
  playerIsCatcher: boolean,
};

const Cell = ({ cellSize, cell, playerIsCatcher }: CellProps) => (
  <div
    style={{
      height: `${cellSize}px`,
      width: `${cellSize}px`,
    }}
    className={classNames(style.cell, { highlighted: cell.highlighted })}
  >
    {!playerIsCatcher && cell.grass && <Grass />}
  </div>
);

export default Cell;
