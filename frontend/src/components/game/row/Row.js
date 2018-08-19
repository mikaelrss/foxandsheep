// @flow

import React from 'react';
import Cell from '../cell/Cell';

import style from './Row.css';
import type { CellType } from '../../../types';

type RowProps = {
  cells: Array<CellType>,
  cellSize: number,
  playerIsCatcher: boolean,
  moveHandler: Function,
};

const Row = (props: RowProps) => {
  const { cells, cellSize, playerIsCatcher, moveHandler } = props;
  return (
    <div className={style.row}>
      {cells.map((cell, index) => (
        <Cell
          cell={cell}
          cellSize={cellSize}
          playerIsCatcher={playerIsCatcher}
          key={cell.key}
          moveHandler={moveHandler.bind(this, index)}
        />
      ))}
    </div>
  );
};

export default Row;
