// @flow

import React from 'react';
import classNames from 'classnames';
import style from './Cell.css';

import type { CellType } from '../../../types';

const Grass = () => <div className={style.grass} />;

type CellProps = {
  cell: CellType,
};

const Cell = ({ cell, highlighted }: CellProps) => {
  return <div className={classNames(style.cell, { highlighted: cell.highlighted })}>{cell.grass && <Grass />}</div>;
};

export default Cell;
