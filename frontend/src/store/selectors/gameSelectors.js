export const gameSelector = state => state.game;

export const levelsSelector = state => gameSelector(state).levels;

export const isWatchingSelector = state => gameSelector(state).isWatching;

export const linkedColorsSelector = state => gameSelector(state).linkedColors;
export const linkedColorSelector = (color) => state => {
  return gameSelector(state).linkedColors[color];
}

export const isCompletedSelector = state => gameSelector(state).isCompleted;

export const currCoordsSelector = state => gameSelector(state).currCoords;

export const prevCoordsSelector = state => gameSelector(state).prevCoords;

export const gridSelector = state => gameSelector(state).grid;
export const gridDataSelector = state => gridSelector(state).data;
export const gridCellDataSelector = (row, col) => state => {
  const grid = gridSelector(state);
  return grid.data[row][col];
};
