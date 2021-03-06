import { createSelector } from 'reselect';

const gameStateSelector = (state, props) => state.GameState[props.roomName];

const selector = createSelector(gameStateSelector, state => {
  return {
    ...state,
  };
});

export default selector;
