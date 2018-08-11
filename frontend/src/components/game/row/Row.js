// @flow

import React from 'react';
import Cell from '../cell/Cell';
import { spring } from 'react-spring';

import style from './Row.css';
import type { CellType } from '../../../types';

type RowProps = {
  cells: Array<CellType>,
  cellSize: number,
};

const Row = (props: RowProps) => {
  const { cells, cellSize } = props;
  return (
    <div className={style.row}>
      {cells.map(cell => (
        <Cell cell={cell} cellSize={cellSize} />
      ))}
    </div>
  );
};

export default Row;
