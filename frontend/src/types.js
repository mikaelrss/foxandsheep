// @flow

export type CellType = {
  grass?: boolean,
  fox?: boolean,
  sheep?: boolean,
};

export type GameStateType = {
  gameBoard: string,
  catcherStepSize: number,
  runnerStepSize: number,
  catcherPosition: PositionType,
  runnerPosition: PositionType,
  playerIsCatcher: boolean,
};

export type ClientInformationType = {
  roomName: string,
  gameState: Object,
  catcher: string,
  runner: string,
};

export type RowType = {
  row: Array<CellType>,
  key: string,
};

export type PositionType = {
  x: number,
  y: number,
};

export type PositionWithKey = PositionType & {
  key: string,
};

export type CharacterType = 'fox' | 'sheep';
