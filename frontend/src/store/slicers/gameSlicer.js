import { createSlice } from '@reduxjs/toolkit';
import { collectCustomHooksForSignature } from 'react-refresh';

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
    size: 5,
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
      const entries = Object.entries(action.payload);
      state.linkedColors[entries[0][0]] = entries[0][1];
    },
    setIsComplited(state, action) {
      state.isCompleted = action.payload;
    },
    setResetStateToInitial(state) {
      Object.assign(state, initialState);
    },
    setTest(state, action) {
      console.log(action.payload);
    }
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
  setIsComplited,
  setResetStateToInitial,
  setTest
} = gameSlicer.actions;

export default gameSlicer.reducer;
