import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  email: null,
  isAuth: false,
  avatar: null,
  avatarList: [],
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
    },
    setAvatarList(state, action) {
      state.avatarList = action.payload;
    },
    setAvatar(state, action) {
      state.avatar = action.payload;
    }
  },
});

export const {
  setUserData,
  resetUserData,
  setAvatarList,
  setAvatar
} = userSlicer.actions;

export default userSlicer.reducer;
