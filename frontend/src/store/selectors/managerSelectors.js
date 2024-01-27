export const managerSelector = state => state.manager;

// export const statusSelector = state => managerSelector(state).status;

export const levelsSelector = state => managerSelector(state).levels;

export const currLevelIndexSelector = state => managerSelector(state).currLevelIndex;
