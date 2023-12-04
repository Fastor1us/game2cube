import store from '../store/store';

export function getGameState() {
  return store.getState().game;
}

export function getGridData() {
  return store.getState().game.grid.data;
}
