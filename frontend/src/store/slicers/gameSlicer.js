import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isWatching: false,
  currCoords: {
    row: null,
    col: null
  },
  prevCoords: {
    row: null,
    col: null
  },
  grid: {
    size: 4,
    data: [],
  }
};

const gameSlicer = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGridData(state, action) {
      state.grid.data = action.payload;
    },
    setIsWatching(state, action) {
      state.isWatching = action.payload;

      // если передано false то сбрасываем данные prevCoords
      if (!action.payload) {
        state.prevCoords = initialState.prevCoords;
      }
    },
    setCurrCellParams(state, action) {
      // записываем данные о предыдущей ячейке в prevCoords
      if (state.isWatching) {
        state.prevCoords.row = state.currCoords.row;
        state.prevCoords.col = state.currCoords.col;
      }

      // записываем данные о текущей ячейке в currCoords
      state.currCoords.row = action.payload.row;
      state.currCoords.col = action.payload.col;
    },
    setCellState(state, action) {
      state.grid.data[action.payload.address.row][action.payload.address.col] =
        action.payload.data;
      // state.grid.data[action.payload.address.row][action.payload.address.col] =
      //   {...state.grid.data[action.payload.address.row][action.payload.address.col],
      //   ...action.payload.data};
    }
  }
});

export const {
  setGridData,
  setIsWatching,
  setCurrCellParams,
  setCellState
} = gameSlicer.actions;

export default gameSlicer.reducer;
