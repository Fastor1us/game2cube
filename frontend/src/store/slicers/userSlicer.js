import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  email: null,
  isAuth: false,
};

const userSlicer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData(state, action) {
      for (let key in action.payload) {
        state[key] = action.payload[key];
      }
    },
    resetUserData(state) {
      Object.assign(state, initialState);
    }
  },
});

export const {
  setUserData,
  resetUserData
} = userSlicer.actions;

export default userSlicer.reducer;
