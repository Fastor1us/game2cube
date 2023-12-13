import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currLevel: {
    index: null,
    id: null
  },
  levels: [],
}

const managerSlicer = createSlice({
  name: 'manager',
  initialState,
  reducers: {
    setLevels(state, action) {
      state.levels = action.payload;
    },
    setCurrLevel(state, action) {
      state.currLevel = action.payload;
      // state.currLevel = Object.assign({}, action.payload);
    },
    toggleLevelReduxLike(state, action) {
      state.levels[action.payload.index].likes =
        state.levels[action.payload.index].isAbleToLike ?
          Number(state.levels[action.payload.index].likes) + 1 :
          state.levels[action.payload.index].likes - 1;
      state.levels[action.payload.index].isAbleToLike =
        !state.levels[action.payload.index].isAbleToLike;
    }
  }
});

export const {
  setLevels,
  setCurrLevel,
  toggleLevelReduxLike
} = managerSlicer.actions;

export default managerSlicer.reducer;
