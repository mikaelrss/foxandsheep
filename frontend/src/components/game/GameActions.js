import { createAction } from 'redux-actions';

export const SET_GAME_STATE = 'SET_GAME_STATE';

const setGameStateAction = createAction(SET_GAME_STATE);

export const setGameState = (gameState, roomName) => dispatch => {
  dispatch(setGameStateAction({ gameState, roomName }));
};
