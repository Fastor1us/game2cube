import { combineReducers, configureStore } from '@reduxjs/toolkit';

import gameSlicer from './slicers/gameSlicer.js';


const rootReducer = combineReducers({
  game: gameSlicer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
