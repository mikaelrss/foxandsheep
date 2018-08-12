import storage from 'redux-persist/lib/storage';
import { persistCombineReducers } from 'redux-persist';

import GameState from '../components/game/GameReducer';

const persistConfig = { blacklist: [], storage, key: 'primary' };

export default persistCombineReducers(persistConfig, {
  GameState,
});
