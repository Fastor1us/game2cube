import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { userAPI } from '../utils/api/user-api.js';

import gameSlicer from './slicers/gameSlicer.js';


const rootReducer = combineReducers({
  game: gameSlicer,
  [userAPI.reducerPath]: userAPI.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAPI.middleware),
});

export default store;
