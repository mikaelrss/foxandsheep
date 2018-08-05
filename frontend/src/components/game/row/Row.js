// @flow

import React, { Component } from 'react';
import Cell from '../cell/Cell';
import { spring } from 'react-spring';

import style from './Row.css';
import type { CellType } from '../../../types';

type RowProps = {
  cells: Array<CellType>,
  cellSize: number,
};

class Row extends Component<RowProps> {
  row: ?HTMLDivElement;

  componentDidUpdate() {
    if (this.row && this.row.style) {
      this.row.style.height = `${this.props.cellSize}px`;
    }
  }

  render() {
    const { cells } = this.props;
    return (
      <div
        className={style.row}
        ref={node => {
          this.row = node;
        }}
      >
        {cells.map(cell => (
          <Cell cell={cell}/>
        ))}
      </div>
    );
  }
}

export default Row;
