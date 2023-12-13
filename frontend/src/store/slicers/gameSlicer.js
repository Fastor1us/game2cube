import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isWatching: false,
  isFocus: false,
  isCompleted: false,
  linkedColors: {},
  currCoords: {
    row: null,
    col: null
  },
  prevCoords: {
    row: null,
    col: null
  },
  grid: {
    data: [],
  },
  levels: [],
};

const gameSlicer = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGridData(state, action) {
      // console.log('setGridData');
      // console.log('state.grid.data', state.grid.data);
      state.grid.data = action.payload;
      // console.log('state.grid.data', state.grid.data);
    },
    setIsWatching(state, action) {
      state.isWatching = action.payload;

      // если передано false то сбрасываем данные prevCoords
      if (!action.payload) {
        state.prevCoords = initialState.prevCoords;
      }
    },
    setCellCoords(state, action) {
      // записываем данные о предыдущей ячейке в prevCoords
      if (state.isWatching) {
        state.prevCoords.row = state.currCoords.row;
        state.prevCoords.col = state.currCoords.col;
      }
      // записываем данные о текущей ячейке в currCoords
      state.currCoords.row = action.payload.row;
      state.currCoords.col = action.payload.col;
    },
    setCurrCellCoords(state, action) {
      state.currCoords.row = action.payload.row;
      state.currCoords.col = action.payload.col;
    },
    setPrevCellCoords(state, action) {
      state.prevCoords.row = action.payload.row;
      state.prevCoords.col = action.payload.col;
    },
    setCellState(state, action) {
      // state.grid.data[action.payload.address.row][action.payload.address.col] =
      //   action.payload.data;
      state.grid.data[action.payload.address.row][action.payload.address.col] =
      {
        ...state.grid.data[action.payload.address.row][action.payload.address.col],
        ...action.payload.data
      };
      state.isFocus = action.payload.data.focus || false;
    },
    setLinkedColors(state, action) {
      if (Object.keys(action.payload).length === 0) {
        state.linkedColors = initialState.linkedColors;
      } else {
        const entries = Object.entries(action.payload);
        state.linkedColors[entries[0][0]] = entries[0][1];
      }
    },
    setIsCompleted(state, action) {
      state.isCompleted = action.payload;
    },
  }
});

export const {
  setGridData,
  setIsWatching,
  setCellCoords,
  setCurrCellCoords,
  setPrevCellCoords,
  setCellState,
  setLinkedColors,
  setIsCompleted,
} = gameSlicer.actions;

export default gameSlicer.reducer;
