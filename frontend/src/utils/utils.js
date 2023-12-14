import store from '../store/store';

export function getGameState() {
  return store.getState().game;
}

export function getGridData() {
  return store.getState().game.grid.data;
}

export function shallowEqual(obj1, obj2) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }

  for (let key in obj1) {
    if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
}
