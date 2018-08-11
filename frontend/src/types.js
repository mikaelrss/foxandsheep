// @flow

export type CellType = {
  grass?: boolean,
  fox?: boolean,
  sheep?: boolean,
};

export type PositionType = {
  x: number,
  y: number,
};

export type CharacterType = 'fox' | 'sheep';
