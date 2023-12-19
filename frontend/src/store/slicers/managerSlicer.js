import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: {},
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
    },
    setStatus(state, action) {
      if (Object.keys(action.payload).length > 0) {
        state.status = {};
        const entries = Object.entries(action.payload);
        entries.forEach(([key, value]) => {
          if (value) state.status[key] = value;
        })
      }
    }
  }
});

export const {
  setLevels,
  setCurrLevel,
  toggleLevelReduxLike,
  setStatus
} = managerSlicer.actions;

export default managerSlicer.reducer;
