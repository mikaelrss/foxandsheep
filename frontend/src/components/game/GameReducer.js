import { SET_GAME_STATE } from './GameActions';

const INITIAL_STATE = {
  'default-client': {
    roomName: 'default-room',
    originalPlayerPosition: {},
    playerPosition: {},
    opponentPosition: {},
    stepSize: 0,
    playerIsCatcher: false,
    gameBoard: [],
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_GAME_STATE:
      console.log(action);
      return {
        ...state,
        [action.payload.roomName]: {
          ...state[action.payload.roomName],
          ...action.payload.gameState,
        },
      };

    default:
      return state;
  }
};
