// @flow

export type CellType = {
  grass?: boolean,
  fox?: boolean,
  sheep?: boolean,
};

export type GameStateType = {
  gameBoard: string,
  catcher: {
    stepSize: number,
    position: PositionType,
  },
  runner: {
    stepSize: number,
    position: PositionType,
  },
  playerIsCatcher: boolean,
};

export type ClientInformationType = {
  roomName: string,
  gameState: GameStateType,
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
