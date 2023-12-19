export const managerSelector = state => state.manager;

export const statusSelector = state => managerSelector(state).status;

export const levelsSelector = state => managerSelector(state).levels;

export const currLevelSelector = state => managerSelector(state).currLevel;
