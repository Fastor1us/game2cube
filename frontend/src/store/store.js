import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { userAPI } from '../utils/api/user-api.js';
import { gameAPI } from '../utils/api/game-api.js';

import gameSlicer from './slicers/gameSlicer.js';
import userSlicer from './slicers/userSlicer.js';
import managerSlicer from './slicers/managerSlicer.js';


const rootReducer = combineReducers({
  user: userSlicer,
  manager: managerSlicer,
  game: gameSlicer,
  [userAPI.reducerPath]: userAPI.reducer,
  [gameAPI.reducerPath]: gameAPI.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userAPI.middleware, gameAPI.middleware
    ),
});

export default store;
