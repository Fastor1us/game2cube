import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isWatching: false,
  currentCell: {
    cordinates: { row: 0, col: 0 },
    color: null,
  },
  painting: {
    color: null,
  }
};

const gameSlicer = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setIsWatching(state, action) {
      state.isWatching = action.payload;
    },
    setCurrentCellParams(state, action) {
      state.currentCell.cordinates.row = action.payload.row;
      state.currentCell.cordinates.col = action.payload.col;
      state.currentCell.color = action.payload.color === 'none'
        ? null : action.payload.color;
    },
    setPaintColor(state, action) {
      state.painting.color = action.payload;
    }
  }
});

export const {
  setIsWatching,
  setCurrentCellParams,
  setPaintColor
} = gameSlicer.actions;

export default gameSlicer.reducer;
