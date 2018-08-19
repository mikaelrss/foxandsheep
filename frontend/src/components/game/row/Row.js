// @flow

import React from 'react';
import Cell from '../cell/Cell';

import style from './Row.css';
import type { CellType } from '../../../types';

type RowProps = {
  cells: Array<CellType>,
  cellSize: number,
  playerIsCatcher: boolean,
};

const Row = (props: RowProps) => {
  const { cells, cellSize, playerIsCatcher } = props;
  return (
    <div className={style.row}>
      {cells.map(cell => (
        <Cell cell={cell} cellSize={cellSize} playerIsCatcher={playerIsCatcher} key={cell.key} />
      ))}
    </div>
  );
};

export default Row;
